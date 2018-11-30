const xStart = 20652500;
const yStart = 4190300.16;
const xySection = 25;
export function idIndexMap(allWells: any) {
  const map = new Map();
  allWells.map((e: any, i: number) => {
    map.set(e.id, i);
  });
  return map;
}

export function getNearIndexList(allWells: any) {
  const map = idIndexMap(allWells);
  return fetch("./data/nearList.json")
    .then(r => r.json())
    .then((data: any) => {
      const indexList: any[] = [];
      for (const w of data) {
        const index1 = map.get(w.id);
        for (const nearWellID of w.nearList) {
          const index2 = map.get(nearWellID);
          indexList.push([index1, index2]);
        }
      }
      return indexList;
    });
}

export function getPointsOnLine(line: [number, number][]): [number, number][] {
  const x1 = (line[0][0] - xStart) / xySection;
  const y1 = (line[0][1] - yStart) / xySection;
  const x2 = (line[1][0] - xStart) / xySection;
  const y2 = (line[1][1] - yStart) / xySection;
  const matrixCoors = [[x1, y1], [x2, y2]].map(e => e.map(Math.floor));
  const k =
    (matrixCoors[0][1] - matrixCoors[1][1]) /
    (matrixCoors[0][0] - matrixCoors[1][0]);
  const b = matrixCoors[0][1] - matrixCoors[0][0] * k;
  const smallerX = matrixCoors[0][0] < matrixCoors[1][0] ? 0 : 1;
  const biggerX = matrixCoors[0][0] < matrixCoors[1][0] ? 1 : 0;
  const pointsOnLine: [number, number][] = [];
  for (
    let x = matrixCoors[smallerX][0];
    x <= matrixCoors[biggerX][0];
    x += 0.05
  ) {
    let y = Math.floor(k * x + b);
    let exist = false;
    for (let i = 0; i < pointsOnLine.length; i++) {
      let p = pointsOnLine[i];
      if (equal(p[0], p[1], Math.floor(x), y)) exist = true;
    }
    if (!exist) pointsOnLine.push([Math.floor(x), y]);
  }
  //Ensure the last point is on line
  let lastPoint = pointsOnLine[pointsOnLine.length - 1];
  if (
    lastPoint[0] !== matrixCoors[biggerX][0] ||
    lastPoint[1] !== matrixCoors[biggerX][1]
  ) {
    pointsOnLine.push([matrixCoors[biggerX][0], matrixCoors[biggerX][1]]);
  }
  return pointsOnLine;
  function equal(x1: number, y1: number, x2: number, y2: number): boolean {
    return x1 === x2 && y1 === y2;
  }
}

export function mapapi_getWellIDNearLine(
  pointsOnLine: number[][],
  allWells: any,
  coupleWell: any
): any {
  console.log("coupleWell: ", coupleWell);
  /*this method can speed up by tranform the 
  structure of `allWells` from list to hashmap*/
  const wellIDNearLine = new Set();
  const wellIDNearLineIndexOnLine = [];
  for (let i = 0; i < pointsOnLine.length; i++) {
    for (let j = 0; j < allWells.length; j++) {
      let cellPoint: [number, number] = [
        allWells[j].xOnMatrix,
        allWells[j].yOnMatrix
      ];
      if (ifInCell(cellPoint, pointsOnLine[i])) {
        wellIDNearLine.add(allWells[j].id);
        wellIDNearLineIndexOnLine.push((i + 1) / pointsOnLine.length);
        break;
      }
    }
  }

  let wellIDNearLineList = Array.from(wellIDNearLine);
  //ensure the first well of couple well is gotten
  //in the first cell
  wellIDNearLineList[0] = coupleWell[0];
  wellIDNearLineList[wellIDNearLineList.length - 1] = coupleWell[1];

  wellIDNearLineIndexOnLine[0] = 0;
  wellIDNearLineIndexOnLine[wellIDNearLineIndexOnLine.length - 1] = 1;
  console.log("wellIDNearLineList: ", wellIDNearLineList);
  console.log("wellIDNearLineIndexOnLine: ", wellIDNearLineIndexOnLine);
  return [wellIDNearLineList, wellIDNearLineIndexOnLine];

  function ifInCell(
    cellPoint: [number, number],
    pointOnLine: number[]
  ): boolean {
    return cellPoint[0] === pointOnLine[0] && cellPoint[1] === pointOnLine[1];
  }
}
