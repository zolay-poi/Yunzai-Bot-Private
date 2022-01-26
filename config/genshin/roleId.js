//首位是官方默认名称
let roleId = {
  10000003: ["琴", "团长", "代理团长", "琴团长", "蒲公英骑士"],
  10000006: ["丽莎", "图书管理员", "图书馆管理员", "蔷薇魔女"],
  10000005: ["空", "男主", "男主角", "龙哥"],
  10000007: ["荧", "女主", "女主角", "莹", "萤"],
  20000000: ["主角", "旅行者", "卑鄙的外乡人", "荣誉骑士", "爷","风主","岩主"],
  10000014: ["芭芭拉","巴巴拉","拉粑粑","拉巴巴","内鬼","加湿器","闪耀偶像","偶像",],
  10000015: ["凯亚","盖亚","凯子哥","凯鸭","矿工","矿工头子","骑兵队长","凯子",],
  10000016: ["迪卢克","卢姥爷","姥爷","卢老爷","卢锅巴","正义人","正e人","正E人","卢本伟","暗夜英雄","卢卢伯爵","落魄了","落魄了家人们"],
  10000020: ["雷泽", "狼少年", "狼崽子", "狼崽", "卢皮卡", "小狼", "小狼狗"],
  10000021: ["安柏","安伯","兔兔伯爵","飞行冠军","侦查骑士","点火姬","点火机","打火机","打火姬",],
  10000022: ["温迪","温蒂","风神","卖唱的","巴巴托斯","巴巴脱丝","芭芭托斯","芭芭脱丝","干点正事","不干正事","吟游诗人","诶嘿","唉嘿","摸鱼",],
  10000023: ["香菱", "香玲", "锅巴", "厨师", "万民堂厨师", "香师傅"],
  10000024: ["北斗", "大姐头", "大姐","无冕的龙王","龙王"],
  10000025: ["行秋", "秋秋人", "秋妹妹", "书呆子"],
  10000026: ["魈","杏仁豆腐","打桩机","插秧","三眼五显仙人","三眼五显真人","降魔大圣","护法夜叉","快乐风男","无聊","靖妖傩舞","矮子仙人",],
  10000027: ["凝光", "富婆", "天权星"],
  10000029: ["可莉","嘟嘟可","火花骑士","蹦蹦炸弹","炸鱼","放火烧山","放火烧山真君","蒙德最强战力","逃跑的太阳","啦啦啦","哒哒哒","炸弹人","禁闭室",],
  10000030: ["钟离","摩拉克斯","岩王爷","岩神","钟师傅","天动万象","岩王帝君","未来可期","帝君","拒收病婿"],
  10000031: ["菲谢尔","皇女","小艾米","小艾咪","奥兹","断罪皇女","中二病","中二少女","中二皇女",],
  10000032: ["班尼特","点赞哥","点赞","倒霉少年","倒霉蛋","霹雳闪雷真君","班神","班爷","倒霉"],
  10000033: ["达达利亚","达达鸭","达达利鸭","公子","玩具销售员","玩具推销员","钱包","鸭鸭","愚人众末席"],
  10000034: ["诺艾尔", "女仆", "高达" ,"岩王帝姬"],
  10000035: ["七七", "僵尸","肚饿真君","度厄真君"],
  10000036: ["重云", "纯阳之体", "冰棍"],
  10000037: ["甘雨", "椰羊", "椰奶", "王小美"],
  10000038: ["阿贝多","可莉哥哥","升降机","升降台","电梯","白垩之子","贝爷","白垩","阿贝少","花呗多","阿贝夕"],
  10000039: ["迪奥娜","迪欧娜","dio","dio娜","冰猫","猫猫","猫娘","喵喵","调酒师"],
  10000041: ["莫娜","穷鬼","穷光蛋","穷","莫纳","占星术士","占星师","讨龙真君","半部讨龙真君","阿斯托洛吉斯·莫娜·梅姬斯图斯"],
  10000042: ["刻晴","刻情","氪晴","刻师傅","刻师父","牛杂","牛杂师傅","斩尽牛杂","免疫","免疫免疫","屁斜剑法","玉衡星","阿晴"],
  10000043: ["砂糖", "雷莹术士", "雷萤术士", "雷荧术士"],
  10000044: ["辛焱", "辛炎", "黑妹","摇滚"],
  10000045: ["罗莎莉亚", "罗莎莉娅", "白色史莱姆", "白史莱姆", "修女"],
  10000046: ["胡桃","胡淘","往生堂堂主","火化","抬棺的","蝴蝶","核桃","堂主","胡堂主","雪霁梅香"],
  10000047: ["枫原万叶", "万叶", "叶天帝", "天帝", "叶师傅"],
  10000048: ["烟绯", "烟老师", "律师", "罗翔"],
  10000051: ["优菈", "优拉", "尤拉", "尤菈", "浪花骑士", "记仇","劳伦斯"],

  //2.0
  10000002: ["神里绫华", "神里", "绫华","神里凌华","凌华", "白鹭公主", "神里大小姐"],
  10000049: ["宵宫", "霄宫", "烟花", "肖宫", "肖工","绷带女孩"],
  10000052: ["雷电将军","雷神","将军","雷军","巴尔","阿影","影","巴尔泽布","煮饭婆","奶香一刀","无想一刀","宅女"],
  10000053: ["早柚", "小狸猫","狸猫","忍者"],
  10000054: ["珊瑚宫心海","心海","军师","珊瑚宫","书记","观赏鱼","水母","鱼","美人鱼"],
  10000056: ["九条裟罗", "九条", "九条沙罗", "裟罗", "沙罗"],
  10000062: ["埃洛伊"],
  10000050: ["托马", "家政官", "太郎丸", "地头蛇","男仆","拖马"],
  10000055: ["五郎","柴犬","土狗"],
  10000057: ["荒泷一斗","荒龙一斗", "一斗", "一抖","荒泷","1斗","牛牛","斗子哥","牛子哥","牛子","孩子王","斗虫"],
  10000058: ["八重神子","八重","神子","狐狸","想得美哦","巫女","屑狐狸","骚狐狸"],
  10000063: ["申鹤", "神鹤","小姨","小姨子","审鹤"],
  10000064: ["云堇","云瑾","云先生","云锦","神女劈观"],

  //卫星角色
  10000000: [],
};

//wife
let wifeData = [
  //成女
  [10000003,10000006,10000007,10000014,10000021,10000023,10000024,10000027,10000031,10000034,10000037,10000041,10000042,10000043,10000044,10000045,10000046,10000048,10000051,10000002,10000049,10000052,10000054,10000056,10000058,10000062,10000063,10000064],
  //成男
  [10000005,10000015,10000016,10000020,10000022,10000025,10000026,10000030,10000032,10000033,10000036,10000038,10000047,10000050,10000055,10000057],
  //萝莉
  [10000029,10000035,10000039,10000053],
  //正太
  [],
]
//五星
let roleId5 = [10000003,10000005,10000007,10000016,10000022,10000026,10000029,10000030,10000033,10000035,10000037,10000038,10000041,10000042,10000046,10000047,10000051,10000002,10000049,10000052,10000054,10000062,10000057];
//四星
let roleId4 = [10000006,10000014,10000015,10000020,10000021,10000023,10000024,10000025,10000027,10000031,10000032,10000034,10000036,10000039,10000043,10000044,10000045,10000048,10000053,10000056,10000050,10000055];

//武器 角色名称缩写，避免过长
let abbr = {
  '达达利亚':'公子',
  '神里绫华':'神里',
  '枫原万叶':'万叶',
  '雷电将军':'雷神',
  '珊瑚宫心海':'心海',
  '荒泷一斗':'一斗',
  '八重神子':'神子',
  '九条裟罗':'九条',

  '松籁响起之时':'松籁',
  '无工之剑':'无工',
  '狼的末路':'狼末',
  '苍古自由之誓':'苍古',
  '雾切之回光':'雾切',
  '终末嗟叹之诗':'终末',
  '阿莫斯之弓':'阿莫斯',
  '冬极白星':'冬极',
  '飞雷之弦振':'飞雷',
  '护摩之杖':'护摩',
  '薙草之稻光':'薙草',
  '赤角石溃杵':'赤角',
  '嘟嘟可故事集':'嘟嘟可',
  '讨龙英杰谭':'讨龙',
  '「渔获」':'渔获',
  '天目影打刀':'天目刀',
  '雪葬的星银':'雪葬星银',
  '辰砂之纺锤':'辰砂纺锤',
  '万国诸海图谱':'万国图谱',
  '神乐之真意':'神乐',

  '角斗士的终幕礼':'角斗士',
  '流浪大地的乐团':'流浪乐团',
  '华馆梦醒形骸记':'华馆梦醒',
  '平息鸣雷的尊者':'平雷尊者',
  '炽烈的炎之魔女':'炽烈魔女',
  '渡过烈火的贤人':'渡火贤人',
  '冰风迷途的勇士':'冰风勇士',
}

let abbr2 = {
  '魈':'夜叉',
  '琴':'团长',
  '不灭月华':'月华',
}

//活动武器
let actWeapon = ["腐殖之剑","风花之颂","嘟嘟可故事集","「渔获」","辰砂之纺锤"];

export { roleId , wifeData , abbr , abbr2 , roleId5 , roleId4 , actWeapon };
