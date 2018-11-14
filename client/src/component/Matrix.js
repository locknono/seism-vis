import * as React from "react";
import MatrixFigre from "./MatrixFigureV2";
import SvgLayer from "./SvgLayer";

class Matrix extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MatrixFigre />
        <SvgLayer />
      </React.Fragment>
    );
  }
}

export default Matrix;
