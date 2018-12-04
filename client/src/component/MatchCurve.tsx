import * as React from "react";
import * as d3 from "d3";
import Vertex from "./Vertex";
import { List } from "immutable";
import { MatchCurvePath, VertexType } from "../ts/MatchCurveTs";
export function extractVertexIndex(path: MatchCurvePath): number[] {
  console.log("path: ", path);
  return [
    0,
    path.length - 2,
    Math.floor(path.length / 2) - 1,
    Math.floor(path.length / 2)
  ];
}
export function extractVertex(path: MatchCurvePath): VertexType {
  const matchVertex: any = [];
  const vertexIndex = extractVertexIndex(path);
  for (let index of vertexIndex) matchVertex.push(path[index]);
  return matchVertex;
}

interface Props {
  path: MatchCurvePath;
  index: number;
  changeCurvePath: any;
}
interface State {
  pathGen: any;
  vertex: [number, number][] | null;
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
    this.changeVertexPosition = this.changeVertexPosition.bind(this);
  }

  componentDidMount() {}
  handleClick() {
    const { path } = this.props;
    const vertex = extractVertex(path);
    this.setState({ vertex });
  }

  changeVertexPosition(newVertex: VertexType) {
    const { changeCurvePath, index, path } = this.props;
    this.setState({ vertex: newVertex });
    const newPath = List(path);
    const vertexIndex = extractVertexIndex(path);
    for (let i = 0; i < vertexIndex.length; i++)
      newPath[vertexIndex[i]] = [...newVertex[i]];
    changeCurvePath(newPath.toJS(), index);
  }

  render() {
    const { path } = this.props;
    const { pathGen, vertex } = this.state;
    const style = { fill: "grey", stroke: "none", fillOpacity: 0.8 };
    const drawVertex =
      vertex !== null ? (
        <Vertex
          vertex={vertex}
          changeVertexPosition={this.changeVertexPosition}
        />
      ) : null;
    return (
      <React.Fragment>
        <path
          d={pathGen(path)}
          style={style}
          className="well-match-axis"
          onClick={this.handleClick}
        />
        {drawVertex}
      </React.Fragment>
    );
  }
}

export default MatchCurve;
