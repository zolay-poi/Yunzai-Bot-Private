import fs from "fs";
import path from "path";
import {Buffer} from "buffer";
import {segment} from "oicq";
import moment from "moment";
import Data from "../components/Data.js";
import {render} from "../render.js";

//项目路径
const _path = process.cwd();
const mazePath = path.join(_path, "data/mazeDB");

export const rule = {
  mazeList: {
    reg: "^#?迷宫(列表)?$",
    priority: 100,
  },
  mazeCURD: {
    reg: "^#(添加|修改|删除)迷宫(模板|说明)?",
    priority: 100,
  },
  refreshMaze: {
    reg: "^#更新迷宫列表$",
    priority: 100,
  },
  mazeHelp: {
    reg: "^#迷宫帮助$",
    priority: 100,
  },
};

if (!fs.existsSync(mazePath)) {
  fs.mkdirSync(mazePath);
}

const whiteList = [
  644404503,
  290546227,
];

export function isWhiteList(e) {
  return whiteList.includes(e.group_id);
}

export async function mazeList(e) {
  if (e.isPrivate) return;
  if (!isWhiteList(e)) return;
  let cachePath = path.join(mazePath, `${e.group_id}.png`);
  if (fs.existsSync(cachePath)) {
    e.reply([segment.image(cachePath)]);
    return true;
  }
  return refreshMaze(e);
}

const BF_ID = "@ID：";
const BF_AUTHOR = "@作者QQ：";
const BF_NAME = "@名称：";
const BF_TYPE = "@类型：";
const BF_DIFFICULTY = "@难度：";
const BF_REMARK = "@备注：";

export async function mazeCURD(e) {
  if (e.isPrivate) return;
  if (!isWhiteList(e)) return;
  let isAdd = e.msg.includes("#添加迷宫");
  let isEdit = e.msg.includes("#修改迷宫");
  let isDelete = e.msg.includes("#删除迷宫");

  let addReq = [BF_AUTHOR, BF_NAME, BF_TYPE, BF_DIFFICULTY, BF_REMARK];
  let editReq = [BF_ID, BF_NAME, BF_AUTHOR, BF_TYPE, BF_DIFFICULTY, BF_REMARK];
  let deleteReq = [BF_ID];
  let checkReq = async (req, cmd, otherMsg = "") => {
    for (const reqItem of req) {
      if (!e.msg.includes(reqItem)) {
        await e.reply([segment.at(e.user_id), ` 请复制以下模板填充内容：`, otherMsg]);
        await e.reply(`${cmd}\n${req.join("\n")}`);
        return false;
      }
    }
    return true;
  };
  let mazeData = getJson(e);
  if (isAdd) {
    if (await checkReq(addReq, "#添加迷宫")) {
      let info = parseMessage(e);
      if (!info.author) {
        info.author = getAtQQ(e);
      }
      if (!info.author) {
        info.author = e.user_id;
      }
      try {
        info.author = Number.parseInt(info.author);
        if (Number.isNaN(info.author)) {
          throw new Error();
        }
      } catch {
        e.reply([segment.at(e.user_id), ` 操作失败，作者QQ格式错误！`]);
        return true;
      }
      let isAdmin = checkAuth(e);
      if (!isAdmin && info.author !== e.user_id) {
        e.reply([segment.at(e.user_id), ` 添加失败：只有管理员可以添加他人的迷宫！`]);
        return true;
      }
      mazeData.add(info);
      e.reply([segment.at(e.user_id), ` 迷宫添加成功！`]);
      return refreshMaze(e);
    }
  } else if (isEdit) {
    // 获取模板
    if (e.msg.includes("#修改迷宫模板")) {
      if (await checkReq([BF_ID], "#修改迷宫模板")) {
        let {mazeItem} = getMazeItemCheckAuth(e, mazeData, "修改");
        if (mazeItem) {
          let template = [
            "#修改迷宫",
            BF_ID + mazeItem.id,
            BF_AUTHOR + mazeItem.author,
            BF_NAME + mazeItem.name,
            BF_TYPE + mazeItem.type,
            BF_DIFFICULTY + mazeItem.difficulty,
            BF_REMARK + mazeItem.remark,
          ];
          return e.reply(template.join("\n"));
        }
      }
      return true;
    }
    if (e.msg.includes("#修改迷宫说明")) {
      if (!checkAuth(e)) {
        e.reply([segment.at(e.user_id), ` 只有管理员才可以修改迷宫说明！`]);
        return true;
      }
      let lines = e.msg.split(/[\r\n]/);
      if (lines.length < 2) {
        await e.reply([segment.at(e.user_id), ` 请复制以下模板修改内容（可使用html标签）：`]);
        await e.reply(`#修改迷宫说明\n${mazeData.difficulty}`);
        return true;
      }
      let difficultyTexts = [];
      for (let i = 1; i < lines.length; i++) {
        difficultyTexts.push(lines[i]);
      }
      mazeData.difficulty = difficultyTexts.join("\n");
      mazeData.save();
      e.reply([segment.at(e.user_id), ` 迷宫说明修改成功！`]);
      return refreshMaze(e);
    }

    if (await checkReq(editReq, "#修改迷宫", "\n你也可以发送“#修改迷宫模板”来恢复以前添加过的迷宫")) {
      let {mazeItem, info} = getMazeItemCheckAuth(e, mazeData, "修改");
      if (mazeItem) {
        if (!info.author) {
          info.author = mazeItem.author;
        }
        if (!info.author) {
          info.author = getAtQQ(e);
        }
        if (!info.author) {
          info.author = e.user_id;
        }
        try {
          info.author = Number.parseInt(info.author);
          if (Number.isNaN(info.author)) {
            throw new Error();
          }
        } catch {
          e.reply([segment.at(e.user_id), ` 操作失败，作者QQ格式错误！`]);
          return true;
        }
        mazeData.edit(mazeItem, info);
        e.reply([segment.at(e.user_id), ` 迷宫修改成功！`]);
        return refreshMaze(e);
      }
    }
  } else if (isDelete) {
    if (await checkReq(deleteReq, "#删除迷宫")) {
      let {mazeItem} = getMazeItemCheckAuth(e, mazeData, "删除");
      if (mazeItem) {
        mazeData.delete(mazeItem);
        e.reply([segment.at(e.user_id), ` 迷宫已删除……`]);
        return refreshMaze(e);
      }
    }
  }
  return true;
}

export async function refreshMaze(e) {
  let json = getJson(e);
  let list = json.list || [];
  if (list.length === 0) {
    e.reply("没有任何迷宫");
    return true;
  }
  let authorMap = new Map();
  for (const item of list) {
    let data = authorMap.get(item.author);
    if (!data) {
      data = [];
      authorMap.set(item.author, data);
    }
    if (!item.isDelete) {
      data.push(item);
    }
  }
  let authorList = [];
  for (const mazeList of authorMap.values()) {
    if (mazeList.length > 0) {
      let authorName = "";
      for (const mazeItem of mazeList) {
        if (!authorName) {
          let member = Bot.pickMember(e.group_id, mazeItem.author);
          if (member && member.card) {
            authorName = member.card;
          } else {
            let userInfo = await Bot.pickUser(mazeItem.author).getSimpleInfo();
            if (!userInfo) {
              authorName = "未知";
            }
            authorName = userInfo.nickname;
          }
          if (authorName) {
            authorName = authorName.replace(/[1-9]\d{8,}/g, "").trim();
          }
        }
        mazeItem.authorName = authorName || mazeItem.author;
      }
      authorList.push(mazeList);
    }
  }
  let base64 = await render("maze", "list", {
    authorList,
    difficulty: json.difficulty,
    time: moment().format("YYYY年MM月DD日 HH:mm:ss"),
  });
  if (base64) {
    e.reply([segment.image(`base64://${base64}`)]);
    let dataBuffer = Buffer.from(base64, "base64");
    let cachePath = path.join(mazePath, `${e.group_id}.png`);
    fs.writeFile(cachePath, dataBuffer, () => 0);
  }
  return true;
}

function getAtQQ(e) {
  for (let msg of e.message) {
    if (msg.type === "at") {
      return msg.qq;
    }
  }
  return null;
}

function getMazeItemCheckAuth(e, mazeData, action) {
  let info = parseMessage(e);
  if (!info.id) {
    e.reply([segment.at(e.user_id), ` 格式错误：@ID 不能为空！`]);
    return {};
  }
  let mazeItem = mazeData.pickMaze(info.id);
  if (!mazeItem) {
    e.reply([segment.at(e.user_id), ` ${action}失败：没有找到 @ID 为 ${info.id} 的迷宫！`]);
    return {};
  }
  let isAdmin = checkAuth(e);
  if (!isAdmin && mazeItem.author !== e.user_id) {
    e.reply([segment.at(e.user_id), ` ${action}失败：只有管理员可以${action}他人的迷宫！`]);
    return {};
  }
  return {mazeItem, info};
}

function parseMessage(e) {
  let msg = [];
  for (let val of e.message) {
    if (val.type === "text") {
      val.text = val.text.replace(/[＃井]/g, "#").trim();
      msg.push(val.text);
    }
  }
  msg = msg.join("\n");
  let lines = msg.split(/[\r\n]/);
  lines = lines.splice(1, lines.length);
  let idx = 0;
  let texts = [];
  for (let line of lines) {
    let text = line;
    if (line.includes(BF_ID)) {
      idx = 0;
      text = text.replace(BF_ID, "");
    } else if (line.includes(BF_AUTHOR)) {
      idx = 1;
      text = text.replace(BF_AUTHOR, "");
    } else if (line.includes(BF_TYPE)) {
      idx = 2;
      text = text.replace(BF_TYPE, "");
    } else if (line.includes(BF_DIFFICULTY)) {
      idx = 3;
      text = text.replace(BF_DIFFICULTY, "");
    } else if (line.includes(BF_REMARK)) {
      idx = 4;
      text = text.replace(BF_REMARK, "");
    } else if (line.includes(BF_NAME)) {
      idx = 5;
      text = text.replace(BF_NAME, "");
    } else {
      text = "\n" + text;
    }
    if (!texts[idx]) {
      texts[idx] = "";
    }
    texts[idx] += text;
  }
  return {
    id: (texts[0] || "").trim(),
    author: (texts[1] || "").trim(),
    name: (texts[5] || "").trim(),
    type: (texts[2] || "").trim(),
    difficulty: (texts[3] || "").trim(),
    remark: (texts[4] || "").trim(),
  };
}

const defaultDifficulty = `
<h3 style="text-align: center;">迷宫难度说明</h3>
<h4>迷宫难度等级：</h4>
D级难度：10分钟以下
C级难度：10-30分钟
B级难度：30分钟-1小时
A级难度：1-2小时
S级难度：2-5小时
SS级难度：5-10小时
SSS级难度：10小时以上

<h4>迷宫类型：</h4>
山体迷宫、平面迷宫、浮空迷宫、建筑迷宫、特殊迷宫，共5类。`;

function getJson(e) {
  let json;
  try {
    json = Data.readJSON(mazePath, `${e.group_id}.json`);
  } catch {
  }
  if (!json) {
    json = {
      list: [],
      difficulty: defaultDifficulty,
    };
  }
  json.pickMaze = (id) => pickMaze(id, json.list);
  json.save = () => {
    fs.writeFileSync(mazePath + `/${e.group_id}.json`, JSON.stringify(json, null, 2));
  };
  // 新增
  json.add = (info) => {
    json.list.push({
      ...info,
      id: nextId(json.list),
      isDelete: false
    });
    json.save();
  };
  // 修改
  json.edit = (item, info) => {
    item.author = info.author;
    item.name = info.name;
    item.type = info.type;
    item.difficulty = info.difficulty;
    item.remark = info.remark;
    item.isDelete = false;
    json.save();
  };
  // 删除
  json.delete = (item) => {
    item.isDelete = true;
    json.save();
  };
  return json;
}

function pickMaze(id, list) {
  for (const item of list) {
    if (`${item.id}` === `${id}`) {
      return item;
    }
  }
  return null;
}

function nextId(list) {
  let ids = list.map((i) => i.id);
  return Math.max(...ids) + 1;
}

function checkAuth(e) {
  // owner 群主
  // member 群员
  // admin 管理员
  return e.isMaster || e.sender.role === "owner" || e.sender.role === "admin";
}


export function mazeHelp(e) {
  let helps = [];
  helps.push(`指令：#添加迷宫\n用途：向迷宫列表里添加你的迷宫，任何人都可以添加自己的迷宫，管理员可以添加他人的迷宫。\n`);
  helps.push(`指令：#修改迷宫\n用途：修改已添加的迷宫，任何人都可以修改自己添加的迷宫，管理员可以修改他人的迷宫。\n`);
  helps.push(`指令：#修改迷宫模板\n用途：可以将已添加的迷宫以文字形式展示出来，用于快速修改迷宫。\n`);
  helps.push(`指令：#删除迷宫\n用途：删除迷宫，任何人都可以删除自己添加的迷宫，管理员可以删除他人的迷宫。\n`);
  helps.push(`指令：#更新迷宫列表\n用途：当任何人修改了群名片后，可发送该指令刷新图片。\n`);
  helps.push(`指令：#修改迷宫说明\n用途：修改迷宫列表最底端的迷宫说明，仅管理员可用。\n`);
  helps.push(`其他说明：`);
  helps.push(`1、【@ID】在添加的时候不必填写，系统会自动生成一个，修改或删除的时候，要认准图片里显示的ID。`);
  helps.push(`2、【@迷宫作者QQ】可以艾特一个人，也可以留空不填，不填代表作者是你自己。`);
  helps.push(`3、【@类型】可参考图片底部的迷宫说明。`);
  helps.push(`4、【@难度】可参考图片底部的迷宫说明。若你也不确定你迷宫的难度，可以找群友帮忙评级。`);

  e.reply(helps.join("\n"));
  return true;
}
