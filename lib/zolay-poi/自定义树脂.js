import fs from "fs";
import moment from "moment";
import { segment } from "oicq";
import fetch from "node-fetch";
import format from "date-format";
import lodash from "lodash";
import { render } from "../render.js";
import Data from "../components/Data.js";
import { getHeaders, getUrl } from "../app/mysApi.js";

import { rule as dailyNoteRule } from "../app/dailyNote.js";


const _path = process.cwd();
let role_user = Data.readJSON(`${_path}/resources/genshin/dailyNote_zolay/json`, "dispatch_time");

let path_url = ["dailyNote", "xiaoyao_Note"];
let path_img = ["background_image", "/icon/bg"];

export const rule = {
  dailyNote_zolay: {
    hashMark: true,
    reg: dailyNoteRule.dailyNote.reg,
    priority: dailyNoteRule.dailyNote.priority - 1,
    describe: "【体力，树脂】原神体力查询，需要私聊配置cookie",
  },
};

//#树脂
export async function dailyNote_zolay(e) {
  let cookie, uid;
  if (NoteCookie[e.user_id]) {
    cookie = NoteCookie[e.user_id].cookie;
    uid = NoteCookie[e.user_id].uid;
  } else if (BotConfig.dailyNote && BotConfig.dailyNote[e.user_id]) {
    cookie = BotConfig.dailyNote[e.user_id].cookie;
    uid = BotConfig.dailyNote[e.user_id].uid;
  } else {
    e.reply(`尚未配置，无法查询树脂\n配置教程：${BotConfig.cookieDoc}`);
    return true;
  }

  const response = await getDailyNote(uid, cookie);
  if (!response.ok) {
    e.reply("米游社接口错误");
    return true;
  }
  const res = await response.json();

  if (res.retcode === 10102) {
    if (!e.openDailyNote) {
      e.openDailyNote = true;
      await openDailyNote(cookie); //自动开启
      dailyNote_zolay(e);
    } else {
      e.reply("请先开启实时便笺数据展示");
    }
    return true;
  }

  if (res.retcode !== 0) {
    if (res.message === "Please login") {
      Bot.logger.mark(`米游社cookie已失效`);
      e.reply(`米游社cookie已失效，请重新配置\n注意：退出米游社登录cookie将会失效！`);

      if (NoteCookie[e.user_id]) {
        await MysUser.delNote(NoteCookie[e.user_id]);
        delete NoteCookie[e.user_id];
        saveJson();
      }
    } else {
      e.reply(`树脂查询错误：${res.message}`);
      Bot.logger.mark(`树脂查询错误:${JSON.stringify(res)}`);
    }

    return true;
  }

  //redis保存uid
  redis.set(`genshin:uid:${e.user_id}`, uid, {
    EX: 2592000,
  });

  //更新
  if (NoteCookie[e.user_id]) {
    NoteCookie[e.user_id].maxTime = new Date().getTime() + res.data.resin_recovery_time * 1000;
    saveJson();
  }

  let data = res.data;
  //推送任务
  if (e.isTask && data.current_resin < e.sendResin) {
    return;
  }

  if (e.isTask) {
    Bot.logger.mark(`树脂推送:${e.user_id}`);
  }

  let nowDay = format("dd", new Date());
  let resinMaxTime;
  let resinMaxTime_mb2;
  let resinMaxTime_mb2Day;
  if (data.resin_recovery_time > 0) {
    resinMaxTime = new Date().getTime() + data.resin_recovery_time * 1000;
    let maxDate = new Date(resinMaxTime);
    resinMaxTime = format("hh:mm", maxDate);
    let Time_day = await dateTime_(maxDate);
    resinMaxTime_mb2 = Time_day + moment(maxDate).format("hh:mm");
    // console.log(format("dd", maxDate))
    if (format("dd", maxDate) !== nowDay) {
      resinMaxTime_mb2Day = `明天`;
      resinMaxTime = `明天 ${resinMaxTime}`;
    } else {
      resinMaxTime_mb2Day = `今天`;
      resinMaxTime = ` ${resinMaxTime}`;
    }
  }
  // console.log(data.expeditions)
  for (let val of data.expeditions) {
    if (val.remained_time <= 0) {
      val.percentage = 100;
    }
    if (val.remained_time > 0) {
      // console.log(val.remained_time)
      val.dq_time = val.remained_time;
      val.remained_time = new Date().getTime() + val.remained_time * 1000;
      // console.log(val.remained_time)
      let urls_avatar_side = val.avatar_side_icon.split("_");
      let id = YunzaiApps.mysInfo.roleIdToName(urls_avatar_side[urls_avatar_side.length - 1].replace(
        /(.png|.jpg)/g, ""));
      let name = YunzaiApps.mysInfo.roleIdToName(id, true);
      let time_cha = 20;
      if (role_user["12"].includes(name)) {
        time_cha = 15;
      }
      val.percentage = 100 - (((val.dq_time / 60 / 60 / time_cha) * 100 / 10).toFixed(0) * 10);
      let remainedDate = new Date(val.remained_time);
      val.remained_time = format("hh:mm", remainedDate);
      let Time_day = await dateTime_(remainedDate);
      if (format("dd", remainedDate) !== nowDay) {
        val.remained_mb2 = "明天" + Time_day + moment(remainedDate).format("hh:mm");
        val.remained_time = `明天 ${val.remained_time}`;
      } else {
        val.remained_mb2 = "今天" + Time_day + moment(remainedDate).format("hh:mm");
        val.remained_time = ` ${val.remained_time}`;
      }
    }
  }
  let remained_time = "";
  if (data.expeditions && data.expeditions.length >= 1) {
    remained_time = lodash.map(data.expeditions, "remained_time");
    remained_time = lodash.min(remained_time);
    if (remained_time > 0) {
      remained_time = new Date().getTime() + remained_time * 1000;
      let remainedDate = new Date(remained_time);
      remained_time = format("hh:mm", remainedDate);
      if (format("dd", remainedDate) !== nowDay) {
        remained_time = `明天 ${remained_time}`;
      } else {
        remained_time = ` ${remained_time}`;
      }
    }
  }

  let coinTime_mb2 = "";
  let coinTime_mb2Day = "";
  let coinTime = "";
  // let chnNumChar = ["零", "一", "后", "三", "四", "五", "六", "七", "八", "九"];
  let chnNumChar = ["今", "明", "后", "大后", "四", "五", "六", "七", "八", "九"];
  if (data.home_coin_recovery_time > 0) {
    let coinDate = new Date(new Date().getTime() + data.home_coin_recovery_time * 1000);
    let coinDay = Math.floor(data.home_coin_recovery_time / 3600 / 24);
    let coinHour = Math.floor((data.home_coin_recovery_time / 3600) % 24);
    let coinMin = Math.floor((data.home_coin_recovery_time / 60) % 60);
    if (coinDay > 0) {
      coinTime = `${coinDay}天${coinHour}小时${coinMin}分钟`;
      coinTime_mb2Day = chnNumChar[coinDay] + "天";
      let Time_day = await dateTime_(coinDate);
      coinTime_mb2 = Time_day + moment(coinDate).format("hh:mm");
    } else {
      coinTime_mb2 = moment(coinDate).format("hh:mm");
      if (format("dd", coinDate) !== nowDay) {
        coinTime_mb2Day = "明天";
        coinTime = `明天 ${format("hh:mm", coinDate)}`;
      } else {
        coinTime_mb2Day = "今天";
        coinTime = format("hh:mm", coinDate);
      }
    }
  }

  let day = format("MM-dd hh:mm", new Date());
  let week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  day += " " + week[new Date().getDay()];
  let day_mb2 = format("yyyy年MM月dd日 hh:mm", new Date()) + " " + week[new Date().getDay()];
  //参量质变仪
  if (data?.transformer?.obtained) {
    data.transformer.reached = data.transformer.recovery_time.reached;
    let recovery_time = "";
    if (data.transformer.recovery_time.Day > 0) {
      recovery_time += `${data.transformer.recovery_time.Day}天`;
    }
    if (data.transformer.recovery_time.Hour > 0) {
      recovery_time += `${data.transformer.recovery_time.Hour}小时`;
    }
    if (data.transformer.recovery_time.Minute > 0) {
      recovery_time += `${data.transformer.recovery_time.Minute}分钟`;
    }
    data.transformer.recovery_time = recovery_time;
  }
  // 固定为1
  let mb = 1;
  let image = fs.readdirSync(`./resources/genshin/dailyNote_zolay/${path_img[mb]}`);
  let list_img = [];
  for (let val of image) {
    list_img.push(val);
  }
  let imgs = list_img.length === 1 ? list_img[0] : list_img[lodash.random(0, list_img.length - 1)];
  let base64 = await render("genshin", `dailyNote_zolay`, {
    save_id: uid,
    uid: uid,
    coinTime_mb2Day,
    coinTime_mb2,
    resinMaxTime_mb2Day,
    resinMaxTime,
    resinMaxTime_mb2,
    remained_time,
    coinTime,
    imgs,
    day_mb2,
    day,
    ...data,
  }, "png");
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;
}

async function dateTime_(time) {
  let hh = format("hh", time);
  return hh < 6 ? "凌晨" : hh < 12 ? "上午" : hh < 16 ? "下午" : "傍晚";
}

async function getDailyNote(uid, cookie) {
  let { url, headers, query, body } = getUrl("dailyNote", uid);

  headers.Cookie = cookie;

  return await fetch(url, {
    method: "get",
    headers,
  });
}

export async function saveJson() {
  let path = "data/NoteCookie/NoteCookie.json";
  fs.writeFileSync(path, JSON.stringify(NoteCookie, "", "\t"));
}

let host = "https://api-takumi.mihoyo.com/";

//便签开关
async function openDailyNote(cookie) {
  let url = host + "game_record/card/wapi/getGameRecordCard?uid=";
  let change_url = host + "game_record/card/wapi/changeDataSwitch";
  let query = "";
  let body = `{"is_public":true,"switch_id":3,"game_id":"2"}`;

  let headers = getHeaders(query, body);
  headers.Cookie = cookie;

  let account_id = cookie.match(/ltuid=(\w{0,9})/g)[0].replace(/ltuid=|;/g, "");

  const res = await fetch(url + account_id, { method: "GET", headers });
  return await fetch(change_url, { method: "POST", body, headers });
}
