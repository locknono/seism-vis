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
  }

  componentDidMount() {
    const { xStart, xEnd, yStart, yEnd } = this.props;
    console.log('xStart: ', xStart);
    setTimeout(
      function() {
        const figuerNode = this.figureRef.current;
        const { width, height, left, top } = figuerNode.getBoundingClientRect();
        this.props.changeSizePosition(width, height, left, top);
        console.log("width: ", width);
        console.log("xStart: ", xStart);
        const xScaler = d3
          .scaleLinear()
          .domain([xStart, xEnd])
          .range([0, width]);
        console.log(xScaler(100000));
        const yScaler = d3
          .scaleLinear()
          .domain([yStart, yEnd])
          .range([height, 0]);

        this.props.getScaler({ xScaler, yScaler });
      }.bind(this),
      0
    );
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
