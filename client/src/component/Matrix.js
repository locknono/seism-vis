import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import MatrixInfo from "./MatrixInfo";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import PlaneChooseButton from "./PlaneChooseButton";
class Matrix extends Component {
  constructor(props) {
    super(props);
    this.state = { plane: "xy", depth: 0, maxDepth: 2902 };
    this.onSlide = this.onSlide.bind(this);
    this.onAutoShow = this.onAutoShow.bind(this);
    this.stopAutoShow = this.stopAutoShow.bind(this);
    this.onChangePlane = this.onChangePlane.bind(this);
  }
  onSlide(value) {
    let plane = this.state.plane;
    this.setState({ depth: value, plane: plane });
  }
  onAutoShow() {
    let curDepth = this.state.depth;
    let plane = this.state.plane;
    let interval = setInterval(
      function() {
        this.setState({ depth: curDepth });
        curDepth += 1;
      }.bind(this),
      35
    );
    this.setState({ interval: interval, plane: plane });
  }
  stopAutoShow() {
    clearInterval(this.state.interval);
  }
  onChangePlane(plane) {
    let maxDepth = null;
    switch (plane) {
      case "xy":
        maxDepth = 2902;
        break;
      case "xz":
        maxDepth = 716;
        break;
      case "yz":
        maxDepth = 886;
        break;
      default:
        maxDepth = 2902;
        break;
    }
    this.setState({ plane: plane, depth: 0, maxDepth: maxDepth });
    this.stopAutoShow();
  }
  render() {
    const { plane, depth, maxDepth } = this.state;
    const PlaneChooseButtonS = ["xy", "xz", "yz"].map(plane => (
      <PlaneChooseButton plane={plane} onChangePlane={this.onChangePlane} />
    ));
    return (
      <div>
        <img src={`./imgs/${plane}/${depth}.png`} alt="Matrix" />
        <Slider onChange={this.onSlide} min={0} max={maxDepth} value={depth} />
        <Button bsStyle="primary" onClick={this.onAutoShow}>
          自动展示
        </Button>
        <Button bsStyle="primary" onClick={this.stopAutoShow}>
          停止自动展示
        </Button>
        {PlaneChooseButtonS}
        <MatrixInfo plane={plane} depth={depth} />
      </div>
    );
  }
}

export default Matrix;
