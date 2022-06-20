import fs from "fs";
import path from "path";
import { segment } from "oicq";

//项目路径
const _path = process.cwd();
const __dirname = path.resolve();

export const rule = {
	global: {
		reg: "^#(全局){0,1}(语音|视频|图片)列表(.*)$", //定义匹配正则
		priority: 450,
		describe: "生成js文件自动放到插件目录下面",
	},

}
//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function global(e) {
	if (!e.isMaster)return;
	// console.log(e)
	let msg = e.msg.replace(/#|全局/g, "").split('列表');	//去除#以及触发字
// 	if (!msg[1]) {	//判断是否输入内容
// 		e.reply("派蒙没有理解你的意思\n正确指令：\n例如：#全局语音列表诶嘿");
// 		return true;
// 	}
	let url = '';	//匹配路径
	switch (msg[0]) {
		case "语音":
			url = "global_record";
			break;
		case "视频":
			url = "global_video";
			break;
		case "图片":
			url = "global_img";
			break;
		default:
			break;
	}

	// 异步读取上级目录下的所有文件
	fs.readdir(`${_path}/resources/${url}`, function(err, files) {
		if (err) {
			e.reply("出问题了呢建议检查/resources/"+url+"有没有")
			return true
		} else {
			let new_files=[];
			for(let i=0;i<files.length;i++){
				if(files[i].indexOf(msg[1])>=0){
					new_files.push(files[i])
				}
			}
			if(new_files.length==0){
				e.reply("派蒙没有找到你想要的"+msg[0]+"文件哦")
				return true;
			}
			let mess="触发关键字【-】用于区分不同的触发关键字：\n"; //可有可无的提示 请自行修改
			//请自行添加文件格式后缀
			e.reply(mess+new_files.join(",").replace(/,/g, ',\n').replace(/(.amr|.mp3|.mp4|.jpg|.png)/g,""))
			return true;
		}
	});
	return true;
}
