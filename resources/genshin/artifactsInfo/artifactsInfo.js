const yzHowGet = document.getElementById('yz-how-get');
const tmplArr = document.querySelectorAll('.detail .detail__body .detail__content .obc-tmpl');

for (const tmpl of tmplArr) {
  let item = tmpl.querySelector('.obc-tmpl__part > h2');
  // 删除“切换”按钮
  tmpl.querySelectorAll('.obc-tmpl__switch-btn-list').forEach(e => e.remove());
  // 删除“折叠”按钮
  tmpl.querySelectorAll('.obc-tmpl__fold-tag').forEach(e => e.remove());
  // 获取标题
  if (!item) item = tmpl.querySelector('.obc-tmpl__part > .h2');
  if (!item) continue;
  let el, innerText = item.innerText.trim();
  // 删除“其他”页签
  if (innerText === '其他' || innerText === '套装属性') {
    el = tmpl.querySelector('.obc-tmpl__part');
    el && el.remove();
  }
  // 调整“装备描述”
  else if (innerText === '装备描述') {
    el = tmpl.querySelector('.obc-tmpl__part[data-part=main]');
    el && (el.style.borderRadius = '0.05rem 0.05rem 0 0');
    el = tmpl.querySelector('.obc-tmpl__part[data-part=description]');
    if (el) {
      el.style.top = '-10px';
      el.borderRadius = '0 0 0.05rem 0.05rem';
    }
    item.remove();
  }
  // 部分页面的“获取途径”是单独的一个板块
  else if (innerText === '获取途径') {
    yzHowGet.innerText = item.nextElementSibling.innerText.replace(/\n{2,}/g, '\n');
    tmpl.remove();
  }
  // 调整搭配推荐样式，添加class
  else if (innerText === '搭配推荐') {
    tmpl.classList.add('yz-dptj');
  }
}

// 获取“获取途径”
const obcTmplFl = document.querySelectorAll('.obc-tmpl__f-l');
for (const item of obcTmplFl) {
  if (item.innerText.trim().includes('获取途径：')) {
    if (!yzHowGet.innerText && item.nextElementSibling && item.nextElementSibling.className === 'obc-tmpl__rich-text') {
      yzHowGet.innerText = item.nextElementSibling.innerText;
    }
    item.parentElement.outerHTML = '';
  }
}

