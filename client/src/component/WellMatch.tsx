import * as React from "react";
import { connect } from "react-redux";
import { getCoupleWellPath } from "../action/changeWell";
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
    wellIDNearLineIndex
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
    wellIDNearLineIndex
  };
};

const mapDispatchToProps = { getCoupleWellPath, changeSvgSize };

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
    console.log("wellIDNearLine: ", wellIDNearLine);
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
        console.log("data: ", data);
        const {
          width,
          paddingRatio,
          scale,
          coupleWell,
          wellIDNearLineIndex
        } = this.props;
        const drawWidth = width * (1 - 2 * paddingRatio);
        let existLayerIndex: number[] = [];
        for (let i = 0; i < data[0].value.length; i++) {
          if (
            data[0].value[i].topDepth &&
            data[data.length - 1].value[i].topDepth
          ) {
            existLayerIndex.push(i);
          }
        }
        const topPathYList = [];
        const bottomPathYList = [];
        const xList = [];
        for (let i = 0; i < data.length; i++) {
          let x = wellIDNearLineIndex[i] * drawWidth;
          xList.push(x);
          for (let j = 0; j < existLayerIndex.length; j++) {
            let index = existLayerIndex[j];
            let value = data[i].value;
            if (value[index].topDepth) {
              let y1 = scale(value[index].topDepth);
              let y2 = scale(value[index].bottomDepth);
              topPathYList.push(y1);
              bottomPathYList.push(y2);
            } else {
              topPathYList.push(null);
              bottomPathYList.push(null);
            }
          }
        }

        for (let i = 0; i < topPathYList.length; i++) {
          if (!topPathYList[i]) {
            //do not have to ensure it's a `null`
            //false-like is ok
            topPathYList[i] =
              (topPathYList[i - 1] + bottomPathYList[i - 1]) / 2;
            bottomPathYList[i] =
              (topPathYList[i - 1] + bottomPathYList[i - 1]) / 2;
          }
        }
        let path = [];
        for (let i = 0; i < xList.length; i++) {
          for (
            let j = 0;
            j < topPathYList.length;
            j += existLayerIndex.length
          ) {
            let point = [xList[i], topPathYList[j]];
            path.push(point);
          }
        }

        for (let i = xList.length - 1; i >= 0; i--) {
          for (
            let j = bottomPathYList.length - 1;
            j >= 0;
            j -= existLayerIndex.length
          ) {
            let point = [xList[i], bottomPathYList[j]];
            path.push(point);
          }
        }
        path.push([xList[0], topPathYList[0]]);

      });
  }

  fetchManualWellMatchData(coupleWell: any) {
    fetch(`http://localhost:5000/wellMatch/${coupleWell[0]}_${coupleWell[1]}`)
      .then(res => res.json())
      .then(data => {
        console.log("旧data: ", data);
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
    const { width, height, paddingRatio, coupleWellPath, figURI } = this.props;
    const { colorScale, pathGen } = this.state;
    /* const p1 = [paddingRatio * width, paddingRatio * height];
    const p2 = [paddingRatio * width, (1 - paddingRatio) * height];
    const p3 = [(1 - paddingRatio) * width, paddingRatio * height];
    const p4 = [(1 - paddingRatio) * width, (1 - paddingRatio) * height]; */
    let mapLines = null;

    if (coupleWellPath) {
      mapLines = coupleWellPath.map((e: any, i: number) => {
        let pathD = pathGen(e);
        let style = { fill: colorScale(i), stroke: "none", fillOpacity: 0.5 };
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
          {/* <line
            x1={p1[0]}
            y1={p1[1]}
            x2={p2[0]}
            y2={p2[1]}
            className="well-match-axis"
          />
          <line
            x1={p3[0]}
            y1={p3[1]}
            x2={p4[0]}
            y2={p4[1]}
            className="well-match-axis"
          /> */}
          {mapLines}
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
