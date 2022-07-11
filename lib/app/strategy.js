import { segment } from "oicq"
import fs from "fs"
import fetch from "node-fetch"
import { pipeline } from "stream"
import { promisify } from "util"
import lodash from "lodash"

const _path = process.cwd()

export const rule = {
  strategy: {
    reg: "^#?(更新)?\\S+攻略([1-4])?$",
    priority: 1000,
    describe: "【#心海攻略1/2/3/4】【#更新心海攻略1/2/3/4】获取攻略图",
  },
  strategy_help: {
    reg: "^#?攻略(说明|帮助)?$",
    priority: 1000,
    describe: "【#攻略】【#攻略帮助】获取攻略图",
  }
}

let url = "https://bbs-api.mihoyo.com/post/wapi/getPostFullInCollection?&gids=2&order_type=2&collection_id="
let collection_id = [
  [],
  // 来源：西风驿站
  [839176, 839179, 839181],
  // 来源：原神观测枢
  [813033],
  // 来源：派蒙喵喵屋
  [341284],
  // 来源：OH是姜姜呀(需特殊处理)
  [341523]
]

let mys = {
  async getData(url) {
    let response = await fetch(url, { method: "get" })
    if (!response.ok) {
      return false
    }
    const res = await response.json()
    return res
  },
  async downImg(url, name, path) {
    url = url + "?x-oss-process=image/quality,q_80/auto-orient,0/interlace,1/format,jpg"
    let response = await fetch(url, { method: "get" })
    if (!response.ok) {
      Bot.logger.error(`下载失败：${name}}`)
      return false
    }
    const streamPipeline = promisify(pipeline)
    await streamPipeline(response.body, fs.createWriteStream(path))
    Bot.logger.mark(`下载攻略完成：${name}`)
  },
}

export async function strategy(e) {
  let reg = /^#?(更新)?(\S+)攻略([1-4])?$/.exec(e.msg)
  let isUpdate = reg[1] ? true : false
  let role = reg[2]
  let group = reg[3] ? reg[3] : 1

  let id = YunzaiApps.mysInfo.roleIdToName(role)
  let name, img

  if (["10000005", "10000007", "20000000"].includes(id)) {
    if (!["风主", "岩主", "雷主"].includes(role)) {
      e.reply(`请选择：风主攻略${group}、岩主攻略${group}、雷主攻略${group}`)
      return true
    }
    name = role
  } else {
    name = YunzaiApps.mysInfo.roleIdToName(id, true)
    if (!name) return true
  }

  let base_path = `${_path}/resources/strategy/`
  if (!fs.existsSync(base_path)) {
    fs.mkdirSync(base_path)
  }
  if (!fs.existsSync(base_path + `${group}/`)) {
    fs.mkdirSync(base_path + `${group}/`)
  }
  let path = base_path + `${group}/${name}.png`
  if (fs.existsSync(path) && !isUpdate) {
    e.reply(segment.image(`file:///${path}`))
    return true
  }

  let msyRes = []
  collection_id[group].forEach((id) => msyRes.push(mys.getData(url + id)))

  try {
    msyRes = await Promise.all(msyRes)
  } catch (error) {
    e.reply("暂无攻略数据，请稍后再试")
    Bot.logger.error(`米游社接口报错：${error}}`)
    return true
  }

  let posts = lodash.flatten(lodash.map(msyRes, (item) => item.data.posts))

  for (let post of posts) {
    if (group == 4) {
      if (post.post.structured_content.includes(name + '】')) {
        let content = post.post.structured_content.replace(/\\\/\{\}/g, "")
        let pattern = new RegExp(name + '】.*?image":"(.*?)"')
        let img_id = pattern.exec(content)[1]
        for (let image of post.image_list) {
          if (image.image_id == img_id) {
            img = image.url
            break
          }
        }
        break
      }
    } else {
      if (post.post.subject.includes(name)) {
        let max = 0
        post.image_list.forEach((v, i) => {
          if (Number(v.size) >= Number(post.image_list[max].size)) max = i
        })
        img = post.image_list[max].url
        break
      }
    }
  }

  if (!img) {
    e.reply(`暂无${name}攻略`)
    return true
  }

  await mys.downImg(img, name, path)

  e.reply(segment.image(`file:///${path}`))
  return true
}

export function strategy_help(e) {
  e.reply("攻略帮助:\n#心海攻略1234\n示例: 心海攻略4\n\n攻略来源:\n1——西风驿站\n2——原神观测枢\n3——派蒙喵喵屋\n4——OH是姜姜呀")
  return true
}
