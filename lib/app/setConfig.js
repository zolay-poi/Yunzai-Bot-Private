import {
	segment
} from "oicq";
import fetch from "node-fetch";
import lodash from "lodash";
import fs from "fs";
import {
	createRequire
} from "module";
import path from 'path';

const _path = process.cwd();
const __dirname = path.resolve();
const require = createRequire(
	import.meta.url);
let cfgMap = {
	"私聊回复": "disableMsg",
	"禁用私聊": "disablePrivate",
	"角色展示": "roleAllAvatar",
	"全部ck": "allowUseNoteCookie",
	"退群删ck": "decreaseCookie",
	"自动同意好友": "autoFriend",
	"签到推送": "isPushSign",
	"原石推送": "isPushLedger",
	"体力推送": "isPushNote",
	"新闻推送": "isPushNews",
	"腾讯Id": "secretId",
	"腾讯key": "secretKey",
	"ai名字": "BotName",
	"百度Id": "APP_ID",
	"百度key": "API_KEY",
	"百度密钥": "SECRET_KEY",
};
let cfgQQ = {
	"黑名单": "balckQQ",
	"主人": "masterQQ",
	"群黑名单": "balckGroup",
}
let cfgGroup = {
	"抽卡撤回": "delMsg",
	"每日抽卡": "gachaDayNum",
	"卡池计算": "LimitSeparate",
	"每日查询": "mysDayLimit",
	"每日查询uid": "mysUidLimit",
	"指令冷却": "groupCD",
	"操作冷却": "singleCD",
	"戳一戳冷却": "PokeCD",
	"功能禁用": "disable",
	"功能恢复": "disable",
}
let sysCfgReg = `^#(yunzai|云崽|yz|云仔)设置\s*(${lodash.keys(cfgMap).join("|")})?\s*(.*)$`;
let sysQQReg = `^#(yunzai|云崽|yz|云仔)(设置|移除|移出)(${lodash.keys(cfgQQ).join("|")})(\\d*)$`;
let sysGroupReg = `^#(yunzai|云崽|yz|云仔)设置群(\\d*)(${lodash.keys(cfgGroup).join("|")})(.*)$`;
export const rule = {
	setConfig: {
		reg: sysCfgReg, //匹配消息正则，命令正则
		priority: 5000, //优先级，越小优先度越高
		describe: "【(yunzai|云崽|yz)设置】", //【命令】功能说明
	},
	setQQAndGroup: {
		reg: sysQQReg, //匹配消息正则，命令正则
		priority: 4000, //优先级，越小优先度越高
		describe: "【(yunzai|云崽|yz)设置】", //【命令】功能说明
	},
	setGroup: {
		reg: sysGroupReg, //匹配消息正则，命令正则
		priority: 4000, //优先级，越小优先度越高
		describe: "【(yunzai|云崽|yz)设置】", //【命令】功能说明
	}
};

export async function setConfig(e) {
	if (!await checkAuth(e)) {
		return true;
	}
	let cfgReg = new RegExp(sysCfgReg);
	let regRet = cfgReg.exec(e.msg);

	if (!regRet) {
		return true;
	}
	
	if (regRet[1]) {
		let strConfig = renderFile();
		// 设置模式
		let val = regRet[3] || "";
		let cfgKey = cfgMap[regRet[2]];
		if (cfgKey != "disableMsg" && !val) {
			return false;
		}
		let reg = new RegExp(`('|")*${cfgKey}('|")*(\\s\\S)*:(\\s\\S)*('|")*(.{0,10})('|")*,`, "g")
		let lastmsg = strConfig.match(reg);
		let ismsg = /('|")/.test(lastmsg[0].split(":")[1]);
		if (/(开启|关闭)/.test(val)) val = val == "开启" ? true : false;
		let newMsg = `${cfgKey}:`
		if (ismsg) {
			newMsg += ` '${val}',`
		} else {
			newMsg += ` ${val},`
		}
		strConfig = strConfig.replace(new RegExp(lastmsg[0], "g"), newMsg)
		saveConfig(strConfig)
		e.reply(`config文件更新成功！${regRet[2]}功能修改${val}成功`)
		return true
	}

}
const checkAuth = async function(e) {
	return await e.checkAuth({
		auth: "master",
		replyMsg: `只有主人才能命令我哦~
    (*/ω＼*)`
	});
}
const getStatus = function(rote, def = true) {
	if (Cfg.get(rote, def)) {
		return `<div class="cfg-status" >已开启</div>`;
	} else {
		return `<div class="cfg-status status-off">已关闭</div>`;
	}
}

const renderFile = function() {
	return fs.readFileSync(__dirname + "/config/config.js", "utf8");
}
const saveConfig = function(str) {
	fs.writeFile(__dirname + '/config/config.js', str, 'utf8', (err) => {
		if (err) {
			Bot.pickUser(BotConfig.masterQQ[0]).sendMsg(err)
		}
	});
}
export async function setQQAndGroup(e) {
	if (!await checkAuth(e)) {
		return true;
	}
	let cfgReg = new RegExp(sysQQReg);
	let regRet = cfgReg.exec(e.msg);
	if (!regRet) {
		return true;
	}
	if (regRet[1]) {
		let strConfig = renderFile();
		let val = regRet[4] || "";
		let cfgKey = cfgQQ[regRet[3]];
		// let reg = new RegExp(`('|")*${cfgKey}('|")*(\\s)*:(\\s)*\\[`, "g")
		let reg = new RegExp(`('|")*${cfgKey}('|")*(\\s)*:(\\s)*\\[`, "g")
		let lastmsg = strConfig.match(reg);
		let newMsg = lastmsg[0]
		if (/设置/.test(regRet[2])) {
			newMsg += `${val},`
			strConfig = strConfig.replace(lastmsg[0], newMsg)
		} else {
			strConfig = strConfig.replace(new RegExp(val + ",{0,1}"), "")
		}
		saveConfig(strConfig)
		e.reply(`config文件更新成功！${regRet[2]}功能修改${val}成功`)
	}
	return true
}

export async function setGroup(e) {
	let cfgReg = new RegExp(sysGroupReg);
	let regRet = cfgReg.exec(e.msg);
	if (!regRet) {
		return true;
	}
	// console.log(regRet)
	if (regRet[1]) {
		try{
			let strConfig = renderFile();
			let val = regRet[4] || "";
			let cfgKey = cfgGroup[regRet[3]];
			let reg = new RegExp(`('|")*${regRet[2]}('|")*(\\s)*:(\\s)*\\{([\\s\\S]*)\\}`, "g")
			// console.log(reg)
			let oneMsg = strConfig.match(reg);
			if (oneMsg) {
				let reg2 = new RegExp(`('|")*${cfgKey}('|")*(\\s)*:(\\s)*\\[{0,1}('|")*(.*)('|")*\\]{0,1},`, "g")
				let lastmsg = oneMsg[0].match(reg2)
				let newMsg = `${cfgKey}: `
				// console.log(lastmsg)
				if (cfgKey == 'disable') {
					if(regRet[3]=="功能禁用"){
						newMsg =newStr(lastmsg[0],2,val)
					}else{
						newMsg=lastmsg[0].replace(new RegExp(`,{0,1}('|")*${val}('|")*`),"")
					}
				} else {
					newMsg += `${val},`
				}
				let Msg = oneMsg[0].replace(lastmsg[0], newMsg)
				// console.log(Msg)
				strConfig = strConfig.replace(oneMsg[0], Msg)
			} else {
				let reg2 = new RegExp(`group:(\\s*){`, "g")
				let Msg = `group:{\n'${regRet[2]}': {
				delMsg: ${cfgKey=='delMsg'?val:0}, //隔多少毫秒后撤回消息（十连），0不撤回
				gachaDayNum: ${cfgKey=='gachaDayNum'?val:200}, //每天抽卡次数，限制次数，防止刷屏,4点重置
				LimitSeparate: ${cfgKey=='LimitSeparate'?val:0}, //角色池，武器池限制分开计算 0-不分开 1-分开
			
				//米游社信息查询
				mysDayLimit: ${cfgKey=='mysDayLimit'?val:30}, //每天每人查询次数
				mysUidLimit: ${cfgKey=='mysUidLimit'?val:50}, //每天每人查询uid个数
			
				groupCD: ${cfgKey=='groupCD'?val:500}, //群聊中所有指令操作冷却时间，单位毫秒,0则无限制
				singleCD: ${cfgKey=='singleCD'?val:2000}, //群聊中个人操作冷却时间，单位毫秒
				PokeCD: ${cfgKey=='PokeCD'?val:5000}, //群聊中戳一戳冷却时间，单位毫秒
				disable: ['${cfgKey=='disable'?val:""}'], //禁用所有功能
			},`
				// console.log(strConfig.match(reg2))
				strConfig = strConfig.replace(strConfig.match(reg2)[0], Msg)
			}
			// console.log(strConfig)
			saveConfig(strConfig)
			e.reply(`config文件更新成功！群${regRet[2]}功能修改${val}成功`)
		}catch(e){
			e.reply("总感觉哪里出问题了呢~")
		}
	}
	return true
}

function newStr(str, n,key) {
	let val="";
	if(str.indexOf("'")>=0){
		val=",'"+key+"'"
	}else{
		val="'"+key+"'"
	}
	var newStr = str.slice(0, str.length - n) + val + str.slice(-n)
	return newStr
}
