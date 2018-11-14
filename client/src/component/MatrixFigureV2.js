import React, { Component } from "react";
import { connect } from "react-redux";
import {
  changePlane,
  changeDepth,
  changeSizePosition
} from "../action/changeFigPara";
import SvgLayer from "./SvgLayer";

const mapStateToProps = (state, ownProps) => {
  const { planeName, depth } = state;
  return { planeName, depth };
};

const mapDispatchToProps = {
  changePlane,
  changeDepth,
  changeSizePosition
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
    setTimeout(
      function() {
        const figuerNode = this.figureRef.current;
        const { width, height, left, top } = figuerNode.getBoundingClientRect();
        this.props.changeSizePosition(width, height, left, top);
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
