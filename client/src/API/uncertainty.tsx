export default class Uncertainty {
  constructor() {}

  extractMatchVertex(curvePaths: any): any {
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

  comparePosition(vertex1: [number, number][], vertex2: [number, number][]) {}
  cal(vertex: any, curvePaths: any) {
    const matchVertex = this.extractMatchVertex(curvePaths);
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
    console.log("trackVertex: ", trackVertex);
    console.log("matchVertex: ", matchVertex);
    let ucList: number[] = [];
    for (let i = 0; i < matchVertex.length; i++) {
      let curTrackUc: number = 0;
      for (let j = 0; j < trackVertex.length; j++) {
        if (
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
    return this.getUcPath(matchVertex, ucList);
  }

  getUcPath(matchVertex: [number, number][][], ucList: number[]) {
    console.log("ucList: ", ucList);
    console.log("matchVertex: ", matchVertex);
    //TODO:Change pad to padding-ratio raleted value
    const pad = 30;
    const xStart = matchVertex[0][0][0];
    const xEnd = matchVertex[0][2][0];
    const ucPath = [];
    for (let i = 0; i < matchVertex.length; i++) {
      const value = ucList[i];
      const track = matchVertex[i];
      const topPoint = [xEnd + pad, track[2][1]];
      const midPoint = [
        xEnd + pad + value * 2,
        (track[2][1] + track[3][1]) / 2
      ];
      const bottomPoint = [xEnd + pad, track[3][1]];
      const path = [topPoint, midPoint, bottomPoint];
      ucPath.push(path);
    }

    return ucPath;
  }
}
