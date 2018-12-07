import * as React from "react";
import { connect } from "react-redux";
import {
  getCoupleWellPath,
  getWellCurve,
  getTracePath,
  getAllTrack,
  getTrackVertex,
  getUcPath,
  getAttrDiff,
  getCurIndex
} from "../action/changeWell";
import { changeSvgSize } from "../action/changeWellMatchSvg";
import * as d3 from "d3";
import Tracker from "../API/tracking";
import WellAttr from "./WellAttr";
import Uncertainty from "../API/uncertainty";
import {
  getSize,
  getWellMatchPath,
  api_getTracePath,
  ifMatchCurveEqual
} from "../API/wellMatchAPI";
import MatchCurve from "./MatchCurve";
import { v4 } from "uuid";
import { ViewHeading } from "./ViewHeading";
import {
  AllTracks,
  AllVertices,
  WellAttrData,
  AllMatchCurve,
  AllDiff,
  CurSelectedIndex
} from "src/ts/Type";
import { diff } from "../API/wellAttrDiff";
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
    paths,
    allTrack,
    vertex,
    ucPath,
    wellAttrData,
    allDiff,
    curSelectedIndex
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
    paths,
    allTrack,
    allTrackVertex: vertex,
    ucPath,
    wellAttrData,
    allDiff,
    curSelectedIndex
  };
};

const mapDispatchToProps = {
  getCoupleWellPath,
  changeSvgSize,
  getWellCurve,
  getTracePath,
  getAllTrack,
  getTrackVertex,
  getUcPath,
  getAttrDiff,
  getCurIndex
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
  curvePaths: AllMatchCurve;
  matrixData: any;
  depthList: number[];
  paths: any;
  getTracePath: any;
  getAllTrack: any;
  allTrack: AllTracks;
  getTrackVertex: any;
  allTrackVertex: AllVertices;
  ucPath: any[];
  getUcPath: any;
  wellAttrData: WellAttrData;
  allDiff: AllDiff;
  getAttrDiff: typeof getAttrDiff;
  curSelectedIndex: CurSelectedIndex;
  getCurIndex: typeof getCurIndex;
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
      //.curve(d3.curveCardinal)
    };
    this.drawMatch = this.drawMatch.bind(this);
    this.drawTrace = this.drawTrace.bind(this);
    this.calUncertainty = this.calUncertainty.bind(this);
    this.changeCurvePath = this.changeCurvePath.bind(this);
  }

  componentDidUpdate(prevProps: any) {
    const {
      coupleWell,
      changeSvgSize,
      matrixData,
      width,
      curvePaths,
      allTrackVertex,
      ucPath
    } = this.props;

    if (matrixData && matrixData !== prevProps.matrixData) {
      /*  const [width, height] = getSize(matrixData);
      changeSvgSize(width, height); */
      this.drawMatch();
      this.drawTrace();
    }

    if (width !== prevProps.width) {
    }

    //Condition is too complex
    //Maybe i should import `immutable.js` if scale grows
    if (
      curvePaths &&
      allTrackVertex &&
      (!prevProps.curvePaths ||
        ifMatchCurveEqual(curvePaths, prevProps.curvePaths) === false)
    ) {
      this.calUncertainty();
    }
  }

  drawTrace() {
    const {
      width,
      paddingRatio,
      scale,
      matrixData,
      depthList,
      getTracePath,
      getAllTrack,
      getTrackVertex
    } = this.props;
    const { allTrackVertex, allTracks, paths } = api_getTracePath(
      width,
      matrixData,
      scale,
      paddingRatio,
      depthList
    );
    getTrackVertex(allTrackVertex);
    //draw tracking line
    getAllTrack(allTracks);
    //draw trace
    getTracePath(paths);
  }

  drawMatch() {
    const {
      wellIDNearLine,
      matrixData,
      width,
      paddingRatio,
      scale,
      wellIDNearLineIndex,
      getWellCurve
    } = this.props;
    if (!wellIDNearLine) return;
    getWellMatchPath(
      wellIDNearLine,
      paddingRatio,
      width,
      matrixData,
      wellIDNearLineIndex,
      scale
    ).then(paths => {
      getWellCurve(paths);
    });
  }

  calUncertainty() {
    const {
      allTrackVertex,
      curvePaths,
      getUcPath,
      coupleWell,
      paddingRatio,
      width,
      height,
      wellAttrData,
      scale,
      getAttrDiff
    } = this.props;
    const allDiff = diff(wellAttrData, curvePaths);
    getAttrDiff(allDiff);

    const uc = new Uncertainty();
    const ucPath = uc.cal(
      allTrackVertex,
      curvePaths,
      width,
      paddingRatio,
      height
    ).path;
    const ucList = uc.cal(
      allTrackVertex,
      curvePaths,
      width,
      paddingRatio,
      height
    ).ucList;
    const ucSum = uc.getUcSum(ucList);

    const id1 = coupleWell[0];
    const id2 = coupleWell[1];
    const coupleWellUc = {
      id1,
      id2,
      value: ucSum
    };

    getUcPath(ucPath);
    fetch(`http://localhost:5000/storeUcSum/`, {
      body: JSON.stringify(coupleWellUc),
      credentials: "same-origin",
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      mode: "cors"
    });
  }

  changeCurvePath(newPath: any, index: number) {
    const { curvePaths, getWellCurve } = this.props;
    const newCurvePaths = JSON.parse(JSON.stringify(curvePaths));
    newCurvePaths[index] = newPath;
    getWellCurve(newCurvePaths);
  }
  render() {
    const {
      width,
      height,
      curvePaths,
      paths,
      allTrack,
      paddingRatio,
      ucPath,
      wellAttrData,
      scale,
      allDiff,
      getCurIndex,
      curSelectedIndex
    } = this.props;
    const { colorScale, pathGen } = this.state;
    let curves = null;
    if (curvePaths) {
      curves = curvePaths.map((e: any, i: number) => {
        return (
          <MatchCurve
            key={e.toString()}
            path={e}
            index={i}
            changeCurvePath={this.changeCurvePath}
            curSelectedIndex={curSelectedIndex}
            getCurIndex={getCurIndex}
          />
        );
      });
    }

    let positivePaths = null;
    let negativePaths = null;
    if (paths) {
      positivePaths = paths[0].map((e: any, i: number) => {
        let pathD = pathGen(e);
        let style = { fill: "black", stroke: "black", strokeWidth: 0.3 };
        return <path key={i} d={pathD} style={style} className="trace-path" />;
      });
      negativePaths = paths[1].map((e: any, i: number) => {
        let pathD = pathGen(e);
        let style = { fill: "none", stroke: "black", strokeWidth: 0.3 };
        return <path key={i} d={pathD} style={style} className="trace-path" />;
      });
    }
    let trackPath = null;
    if (allTrack) {
      let pathGene = d3
        .line()
        .x((d: any) => {
          return d.highestX;
        })
        .y((d: any) => {
          //TODO:fix bug:highestY on negative path is not accurate
          return d.mid;
        });
      trackPath = allTrack.map((track: any, i: number) => {
        let d: any = pathGene(track);
        let style = { fill: "none", stroke: "black", strokeWidth: 1 };
        return <path key={i} d={d} style={style} className="trace-path" />;
      });
    }

    let ucPathOnSvg = null;
    if (ucPath) {
      ucPath.push(ucPath.length - 1); //loop
      let pathGene = d3
        .line()
        .x((d: any) => {
          return d[0];
        })
        .y((d: any) => {
          return d[1];
        })
        .curve(d3.curveBasis);
      const color = "rgb(223,136,23)";
      let style = {
        fill: color,
        stroke: color,
        strokeWidth: 0.5
      };
      ucPathOnSvg = ucPath.map((e, i) => {
        return (
          <path
            key={i}
            d={pathGene(e) as any}
            style={style}
            className="trace-path"
          />
        );
      });
    }
    let wellAttrCurve = null;
    if (wellAttrData) {
      wellAttrCurve = wellAttrData.map((e, i) => {
        const pad = (width * (paddingRatio - 0.1)) / 5;
        const xStart = i === 0 ? pad / 2 : width - pad / 2;
        return (
          <WellAttr
            key={e.id}
            xStart={xStart}
            id={e.id}
            values={e.value}
            yScale={scale}
            svgWidth={width}
            leftFlag={i === 0 ? true : false}
            paddingRatio={paddingRatio}
          />
        );
      });
    }
    const svgStyle = { width, height: height };
    const divStyle = { width, height: height };
    return (
      <div className=" well-match-div panel panel-primary" style={divStyle}>
        <ViewHeading height={height * 0.05 - 3} />
        <svg className="well-match-svg" style={svgStyle}>
          {curves}
          {positivePaths}
          {negativePaths}
          {trackPath}
          {ucPathOnSvg}
          {wellAttrCurve}
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
