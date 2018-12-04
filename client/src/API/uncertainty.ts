import {
  Vertices,
  MatchCurvePath,
  AllMatchCurve,
  AllVertices
} from "../ts/Type";

export function extractMatchVertex(curvePaths: AllMatchCurve): AllVertices {
  const matchVertex: any = [];
  curvePaths.map((e: any) => {
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
    vertex: any,
    curvePaths: any,
    width: number,
    paddingRatio: number,
    height: number
  ) {
    const matchVertex = extractMatchVertex(curvePaths);

    const [xStart, xEnd] = [matchVertex[0][0][0], matchVertex[0][2][0]];
    //Change the initial trackVertex structure
    const trackVertex: [number, number][][] = [];

    vertex.map((fourVertex: any, i: number) => {
      let vertex2: [number, number][] = [];
      fourVertex.map((e: any, index: number) => {
        if (index <= 1) {
          vertex2.push([xStart, e]);
        } else {
          vertex2.push([xEnd, e]);
        }
      });
      trackVertex.push(vertex2);
    });

    let ucList: number[] = [];
    for (let i = 0; i < matchVertex.length; i++) {
      let curTrackUc: number = 0;
      for (let j = 0; j < trackVertex.length; j++) {
        if (
          //match is totally inside the track
          matchVertex[i][0][1] >= trackVertex[j][0][1] &&
          matchVertex[i][1][1] <= trackVertex[j][1][1] &&
          matchVertex[i][2][1] >= trackVertex[j][2][1] &&
          matchVertex[i][3][1] <= trackVertex[j][3][1]
        ) {
          curTrackUc = 0;
          break;
        }
        if (
          //cross
          (matchVertex[i][1][1] > trackVertex[j][0][1] &&
            matchVertex[i][2][1] < trackVertex[j][3][1]) ||
          (matchVertex[i][0][1] < trackVertex[j][1][1] &&
            matchVertex[i][3][1] > trackVertex[j][2][1])
        ) {
          curTrackUc += 1;
        }
      }
      ucList.push(curTrackUc);
    }
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
        const midPoint = [startX + value * 3, (track[2][1] + track[3][1]) / 2];
        const bottomPoint = [startX, track[3][1]];
        const path = [topPoint, midPoint, bottomPoint];
        ucPath.push(path);
      } else {
        const topPoint = [startX, track[0][1]];
        const midPoint = [startX - value * 3, (track[0][1] + track[1][1]) / 2];
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
