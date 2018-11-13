//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
function mapStateToProps(state, ownProps) {
  const { planeName, depth } = state;
  return { planeName, depth };
}

class MatrixFigureV2 extends Component {
  render() {
    const { planeName, depth } = this.props;
    return (
      <div className="matrix-figure panel panel-default">
        <img src={`./imgs/${planeName}/${depth}.png`} alt="matrix-figure" />
      </div>
    );
  }
}

export default connect(mapStateToProps)(MatrixFigureV2);
