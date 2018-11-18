import * as React from "react";
import { connect } from "react-redux";
import { getCoupleWellPath, getWellCurve } from "../action/changeWell";
import { changeSvgSize } from "../action/changeWellMatchSvg";
import * as d3 from "d3";
const mapStateToProps = (state: any, ownProps?: any) => {
  const {
    wellMinDepth,
    wellMaxDepth,
    wellMatchSvgHeight,
    wellMatchSvgWidth,
    wellMatchSvgPaddingRatio,
    wellMatchDepthScale
  } = state.globalVarReducer;

  const {
    coupleWell,
    coupleWellPath,
    figURI,
    wellIDNearLine,
    wellIDNearLineIndex,
    curvePaths
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
    curvePaths
  };
};

const mapDispatchToProps = { getCoupleWellPath, changeSvgSize, getWellCurve };

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
}

interface State {
  colorScale: any;
  pathGen: any;
}

interface WellMatch {
  unsafe_figure_loaded: boolean;
  figureRef: any;
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
    this.unsafe_figure_loaded = false;
    this.figureRef = React.createRef();
    this.onImgLoad = this.onImgLoad.bind(this);
    this.fetchManualWellMatchData = this.fetchManualWellMatchData.bind(this);
    this.getManualWellMatchResultNearLine = this.getManualWellMatchResultNearLine.bind(
      this
    );
    this.generateMatchPath = this.generateMatchPath.bind(this);
  }

  componentDidUpdate() {
    const { coupleWell } = this.props;
    if (this.unsafe_figure_loaded === true) {
      this.fetchManualWellMatchData(coupleWell);
      this.getManualWellMatchResultNearLine();
      this.unsafe_figure_loaded = false;
    }
  }

  onImgLoad(e: any) {
    this.unsafe_figure_loaded = true;
    const { changeSvgSize } = this.props;
    const figuerNode = this.figureRef.current;
    const { width, height, left, top } = figuerNode.getBoundingClientRect();
    changeSvgSize(width, height);
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
        console.log("wellIDNearLineIndex: ", wellIDNearLineIndex);
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

  fetchManualWellMatchData(coupleWell: any) {
    fetch(`http://localhost:5000/wellMatch/${coupleWell[0]}_${coupleWell[1]}`)
      .then(res => res.json())
      .then(data => {
        const { width, paddingRatio, scale } = this.props;
        let coupleWellPath = [];
        let x1 = paddingRatio * width;
        let x2 = width * (1 - paddingRatio);
        for (let i = 0; i < data[0].value.length; i++) {
          if (data[0].value[i].topDepth && data[1].value[i].topDepth) {
            let y1 = scale(data[0].value[i].topDepth);
            let y2 = scale(data[1].value[i].topDepth);
            let y3 = scale(data[0].value[i].bottomDepth);
            let y4 = scale(data[1].value[i].bottomDepth);
            let path = [[x1, y1], [x2, y2], [x2, y4], [x1, y3]];
            coupleWellPath.push(path);
          }
        }
        this.props.getCoupleWellPath(coupleWellPath);
      });
  }

  generateMatchPath() {}
  render() {
    const { width, height, figURI, curvePaths } = this.props;
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
    const imgStyle = {};
    const svgStyle = { width, height };
    return (
      <div className="panel panel-default well-match-div">
        <img
          alt="Selected Line"
          style={imgStyle}
          src={`data:image/png;base64,${figURI}`}
          className="matrix-selected-line-img"
          onLoad={this.onImgLoad}
          ref={this.figureRef}
        />
        <svg className="well-match-svg" style={svgStyle}>
          {curves}
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
