import React, { Component } from "react";
import { connect } from "react-redux";
import * as d3 from "d3";
import {
  changePlane,
  changeDepth,
  changeSizePosition,
  getScaler
} from "../action/changeFig";
import SvgLayer from "./SvgLayer";

const mapStateToProps = (state, ownProps) => {
  const { planeName, depth } = state.figReducer;
  const { xStart, yStart, xEnd, yEnd } = state.globalVarReducer;
  return { planeName, depth, xStart, yStart, xEnd, yEnd };
};

const mapDispatchToProps = {
  changePlane,
  changeDepth,
  changeSizePosition,
  getScaler
};

interface Props {
  planeName: string;
  depth: number;
  figWidth: number;
  figWidth: number;
}

interface State {}

class MatrixFigureV2 extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.figureRef = React.createRef();
    this.imgOnLoad = this.imgOnLoad.bind(this);
  }

  /*   componentDidMount() {
    const { xStart, xEnd, yStart, yEnd } = this.props;
    setTimeout(
      function() {
        const figuerNode = this.figureRef.current;
        const { width, height, left, top } = figuerNode.getBoundingClientRect();
        this.props.changeSizePosition(width, height, left, top);
        const xScaler = d3
          .scaleLinear()
          .domain([xStart, xEnd])
          .range([0, width]);
        const yScaler = d3
          .scaleLinear()
          .domain([yStart, yEnd])
          .range([height, 0]);
        this.props.getScaler({ xScaler, yScaler });
      }.bind(this),
      0
    );
  } */

  imgOnLoad() {
    const { xStart, xEnd, yStart, yEnd } = this.props;
    const figuerNode = this.figureRef.current;
    const { width, height, left, top } = figuerNode.getBoundingClientRect();
    this.props.changeSizePosition(width, height, left, top);
    const xScaler = d3
      .scaleLinear()
      .domain([xStart, xEnd])
      .range([0, width]);
    const yScaler = d3
      .scaleLinear()
      .domain([yStart, yEnd])
      .range([height, 0]);
    this.props.getScaler({ xScaler, yScaler });
  }

  render() {
    const { planeName, depth } = this.props;
    let style = {};
    return (
      <div className="matrix-figure panel panel-default">
        <img
          src={`./imgs/${planeName}/${depth}.png`}
          alt="matrix-figure"
          ref={this.figureRef}
          onLoad={this.imgOnLoad}
          style={style}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatrixFigureV2);
