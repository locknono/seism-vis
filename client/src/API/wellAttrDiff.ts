import * as d3 from "d3";
import {
  WellAttrData,
  MatchCurvePath,
  AllMatchCurve,
  SingleWellAttrData
} from "../ts/Type";
import { reverseScale } from "../reducer/globalVarReducer";
import { extractMatchVertex } from "./uncertainty";
export function diff(wellAttrData: WellAttrData, matchCurve: AllMatchCurve) {
  const [well1, well2] = wellAttrData;
  const allDepth = getLayerDepth(matchCurve);
  const allDiff = [];
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
) {
  const k = 20;
  const indexList = depthList.map(e => getIndexWithDepth(e));
  const [l1, l2, r1, r2] = indexList;
  const v1 = w1.value;
  const v2 = w2.value;
  const leftIndices = getDivisionIndex(l1, l2, k);
  const rightIndices = getDivisionIndex(r1, r2, k);
  let diffSum = [0, 0, 0, 0, 0];
  //j for attrIndex
  for (let i = 0; i < k; i++) {
    for (let j = 1; j <= 5; j = j + 1) {
      const diff = Math.pow(v1[leftIndices[i]][j] - v2[rightIndices[i]][j], 2);
      diffSum[j - 1] += diff;
    }
  }
  return diffSum.map(e => e / k);
}
