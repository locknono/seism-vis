import React, { Component } from "react";
import * as d3 from "d3";
class MatrixPolyLine extends Component {
  constructor(props) {
    super(props);
    const { width, height } = this.props;
    let yScale = d3
      .scaleLinear()
      .domain([-15533.79296875, 16425.25390625])
      .range([0, height]);
    this.lineGen = d3
      .line()
      .x((d, i) => {
        return (width / 2902) * i;
      })
      .y(d => yScale(d));
  }

  getPolyPath(zData) {
    return this.lineGen(zData);
  }

  render() {
    const { width, height, zData } = this.props;
    const d = this.getPolyPath(zData);
    return (
      <div className="matrix-polyline panel panel-default">
        <svg width={width} height={height}>
          <path d={d} stroke="black" strokeWidth="1px" fill="none" />
        </svg>
      </div>
    );
  }
}

export default MatrixPolyLine;
