import {segment} from 'oicq';

export const rule = {
  hookProfile: {
    reg: '',
    priority: 0,
    describe: '',
  },
};

const whiteListUser = [
  2426124143,
  2715442757,
];
const whiteListGroup = [
  644404503,
  290546227,
];

export async function hookProfile(e) {
     return false;
  if (e.isMaster) {
    return false;
  }
  let msg = e.msg || ''
  let flag1 = /^#(全部面板更新|更新全部面板|获取游戏角色详情)$/.test(msg)
  let flag2 = msg.includes('面板');
  let flag3 = msg.includes('更新');
  if (!flag1 && !(flag2 && flag3)) {
    return;
  }
  let name = msg.replace(/#|＃|面板|更新/g, '')
  if (!name) return;
      e.reply('因版本更新，获取面板功能已失效，请耐心等待升级，已获取的面板不影响使用…');
      return true;  
  if (e.isPrivate) {
    if (!whiteListUser.includes(e.user_id)) {
      e.reply('该功能暂不开放私聊…');
      return true;
    }
  } else {
    if (!whiteListGroup.includes(e.group_id)) {
      e.reply('该功能暂不开放…');
      return true;
    }
    let info = await e.member.renew();
    if (info.level < 10) {
      e.reply('该功能仅限群聊等级10级及以上的群员使用~ 少年呦请多水水群再来吧！');
      return true;
    }
  }
}