import { segment } from "oicq";
import fs from "fs"
import path from "path"
const __dirname = path.resolve();

/**
 * 基于群友分享的 voice.js 开发
 * 
 * 使用方法：
 * 1. 将该JS文件放到 bot根目录/lib/example/ 下
 * 2. 修改下面的配置
 * 
 * 注意事项：
 * 1. 群隔离功能暂未实现
 * 2. 语音包可以在群文件里下载到（voice.zip）
 */
const settings = {
  // 语音文件存放路径
  path: path.join(__dirname, "/resources/voice"),
  // 语音目录的语言名称，因为群文件压缩包里的中文语音目录叫：China，如果你不想修改文件夹名称的话，可以将此处的配置改为China
  keys: ["Chinese", "English", "Japanese", "Korean"],
}

export const rule = {
  playVoice: {
    reg: "^#(.+)语音(.*)$",
    priority: 5,
    describe: "#烟绯语音[语言]",
  },
  // 猜语音
  guessVoice: {
    reg: "^#猜语音(.*)$",
    priority: 4,
    describe: "#猜语音[语音]",
  },
  // 猜语音结果监听
  guessVoiceCheck: {
    reg: "noCheck",
    priority: 3,
    describe: "",
  },
}

const languageConfig = [
  {
    key: settings.keys[0],
    name: "中文",
    alias: ['中', '中文', '汉', '汉语', '中配', settings.keys[0]],
  },
  {
    key: settings.keys[1],
    name: "英语",
    alias: ['英', '英文', '英语', '英配', settings.keys[1]],
  },
  {
    key: settings.keys[2],
    name: "日语",
    alias: ['日', '日文', '日语', '日配', settings.keys[2]],
  },
  {
    key: settings.keys[3],
    name: "韩语",
    alias: ['韩', '韩文', '韩语', '韩配', settings.keys[3]],
  }
]

function getLanguage(name) {
  if (name == '' || name == null) {
    return languageConfig[0]
  }
  for (const item of languageConfig) {
    if (item.alias.find(a => a.toLowerCase() == name.toLowerCase())) {
      return item
    }
  }
  return null
}

export async function playVoice(e) {
  let splitArr = e.msg.split('语音')
  let language = languageConfig[0]
  if (splitArr.length >= 2) {
    language = getLanguage(splitArr[1])
    if (language == null) {
      e.reply(`没有找到语言为“${splitArr[1]}”的语音`)
      return true;
    }
  }
  let name = splitArr[0].substring(1, splitArr[0].length)
  randomPlayVoice(e, name, language)
  return true;
}

function randomPlayVoice(e, name, language) {
  let voicePath = path.join(settings.path, language.key, name);
  let voiceFiles = [];
  if (fs.existsSync(voicePath)) {
    fs.readdirSync(voicePath).forEach(fileName => voiceFiles.push(fileName))
  } else {
    e.reply(`没有找到${name}的${language.name}语音哦！`)
    return true;
  }
  let randomFile = voiceFiles[Math.round(Math.random() * (voiceFiles.length - 1))]
  let finalPath = path.join(settings.path, language.key, name, randomFile);
  let bitMap = fs.readFileSync(finalPath);
  let base64 = Buffer.from(bitMap, 'binary').toString('base64');
  let message = segment.record(`base64://${base64}`);
  e.reply(message);
}

const guessConfigMap = new Map()

export function getGuessConfig(e) {
  let key = e.message_type + e[e.isGroup ? 'group_id' : 'user_id']
  let config = guessConfigMap.get(key)
  if (config == null) {
    config = {
      playing: false,
      roleId: '',
      timer: null,
    }
    guessConfigMap.set(key, config)
  }
  return config
}

export async function guessVoice(e) {
  let guessConfig = getGuessConfig(e)
  if (guessConfig.playing) {
    e.reply('猜语音游戏正在进行哦')
    return true;
  }
  let splitArr = e.msg.split('语音')
  let language = languageConfig[0]
  if (splitArr.length >= 2) {
    language = getLanguage(splitArr[1])
    if (language == null) {
      e.reply(`没有找到语言为“${splitArr[1]}”的语音`)
      return true;
    }
  }
  // 随机角色名
  let langPath = path.join(settings.path, language.key);
  let nameList = [];
  fs.readdirSync(langPath).forEach(fileName => nameList.push(fileName))
  let roleName = nameList[Math.round(Math.random() * (nameList.length - 1))]
  let roleId = YunzaiApps.mysInfo.roleIdToName(roleName);
  guessConfig.playing = true;
  guessConfig.roleId = roleId;
  e.reply('即将发送一段语音，30秒之后揭晓答案')
  console.group("猜语音")
  console.log('角色:', roleName)
  console.log('语言:', language.name)
  console.groupEnd()
  setTimeout(() => {
    randomPlayVoice(e, roleName, language)
    guessConfig.timer = setTimeout(() => {
      if (guessConfig.playing) {
        guessConfig.playing = false
        e.reply('很遗憾，还没有人答对哦，正确答案是：' + roleName)
      }
    }, 30000)
  }, 1500)

  return true;
}

export async function guessVoiceCheck(e) {
  let guessConfig = getGuessConfig(e);
  let { playing, roleId } = guessConfig;
  if (playing && roleId && e.msg) {
    let id = YunzaiApps.mysInfo.roleIdToName(e.msg.trim());
    if (roleId === id) {
      e.reply(['恭喜你答对了！'], true);
      guessConfig.playing = false;
      clearTimeout(guessConfig.timer);
      return true;
    }
  }
}
