import {
  getPointsOnLine,
  mapapi_getWellIDNearLine,
  fetchMatrixData,
  getNearIndexList
} from "../API/mapAPI";
import {
  getSize,
  getWellMatchPath,
  api_getTracePath
} from "../API/wellMatchAPI";
import * as d3 from "d3";
import {
  wellMaxDepth,
  wellMinDepth,
  depthList
} from "../reducer/globalVarReducer";
import Uncertainty from "../API/uncertainty";
const paddingRatio = 0.1;

export function getTwoWellUc(well1: any, well2: any, allWells: any) {
  const idStore = [well1.id, well2.id];
  const xyStore: any = [[well1.x, well1.y], [well2.x, well2.y]];
  const coupleWell = idStore;
  const pointsOnLine = getPointsOnLine(xyStore);
  //const wellIDNearLine = getWellIDNearLine(pointsOnLine);
  const [wellIDNearLine, wellIDNearLineIndex] = mapapi_getWellIDNearLine(
    pointsOnLine,
    allWells,
    coupleWell
  );
  return fetchMatrixData(pointsOnLine).then(matrixData => {
    const [width, height] = getSize(matrixData);
    const scale = d3
      .scaleLinear()
      .domain([wellMinDepth, wellMaxDepth])
      .range([height * paddingRatio, height * (1 - paddingRatio)]);
    return getWellMatchPath(
      wellIDNearLine,
      paddingRatio,
      width,
      matrixData,
      wellIDNearLineIndex,
      scale
    ).then(curvePaths => {
      curvePaths;
      const { vertex, allTracks, paths } = api_getTracePath(
        width,
        matrixData,
        scale,
        paddingRatio,
        depthList
      );
      const uc = new Uncertainty();
      const ucList = uc.cal(vertex, curvePaths).ucList;
      const ucSum = uc.getUcSum(ucList);
      const id1 = coupleWell[0];
      const id2 = coupleWell[1];
      const coupleWellUc = {
        id1,
        id2,
        value: ucSum
      };

      return coupleWellUc;
    });
  });
}

export function storeUcData(allWells: any) {
  getNearIndexList(allWells).then(nearIndexList => {
    for (let i = 0; i < nearIndexList.length; i++) {
      setTimeout(() => {
        let index1 = nearIndexList[i][0];
        let index2 = nearIndexList[i][1];
        getTwoWellUc(allWells[index1], allWells[index2], allWells).then(
          coupleWellUc => {
            fetch(`http://localhost:5000/storeUcSum/`, {
              body: JSON.stringify(coupleWellUc),
              credentials: "same-origin",
              headers: {
                "content-type": "application/json"
              },
              method: "POST",
              mode: "cors"
            });
          }
        );
      }, 500 * i);
    }
  });
}

export function getHeatData(allWells: any) {
  const heatData: [number, number, number][] = [];
  const idCoorsMap = new Map();
  allWells.map((e: any) => {
    idCoorsMap.set(e.id, e.latlng);
  });
  return d3.json("./data/ucSum.json").then((data: any) => {
    for (let e of data) {
      const [lat, lng]: [number, number] = idCoorsMap.get(e.id);
      const heatPoint = [lat, lng, e.value];
      heatData.push(heatPoint as any);
    }
    return heatData;
  });
}
