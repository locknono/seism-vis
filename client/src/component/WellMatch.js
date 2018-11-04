//@flow
import React, { Component } from "react";
import * as d3 from "d3";

type Props = {
  wellIDs: Array<String>
};

type State = {
  svgWidth: number,
  svgHeight: number,
  minDepth: number,
  maxDepth: number,
  svgPadding: number,
  colorScale: fn
};

class WellMatch extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      svgWidth: 0,
      svgHeight: 0,
      svgPadding: 0.1,
      minDepth: 1082,
      maxDepth: 1850,
      layerPath: [[0, 0], [0, 0]],
      colorScale: d3.scaleOrdinal(d3.schemeCategory10),
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
  }
  componentDidMount() {
    const { wellIDs } = this.props;
    let svg = d3.select(".well-match-svg");
    let svgWidth = parseFloat(svg.style("width").split("px")[0]);
    let svgHeight = parseFloat(svg.style("height").split("px")[0]);
    this.setState({ svgWidth, svgHeight });
    fetch(`http://localhost:5000/wellMatch/${wellIDs[0]}_${wellIDs[1]}`)
      .then(res => res.json())
      .then(data => {
        let {
          svgPadding,
          svgWidth,
          svgHeight,
          minDepth,
          maxDepth
        } = this.state;
        const scale = d3
          .scaleLinear()
          .domain([minDepth, maxDepth])
          .range([svgPadding * svgHeight, (1 - svgPadding) * svgHeight]);
        let layerPath = [];
        let x1 = svgPadding * svgWidth;
        let x2 = svgWidth * (1 - svgPadding);
        for (let i = 0; i < data[0].value.length; i++) {
          if (data[0].value[i].topDepth && data[1].value[i].topDepth) {
            let y1 = scale(data[0].value[i].topDepth);
            let y2 = scale(data[1].value[i].topDepth);
            let y3 = scale(data[0].value[i].bottomDepth);
            let y4 = scale(data[1].value[i].bottomDepth);
            let path = [[x1, y1], [x2, y2], [x2, y4], [x1, y3]];
            layerPath.push(path);
          }
        }
        this.setState({ layerPath, scale });
      });
  }
  componentDidUpdate(prevProps, prevState) {
    const { wellIDs } = this.props;
    if (wellIDs === prevProps.wellIDs) return;
    fetch(`http://localhost:5000/wellMatch/${wellIDs[0]}_${wellIDs[1]}`)
      .then(res => res.json())
      .then(data => {
        let { svgPadding, svgWidth, scale } = this.state;
        let layerPath = [];
        let x1 = svgPadding * svgWidth;
        let x2 = svgWidth * (1 - svgPadding);
        for (let i = 0; i < data[0].value.length; i++) {
          if (data[0].value[i].topDepth && data[1].value[i].topDepth) {
            let y1 = scale(data[0].value[i].topDepth);
            let y2 = scale(data[1].value[i].topDepth);
            let y3 = scale(data[0].value[i].bottomDepth);
            let y4 = scale(data[1].value[i].bottomDepth);
            let path = [[x1, y1], [x2, y2], [x2, y4], [x1, y3]];
            layerPath.push(path);
          }
        }
        this.setState({ layerPath, scale });
      });
  }
  render() {
    const { svgWidth, svgPadding, layerPath, colorScale, pathGen } = this.state;
    const p1 = [svgPadding * svgWidth, svgPadding * svgHeight];
    const p2 = [svgPadding * svgWidth, (1 - svgPadding) * svgHeight];
    const p3 = [(1 - svgPadding) * svgWidth, svgPadding * svgHeight];
    const p4 = [(1 - svgPadding) * svgWidth, (1 - svgPadding) * svgHeight];
    const mapLines = layerPath.map((e, i) => {
      let path = e;
      let pathD = pathGen(e);
      let style = { fill: colorScale(i), stroke: "none" };
      return (
        <path key={i} d={pathD} style={style} className="well-match-axis" />
      );
    });
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
      </div>
    );
  }
}

export default WellMatch;
