import * as React from "react";
import * as d3 from "d3";

interface Props {}
interface State {}
const minList = [
  -662.546 / 2,
  -999.25 / 2,
  -499.048 / 16,
  -999.25 / 16,
  -3490.68 / 8
];
const maxList = [
  662.546 / 2,
  999.25 / 2,
  499.048 / 64,
  999.25 / 64,
  3490.68 / 8
];
const minDepth = 1067.18;

const colorScale = d3.scaleOrdinal(d3.schemeSet1);
interface Props {
  id: string;
  values: any[];
  yScale: any;
  xStart: number;
  svgWidth: number;
  paddingRatio: number;
}

interface State {
  pathGen: any;
}
class WellAttr extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
  }

  componentDidMount() {}
  render() {
    //TODO:handle error value
    const { values, yScale, xStart, svgWidth, paddingRatio } = this.props;
    const { pathGen } = this.state;
    const scales: any[] = [];
    const pad = (svgWidth * (paddingRatio - 0.1)) / 5;
    for (let i = 0; i < minList.length; i++) {
      const range = [minList[i], maxList[i]];
      const scale = d3
        .scaleLinear()
        .domain(range)
        .range([-pad / 2, pad / 2])
        .clamp(true);
      scales.push(scale);
    }
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

        //filter dirty data
        if (value <= -9999) continue;

        const xOffset = scales[j - 1](value);
        const point = [xList[j - 1] + xOffset, y];
        if (point && !Number.isNaN(point[0]) && !Number.isNaN(point[1])) {
          paths[j - 1].push(point);
        }
      }
    }

    const style = {
      fill: "none",
      strokeWidth: 1
    };
    let drawPaths = null;
    if (paths) {
      drawPaths = paths.map((e: [number, number][], i: number) => {
        const color = colorScale(i.toString());
        return (
          <path
            d={pathGen(e)}
            style={{ ...style, stroke: color }}
            className="well-match-axis"
            key={i}
          />
        );
      });
    }
    return drawPaths;
  }
}

export default WellAttr;
