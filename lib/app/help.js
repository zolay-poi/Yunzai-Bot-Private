import { currentVersion, changelogs } from "../components/Changelog.js";
import Common from "../components/Common.js";

export const rule = {
  versionInfo: {
    reg: "^#(版本|更新日志)$",
    priority: 500,
    hashMark: true,
    describe: "【#帮助】 版本介绍",
  },
};

export async function versionInfo(e, { render }) {
  return await Common.render("help/version-info", {
    currentVersion,
    changelogs,
    elem: "hydro",
  }, { e, render, scale: 1.2 })
}