import React, { Component } from "react";
import { connect } from "react-redux";
import { getCoupleWellPath } from "../action/changeWell";
import * as d3 from "d3";
const mapStateToProps = (state, ownProps) => {
  const {
    wellMinDepth,
    wellMaxDepth,
    wellMatchSvgHeight,
    wellMatchSvgWidth,
    wellMatchSvgPaddingRatio,
    wellMatchDepthScale
  } = state.globalVarReducer;

  const { coupleWell, coupleWellPath, figURI } = state.wellReducer;

  return {
    wellMinDepth,
    wellMaxDepth,
    scale: wellMatchDepthScale,
    width: wellMatchSvgWidth,
    height: wellMatchSvgHeight,
    paddingRatio: wellMatchSvgPaddingRatio,
    coupleWell,
    coupleWellPath,
    figURI
  };
};

const mapDispatchToProps = { getCoupleWellPath };

class WellMatch extends Component {
  constructor(props) {
    super(props);
    //do not store in `redux store` temporarily
    this.state = {
      colorScale: d3.scaleOrdinal(d3.schemeCategory10),
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
  }

  componentDidMount() {
    const { coupleWell } = this.props;
  }

  componentDidUpdate(prevProps, prevState) {
    const coupleWell = this.props.coupleWell;
    if (coupleWell.length === 2 && prevProps.coupleWell.length === 1) {
      fetch(`http://localhost:5000/wellMatch/${coupleWell[0]}_${coupleWell[1]}`)
        .then(res => res.json())
        .then(data => {
          const { width, height, paddingRatio, scale } = this.props;
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
  }
  render() {
    const { width, height, paddingRatio, coupleWellPath, figURI } = this.props;
    const { colorScale, pathGen } = this.state;
    const p1 = [paddingRatio * width, paddingRatio * height];
    const p2 = [paddingRatio * width, (1 - paddingRatio) * height];
    const p3 = [(1 - paddingRatio) * width, paddingRatio * height];
    const p4 = [(1 - paddingRatio) * width, (1 - paddingRatio) * height];
    let mapLines = null;

    if (coupleWellPath) {
      mapLines = coupleWellPath.map((e, i) => {
        let pathD = pathGen(e);
        let style = { fill: colorScale(i), stroke: "none" };
        return (
          <path key={i} d={pathD} style={style} className="well-match-axis" />
        );
      });
    }

    return (
      <div className="panel panel-default well-match-div">
        <svg className="well-match-svg">
          <line
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
          />
          {mapLines}
        </svg>
        <img
          alt="Selected Line"
          src={`data:image/png;base64,${figURI}`}
          className="matrix-selected-line-img"
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WellMatch);
