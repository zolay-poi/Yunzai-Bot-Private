import {segment} from 'oicq'
import fetch from "node-fetch";

export const rule = {
  randomACG: {
    reg: /^#acg$/,
    priority: 100,
    describe: '【#acg】随机acg图片',
  },
  todayYiYan: {
    reg: '^#(每日)?一言$', //匹配消息正则，命令正则
    priority: 100, //优先级，越小优先度越高
    describe: '【#一言】一言接口', //【命令】功能说明
  },
  moYu: {
    reg: '^#(摸鱼|放假)$',
    priority: 100,
    describe: '【#摸鱼】摸鱼时间',
  },
  getGroupImage:{
    reg: '^#获取(图片|视频)_.+$',
    priority: 100,
  }
}

export async function randomACG(e) {
  if (!e.isMaster) return
  let url = `https://iw233.cn/api/Random.php`
  e.reply([segment.image(url)])
  return true
}

export async function todayYiYan(e) {
  //执行的逻辑功能
  let url = 'https://v1.hitokoto.cn/' //一言接口
  let response = await fetch(url) //调用接口获取数据
  let res = await response.json() //结果json字符串转对象


  //最后回复消息
  let msg = [res.hitokoto]

  //发送消息
  e.reply(msg)

  return true //返回true 阻挡消息不再往下
}

const moyuDate = [
  {name: '清明', date: new Date('2022-04-03')},
  {name: '五一', date: new Date('2022-04-30')},
  {name: '端午', date: new Date('2022-06-03')},
  {name: '中秋', date: new Date('2022-09-10')},
  {name: '国庆', date: new Date('2022-10-01')},
  {name: '元旦', date: new Date('2023-01-01')},
  {name: '春节', date: new Date('2023-01-22')},
  {name: '元宵', date: new Date('2023-02-05')},
]

export async function moYu(e) {
  let msg = [
    '【摸 鱼 办】提醒',
    segment.at(e.user_id),
    '：',
  ]
  let curr = new Date()
  msg.push(`${curr.getMonth() + 1}月${curr.getDate()}日${curr.getHours() > 12 ? '下午' : '上午'}好`)
  msg.push(',摸鱼人！工作再累，一定不要忘记摸鱼哦！有事没事起身去茶水间去厕所，去廊道走走别总在工位上坐着，钱是老板的，但健康是自己的。')

  let weekNum = 7 - curr.getDay() - 1
  if (weekNum > 0) {
    msg.push(`\n距离【周末】还有：${weekNum}天`)
  }
  let time = curr.getTime()
  for (let item of moyuDate) {
    let diff = item.date.getTime() - time
    if (diff > 0) {
      let day = Math.ceil(diff / 1000 / 60 / 60 / 24)
      msg.push(`\n距离【${item.name}】还有：${day > 1 ? day : '不到1'}天`)
    }
  }
  //发送消息
  e.reply(msg)

  return true //返回true 阻挡消息不再往下
}

export async function getGroupImage(e){
  if(!e.isMaster) return
  let md5 =  e.msg.split("_")[1]
  if(e.msg.indexOf('视频')!=-1){
      console.log('---- 1',md5)
      e.reply([segment.video(md5)])
     let url = await Bot.getVideoUrl('644404503',md5)
     console.log('---- 2', url)
    e.reply(url)   
  } else {
    e.reply([segment.image(md5)])    
  }
  return true
}
