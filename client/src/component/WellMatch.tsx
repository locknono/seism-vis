import * as React from "react";
import { connect } from "react-redux";
import {
  getCoupleWellPath,
  getWellCurve,
  getTracePath
} from "../action/changeWell";
import { changeSvgSize } from "../action/changeWellMatchSvg";
import * as d3 from "d3";
const mapStateToProps = (state: any, ownProps?: any) => {
  const {
    wellMinDepth,
    wellMaxDepth,
    wellMatchSvgHeight,
    wellMatchSvgWidth,
    wellMatchSvgPaddingRatio,
    wellMatchDepthScale,
    depthList
  } = state.globalVarReducer;

  const {
    coupleWell,
    coupleWellPath,
    figURI,
    wellIDNearLine,
    wellIDNearLineIndex,
    curvePaths,
    matrixData,
    paths
  } = state.wellReducer;

  return {
    wellMinDepth,
    wellMaxDepth,
    scale: wellMatchDepthScale,
    width: wellMatchSvgWidth,
    height: wellMatchSvgHeight,
    paddingRatio: wellMatchSvgPaddingRatio,
    coupleWell,
    coupleWellPath,
    figURI,
    wellIDNearLine,
    wellIDNearLineIndex,
    curvePaths,
    matrixData,
    depthList,
    paths
  };
};

const mapDispatchToProps = {
  getCoupleWellPath,
  changeSvgSize,
  getWellCurve,
  getTracePath
};

interface Props {
  readonly wellMinDepth: number;
  readonly wellMaxDepth: number;
  scale: any;
  width: number;
  height: number;
  paddingRatio: number;
  coupleWell: any;
  coupleWellPath: any;
  figURI: string;
  wellIDNearLine: string[];
  getCoupleWellPath: any;
  changeSvgSize: any;
  wellIDNearLineIndex: any;
  getWellCurve: any;
  curvePaths: any;
  matrixData: any;
  depthList: number[];
  paths: any;
  getTracePath: any;
}

interface State {
  colorScale: any;
  pathGen: any;
}

class WellMatch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    //do not store in `redux store` temporarily
    this.state = {
      colorScale: d3.scaleOrdinal(d3.schemeCategory10),
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
    this.getManualWellMatchResultNearLine = this.getManualWellMatchResultNearLine.bind(
      this
    );
    this.drawTrace = this.drawTrace.bind(this);
  }

  componentDidUpdate(prevProps: any) {
    const { coupleWell, changeSvgSize, matrixData, width } = this.props;

    if (matrixData && matrixData !== prevProps.matrixData) {
      changeSvgSize(10 * matrixData.length, 800);
    }
    if (width !== prevProps.width) {
      this.getManualWellMatchResultNearLine();
      this.drawTrace();
    }
  }

  drawTrace() {
    const {
      width,
      paddingRatio,
      scale,
      matrixData,
      depthList,
      getTracePath
    } = this.props;
    console.log("matrixData: ", matrixData);
    const drawWidth = width * (1 - 2 * paddingRatio);
    const pad = drawWidth / matrixData.length;
    const xScale = d3
      .scaleLinear()
      .domain([-13685.379, 15099.375])
      .range([-pad / 1.3, pad / 1.3]);
    let paths = [];
    for (let i = 0; i < matrixData.length; i++) {
      let path: any = [];
      let x = pad * i + pad / 2;
      path.push([x, 0]);
      let thisCol = matrixData[i];
      for (let j = 0; j < thisCol.length; j++) {
        let p1 = [x, scale(depthList[j])];
        let p2 = [
          x + xScale(thisCol[j]),
          (scale(depthList[j]) + scale(depthList[j + 1])) / 2
        ];
        path.push(p1, p2);
      }
      path.push([x, 0]);
      paths.push(path);
    }
    getTracePath(paths);
  }

  getManualWellMatchResultNearLine() {
    const { wellIDNearLine } = this.props;
    if (!wellIDNearLine) return;
    fetch(`http://localhost:5000/nearLineCurve/`, {
      body: JSON.stringify(wellIDNearLine),
      credentials: "same-origin",
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        const {
          width,
          paddingRatio,
          scale,
          wellIDNearLineIndex,
          getWellCurve
        } = this.props;
        const drawWidth = width * (1 - 2 * paddingRatio);
        let layerIndexList: number[] = [];
        for (let i = 0; i < data[0].value.length; i++) {
          if (
            data[0].value[i].topDepth &&
            data[data.length - 1].value[i].topDepth
          ) {
            layerIndexList.push(i);
          }
        }
        const paths = [];
        for (let i = 0; i < layerIndexList.length; i++) {
          let index = layerIndexList[i];
          let path = [];
          for (let j = 0; j < data.length; j++) {
            let x = wellIDNearLineIndex[j] * drawWidth;
            let value = data[j].value;
            if (value[index].topDepth) {
              let y = scale(value[index].topDepth);
              path.push([x, y]);
            } else {
              path.push([x, null]);
            }
          }
          for (let j = data.length - 1; j >= 0; j--) {
            let x = wellIDNearLineIndex[j] * drawWidth;
            let value = data[j].value;
            if (value[index].bottomDepth) {
              let y = scale(value[index].bottomDepth);
              path.push([x, y]);
            } else {
              path.push([x, null]);
            }
          }
          paths.push(path);
        }
        for (let i = 0; i < paths.length; i++) {
          let path = paths[i];
          for (let j = 0; j < path.length / 2; j++) {
            if (!path[j][1]) {
              path[j][1] = path[j - 1][1];
            }
          }
          for (let j = path.length - 1; j > path.length / 2; j--) {
            if (!path[j][1]) {
              path[j][1] = path[j + 1][1];
            }
          }
        }
        for (let i = 0; i < paths.length; i++) {
          paths[i].push(paths[i][0]);
        }
        getWellCurve(paths);
      });
  }

  render() {
    const { width, height, figURI, curvePaths, paths } = this.props;
    const { colorScale, pathGen } = this.state;
    let curves = null;
    if (curvePaths) {
      curves = curvePaths.map((e: any, i: number) => {
        let pathD = pathGen(e);
        let style = { fill: colorScale(i), stroke: "none", fillOpacity: 0.8 };
        return (
          <path key={i} d={pathD} style={style} className="well-match-axis" />
        );
      });
    }
    let tracePaths = null;
    if (paths) {
      tracePaths = paths.map((e: any, i: number) => {
        let pathD = pathGen(e);
        let style = { stroke: "black", strokeWidth: 1 };
        return <path key={i} d={pathD} style={style} className="trace-path" />;
      });
    }
    const svgStyle = { width, height };
    return (
      <div className="panel panel-default well-match-div" style={svgStyle}>
        <svg className="well-match-svg" style={svgStyle}>
          {curves}
          {tracePaths}
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
