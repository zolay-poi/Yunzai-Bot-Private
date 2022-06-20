import fs from 'fs';
import fetch from 'node-fetch';
import {segment} from 'oicq';
import {render} from '../render.js';
import lodash from 'lodash';

const _path = process.cwd();

export const rule = {
  artifactsInfo: {
    reg: '',
    priority: 100,
    describe: '圣遗物图鉴，例：#绝缘套',
  },
};

let artifacts = new Map();

init();

export function init(e, isUpdate = false) {
  if (isUpdate) {
    artifacts = new Map();
  }
  if (artifacts.size > 0) {
    return true;
  }
  let file = fs.readFileSync('./config/genshin/artifacts.json', 'utf8');
  if (file == null) {
    if (e && e.isMaster) {
      e.reply('圣遗物JSON文件不存在，请确认是否正确按照教程安装了插件。');
    }
    return false;
  }
  let artifactsJson = JSON.parse(file);
  for (let name of Object.keys(artifactsJson)) {
    let item = artifactsJson[name];
    let id = item.splice(0, 1);
    artifacts.set(id, [name].concat(item));
  }
  // console.log(artifacts);
  return true;
}

function getArtifactsId(name) {
  for (const id of artifacts.keys()) {
    if (artifacts.get(id).includes(name)) {
      return id;
    }
  }
  return null;
}

let mysObc = {
  api(type, data) {
    let host = 'https://api-static.mihoyo.com';
    host += '/common/blackboard/ys_obc/v1/';
    let params = ['app_sn=ys_obc'];
    lodash.forEach(data, (v, i) => params.push(`${i}=${v}`));
    params = params.join('&');
    switch (type) {
      // 列表
      case 'contentList':
        host += 'home/content/list?';
        break;
      // 详情
      case 'contentInfo':
        host += 'content/info?';
        break;
    }
    return host + params;
  },
  async getData(e, type, data) {
    let url = this.api(type, data);
    let response = await fetch(url, {method: 'get', headers: {Referer: 'https://bbs.mihoyo.com/'}});
    if (!response.ok) {
      Bot.logger.error(response);
    }
    let res = await response.json();
    if (res.retcode !== 0) {
      Bot.logger.error(`米游社接口访问失败：${res.message}`);
      if (e && e.reply) e.reply(`米游社接口访问失败，请稍后再试`);
      return null;
    }
    return res;
  },
  /**
   * 获取圣遗物详情
   * @param e
   * @param content_id 圣遗物米游社观测枢ID
   */
  async getArtifactsInfo(e, content_id) {
    return this.getData(e, 'contentInfo', {content_id});
  },
};

export async function artifactsInfo(e) {
  let msg = e.msg || '';
  if (e.atBot) {
    msg = '#' + msg.replace('#', '');
  }
  if (!/#*(.*)(信息|图鉴)|#(.*)$/.test(msg)) return;
  if (!init(e)) return;
  msg = msg.replace(/#|＃|信息|图鉴/g, '');
  // 此处id不是游戏里的id，是米游社观测枢的id
  let id = getArtifactsId(msg);
  if (id) {
    let res = await mysObc.getArtifactsInfo(e, id);
    if (!res) {
      return true;
    }
    let data = res.data;
    if (data.channel_list[0]?.slice[0]?.channel_id !== 218) {
      e.reply('不是圣遗物词条');
      return true;
    }
    let ext = JSON.parse(data.content.ext);
    let dataContent = data.content.contents[0].text;
    let props = {
      title: data.content.title,
      icon: data.content.icon,
      table: ext.c_218.table.list,
    };
    let base64 = await render(
      'genshin',
      'artifactsInfo',
      {props, dataContent},
    );
    if (base64) {
      e.reply(segment.image(`base64://${base64}`));
    }
    return true;
  }
}
