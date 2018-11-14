import React, { Component } from "react";
import { connect } from "react-redux";
import { changePlane, changeDepth } from "../action/changeImgPara";

const mapStateToProps = (state, ownProps) => {
  const { planeName, depth } = state;
  return { planeName, depth };
};

const mapDispatchToProps = {
  changePlane,
  changeDepth
};

class MatrixFigureV2 extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.figureRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(
      function() {
        const figuerNode = this.figureRef.current;
        const { width, height } = figuerNode;
        const { top, left } = figuerNode.getBoundingClientRect();
      }.bind(this),
      0
    );
  }

  render() {
    const { planeName, depth } = this.props;

    return (
      <div className="matrix-figure panel panel-default">
        <img
          src={`./imgs/${planeName}/${depth}.png`}
          alt="matrix-figure"
          ref={this.figureRef}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatrixFigureV2);
