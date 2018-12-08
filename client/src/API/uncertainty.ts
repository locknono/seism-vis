import {
  VertexType,
  MatchCurvePath,
  AllMatchCurve,
  AllVertices
} from "../ts/Type";

export function extractMatchVertex(curvePaths: AllMatchCurve): AllVertices {
  const matchVertex: AllVertices = [];
  curvePaths.map(e => {
    matchVertex.push([
      e[0],
      e[e.length - 2],
      e[Math.floor(e.length / 2) - 1],
      e[Math.floor(e.length / 2)]
    ]);
  });
  return matchVertex;
}
export default class Uncertainty {
  constructor() {}

  cal(
    trackVertex: AllVertices,
    curvePaths: AllMatchCurve,
    width: number,
    paddingRatio: number,
    height: number
  ) {
    const matchVertex = extractMatchVertex(curvePaths);
    const trackDepthList = getTrackDepthList(trackVertex);
    let ucList: number[] = [];
    const leftMaps = [];
    const rightMaps = [];
    for (let i = 0; i < matchVertex.length; i++) {
      const curMatch = matchVertex[i];
      leftMaps.push(getMatchVertexPosition(curMatch, trackVertex, 0, 1));
      rightMaps.push(getMatchVertexPosition(curMatch, trackVertex, 2, 3));
    }

    for (let i = 0; i < leftMaps.length; i++) {
      const leftMap = leftMaps[i];
      const rightMap = rightMaps[i];
      let curMatchUC = 0;
      convertMapValueFromDepthToPortion(leftMap);
      convertMapValueFromDepthToPortion(rightMap);
      const allKey = findAllKey(leftMap, rightMap);
      console.log("leftMap: ", leftMap);
      console.log("rightMap: ", rightMap);
      for (let key of allKey) {
        let leftValue = leftMap.get(key);
        let rightValue = rightMap.get(key);
        if (leftValue && rightValue) {
          curMatchUC += Math.abs(leftValue - rightValue);
        } else if (leftValue && !rightValue) {
          curMatchUC += leftValue;
        } else if (rightValue && !leftValue) {
          curMatchUC += rightValue;
        }
      }
      ucList.push(curMatchUC);
    }
    console.log("ucList: ", ucList);

    return {
      path: this.getUcPath(matchVertex, ucList, width, paddingRatio, height),
      ucList
    };
  }

  getUcPath(
    matchVertex: [number, number][][],
    ucList: number[],
    width: number,
    paddingRatio: number,
    height: number
  ) {
    const pad = width / 20;
    const xStart = matchVertex[0][0][0];
    const xEnd = matchVertex[0][2][0];

    const pathRightStartX = xEnd + pad;
    const padLeftStartX = xStart - pad;

    const rightPath = this.getOneSideUcPath(
      matchVertex,
      ucList,
      pathRightStartX,
      height,
      paddingRatio,
      false
    );
    const leftPath = this.getOneSideUcPath(
      matchVertex,
      ucList,
      padLeftStartX,
      height,
      paddingRatio,
      true
    );
    return [leftPath, rightPath];
  }

  getUcSum(ucList: number[]) {
    const reducer = (accumulator: number, currentValue: number) =>
      accumulator + currentValue;
    return ucList.reduce(reducer);
  }

  getOneSideUcPath(
    matchVertex: any,
    ucList: any,
    startX: number,
    height: number,
    paddingRatio: number,
    left: boolean
  ) {
    const ucPath = [];
    for (let i = 0; i < matchVertex.length; i++) {
      const value = ucList[i];
      const track = matchVertex[i];
      if (left === false) {
        const topPoint = [startX, track[2][1]];
        const midPoint = [startX + value * 9, (track[2][1] + track[3][1]) / 2];
        const bottomPoint = [startX, track[3][1]];
        const path = [topPoint, midPoint, bottomPoint];
        ucPath.push(path);
      } else {
        const topPoint = [startX, track[0][1]];
        const midPoint = [startX - value * 9, (track[0][1] + track[1][1]) / 2];
        const bottomPoint = [startX, track[1][1]];
        const path = [topPoint, midPoint, bottomPoint];
        ucPath.push(path);
      }
    }

    ucPath.sort((a: any, b: any) => {
      return a[0][1] - b[0][1];
    });
    const drawPath = [[startX, height * 0.05]];
    for (let i = 0; i < ucPath.length; i++) {
      drawPath.push(ucPath[i][0]);
      drawPath.push(ucPath[i][1]);
      drawPath.push(ucPath[i][2]);
    }
    drawPath.push([startX, height * (1 - 0.05)]);
    return drawPath;
  }

  autoAjustMatchCurve() {}
}

export function getMatchVertexPosition(
  matchVertex: VertexType,
  trackVertex: AllVertices,
  t1: number,
  t2: number
) {
  let startIndex = 0;
  let endIndex = 0;
  let startDepth = 0;
  let endDepth = 0;
  for (let j = 0; j < trackVertex.length; j++) {
    if (
      matchVertex[t1][1] > trackVertex[j][t1][1] &&
      matchVertex[t1][1] < trackVertex[j][t2][1]
    ) {
      startIndex = j;
      startDepth = trackVertex[j][t2][1] - matchVertex[t1][1];
    }
    if (
      matchVertex[t2][1] > trackVertex[j][t1][1] &&
      matchVertex[t2][1] < trackVertex[j][t2][1]
    ) {
      endIndex = j;
      endDepth = matchVertex[t2][1] - trackVertex[j][t1][1];
    }
    if (startIndex === 0 || endIndex === 0) {
      if (
        matchVertex[t1][1] > trackVertex[j][t2][1] &&
        matchVertex[t1][1] < trackVertex[j + 1][t1][1]
      ) {
        startIndex = j;
        endIndex = j;
        startDepth = matchVertex[t1][1] - trackVertex[j][t2][1];
        endDepth = matchVertex[t1][1] - trackVertex[j][t2][1];
      }
    }
  }
  const map: Map<number, number> = new Map();
  if (endIndex === startIndex + 1) {
    map.set(startIndex, startDepth);
    map.set(endIndex, endDepth);
  } else {
    map.set(startIndex, startDepth);
    for (let s = startIndex + 1; s <= endIndex - 1 - 1; s++) {
      map.set(s, trackVertex[s][t2][1] - trackVertex[s][t1][1]);
    }
    map.set(endIndex, endDepth);
  }
  return map;
}

export function getTrackDepthList(trackVertex: AllVertices) {
  const depthList = trackVertex.map(e => {
    return [e[1][1] - e[0][1], e[2][1] - e[1][1]];
  });
  return depthList as [number, number][];
}

export function convertMapValueFromDepthToPortion(map: Map<number, number>) {
  let valueSum = 0;
  for (let [key, value] of map) {
    valueSum += value;
  }
  for (let [key, value] of map) {
    map.set(key, value / valueSum);
  }
}

export function AddLayerKeyWithValueZero(
  map: Map<number, number>,
  trackCount: number
) {
  for (let i = 0; i < trackCount; i++) {
    if (!map.get(i)) {
      map.set(i, 0);
    }
  }
}

export function findAllKey(m1: Map<number, number>, m2: Map<number, number>) {
  const set = new Set();
  for (let [k, v] of m1) {
    set.add(k);
  }
  for (let [k, v] of m2) {
    set.add(k);
  }
  return Array.from(set);
}
