import * as React from "react";
import { connect } from "react-redux";
import { getCoupleWellPath } from "../action/changeWell";
import { changeSvgSize } from "../action/changeWellMatchSvg";
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

const mapDispatchToProps = { getCoupleWellPath, changeSvgSize };

class WellMatch extends React.Component {
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
    this.unsafe_figure_loaded = false;
    this.figureRef = React.createRef();
    this.onImgLoad = this.onImgLoad.bind(this);
    this.fetchManualWellMatchData = this.fetchManualWellMatchData.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { coupleWell, scale } = this.props;
    if (this.unsafe_figure_loaded === true) {
      this.fetchManualWellMatchData(coupleWell, scale);
      this.unsafe_figure_loaded = false;
    }
  }

  onImgLoad(e) {
    this.unsafe_figure_loaded = true;
    const { changeSvgSize } = this.props;
    const figuerNode = this.figureRef.current;
    const { width, height, left, top } = figuerNode.getBoundingClientRect();
    changeSvgSize(width, height);
  }

  fetchManualWellMatchData(coupleWell, scale) {
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

  render() {
    const { width, height, paddingRatio, coupleWellPath, figURI } = this.props;
    const { colorScale, pathGen } = this.state;
    /* const p1 = [paddingRatio * width, paddingRatio * height];
    const p2 = [paddingRatio * width, (1 - paddingRatio) * height];
    const p3 = [(1 - paddingRatio) * width, paddingRatio * height];
    const p4 = [(1 - paddingRatio) * width, (1 - paddingRatio) * height]; */
    let mapLines = null;

    if (coupleWellPath) {
      mapLines = coupleWellPath.map((e, i) => {
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
