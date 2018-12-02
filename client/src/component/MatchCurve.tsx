import * as React from "react";
import * as d3 from "d3";
export function extractVertex(path: any): any {
  const matchVertex: any = [];
  matchVertex.push(
    path[0],
    path[path.length - 2],
    path[Math.floor(path.length / 2) - 1],
    path[Math.floor(path.length / 2)]
  );
  return matchVertex;
}
interface Props {
  path: [number, number][];
}
interface State {
  pathGen: any;
  vertex: [] | null;
}
class MatchCurve extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1]),
      vertex: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { path } = this.props;
    const vertex = extractVertex(path);
    this.setState({ vertex });
  }

  render() {
    const { path } = this.props;
    const { pathGen, vertex } = this.state;
    const style = { fill: "grey", stroke: "none", fillOpacity: 0.8 };
    let vertexCircle = null;
    if (vertex) {
      const style = { stroke: "blue", fill: "blue" };
      vertexCircle = vertex.map((e, i) => {
        return <circle key={i} cx={e[0]} cy={e[1]} r={2} style={style} />;
      });
    }

    return (
      <React.Fragment>
        <path
          d={pathGen(path)}
          style={style}
          className="well-match-axis"
          onClick={this.handleClick}
        />
        {vertexCircle}
      </React.Fragment>
    );
  }
}

export default MatchCurve;
