import {
  getPointsOnLine,
  mapapi_getWellIDNearLine,
  fetchMatrixData
} from "../API/mapAPI";
import { getSize } from "../API/wellMatchAPI";

const paddingRatio = 0.1;

function getTwoWellUc(well1: any, well2: any, allWells: any) {
  const idStore = [well1.id, well2.id];
  const xyStore: any = [[well1.x, well1.y], [well2.x, well2.y]];
  const coupleWell = idStore;
  const pointsOnLine = getPointsOnLine(xyStore);
  //const wellIDNearLine = getWellIDNearLine(pointsOnLine);
  const [wellIDNearLine, wellIDNearLineIndexOnLine] = mapapi_getWellIDNearLine(
    pointsOnLine,
    allWells,
    coupleWell
  );
  fetchMatrixData(pointsOnLine).then(matrixData => {
    console.log("matrixData: ", matrixData);
    const [width, height] = getSize(matrixData);
  });
  console.log("wellIDNearLineIndexOnLine: ", wellIDNearLineIndexOnLine);
  console.log("wellIDNearLine: ", wellIDNearLine);
}
