import * as React from "react";
import * as d3 from "d3";

interface Props {}
interface State {}
const minList = [-1171.154, -999.25, -499.048, -999.25, -8533.336];
const maxList = [662.546, 10000.0, 1591.528, 2094.277, 3490.68];
const scales: any[] = [];
for (let i = 0; i < minList.length; i++) {
  const range = [minList[i], maxList[i]];
  const scale = d3
    .scaleLinear()
    .domain(range)
    .range([-5, 5]);
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

  render() {
    //TODO:handle error value
    const { values, yScale } = this.props;
    const { scales, pathGen } = this.state;
    const xStart = 0;
    const pad = 10;
    const xList = [];
    for (let i = 0; i < 5; i++) {
      xList.push(xStart + pad * i);
    }
    const paths: any = [[], [], [], [], []];
    for (let i = 0; i < values.length; i++) {
      const depth = values[i][0];
      const y = yScale(depth);
      for (let j = 0; j < values[i].length; j++) {
        let value = values[i][j];
        const xOffset = scales[i](value);
        const point = [xList[j] + xOffset, y];
        paths[j].push(point);
      }
    }

    const style = { fill: "grey", stroke: "none", fillOpacity: 0.8 };
    let drawPaths = null;
    if (paths) {
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
