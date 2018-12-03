import * as React from "react";
import * as d3 from "d3";
import { DraggedElementBaseType } from "d3";
import { v4 } from "uuid";
interface Props {
  vertex: [number, number][];
  changeVertexPosition: any;
}
interface State {
  pathGen: any;
}
interface Vertex {
  coords: { x?: number; y?: number };
  vertexRef: any;
}
class Vertex extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1])
    };
    this.vertexRef = this.props.vertex.map(e => {
      return React.createRef();
    });
  }

  componentDidMount() {
    const { vertex, changeVertexPosition } = this.props;
    const vertexNodes: any = [];
    for (let i = 0; i < this.vertexRef.length; i++) {
      vertexNodes.push(this.vertexRef[i].current);
    }
    const d3Nodes: any = d3.selectAll(vertexNodes);
    d3Nodes.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
    function dragstarted() {}

    //Set type annotation of `this` explicitly
    //to be compatible with typescript
    function dragged(this: SVGCircleElement) {
      d3.select(this).attr("cy", d3.event.y);
      const index = d3.select(this).attr("data-index");
      const newVertex = JSON.parse(JSON.stringify(vertex));
      newVertex[index][1] = d3.event.y;
      changeVertexPosition(newVertex);
    }

    function dragended() {}
  }
  render() {
    const { vertex } = this.props;
    let vertexCircle = null;
    if (vertex) {
      const style = { stroke: "blue", fill: "none" };
      vertexCircle = vertex.map((e, i) => {
        return (
          <circle
            key={i}
            cx={e[0]}
            cy={e[1]}
            r={4}
            style={style}
            data-index={i}
            className="vertex"
            ref={this.vertexRef[i]}
          />
        );
      });
    }

    return <React.Fragment>{vertexCircle}</React.Fragment>;
  }
}

export default Vertex;
