import * as React from "react";
import { VertexType } from "src/ts/Type";
import { v4 } from "uuid";
import { vertexRadius, vertexFillOpacity } from "../constraint";

interface Props {
  vertex: VertexType | undefined;
  changeVertexPosition: any;
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
    const { vertex } = this.props;
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
            onClick={this.handleClick}
          />
        );
      });
    }
    return <React.Fragment>{drawVertex}</React.Fragment>;
  }
}

export default RecommendedVertex;
