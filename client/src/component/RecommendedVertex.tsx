import * as React from "react";
import { VertexType } from "src/ts/Type";
import { v4 } from "uuid";
import { vertexRadius, vertexFillOpacity } from "../constraint";

interface Props {
  vertex: VertexType | undefined;
}

function RecommendedVertex(props: Props) {
  const { vertex } = props;
  let drawVertex = null;
  if (vertex) {
    drawVertex = vertex.map(e => {
      return (
        <circle
          key={v4()}
          cx={e[0]}
          cy={e[1]}
          r={vertexRadius}
          style={{
            fill: "red",
            stroke: "red",
            fillOpacity: vertexFillOpacity
          }}
        />
      );
    });
  }
  return <React.Fragment>{drawVertex}</React.Fragment>;
}

export default RecommendedVertex;
