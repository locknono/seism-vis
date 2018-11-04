import React, { Component } from "react";
import Button from "react-bootstrap/lib/Button";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import MatrixInfo from "./MatrixInfo";
import { Row, Col, ButtonGroup } from "react-bootstrap";
class MatrixControlPanel extends Component {
  render() {
    const {
      onSlide,
      onAutoShow,
      stopAutoShow,
      plane,
      depth,
      maxDepth,
      PlaneChooseButtonS
    } = this.props;
    return (
      <div className="matrix-control-panel panel panel-default">
        <Slider onChange={onSlide} min={0} max={maxDepth} value={depth} />
        <Row>
          <Col>
            <Button bsStyle="primary" onClick={onAutoShow}>
              自动展示
            </Button>
            <Button bsStyle="primary" onClick={stopAutoShow}>
              停止自动展示
            </Button>
          </Col>
        </Row>
        <ButtonGroup>{PlaneChooseButtonS}</ButtonGroup>
        <MatrixInfo plane={plane} depth={depth} />
      </div>
    );
  }
}

export default MatrixControlPanel;
