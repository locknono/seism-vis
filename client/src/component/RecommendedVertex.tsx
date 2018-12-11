import * as React from "react";
import { VertexType } from "src/ts/Type";
import { v4 } from "uuid";
import {
  vertexRadius,
  vertexFillOpacity,
  darkerMatchColor,
  recommendedRectColor,
  recommendedOpacity
} from "../constraint";
import * as d3 from "d3";
interface Props {
  vertex: VertexType | undefined;
  changeVertexPosition: any;
  originalVertex: VertexType;
}

class RecommendedVertex extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { vertex, changeVertexPosition } = this.props;
    changeVertexPosition(vertex);
  }
  render() {
    const { vertex, originalVertex } = this.props;
    let drawVertex = null;
    let recommendRect = null;
    let recommendBaseLine = null;
    if (vertex) {
      drawVertex = vertex.map((e, i) => {
        if (e[0] === originalVertex[i][0] && e[1] === originalVertex[i][1]) {
          return null;
        }
        return (
          <circle
            key={v4()}
            cx={e[0]}
            cy={e[1]}
            r={vertexRadius}
            style={{
              fill: "red",
              stroke: "red",
              fillOpacity: recommendedOpacity
            }}
            onClick={this.handleClick}
          />
        );
      });
      const path = d3.path();
      path.moveTo(vertex[0][0], vertex[0][1]);
      path.lineTo(vertex[1][0], vertex[1][1]);
      path.lineTo(vertex[3][0], vertex[3][1]);
      path.lineTo(vertex[2][0], vertex[2][1]);
      path.lineTo(vertex[0][0], vertex[0][1]);
      recommendRect = (
        <path
          d={path.toString()}
          style={{
            stroke: darkerMatchColor,
            fill: recommendedRectColor,
            fillOpacity: recommendedOpacity
          }}
        />
      );
      recommendBaseLine = getBaseLine(vertex);
    }

    return (
      <React.Fragment>
        {recommendRect} {drawVertex}
        {recommendBaseLine}
      </React.Fragment>
    );
  }
}

export default RecommendedVertex;

function getBaseLine(vertex: VertexType) {
  let baseLineStyle = {
    stroke: darkerMatchColor,
    fill: recommendedRectColor,
    fillOpacity: recommendedOpacity
  };

  const lPath = d3.path();
  lPath.moveTo(vertex[0][0], vertex[0][1]);
  lPath.lineTo(0, vertex[0][1]);
  lPath.lineTo(0, vertex[1][1]);
  lPath.lineTo(vertex[0][0], vertex[1][1]);

  const rPath = d3.path();
  rPath.moveTo(vertex[2][0], vertex[2][1]);
  rPath.lineTo(700, vertex[2][1]);
  rPath.lineTo(700, vertex[3][1]);
  rPath.lineTo(vertex[3][0], vertex[3][1]);

  const leftPath = (
    <path d={lPath.toString()} key={lPath.toString()} style={baseLineStyle} />
  );
  const rightPath = (
    <path d={rPath.toString()} key={rPath.toString()} style={baseLineStyle} />
  );

  return [leftPath, rightPath];
}
