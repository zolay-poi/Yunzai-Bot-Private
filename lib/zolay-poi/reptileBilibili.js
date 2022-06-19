import { segment } from 'oicq';
import fetch from 'node-fetch';
import lodash from 'lodash';
import BiliApi from './api/BiliApi.js';

//项目路径
const _path = process.cwd();

export const rule = {
  refreshBangumiJson: {
    reg: '^#刷新追番列表$',
    priority: 50,
    describe: '',
  },
};

export async function refreshBangumiJson(e) {
  let data = await BiliApi.bangumi.getFollow();

  const item = lodash.sample(data.list);
  let msg = [
    item.title,
    '\n',
    item.evaluate,
    '\n',
    item.url,
    '\n',
    segment.image(item.cover),
  ];

  e.reply(msg);

  return true;
}
