import * as React from "react";
import * as d3 from "d3";

interface Props {}
interface State {}
const minList = [-1171.154, -999.25, -499.048, -999.25, -8533.336];
const maxList = [662.546, 10000.0, 1591.528, 2094.277, 3490.68];
const minDepth = 1067.18;
const scales: any[] = [];
const offSet = 10;
for (let i = 0; i < minList.length; i++) {
  const range = [minList[i], maxList[i]];
  const scale = d3
    .scaleLinear()
    .domain(range)
    .range([-offSet, offSet]);
  scales.push(scale);
}

interface Props {
  id: string;
  values: any[];
  yScale: any;
}

interface State {
  scales: any[];
  pathGen: any;
}
class WellAttr extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scales: scales,
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
  }

  componentDidMount() {}
  render() {
    //TODO:handle error value
    const { values, yScale } = this.props;
    console.log("values: ", values);
    const { scales, pathGen } = this.state;
    const xStart = 0;
    const pad = 20;
    const xList = [];
    for (let i = 0; i < 5; i++) {
      xList.push(xStart + pad * i);
    }
    const paths: any = [[], [], [], [], []];
    for (let i = 0; i < values.length; i++) {
      const depth = values[i][0];
      if (depth < minDepth) {
        continue;
      }
      const y = yScale(depth);
      for (let j = 1; j < values[i].length; j++) {
        let value = values[i][j];
        //Attention!
        //bad data structure of values[i]:[depth,value,value,value,value,value]
        //so `j-1`
        const xOffset = scales[j - 1](value);
        const point = [xList[j - 1] + xOffset, y];
        if (point && !Number.isNaN(point[0]) && !Number.isNaN(point[1])) {
          paths[j - 1].push(point);
        }
      }
    }
    console.log("paths: ", paths);
    const style = {
      fill: "none",
      stroke: "black",
      strokeWidth: 0.1,
      fillOpacity: 0.8
    };
    let drawPaths = null;
    console.log("paths: ", paths);
    if (paths) {
      console.log("paths: ", paths);
      drawPaths = paths.map((e: [number, number][], i: number) => {
        return (
          <path d={pathGen(e)} style={style} className="well-match-axis" />
        );
      });
    }
    return drawPaths;
  }
}

export default WellAttr;
