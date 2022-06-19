import fetch from 'node-fetch';


const bangumi = {
  async getFollow() {
    let url = new URL('https://api.bilibili.com/x/space/bangumi/follow/list');
    // 番剧类型
    // 1 = 追番
    // 2 = 追剧
    url.searchParams.set('type', '1');
    // 番剧状态
    // 0 = 全部
    // 1 = 想看
    // 2 = 在看
    // 3 = 看过
    url.searchParams.set('follow_status', '0');
    // PageNum
    url.searchParams.set('pn', '1');
    // PageSize
    url.searchParams.set('ps', '15');
    // 用户ID
    url.searchParams.set('vmid', '13909939');
    // 时间戳
    url.searchParams.set('ts', `${Date.now()}`);

    let response = await fetch(url.toString());
    // response.status === 200
    return (await response.json()).data;
  },
};


export default {
  bangumi,
};
