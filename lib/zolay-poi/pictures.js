import { segment } from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();

//简单应用示例

const randomRaidenShogunReg = "^#(随机)?(.+)图片_?$"

//1.定义命令规则 例子 #原神图 #原神cos图 #崩三图
export const rule = {
  randomPictures: {
    reg: "^#(随机)?(原神|崩三|崩3|崩坏|崩崩崩)(同人|cos)图片?.*$",
    priority: 10, //优先级，越小优先度越高
    describe: "原神图片", //【命令】功能说明
  },
  randomRaidenShogun:{
    reg: randomRaidenShogunReg,
    priority: 10, //优先级，越小优先度越高
    describe: "原神图片", //【命令】功能说明
  }
};

export async function randomPictures(e) {
  //e.msg 用户的命令消息
  let flag = /cos/i.test(e.msg);
  let flag2 = /崩/i.test(e.msg);
  let gids = 0;  //游戏id
  /*
   * 崩 3: 1
	原神: 2
	崩 2: 3
	未定: 4
	大别墅: 5
星穹铁道: 6
  */
  let forum_id = 0;  // 社区ID 
  /*
   * 原神
	COS: 49
	同人图: 29
	崩 3
	同人图: 4
	大别墅
	COS: 47
	同人图: 39
	星穹铁道
	同人图: 56
	崩 2
	同人图: 40
	未定
	同人图: 38

  */
  if (flag2) {
  	// 如果是崩三图
    forum_id = 4;
    gids = 1;
  } else {
  	// 如果是原神图
    forum_id = flag == true ? 49 : 29;
    gids = 2;
  }

  let res = await getTupian(forum_id, gids, 0);
  if (!res || !res.post) {
    e.reply('图片获取失败了……');
    return true
  }
  //最后回复消息
  let msg = [
    //@用户
    segment.at(e.user_id),
    //图片
    "\n",
    segment.image(res.post.cover),
    //文本消息
    "\n",
    res.post.subject,
    "\n",
    `https://bbs.mihoyo.com/ys/article/${res.post.post_id}`
  ];

  //发送消息
  e.reply(msg);

  return true; //返回true 阻挡消息不再往下
}

async function getTupian(forum_id, gids, count){
  let last_id = Math.floor(Math.random()*5 + 1); //相当于页数
  let url = `https://bbs-api.mihoyo.com/post/wapi/getForumPostList?forum_id=${forum_id}&gids=${gids}&is_good=false&is_hot=true&last_id=${last_id}&page_size=20`; //接口地址
  let response = await fetch(url); //调用接口获取数据
  let data = await response.json(); //结果json字符串转对象
  let index = Math.floor(Math.random()*20 + 1)  // 随机图片
  let res = data.data.list[index];
  if (!res || !res.post) {
      if (count>=3){
        return null
      }
      return getTupian(forum_id, gids, count+1)
  }
  return res
}


export async function randomRaidenShogun(e) {
  let regexp = new RegExp(randomRaidenShogunReg)
  let roleName = e.msg.match(regexp)[2]
  let roleId = YunzaiApps.mysInfo.roleIdToName(roleName);
  if (roleId != '10000052') {
    // e.reply('目前仅支持雷电将军的图片');
    // return true
    return
  }
  let isNsfw = false
  if (e.isMaster && e.msg.endsWith("_")) {
    isNsfw = true
  }
  // 该 api 文档：https://waifu.im/docs/
  let url = `https://api.waifu.im/random/?selected_tags=raiden-shogun&is_nsfw=${isNsfw}`
  let response = await fetch(url)
  let data = await response.json()
  let imageUrl = data.images[0].url
  let msg = [segment.image(imageUrl)]
  if (isNsfw) {
    msg.push( '\n' + imageUrl)
  }
  e.reply(msg);
  return true
}
// 