import * as React from "react";
import * as d3 from "d3";
import Vertex from "./Vertex";
import { List } from "immutable";
import { MatchCurvePath, VertexType, CurSelectedIndex } from "../ts/Type";
import {
  matchColor,
  darkerMatchColor,
  brighterMatchColor,
  vertexRadius,
  vertexFillOpacity
} from "../constraint";
import { v4 } from "uuid";
import RecommendedVertex from "./RecommendedVertex";
export function extractVertexIndex(path: MatchCurvePath): number[] {
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
  curSelectedIndex: CurSelectedIndex;
  getCurIndex: any;
  getRecommended: any;
  recommendedVertex: VertexType | undefined;
}
interface State {
  pathGen: any;
  vertex: VertexType | null;
  showRecommendedVertex: boolean;
}

class MatchCurve extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pathGen: d3
        .line()
        .x(d => d[0])
        .y(d => d[1]),
      vertex: null,
      showRecommendedVertex: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.changeVertexPosition = this.changeVertexPosition.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {}
  handleClick() {
    const { path, getRecommended, index, getCurIndex } = this.props;
    console.log("index: ", index);

    const vertex = extractVertex(path);
    this.setState({ vertex, showRecommendedVertex: true });

    getCurIndex(index);
    getRecommended(index);
  }

  handleMouseEnter() {
    /* const { index, getCurIndex, path, getRecommended } = this.props;
    getCurIndex(index); */
  }

  handleMouseLeave() {
    const { index, getCurIndex } = this.props;
    //getCurIndex(undefined);
  }

  changeVertexPosition(newVertex: VertexType) {
    const { vertex } = this.state;
    const { changeCurvePath, index, path } = this.props;

    this.setState({ vertex: newVertex });
    const newPath = JSON.parse(JSON.stringify(path));
    const vertexIndex = extractVertexIndex(path);
    for (let i = 0; i < vertexIndex.length; i++)
      newPath[vertexIndex[i]] = JSON.parse(JSON.stringify(newVertex[i]));
    changeCurvePath(newPath, index);
  }

  render() {
    const { path, curSelectedIndex, index, recommendedVertex } = this.props;
    const { pathGen, vertex, showRecommendedVertex } = this.state;
    const VertexOnPath = extractVertex(path);
    const style = {
      fill: matchColor,
      fillOpacity: 0.8,
      stroke: "none"
    };
    if (index === curSelectedIndex) {
      style.fill = darkerMatchColor;
    }
    const drawVertex =
      vertex !== null && index === curSelectedIndex ? (
        <Vertex
          vertex={vertex}
          changeVertexPosition={this.changeVertexPosition}
        />
      ) : null;
    const baseLine = getBaseLine(VertexOnPath, curSelectedIndex, index);
    return (
      <React.Fragment>
        <path
          d={pathGen(path)}
          style={style}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        {drawVertex}
        {baseLine}
        {showRecommendedVertex ? (
          <RecommendedVertex
            originalVertex={VertexOnPath}
            vertex={recommendedVertex}
            changeVertexPosition={this.changeVertexPosition}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default MatchCurve;

function getBaseLine(
  VertexOnPath: VertexType,
  curSelectedIndex: CurSelectedIndex,
  index: number
) {
  let baseLineStyle = {
    stroke: matchColor,
    strokeOpacity: 0.8,
    strokeWidth: 0.8,
    fill: "none",
    fillOpacity: 0.5
  };

  if (index === curSelectedIndex) {
    baseLineStyle.fill = brighterMatchColor;
  }

  const lPath = d3.path();
  lPath.moveTo(VertexOnPath[0][0], VertexOnPath[0][1]);
  lPath.lineTo(0, VertexOnPath[0][1]);
  lPath.lineTo(0, VertexOnPath[1][1]);
  lPath.lineTo(VertexOnPath[0][0], VertexOnPath[1][1]);

  const rPath = d3.path();
  rPath.moveTo(VertexOnPath[2][0], VertexOnPath[2][1]);
  rPath.lineTo(700, VertexOnPath[2][1]);
  rPath.lineTo(700, VertexOnPath[3][1]);
  rPath.lineTo(VertexOnPath[3][0], VertexOnPath[3][1]);

  const leftPath = (
    <path d={lPath.toString()} key={lPath.toString()} style={baseLineStyle} />
  );
  const rightPath = (
    <path d={rPath.toString()} key={rPath.toString()} style={baseLineStyle} />
  );

  return [leftPath, rightPath];
}
