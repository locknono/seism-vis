import * as React from "react";
import * as d3 from "d3";
import { colorScale } from "../constraint";
import { shouldFilterDirtyData } from "../API/wellAttrDiff";
interface Props {}
interface State {}

function getWellScales(
  values: [number, number, number, number, number, number][],
  offset: number
) {
  const minList = Array(5).fill(Number.MAX_SAFE_INTEGER);
  const maxList = Array(5).fill(Number.MIN_SAFE_INTEGER);
  for (let value of values) {
    for (let i = 1; i <= 5; i++) {
      if (shouldFilterDirtyData(value[i])) continue;
      if (value[i] < minList[i - 1]) {
        minList[i - 1] = value[i];
      }
      if (value[i] > maxList[i - 1]) {
        maxList[i - 1] = value[i];
      }
    }
  }
  const scales = [];
  for (let i = 0; i < minList.length; i++) {
    scales.push(
      d3
        .scaleLinear()
        .domain([minList[i], maxList[i]])
        .range([-offset, offset])
    );
  }
  return scales;
}
const minList = [
  -662.546 / 4,
  -999.25 / 4,
  -499.048 / 256,
  -999.25 / 256,
  -3490.68
];
const maxList = [662.546 / 4, 999.25 / 4, 499.048 / 256, 999.25 / 256, 3490.68];
const minDepth = 1067.18;

interface Props {
  id: string;
  values: [number, number, number, number, number, number][];
  yScale: any;
  xStart: number;
  svgWidth: number;
  paddingRatio: number;
  leftFlag: boolean;
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

  componentDidMount() {
    //TODO:ADD BASELINE
  }
  render() {
    //TODO:handle error value
    const {
      values,
      yScale,
      xStart,
      svgWidth,
      paddingRatio,
      leftFlag
    } = this.props;
    const { pathGen } = this.state;
    const pad = (svgWidth * (paddingRatio - 0.1)) / 5;
    const scales = getWellScales(values, pad / 2 - 2);
    const xList = [];
    if (leftFlag) {
      for (let i = 0; i < 5; i++) {
        xList.push(xStart + pad * i);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        xList.push(xStart - pad * i);
      }
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
        if (value <= -9999 || Number.isNaN(value)) continue;
        const xOffset = scales[j - 1](value);
        const point =
          leftFlag === true
            ? [xList[j - 1] + xOffset, y]
            : [xList[j - 1] - xOffset, y];
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
