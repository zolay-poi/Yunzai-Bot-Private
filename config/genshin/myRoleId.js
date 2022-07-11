const myRoleId = {
  10000006: [
    ['丽莎阿姨', '丽莎姐姐'],
    []
  ],
  10000005: [
    ['黄毛叔叔'],
    []
  ],
  10000007: [
    ['包包'],
    ['莹', '萤']
  ],
  20000000: [
    ['风爷', '岩爷', '雷爷'],
    []
  ],
  10000014: [
    ['媛媛', '祈礼牧师'],
    []
  ],
  10000016: [
    [],
    ['卢本伟']
  ],
  10000020: [
    ['小狼崽'],
    ["卢皮卡", "小狼", "小狼狗", "狼孩"]
  ],
  10000022: [
    [],
    ['温蒂', '摸鱼',]
  ],
  10000023: [
    ['无敌风火轮真君', '提瓦特枪王', '锅巴发射器'],
    ['香玲', '香师傅']
  ],
  10000025: [
    ['枕玉', '枕玉老师'],
    ['秋妹妹', '书呆子',]
  ],
  10000026: [
    ['个子不高俊小伙', '抬头不见低头见真君', '金鹏', '金鹏大将', '风夜叉'],
    ['跳跳虎', '杏仁豆腐', '无聊',]
  ],
  10000030: [
    ['契约之神', '听书人'],
    ['天动万象', '岩王帝君', '未来可期']
  ],
  10000035: [
    ['起死回骸童子', '救苦度厄真君'],
    []
  ],
  10000036: [
    [],
    ['冰棍']
  ],
  10000041: [
    [],
    ['穷鬼', '穷光蛋', '穷',]
  ],
  10000042: [
    [],
    ['免疫', '免疫免疫',]
  ],
  10000046: [
    [],
    ['火化', '抬棺的']
  ],
  10000048: [
    ['璃月罗翔', "律法咨询师"],
    []
  ],
  10000051: [
    [],
    ['优拉', '尤拉', '尤菈']
  ],
  10000049: [
    ['夏祭的女王', '长野原加特林'],
    ['霄宫', '肖宫', '肖工', '绷带女孩', '烟花',]
  ],
  10000053: [
    ['柚岩龙蜥', '善于潜行的矮子'],
    []
  ],
  10000054: [
    ['宅家派节能军师', '珊瑚宫千花'],
    ['观赏鱼', '水母', '书记', '鱼', '美人鱼']
  ],
  10000062: [
    ['异界的救世主'],
    []
  ],
  10000050: [
    [],
    ['拖马', '太郎丸',]
  ],
  10000055: [
    ['狗狗',],
    ['土狗',]
  ],
  10000057: [
    [
      '荒泷天下独尊一斗', '荒泷相扑鬼王一斗',
      '荒泷鬼族骄傲一斗', '荒泷鬼兜虫角斗士一斗', '荒泷卡牌游戏王中王一斗',
      '荒泷可以输但绝不认输名副其实男子汉一斗', '荒泷本大爷第一斗',
      '荒泷美食大师一斗', '荒泷派初代目头领', '荒泷本大爷最强一斗',
    ],
    ['一抖', '牛牛', '牛子哥', '牛子', '斗虫', '巧乐兹']
  ],
  10000058: [
    [],
    ['想得美哦', '骚狐狸', '婶子', '小八', '八重寄子', '寄子', '八神虫子', '八神重子'],
  ],
  10000063: [
    [],
    ['神鹤', '小姨子', '审鹤']
  ],
  10000064: [
    [],
    ['神女劈观'],
  ],
  10000065: [
    ['真名解饿真君', '解饿真君'],
    ['97', '茄忍', '茄忍', '茄子', '紫茄子'],
  ],
  10000066: [
    ['神人'],
    ['神里凌人', '凌人']
  ],
  10000059: [
    ["鹿野院平藏", "shikanoin heizou", "Heizo", "heizo", "鹿野苑", "鹿野院", "平藏"],
    []
  ],
}


export function assignRoleId(config) {
  let {roleId, abbr} = config

  // 合并 abbr
  Object.assign(abbr, {
    '八重神子': '神子',
    '九条裟罗': '裟罗',
  })

  // 合并 roleId
  for (const key of Object.keys(myRoleId)) {
    let [include, exclude] = myRoleId[key]
    let arr = [...roleId[key], ...include]
    roleId[key] = arr.filter(item => !exclude.includes(item))
  }

}