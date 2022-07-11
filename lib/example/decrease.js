import {
	segment
} from "oicq";
import fetch from "node-fetch";
import lodash from "lodash";
import fs from "fs";
import {
	MysUser,
	User
} from "../components/Models.js";

//项目路径
const _path = process.cwd();

//简单应用示例

//1.定义命令规则
export const rule = {
	decrease: {
		reg: "^#退群删除ck$", //匹配消息正则，命令正则
		priority: 5000, //优先级，越小优先度越高
		describe: "【#退群删除ck】开发简单示例演示", //【命令】功能说明
	},
};

//2.编写功能方法
//方法名字与rule中的decrease保持一致
//测试命令 npm test 例子
export async function decrease(e) {
	let name = e.member?.card ? e.member.card : e.member?.nickname;

	//定义退群内容
	let msg = `${name}(${e.user_id}) 永远的离开了我们。。。`; //文字

	//不是群聊
	if (!e.isGroup) {
		return;
	}
	let isNote = true;
	if (!NoteCookie[e.user_id] || await finedData(e.user_id) > 0) {
		isNote = false;
	}
	if (BotConfig.decreaseCookie == 1 && isNote) {
		let selfUser = User.get(e.user_id);
		// 将用户从MysUser缓存中删除
		MysUser.delNote(NoteCookie[e.user_id]);
		delete NoteCookie[e.user_id];
		saveJson()
		Bot.logger.mark(`删除cookie:${e.user_id}`);
		Bot.pickFriend(e.user_id).delete() //怨种一个必须删除好友
		msg += "已成功删除cookie。";
	}
	if (BotConfig.decreaseCookie == 2 && isNote) {
		NoteCookie[e.user_id].isPush = false;
		NoteCookie[e.user_id].isSignPush = false;
		NoteCookie[e.user_id].isSignAuto = false;
		saveJson()
		msg += "已关闭自动签到跟推送。";
		Bot.logger.mark(`已关闭自动签到跟推送:${e.user_id}`);
	}
	e.reply(msg);
	return true; //返回true 阻挡消息不再往下
}

/**
 * 判断是否在bot所在的其他群中
 * @param {退群的人的qq号} qq 
 */
async function finedData(qq) {
	let Blacklist = await Bot.gl //获取全部群
	let Flendlist = await Bot.fl //获取全部用户
	let count = 0;
	for (let key of Blacklist) {
		let userlist = await Bot.pickGroup(key[0] * 1).getMemberMap();
		for (let user of userlist) {
			console.log(user[0] * 1)
			if (user[0] * 1 == qq * 1) {
				count++;
			}
		}
	}
	return count
}
/**
 * 用于保存ck数据
 */
export async function saveJson() {
	let path = "data/NoteCookie/NoteCookie.json";
	fs.writeFileSync(path, JSON.stringify(NoteCookie, "", "\t"));
}
