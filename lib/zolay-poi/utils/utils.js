import lodash from "lodash";
import { segment } from "oicq";
import { faceIds } from "./constant.js";

/**
 * 获取随机表情
 * @param size 获取几个
 */
export function getRandomFace(size = 1) {
  let face = lodash.sampleSize(faceIds, size).map(f => segment.face(f.id));
  if (size === 1) {
    return face[0];
  }
  return face;
}
