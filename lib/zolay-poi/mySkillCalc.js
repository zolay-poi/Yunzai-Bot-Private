import { segment } from "oicq";
import * as appSkill from "../app/skillcalculate.js";

export const rule = {
  skillCalculateHelp: {
    reg: appSkill.rule.skillcalculateHelp.reg,
    priority: appSkill.rule.skillcalculateHelp.priority - 1,
    describe: "",
  },
  skillCalculate: {
    reg: appSkill.rule.skillcalculate.reg,
    priority: appSkill.rule.skillcalculate.priority - 1,
    describe: "",
  },
  mySkillCalculate: {
    reg: "^#*(.*)(养成|计算|素材|材料)([0-9]|,|，| )*$",
    priority: appSkill.rule.skillcalculate.priority - 2,
    describe: "",
  },
};

// noinspection JSUnusedGlobalSymbols
export function skillCalculateHelp(e) {
  return appSkill.skillcalculateHelp(e);
}

// noinspection JSUnusedGlobalSymbols
export function skillCalculate(e) {
  return mySkillCalculate(e);
}

export function mySkillCalculate(e) {
  let player = ["风主", "岩主", "雷主"];
  let avatarName = e.msg.replace(/#|＃|养成|计算|素材|材料|[0-9]|,|，| /g, "").trim();
  if (player.includes(avatarName)) {
    let url = roleImgMap.get(avatarName);
    if (url) {
      e.reply([segment.image(url)]);
      return true;
    }
    return;
  }
  // noinspection JSUnresolvedFunction
  let roleId = YunzaiApps.mysInfo.roleIdToName(avatarName);
  if (!roleId) {
    return;
  }
  roleId = Number.parseInt(roleId);
  if ([10000005, 10000007, 20000000].includes(roleId)) {
    e.reply("请选择#风主养成、#岩主养成、#雷主养成");
    return true;
  }
  let url = roleImgMap.get(roleId);
  if (url) {
    e.reply([segment.image(url)]);
    return true;
  }
}

let roleImgMap = new Map();
roleImgMap.set("风主", "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/003c51f5e713cbd6ae382f2f91f82872_3987597282844601835.jpg");
roleImgMap.set("岩主", "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/e1c2869bca5cce65208336c5d0d624ba_2446934220565193898.jpg");
roleImgMap.set("雷主", "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/662dd7b24f5420b345e22c6173aec58c_4969760491407790547.jpg");

// 神里绫华
roleImgMap.set(10000002, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/51334733f640cfba7303f473a23734a4_1646988703032416261.jpg");
// 琴
roleImgMap.set(10000003, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/d1c11f9de84dabe9d7407e699df4a4c3_5627471314571236154.jpg");
// 丽莎
roleImgMap.set(10000006, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/02c892bde24811a1cca88ea5c7b4cd66_6680709228015290086.jpg");
// 芭芭拉
roleImgMap.set(10000014, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/b493ad24f975fd6ff96aef0d30375797_4008979584430902113.jpg");
// 凯亚
roleImgMap.set(10000015, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/cf3685c4de7a1b2480122ae65e3194b2_4447660630630445681.jpg");
// 迪卢克
roleImgMap.set(10000016, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/d7afc2c49063c367d82f4332f7f01680_3557992198603163174.jpg");
// 雷泽
roleImgMap.set(10000020, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/59b241715cc3dcc61d19c6913d93f231_8133694391638747681.jpg");
// 安柏
roleImgMap.set(10000021, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/76a6118679d7aa978f18d5b87096fd85_683601674271383453.jpg");
// 温迪
roleImgMap.set(10000022, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/cd53659ef538d2870f6cb91a5faea7b1_8019697982654647165.jpg");
// 香菱
roleImgMap.set(10000023, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/0448f0eb1f527dbe152cafff69efaa51_7449442115521976807.jpg");
// 北斗
roleImgMap.set(10000024, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/f5967166455eeaa2d1ef2cd5f7f4e5ff_7271509229454633038.jpg");
// 行秋
roleImgMap.set(10000025, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/2540e8d97c69b74506f34e8295f1ddd0_1379589481651759591.jpg");
// 魈
roleImgMap.set(10000026, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/63ec2498757f5fb6d7fc73429dbfd59f_6807444749028906698.jpg");
// 凝光
roleImgMap.set(10000027, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/d913af2bfd79977b4cdb1d863211810a_3460343523640111084.jpg");
// 可莉
roleImgMap.set(10000029, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/426abbe48f88638275e23f956e248aca_5897295813270901057.jpg");
// 钟离
roleImgMap.set(10000030, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/a52a386fdb49c9710b351550914197d3_6856878913605983505.jpg");
// 菲谢尔
roleImgMap.set(10000031, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/549c0e5f13606ae3155c2254f19ebfd9_1695873038660846010.jpg");
// 班尼特
roleImgMap.set(10000032, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/977437d585705eba4bde498389a4b5c9_5107060987674014478.jpg");
// 达达利亚
roleImgMap.set(10000033, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/83b0bcd984cc0a1df6e8102133164469_1352923822593385693.jpg");
// 诺艾尔
roleImgMap.set(10000034, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/395b596d9a8c079f561d2cfbf2f00696_3858948644469655725.jpg");
// 七七
roleImgMap.set(10000035, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/021af88ee86f179bbecbe3ce5b862f1c_8792007220541546707.jpg");
// 重云
roleImgMap.set(10000036, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/01698c613b6d1d7b5955d25491b795d9_4016915104541306707.jpg");
// 甘雨
roleImgMap.set(10000037, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/a03427dcb53b91d533c60187446b0d59_3623108767593755572.jpg");
// 阿贝多
roleImgMap.set(10000038, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/723e95e337115682e37979a3be5fc8b7_1607413838100259924.jpg");
// 迪奥娜
roleImgMap.set(10000039, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/ea7f2fbc80ff3eb675afcb89e8e79fa0_6817510139763940492.jpg");
// 莫娜
roleImgMap.set(10000041, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/f23c9bf596c556c64e7a60ae73f3dc3e_5271808320030195927.jpg");
// 刻晴
roleImgMap.set(10000042, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/f7345c86f9abc04ab69357cc6e10bc36_7837306922883673888.jpg");
// 砂糖
roleImgMap.set(10000043, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/54009f57d2a0a03a520b22f4938ba9d4_7109570843375513023.jpg");
// 辛焱
roleImgMap.set(10000044, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/7e4c561626348a707204af74c4402a8e_8074720323759128907.jpg");
// 罗莎莉亚
roleImgMap.set(10000045, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/98dcc53ddbca0de6741fa9bddca3b643_6513591517308826875.jpg");
// 胡桃
roleImgMap.set(10000046, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/be407b3af728f4bd9f355a08689ffec9_7279671772956871186.jpg");
// 枫原万叶
roleImgMap.set(10000047, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/438f029fbcabc6864458b680a831f742_1650518671428231103.jpg");
// 烟绯
roleImgMap.set(10000048, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/8257cd43f4b2eb4dc792607f97d09b9a_8215715757022911115.jpg");
// 宵宫
roleImgMap.set(10000049, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/4a4770f6ea1a49fec578b272b3998f74_1691049216482795613.jpg");
// 托马
roleImgMap.set(10000050, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/c5053fecd0074738fa73a297123cd508_5328404822165100557.jpg");
// 优菈
roleImgMap.set(10000051, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/aac280eea5d058ceb069c03875c3dc33_5837601168093625952.jpg");
// 雷电将军
roleImgMap.set(10000052, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/da1ffe5a5b2f9618995f19378374e4e9_4697242200923977838.jpg");
// 早柚
roleImgMap.set(10000053, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/9f19018cfd909545e29ec8946fe825ea_8153527482561871443.jpg");
// 珊瑚宫心海
roleImgMap.set(10000054, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/deee14e119a69f07bc9f8db0ba8880c0_5562592793064847211.jpg");
// 五郎
roleImgMap.set(10000055, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/00936937e3245c724b6151414fa7f23e_5655506146538004398.jpg");
// 九条裟罗
roleImgMap.set(10000056, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/b235640298e097ebe3ecbef4d9737faa_1131379232227554719.jpg");
// 荒泷一斗
roleImgMap.set(10000057, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/4bd03b76985a2d7aa514c4feda6fef81_622170760345474796.jpg");
// 八重神子
roleImgMap.set(10000058, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/abaf762672b5848c9a4bb93c203a02e5_7844425448427843967.jpg");
// 夜兰
roleImgMap.set(10000060, "https://upload-bbs.mihoyo.com/upload/2022/05/31/283486734/ccfeb5a098a6cf4814c19b49f8e360bd_9000983367740534972.jpg");
// 埃洛伊
roleImgMap.set(10000062, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/06375e61441d3dc964712ba4311c65b8_3639266542552862414.jpg");
// 申鹤
roleImgMap.set(10000063, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/0586eebc60fc70a6960c976fc937887c_5326329142546206458.jpg");
// 云堇
roleImgMap.set(10000064, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/5f23d8a1fa000d7de1e6c72eb07bc52a_4726113961810703060.jpg");
// 久岐忍
roleImgMap.set(10000065, "");
// 神里绫人
roleImgMap.set(10000066, "https://upload-bbs.mihoyo.com/upload/2022/05/23/283486734/692bb13e0d73c5c32c316c3448388d59_8965050928982492881.jpg");
