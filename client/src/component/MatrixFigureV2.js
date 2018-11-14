import React, { Component } from "react";
import { connect } from "react-redux";
import { changePlane, changeDepth, changeSize } from "../action/changeFigPara";
import SvgLayer from "./SvgLayer";


const mapStateToProps = (state, ownProps) => {
  const { planeName, depth, figWidth, figHeight } = state;
  return { planeName, depth, figWidth, figHeight };
};

const mapDispatchToProps = {
  changePlane,
  changeDepth,
  changeSize
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
        const { width, height } = figuerNode.getBoundingClientRect();
        this.props.changeSize(width, height);
      }.bind(this),
      0
    );
  }

  render() {
    const { planeName, depth, figWidth, figHeight } = this.props;
    let style = {};
    if (figWidth && figHeight) {
      style = { width: figWidth, height: figHeight };
    }
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
