import * as React from "react";
import { connect } from "react-redux";
import {
  getCoupleWellPath,
  getWellCurve,
  getTracePath,
  getAllTrack,
  getTrackVertex,
  getUcPath
} from "../action/changeWell";
import { changeSvgSize } from "../action/changeWellMatchSvg";
import * as d3 from "d3";
import Tracker from "../API/tracking";
import Uncertainty from "../API/uncertainty";
import { getSize, getWellMatchPath } from "../API/wellMatchAPI";
import { resolve } from "url";
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
    ucPath
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
    vertex,
    ucPath
  };
};

const mapDispatchToProps = {
  getCoupleWellPath,
  changeSvgSize,
  getWellCurve,
  getTracePath,
  getAllTrack,
  getTrackVertex,
  getUcPath
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
  getAllTrack: any;
  allTrack: any;
  getTrackVertex: any;
  vertex: any[];
  ucPath: any[];
  getUcPath: any;
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
  }

  componentDidUpdate(prevProps: any) {
    const {
      coupleWell,
      changeSvgSize,
      matrixData,
      width,
      curvePaths,
      vertex,
      ucPath
    } = this.props;

    if (matrixData && matrixData !== prevProps.matrixData) {
      const [width, height] = getSize(matrixData);
      changeSvgSize(width, height);
    }
    if (width !== prevProps.width) {
      this.drawMatch();
      this.drawTrace();
    }

    if (
      curvePaths &&
      vertex &&
      (!prevProps.curvePaths ||
        curvePaths.length !== prevProps.curvePaths.length)
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
    const trakcer = new Tracker();
    const drawWidth = width * (1 - 2 * paddingRatio);
    const pad = drawWidth / matrixData.length;
    //set xOffsetScope a litter bigger than `pad/2`
    //TODO: restrict the biggest xOffsetScope
    const xOffsetScope = pad / 0.8;
    const xScale = d3
      .scaleLinear()
      .domain([-13685.379, 13685.379])
      .range([-xOffsetScope, xOffsetScope]);
    const allPeaks = [];
    const positivePaths: [number, number][][] = [];
    const negativePaths: [number, number][][] = [];
    const paths = [];
    for (let i = 0; i < matrixData.length; i++) {
      let positivePath: [number, number][] = [];
      let negativePath: [number, number][] = [];
      const x = pad * i + pad / 2;
      for (let j = 0; j < matrixData[i].length; j++) {
        const xOffset = matrixData[i][j] === 0 ? 0 : xScale(matrixData[i][j]);
        const p1: [number, number] = [x, scale(depthList[j])];
        const p2: [number, number] = [
          x + xOffset,
          (scale(depthList[j]) + scale(depthList[j + 1])) / 2
        ];
        const p3: [number, number] = [
          x,
          (scale(depthList[j]) + scale(depthList[j + 1])) / 2
        ];
        if (xOffset > 0) {
          positivePath.push(p1, p2);
          negativePath.push(p1, p3);
        } else {
          positivePath.push(p1, p3);
          negativePath.push(p1, p2);
        }
      }

      positivePath = trakcer.clearSawtooth(positivePath, x, true);
      negativePath = trakcer.clearSawtooth(negativePath, x, false);

      const peaks = [
        ...trakcer.extractPeaks(positivePath, x),
        ...trakcer.extractPeaks(negativePath, x)
      ];
      allPeaks.push(peaks);
      //loop the positivePath to ensure it's closed so that css `fill` works
      positivePath.push([x, scale(depthList[matrixData[0].length + 1])]);
      positivePath.push([x, scale(depthList[0])]);
      negativePath.push([x, scale(depthList[matrixData[0].length + 1])]);

      positivePaths.push(positivePath);
      negativePaths.push(negativePath);
    }

    const allTracks: any = [];
    for (let i = 0; i < allPeaks.length / 2; i++) {
      allTracks.push(...trakcer.tracking(allPeaks, i));
    }

    trakcer.cutOffAllTracks(allTracks, allPeaks.length);

    const vertex: any = [];
    allTracks.map((e: any) => {
      vertex.push(trakcer.getFourVertex(e));
    });

    getTrackVertex(vertex);
    paths.push(positivePaths, negativePaths);

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
    const { vertex, curvePaths, getUcPath, coupleWell } = this.props;
    const uc = new Uncertainty();
    const ucPath = uc.cal(vertex, curvePaths).path;
    const ucList = uc.cal(vertex, curvePaths).ucList;
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

  render() {
    const {
      width,
      height,
      curvePaths,
      paths,
      allTrack,
      vertex,
      matrixData,
      paddingRatio,
      ucPath
    } = this.props;
    const { colorScale, pathGen } = this.state;

    let curves = null;
    if (curvePaths) {
      curves = curvePaths.map((e: any, i: number) => {
        let pathD = pathGen(e);
        let style = { fill: "grey", stroke: "none", fillOpacity: 0.8 };
        return (
          <path key={i} d={pathD} style={style} className="well-match-axis" />
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

    let vertexPath = null;
    if (vertex && vertex.length > 0) {
      const drawWidth = width * (1 - 2 * paddingRatio);
      const pad = drawWidth / matrixData.length;
      const x1 = pad * 0 + pad / 2;
      const x2 = pad * (matrixData.length - 1) + pad / 2;
      vertexPath = vertex.map((fourVertex: number[], i: number) => {
        return fourVertex.map((pointY: number, index: number) => {
          const cx = index <= 1 ? x1 : x2;
          const cy = pointY;
          return (
            <circle
              key={i * fourVertex.length + index}
              cx={cx}
              cy={cy}
              r={3}
              fill="none"
              stroke="blue"
            />
          );
        });
      });
    }

    let ucPathOnSvg = null;
    if (ucPath) {
      let pathGene = d3
        .line()
        .x((d: any) => {
          return d[0];
        })
        .y((d: any) => {
          return d[1];
        });
      ucPathOnSvg = ucPath.map((path: any, i: number) => {
        let d: any = pathGene(path);
        let style = { fill: "none", stroke: "black", strokeWidth: 2 };
        return <path key={i} d={d} style={style} className="trace-path" />;
      });
    }

    const svgStyle = { width, height: height + 15 };
    const divStyle = { width, height: height + 15 };
    return (
      <div className=" well-match-div" style={divStyle}>
        <svg className="well-match-svg" style={svgStyle}>
          {curves}
          {positivePaths}
          {negativePaths}
          {trackPath}
          {vertexPath}
          {ucPathOnSvg}
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
