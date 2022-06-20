import { segment } from 'oicq';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

//项目路径
const _path = process.cwd();

let runReg = /^#(run|>)((.|\r|\n)*)/;

export const rule = {
  runCode: {
    reg: '^#(run|>)(.*)',
    priority: 100,
    describe: '运行代码',
  },
};

export async function runCode(e) {
  if (!e.isMaster) {
    return;
  }
  let msg = '';
  for (const item of e.message) {
    if (item.type === 'text') {
      msg += item.text;
    }
  }
  let matches = msg.match(runReg);
  let code = (matches[2] || '').trim();
  if (!code.length) {
    await e.reply(`[error] can't run empty code`);
    return true;
  }
  // await e.reply('<-> running……');
  try {
    const executeCode = `(async () => {"use strict"; ${code}})`;
    console.group('runCode');
    console.log(executeCode);
    console.groupEnd();
    let fn = eval(executeCode)
    let result = await fn();
    if (result) {
      try {
        result = JSON.stringify(result);
      } catch {
      }
    }
    await e.reply([`<- ${result}`]);
  } catch (err) {
    await e.reply(`[error] ${err.message}`);
  } finally {
    // await e.reply('<-> finally');
  }
  return true;
}
