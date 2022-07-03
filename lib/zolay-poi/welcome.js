import lodash from 'lodash';
import { segment } from 'oicq';

export const rule = {
  welcome: {
    reg: '^#---#---#---#新人加群通知#---#---#---#$',
    priority: 999999,
    describe: '',
  },
};

//新人加群通知
export async function welcome(e) {
  let maze = YunzaiApps['迷宫列表'];
  if (!maze.isWhiteList(e)) return;
  if (e.sub_type === 'increase') {
    let name = e.member?.card ? e.member.card : e.member?.nickname;
    name = lodash.truncate(name, { length: 8 });
    let message = [segment.at(e.user_id, name), ` 欢迎新人，请查看迷宫列表，看上哪个了要先艾特一下迷宫作者，然后加好友就可以了。`];
    let replyOld = e.reply;
    e.reply = function(msg, ...args) {
      replyOld(message.concat(msg), ...args);
    };
    maze.mazeList(e);
    return true;
  }
}
