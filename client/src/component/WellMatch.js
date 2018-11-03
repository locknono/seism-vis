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
  svgPadding: number
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
      points: [[0, 0], [0, 0]]
    };
  }
  componentDidMount() {
    const { wellIDs } = this.props;
    fetch(`http://localhost:5000/wellMatch/${wellIDs[0]}_${wellIDs[1]}`)
      .then(res => res.json())
      .then(data => {
        console.log("data: ", data);
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
        let points = [];
        for (let i = 0; i < data[0].value.length; i++) {
          if (data[0].value[i].topDepth && data[1].value[i].topDepth) {
            let x1 = svgPadding * svgWidth;
            let y1 = scale(data[0].value[i].topDepth);
            let x2 = svgWidth * (1 - svgPadding);
            let y2 = scale(data[1].value[i].bottomDepth);
            points.push([[x1, y1], [x2, y2]]);
          }
        }
        this.setState({ points });
      });
    let svg = d3.select(".well-match-svg");
    let svgWidth = parseFloat(svg.style("width").split("px")[0]);
    let svgHeight = parseFloat(svg.style("height").split("px")[0]);
    this.setState({ svgWidth, svgHeight });
  }
  render() {
    const {
      svgWidth,
      svgHeight,
      svgPadding,
      points,
      minDepth,
      maxDepth
    } = this.state;
    console.log("points: ", points);
    const p1 = [svgPadding * svgWidth, svgPadding * svgHeight];
    const p2 = [svgPadding * svgWidth, (1 - svgPadding) * svgHeight];
    const p3 = [(1 - svgPadding) * svgWidth, svgPadding * svgHeight];
    const p4 = [(1 - svgPadding) * svgWidth, (1 - svgPadding) * svgHeight];
    const axisHeight = svgHeight * (1 - 2 * svgPadding);
    const mapLines = points.map((e, i) => {
      return (
        <line
          key={i}
          x1={e[0][0]}
          y1={e[0][1]}
          x2={e[1][0]}
          y2={e[1][1]}
          className="well-match-axis"
        />
      );
    });
    return (
      <div className="panel panel-default">
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
