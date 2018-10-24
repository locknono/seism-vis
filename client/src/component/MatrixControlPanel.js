import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import MatrixInfo from "./MatrixInfo";

class MatrixControlPanel extends Component {
  render() {
    const {
      onSlide,
      onAutoShow,
      stopAutoShow,
      plane,
      depth,
      maxDepth,
      PlaneChooseButtonS,
      height
    } = this.props;
    const style = { height };
    return (
      <div className="matrix-control-panel panel panel-default" style={style}>
        <Slider onChange={onSlide} min={0} max={maxDepth} value={depth} />
        <Button bsStyle="primary" onClick={onAutoShow}>
          自动展示
        </Button>
        <Button bsStyle="primary" onClick={stopAutoShow}>
          停止自动展示
        </Button>
        {PlaneChooseButtonS}
        <MatrixInfo plane={plane} depth={depth} />
      </div>
    );
  }
}

export default MatrixControlPanel;
