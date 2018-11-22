import * as React from "react";
import { connect } from "react-redux";
import {
  getCoupleWellPath,
  getWellCurve,
  getTracePath,
  getAllTrack
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
    paths,
    allTrack
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
    allTrack
  };
};

const mapDispatchToProps = {
  getCoupleWellPath,
  changeSvgSize,
  getWellCurve,
  getTracePath,
  getAllTrack
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
        .curve(d3.curveCardinal)
    };
    this.drawMatch = this.drawMatch.bind(this);
    this.drawTrace = this.drawTrace.bind(this);
  }

  componentDidUpdate(prevProps: any) {
    const { coupleWell, changeSvgSize, matrixData, width } = this.props;

    if (matrixData && matrixData !== prevProps.matrixData) {
      changeSvgSize(20 * matrixData.length, matrixData[0].length * 5);
    }
    if (width !== prevProps.width) {
      this.drawMatch();
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
      getTracePath,
      getAllTrack
    } = this.props;

    const drawWidth = width * (1 - 2 * paddingRatio);
    const pad = drawWidth / matrixData.length;
    //set xOffsetScope a litter bigger than `pad/2`
    const xOffsetScope = pad / 1.3;
    const xScale = d3
      .scaleLinear()
      .domain([-13685.379, 13685.379])
      .range([-xOffsetScope, xOffsetScope]);
    let positivePaths = [];
    let allPeaks = [];
    let negativePaths: [number, number][][] = [];
    let paths = [];
    for (let i = 0; i < matrixData.length; i++) {
      let positivePath: [number, number][] = [];
      let negativePath: [number, number][] = [];
      let x = pad * i + pad / 2;
      for (let j = 0; j < matrixData[i].length; j++) {
        let xOffset = matrixData[i][j] === 0 ? 0 : xScale(matrixData[i][j]);
        let p1: [number, number] = [x, scale(depthList[j])];
        let p2: [number, number] = [
          x + xOffset,
          (scale(depthList[j]) + scale(depthList[j + 1])) / 2
        ];
        let p3: [number, number] = [
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

      positivePath = deleteMidPoint(positivePath, x, true);
      negativePath = deleteMidPoint(negativePath, x, false);

      let peaks = extractPeaks(positivePath, x);
      allPeaks.push(peaks);
      //loop the positivePath to ensure it's closed so that css `fill` works
      positivePath.push([x, scale(depthList[matrixData[0].length + 1])]);
      positivePath.push([x, scale(depthList[0])]);
      negativePaths.push([x, scale(depthList[matrixData[0].length + 1])]);
      positivePaths.push(positivePath);
      negativePaths.push(negativePath);
    }
    let allTracks: any = [];
    for (let i = 0; i < allPeaks.length / 2; i++) {
      allTracks.push(...tracking(allPeaks, i));
    }

    cutOffAllTracks(allTracks, allPeaks.length);
    getAllTrack(allTracks);

    paths.push(positivePaths, negativePaths);
    getTracePath(paths);

    function deleteMidPoint(
      path: [number, number][],
      x: number,
      ifPositive: boolean
    ): [number, number][] {
      const deleteIndicesSet = new Set();
      if (ifPositive) {
        for (let i = 1; i < path.length - 2; i += 2) {
          if (path[i][0] > x && path[i + 2][0] > x) {
            deleteIndicesSet.add(i + 1);
          }
        }
      } else {
        for (let i = 1; i < path.length - 2; i += 2) {
          if (path[i][0] < x && path[i + 2][0] < x) {
            deleteIndicesSet.add(i + 1);
          }
        }
      }
      const deleteIndicesList = Array.from(deleteIndicesSet).reverse();
      for (let i = 0; i < deleteIndicesList.length; i++) {
        path.splice(deleteIndicesList[i], 1);
      }
      return path;
    }

    function tracking(allPeaks: any, original: number) {
      const allTracks = [];
      for (let i = 0; i < allPeaks[original].length; i++) {
        let track = [allPeaks[original][i]];
        for (let j = original + 1; j < allPeaks.length; j++) {
          let nextPeak = null;
          let MaxOffSet = 999;
          for (let s = 0; s < allPeaks[j].length; s++) {
            let offset = Math.abs(
              allPeaks[j][s].mid - track[track.length - 1].mid
            );
            if (offset < MaxOffSet) {
              MaxOffSet = offset;
              nextPeak = allPeaks[j][s];
            }
          }
          //if offsets too much,stop here
          if (MaxOffSet > 50) break;
          track.push(nextPeak);
        }
        allTracks.push(track);
      }
      cutoff(allTracks);
      return allTracks;

      function cutoff(allTracks: any[]) {
        for (let i = 0; i < allTracks.length - 1; i++) {
          for (let j = 0; j < allTracks[i].length; j++) {
            if (!allTracks[i + 1][j]) continue;
            let curTrack = allTracks[i];
            let nextTrack = allTracks[i + 1];
            if (curTrack[j].mid !== nextTrack[j].mid) continue;
            let curOffSet = Math.abs(curTrack[j].mid - curTrack[j - 1].mid);
            let nextOffSet = Math.abs(nextTrack[j].mid - nextTrack[j - 1].mid);
            let curValueDiff = Math.abs(
              curTrack[j].value - curTrack[j - 1].value
            );
            let nextValueDiff = Math.abs(
              nextTrack[j].value - nextTrack[j - 1].value
            );
            let curDiff = 0.5 * curOffSet + 0.5 * curValueDiff;
            let nextDiff = 0.5 * nextOffSet + 0.5 * nextValueDiff;
            if (curDiff < nextDiff) {
              allTracks[i + 1].splice(j, allTracks[i + 1].length - j);
            } else {
              allTracks[i].splice(j, allTracks[i].length - j);
            }
          }
        }
      }
    }

    function cutOffAllTracks(allTracks: any, traceCount: number) {
      for (let i = allTracks.length - 1; i >= 0; i--) {
        if (allTracks[i].length < traceCount / 2) {
          allTracks.splice(i, 1);
        }
      }
      let removeSet = new Set();
      for (let i = 0; i < allTracks.length; i++) {
        labelStop: for (let j = 0; j < allTracks.length; j++) {
          if (i === j) continue;
          let track1 = allTracks[i];
          let track2 = allTracks[j];
          if (track1.length === track2.length) continue;
          for (let s = 1; s < track1.length; s++) {
            for (let m = 1; m < track2.length; m++) {
              if (
                track1[s].mid === track2[m].mid &&
                track1[s].x === track2[m].x &&
                track1[s - 1].mid !== track2[m - 1].mid
              ) {
                if (track1.length < track2.length) {
                  removeSet.add(i);
                  break labelStop;
                } else {
                  removeSet.add(j);
                  break labelStop;
                }
              }
            }
          }
        }
      }
      let removeList = Array.from(removeSet).sort((a, b) => b - a);
      for (let i = 0; i < removeList.length; i++) {
        allTracks.splice(removeList[i], 1);
      }
    }

    function extractPeaks(positivePath: [number, number][], x: number) {
      let peaks = [];
      let peakPoints = [];
      let findFlag = false;
      for (let i = 0; i < positivePath.length - 1; i++) {
        let point = positivePath[i];
        let nextPoint = positivePath[i + 1];
        if (point[0] === x && nextPoint[0] !== x) findFlag = true;
        if (point[0] !== x && nextPoint[0] === x) findFlag = false;
        if (findFlag === true) {
          peakPoints.push(point);
        } else if (findFlag === false && peakPoints.length > 0) {
          let peakInfo = {
            x: 0,
            pos: -1,
            value: -1
          };
          peakPoints.map(e => {
            if (e[0] > peakInfo.x) {
              peakInfo.x = e[0];
              peakInfo.pos = e[1];
              peakInfo.value = e[0] - x;
            }
          });
          let peak = {
            top: peakPoints[0][1],
            bottom: peakPoints[peakPoints.length - 1][1],
            mid: (peakPoints[0][1] + peakPoints[peakPoints.length - 1][1]) / 2,
            peak: peakInfo.pos,
            x: peakInfo.x,
            value: peakInfo.value
          };
          peaks.push(peak);
          peakPoints = [];
        }
      }
      return peaks;
    }
  }

  drawMatch() {
    const { wellIDNearLine, matrixData } = this.props;
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
          wellIDNearLineIndex,
          getWellCurve
        } = this.props;
        console.log("wellIDNearLineIndex: ", wellIDNearLineIndex);
        const drawWidth = width * (1 - 2 * paddingRatio);
        const pad = drawWidth / matrixData.length;
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
            let x =
              wellIDNearLineIndex[j] * (matrixData.length - 1) * pad + pad / 2;
            let value = data[j].value;
            if (value[index].topDepth) {
              let y = scale(value[index].topDepth);
              path.push([x, y]);
            } else {
              path.push([x, null]);
            }
          }

          for (let j = data.length - 1; j >= 0; j--) {
            let x =
              wellIDNearLineIndex[j] * (matrixData.length - 1) * pad + pad / 2;
            let value = data[j].value;
            if (value[index].bottomDepth) {
              let y = scale(value[index].bottomDepth);
              path.push([x, y]);
            } else {
              path.push([x, null]);
            }
          }
          console.log("path: ", path);
          paths.push(path);
        }
        for (let i = 0; i < paths.length; i++) {
          let path = paths[i];
          for (let j = 0; j < path.length / 2; j++) {
            if (path[j][1] === null) {
              path[j][1] = path[j - 1][1];
            }
          }
          for (let j = path.length - 1; j > path.length / 2; j--) {
            if (path[j][1] === null) {
              path[j][1] = path[j + 1][1];
            }
          }
        }

        for (let i = 0; i < paths.length; i++) {
          paths[i].push(paths[i][0]);
        }
        console.log("paths: ", paths);
        getWellCurve(paths);
      });
  }

  render() {
    const { width, height, curvePaths, paths, allTrack } = this.props;

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
          return d.x;
        })
        .y((d: any) => {
          return d.mid;
        });
      trackPath = allTrack.map((track: any, i: number) => {
        let d: any = pathGene(track);
        let style = { fill: "none", stroke: "black", strokeWidth: 1 };
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
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
