import {segment} from 'oicq'
import fetch from 'node-fetch'

//项目路径
const _path = process.cwd()

//简单应用示例

//1.定义命令规则
export const rule = {
  // 禁言单个群员
  muteMember: {
    reg: '^#(禁言|口球|面壁(去)?)',
    priority: 100,
    describe: '#禁言@xxx',
  },
  // 解禁
  unmuteMember: {
    reg: '^#(解禁|不可以自闭|起来嗨)',
    priority: 100,
    describe: '#解禁@xxx',
  },
  // 开启全体禁言
  muteAllBegin: {
    reg: '^#(肃静)',
    priority: 100,
    describe: '#肃静',
  },
  // 结束全体禁言
  muteAllEnd: {
    reg: '^#(继续)',
    priority: 100,
    describe: '#继续',
  },
  // 禁言自己，任何人都可以使用的
  muteMe:{
    reg: '^#自闭.+$',
    priority: 100,
    describe: '#自闭十分钟',
  },
  // 禁言8小时
  jzSleep:{
    reg: '^#精致睡眠$',
    priority: 100,
    describe: '【#】',
  },
  // 警告群成员
  doWarn: {
    reg: '^#(重置|查询)?警告',
    priority: 100,
    describe: '【#】',
  }
}

export async function jzSleep(e) {
  e.group.muteMember(e.user_id, 3600*8)
  return true
}

export async function muteMe(e) {
  if (e.msg.includes("十分钟")) {
    e.group.muteMember(e.user_id, 600)
  } else if (e.msg.includes("半小时")){
    e.group.muteMember(e.user_id, 1800)
  } else if (e.msg.includes("一小时")){
    e.group.muteMember(e.user_id, 3600)
  } else {
    e.reply(['自闭时间还想挑？门都没有！给我说：十分钟、半小时或一小时'])
  }
  return true
}

export async function muteMember(e) {
  if (!hasRole(e)) {
    return true
  }
  let example = '示例：#禁言 @xxx 600（时间单位是秒，最低60秒）'
  let qq = null
  let time = null
  for (let msg of e.message) {
    if (msg.type === 'at') {
      qq = msg.qq
      continue
    }
    if (qq != null && msg.type === 'text') {
      let text = (msg.text||'').trim()
      if (!text) {
        break;
      }
      try {
        time = Number.parseInt(msg.text)
        if (Number.isNaN(time)) {
          throw ''
        }
      } catch (err) {
        e.reply(['禁言时间错啦，请输入纯数字哦！\n' + example])
        return true
      }
    }
  }
  if (qq == null) {
    e.reply(['派蒙不知道你要禁言谁哦\n' + example])
  } else if (qq == 1356496272) {
    e.reply(['神圣无比的master是不可以被禁言哒！'])
  } else {
    e.group.muteMember(qq, time == null ? 600 : (time))
  }
  return true
}

export async function unmuteMember(e) {
  if (e.user_id != 2426124143 && !hasRole(e)) {
    return true
  }
  let example = '示例：#解禁 @xxx'
  let qq = null
  for (let msg of e.message) {
    if (msg.type === 'at') {
      qq = msg.qq
      break
    }
  }
  if (qq == null) {
    e.reply(['派蒙不知道你要解禁谁哦\n' + example])
  }  else {
    e.group.muteMember(qq,0)
  }
  return true
}


export async function muteAllBegin(e) {
  if (hasRole(e)) {
    e.group.muteAll(true)
  }
  return true
}

export async function muteAllEnd(e) {
  if (hasRole(e)) {
    e.group.muteAll(false)
  }
  return true
}

export async function doWarn(e) {
  if (!hasRole(e)) {
    return true
  }
  let example = '示例：#警告 @xxx'
  let qq = null
  for (let msg of e.message) {
    if (msg.type === 'at') {
      qq = msg.qq
      break
    }
  }
  if (qq == null) {
    e.reply(['派蒙不知道你要警告谁哦\n' + example])
  } else {
    const redisKey = `Yunzai:group:admin:warn:${e.group_id}:${qq}`
    let count = await redis.get(redisKey);
    if(count == null || count == '') {
      count = 0
    }
    count = Number.parseInt(count)
    if(e.msg.includes('重置')){
      await redis.set(redisKey, 0);
      e.reply(['重置成功'], true)
    } else if (e.msg.includes('查询')) {
      e.reply(['已累计被警告' + count + '次'], true)
    } else {
      await redis.set(redisKey, ++count);
      e.reply([segment.at(qq), ' 因违反群规，被管理员警告1次，且已累计被警告' + count + '次'])
    }
  }
  return true
}

function hasRole(e) {
  if (!e.isGroup) {
    return false
  }
  // owner 群主
  // member 群员
  // admin 管理员
  if (!(e.isMaster || e.sender.role === 'owner' || e.sender.role === 'admin')) {
    e.reply([segment.at(e.user_id), '\n', segment.face(38), ' 凡人，休得僭越！rua~ '])
    return false
  }
  return true
}