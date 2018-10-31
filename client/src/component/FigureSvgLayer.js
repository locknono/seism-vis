import React, { Component } from "react";

class FigureSvgLayer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      width,
      height,
      className,
      lineCoors,
      top,
      left,
      selectedWellYOnSvg,
      selectedWellXOnSvg,
      allWellXY
    } = this.props;
    const [x1, y1] = lineCoors[0];
    const [x2, y2] = lineCoors[1];
    const circles = allWellXY.map(e => (
      <circle cx={e[1]} cy={e[0]} r={1} fill="black" />
    ));
    return (
      <svg
        className={className}
        width={width}
        height={height}
        style={{ position: "absolute", top, left }}
        pointerEvents="none"
      >
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />
        <circle
          cx={selectedWellXOnSvg}
          cy={selectedWellYOnSvg}
          r={10}
          fill="black"
        />
        {circles}
      </svg>
    );
  }
}

export default FigureSvgLayer;
