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

  comparePosition(vertex1: [number, number][], vertex2: [number, number][]) {

  }
  cal(vertex: any, curvePaths: any) {
    const matchVertex = this.extractMatchVertex(curvePaths);
    //Change the initial trackVertex structure
    const trackVertex: [number, number][][] = [];
    vertex.forEach((fourVertex: any, i: number) => {
      let vertex2: [number, number][] = [];
      fourVertex.forEach((e: any, index: number) => {
        if (index <= 1) {
          vertex2.push([matchVertex[0][0][0], e]);
        } else {
          vertex2.push([matchVertex[0][2][0], e]);
        }
      });
      trackVertex.push(vertex2);
    });
    console.log("trackVertex: ", trackVertex);
    console.log("matchVertex: ", matchVertex);
    let ucList: number[] = [];
    for (let i = 0; i < trackVertex.length; i++) {
      let curTrackUc = 0;
      for (let j = 0; j < matchVertex.length; j++) {
        if (
          (trackVertex[i][1][1] > matchVertex[j][0][1] &&
            trackVertex[i][2][1] < matchVertex[j][3][1]) ||
          (trackVertex[i][0][1] < matchVertex[j][1][1] &&
            trackVertex[i][3][1] > matchVertex[j][2][1])
        ) {
          curTrackUc += 1;
        }
      }
      ucList.push(curTrackUc);
      console.log("ucList: ", ucList);
    }
  }
}
