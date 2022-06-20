import {segment} from 'oicq'
import fetch from 'node-fetch'

import {rule as gachaRule} from '../app/gacha.js'
import {rule as picturesRule} from './pictures.js'

export const rule = {
  hookGroup: {
    reg: '',
    priority: 0,
    describe: '群聊消息',
  },
  hookGacha: {
    reg: gachaRule.gacha.reg,
    priority: gachaRule.gacha.priority - 1,
    describe: '模拟十连CD控制，防止刷屏',
  },
  hookPictures: {
    reg: picturesRule.randomPictures.reg,
    priority: picturesRule.randomPictures.priority - 1,
    describe: '',
  },
}

export async function hookGroup(e) {
  if (e.isPrivate) {
    return
  }
  // console.log('hookGroup e.member 1: ',e.member.uid, e.member.is_admin, e.member.is_owner)
  if (e.isMaster && !e.member.is_admin && e.member.info) {
    e.sender.role = 'admin'
    e.member.info.role = 'admin'
    // console.log('hookGroup e.member 2: ',e.member.uid, e.member.is_admin, e.member.info)
  }
}

/** 模拟十连CD控制，防止刷屏 */
export async function hookGacha(e) {
  if (e.isPrivate || e.isMaster) {
    return
  }
  let cd = 60
  let key = `Yunzai:hookGacha:${e.group_id}:${e.user_id}`
  let cdState = await redis.get(key)
  if (cdState) {
    // 0 = 已发送过提醒，不重复发送提醒
    if (cdState === '0') {
      e.recall(e.message_id)
      return true
    }
    // 算出剩余等待时间
    let timeLeft = cd - Math.round((Date.now() - parseInt(cdState)) / 1000)
    if (timeLeft > 0) {
      redis.set(key, '0', {EX: timeLeft})
      e.recall(e.message_id)
      e.reply([segment.at(e.user_id), ` 每人每${cd}秒只能抽1次`, segment.face(33), `（私聊不受限制）`])
      return true
    }
  }
  redis.set(key, Date.now(), {EX: cd})
}


/** 模拟十连CD控制，防止刷屏 */
export async function hookPictures(e) {
  if (e.isPrivate || e.isMaster) {
    return
  }
  let cd = 300
  let key = `Yunzai:hookTupian:${e.group_id}:${e.user_id}`
  let cdState = await redis.get(key)
  if (cdState) {
    if (cdState === '0') {
      e.recall(e.message_id)
      return true
    }
    // 算出剩余等待时间
    let timeLeft = cd - Math.round((Date.now() - parseInt(cdState)) / 1000)
    if (timeLeft > 0) {
      redis.set(key, '0', {EX: timeLeft})
      e.recall(e.message_id)
      e.reply([segment.at(e.user_id), ` 冷却时间${cd}秒，派蒙也是需要休息的（私聊不受限制）`])
      return true
    }
  }
  redis.set(key, Date.now(), {EX: cd})
}
