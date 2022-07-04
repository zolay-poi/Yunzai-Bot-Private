import { segment } from 'oicq';
import fetch from 'node-fetch';
import lodash from 'lodash';

const _path = process.cwd();

export const rule = {
  baiduSearch: {
    reg: '^#百度(.*)$',
    priority: 1000,
    describe: '【#百度】百度搜索',
    hashMark: true,
  },
  baiduWiki: {
    reg: '^#百科(.*)$',
    priority: 1000,
    describe: '【#百科】搜百度百科',
    hashMark: true,
  },
};

export async function baiduSearch(e, { regexp }) {
  let [, keyword] = e.msg.match(regexp);
  if (!keyword) {
    if (e.hasReply) {
      // 获取原消息
      let source;
      if (e.isGroup) {
        source = (await e.group.getChatHistory(e.source.seq, 1)).pop();
      } else {
        source = (await e.friend.getChatHistory(e.source.time, 1)).pop();
      }
      if (source) {
        keyword = source.message.filter(i => i.type === 'text').map(i => i.text).join('').trim();
      }
    }
  }
  if (!keyword) {
    if (!e.hasReply) {
      e.reply('请输入要搜索的关键字');
    }
    return true;
  }
  let url = `https://www.baidu.com/s?ie=UTF-8&wd=${encodeURIComponent(keyword)}`;
  let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    'Host': 'www.baidu.com',
    'Connection': 'keep-alive',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    // "Cookie": Cookie
  };
  let response = await fetch(url, { method: 'get', headers: headers });

  let truncate = lodash.truncate(keyword, { length: 12 });
  if (!response.ok) {
    e.reply([`百度搜索“${truncate}”失败…`]);
    return;
  }
  let res = await response.text();
  let textReg = /<!--s-data:({.*})-->/;
  let textJson = res.match(new RegExp(textReg, 'g')).map(t => {
    try {
      return JSON.parse(t.match(textReg)[1]);
    } catch {
      return null;
    }
  }).filter(i => i != null && !!i.titleUrl?.length);
  if (textJson?.length <= 0) {
    e.reply('没有搜索到相关内容…');
    return true;
  }
  let defImg = 'https://bkimg.cdn.bcebos.com/pic/1c950a7b02087bf49212ea50f1d3572c10dfcf89';
  let json = textJson[0];
  let title = json.title || truncate;
  let contentText = json.contentText || `百度搜索：${keyword}`;
  let titleUrl = json.titleUrl || json?.source.url;
  let imgUrl = json.leftImg || json?.source.img || defImg;

  title = title.replace(/<em>|<\/em>/g, '').trim();
  contentText = contentText.replace(/<em>|<\/em>/g, '').trim();
  e.reply([segment.share(
    titleUrl,
    title,
    imgUrl,
    contentText,
  )]);
  return true;
}

export async function baiduWiki(e, { regexp }) {
  let [, keyword] = e.msg.match(regexp);
  if (!keyword) {
    e.reply('请输入要搜索的关键字');
    return true;
  }
  let url = `https://ovooa.com/API/bdbk/?Msg=${keyword}`;
  let response = await fetch(url);
  let res = await response.json();
  if (res.code === -2) {
    e.reply('百度百科暂未收录词条“' + keyword + '”');
    return true;
  }
  if (res.code === -1) {
    e.reply('请输入需要百科的内容');
    return true;
  }
  if (res.code !== 1) {
    e.reply('未知错误，请联系开发者反馈');
    return true;
  }
  e.reply([segment.share(
    res.data.url,
    res.data.Msg,
    res.data.image,
    res.data.info,
  )]);
  return true;
}