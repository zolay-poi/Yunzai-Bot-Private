import lodash from "lodash";
import { segment } from "oicq";

const _path = process.cwd();

export const rule = {
  randomRps: {
    reg: "",
    priority: 19998,
    describe: "和派蒙一起猜拳吧",
  },
};

export async function randomRps(e) {
  let rpsId, diceId;
  for (const msg of e.message) {
    if (msg.type === "rps") {
      rpsId = msg.id;
      break;
    }
    if (msg.type === "dice") {
      diceId = msg.id;
      break;
    }
  }
  if (rpsId) {
    e.reply(segment.rps(lodash.random(1, 3)));
    return true;
  }
  if (diceId) {
    e.reply(segment.dice(lodash.random(1, 6)));
    return true;
  }
}
