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
import * as d3 from "d3";
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

function getIndexWithMeterDepth(depth: number) {
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

export function compareInOneLayer(
  depthList: [number, number, number, number],
  w1: SingleWellAttrData,
  w2: SingleWellAttrData
): OneLayerDiff {
  const [normalizedV1, normalizedV2] = normalize(w1, w2);
  const k = 20;
  let realK = 20;
  const indexList = depthList.map(e => getIndexWithMeterDepth(e));
  const [l1, l2, r1, r2] = indexList;
  const v1 = normalizedV1;
  const v2 = normalizedV2;
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
      if (shouldFilterDirtyData(value1) || shouldFilterDirtyData(value2)) {
        realK = realK - 1;
        break;
      }
      const diff = Math.pow(value1 - value2, 2);
      diffSum[j - 1] += diff;
    }
  }

  return diffSum.map(e => e / realK) as OneLayerDiff;
}

function shouldFilterDirtyData(v: number): boolean {
  if (Number.isNaN(v)) return true;
  if (v <= -9999) return true;
  return false;
}

function normalize(w1: SingleWellAttrData, w2: SingleWellAttrData) {
  const v1 = w1.value;
  const v2 = w2.value;
  const [minList, maxList] = getMinMaxList(v1, v2);

  const scales = minList.map((e, i: number) => {
    return d3
      .scaleLinear()
      .domain([minList[i], maxList[i]])
      .range([0, 1]);
  });
  const normalizedV1 = v1.map((e, i) => {
    return e.map((v, j) => {
      if (j === 0) return v;
      else {
        return scales[j - 1](v);
      }
    });
  });
  const normalizedV2 = v2.map((e, i) => {
    return e.map((v, j) => {
      if (j === 0) return v;
      else {
        return scales[j - 1](v);
      }
    });
  });
  return [
    normalizedV1 as [number, number, number, number, number, number][],
    normalizedV2 as [number, number, number, number, number, number][]
  ];
}

function getMinMaxList(
  v1: [number, number, number, number, number, number][],
  v2: [number, number, number, number, number, number][]
) {
  const minList = Array(5).fill(Number.MAX_SAFE_INTEGER);
  const maxList = Array(5).fill(Number.MIN_SAFE_INTEGER);

  for (let i = 0; i < v1.length; i++) {
    for (let j = 1; j < v1[i].length; j++) {
      if (shouldFilterDirtyData(v1[i][j])) continue;
      if (v1[i][j] > maxList[j - 1]) {
        maxList[j - 1] = v1[i][j];
      }
      if (v1[i][j] < minList[j - 1]) {
        minList[j - 1] = v1[i][j];
      }
    }
  }

  for (let i = 0; i < v2.length; i++) {
    for (let j = 1; j < v2[i].length; j++) {
      if (shouldFilterDirtyData(v2[i][j])) continue;
      if (v2[i][j] > maxList[j - 1]) {
        maxList[j - 1] = v2[i][j];
      }
      if (v2[i][j] < minList[j - 1]) {
        minList[j - 1] = v2[i][j];
      }
    }
  }

  return [minList, maxList];
}
