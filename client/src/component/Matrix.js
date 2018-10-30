import React, { Component } from "react";
import PlaneChooseButton from "./PlaneChooseButton";
import MatrixFigure from "./MatrixFigure";
import MatrixControlPanel from "./MatrixControlPanel";
import MatrixPolyLine from "./MatrixPolyLine";
import MatrixSelectedLine from "./MatrixSelectedLine";
import { ButtonToolbar, Row, Col } from "react-bootstrap";
import Map from "./Map";
import { values } from "d3-collection";
import {
  matrixContext,
  matrixContextDefaultValue
} from "../context/matrixContext";

class Matrix extends Component {
  constructor(props) {
    super(props);
    this.state = { plane: "xy", depth: 0, maxDepth: 2902, zData: [] };
    this.onSlide = this.onSlide.bind(this);
    this.onAutoShow = this.onAutoShow.bind(this);
    this.stopAutoShow = this.stopAutoShow.bind(this);
    this.onChangePlane = this.onChangePlane.bind(this);
    this.onClickChangeZData = this.onClickChangeZData.bind(this);
    this.onChangeImgURI = this.onChangeImgURI.bind(this);
    this.onGetFigureHeight = this.onGetFigureHeight.bind(this);
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
  onGetFigureHeight(height) {
    this.setState({ figureHeight: height });
  }
  onClickChangeZData(zData) {
    this.setState({ zData });
  }
  onChangeImgURI(imgURI) {
    this.setState({ imgURI });
  }
  render() {
    const { plane, depth, maxDepth, zData, imgURI, figureHeight } = this.state;
    const PlaneChooseButtonS = ["xy", "xz", "yz"].map(plane => (
      <PlaneChooseButton
        key={plane}
        plane={plane}
        onChangePlane={this.onChangePlane}
      />
    ));
    const controlPanelHeightPortion = 3 / 5;
    return (
      <matrixContext.Provider value={matrixContextDefaultValue}>
        <div className="matrix panel panel-default">
          <div className="matrix-sub-view-for-spliting-layout">
            <matrixContext.Consumer>
              {value => (
                <MatrixFigure
                  plane={plane}
                  depth={depth}
                  onClickChangeZData={this.onClickChangeZData}
                  onChangeImgURI={this.onChangeImgURI}
                  onGetFigureHeight={this.onGetFigureHeight}
                  rowCount={value.rowCount}
                  colCount={value.colCount}
                />
              )}
            </matrixContext.Consumer>
            <MatrixControlPanel
              onSlide={this.onSlide}
              onAutoShow={this.onAutoShow}
              stopAutoShow={this.stopAutoShow}
              plane={plane}
              depth={depth}
              maxDepth={maxDepth}
              PlaneChooseButtonS={PlaneChooseButtonS}
              height={figureHeight * controlPanelHeightPortion}
            />
            <MatrixSelectedLine
              imgURI={imgURI}
              height={figureHeight * (1 - controlPanelHeightPortion)}
            />
            <matrixContext.Consumer>
              {value => <Map uCoors={value} />}
            </matrixContext.Consumer>
          </div>
          <MatrixPolyLine
            zData={zData}
            width={1000}
            height={200}
            zDepth={matrixContextDefaultValue.zDepth}
          />
        </div>
      </matrixContext.Provider>
    );
  }
}

export default Matrix;
