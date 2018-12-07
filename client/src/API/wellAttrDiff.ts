import {
  WellAttrData,
  MatchCurvePath,
  AllMatchCurve,
  SingleWellAttrData,
  AllDiff,
  OneLayerDiff
} from "../ts/Type";
import { reverseScale } from "../reducer/globalVarReducer";
import { extractMatchVertex } from "./uncertainty";
export function diff(
  wellAttrData: WellAttrData,
  matchCurve: AllMatchCurve
): AllDiff {
  const [well1, well2] = wellAttrData;
  const allDepth = getLayerDepth(matchCurve);
  const allDiff: AllDiff = [];
  for (let oneLayerDepthList of allDepth) {
    const diff = compareInOneLayer(oneLayerDepthList, well1, well2);
    allDiff.push(diff);
  }
  return allDiff;
}

function getLayerDepth(matchCurve: AllMatchCurve) {
  const allPathVertex = extractMatchVertex(matchCurve);
  const allDepth = [];
  for (let pathVertex of allPathVertex) {
    const depthList = [];
    for (let point of pathVertex) {
      const depth = reverseScale(point[1]);
      depthList.push(depth);
    }
    allDepth.push(depthList as [number, number, number, number]);
  }
  return allDepth;
}

function getIndexWithDepth(depth: number) {
  const initDepth = 1000,
    pad = 0.125;
  return Math.floor((depth - initDepth) / pad);
}

function getDivisionIndex(start: number, end: number, k: number) {
  const indices: number[] = [];
  for (let i = 1; i <= k; i++) {
    indices.push(Math.floor(((end - start) / k) * i));
  }
  return indices;
}

function compareInOneLayer(
  depthList: [number, number, number, number],
  w1: SingleWellAttrData,
  w2: SingleWellAttrData
): OneLayerDiff {
  const k = 100;
  let realK = 100;
  const indexList = depthList.map(e => getIndexWithDepth(e));
  const [l1, l2, r1, r2] = indexList;
  const v1 = w1.value;
  const v2 = w2.value;
  const leftIndices = getDivisionIndex(l1, l2, k);
  const rightIndices = getDivisionIndex(r1, r2, k);
  const diffSum: OneLayerDiff = [0, 0, 0, 0, 0];
  //j for attrIndex
  for (let i = 0; i < k; i++) {
    for (let j = 1; j <= 5; j = j + 1) {
      //TODO:should not just `break` if some data's missing
      if (!v1[leftIndices[i]] || !v2[rightIndices[i]]) break;
      const value1 = v1[leftIndices[i]][j];
      const value2 = v2[rightIndices[i]][j];
      if (shouldFilterDirtyData(value1, value2)) {
        realK = realK - 1;
        break;
      }
      const diff = Math.pow(value1 - value2, 2);
      diffSum[j - 1] += diff;
    }
  }

  return diffSum.map(e => e / realK) as OneLayerDiff;
}

function shouldFilterDirtyData(v1: number, v2: number): boolean {
  if (Number.isNaN(v1) || Number.isNaN(v2)) return true;
  if (v1 <= -9999 || v2 <= -9999) return true;
  return false;
}
