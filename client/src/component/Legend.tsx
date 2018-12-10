import * as React from "react";
import * as d3 from "d3";
import { v4 } from "uuid";
const Legend = () => {
  const xStart = 20;
  const yStart = 8;
  const pad = 25;
  const yPad = 20;
  const peaks = [];
  for (let i = 0; i < 3; i++) {
    const path = d3.path();
    const x = xStart - 2.5;
    path.moveTo(x + i * pad, yStart);
    path.quadraticCurveTo(
      x + (i + 1) * pad,
      (yStart + yStart + yPad) / 2,
      x + i * pad,
      yStart + yPad
    );
    path.lineTo(x + i * pad, yStart);
    peaks.push(
      <path key={v4()} d={path.toString()} style={{ fill: `black` }} />
    );
  }
  const track = (
    <line
      x1={xStart - 10}
      y1={(yStart + yStart + yPad) / 2}
      x2={xStart + 3 * pad - 10}
      y2={(yStart + yStart + yPad) / 2}
      style={{ stroke: "black", strokeWidth: 2 }}
    />
  );
  const match = (
    <rect
      x={xStart - 10}
      y={yStart + yPad + 15}
      width={3 * pad}
      height={20}
      style={{ fill: "grey" }}
    />
  );
  return (
    <div className="match-legend-div panel panel-default">
      <svg style={{ width: `55%`, height: `100%`, display: "inline-block" }}>
        {peaks}
        {track}
        {match}
      </svg>
      <div className="legend-text" style={{ position: `absolute` }}>
        seismic
        <br />
        horizon
      </div>
      <div
        className="legend-text"
        style={{ position: `absolute`, top: `35px` }}
      >
        stratigraphic <br />
        horizon
      </div>
    </div>
  );
};

export default Legend;
