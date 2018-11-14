import React, { Component } from "react";
import Map from "./Map";
import MatrixFigureV2 from "./MatrixFigureV2";
class Seism extends Component {
  constructor(props) {
    super(props);
    this.state = { wellIDs: ["GD1-2X815", "GD1-6-611"] };
    this.getWellIDs = this.getWellIDs.bind(this);
  }
  getWellIDs(wellIDs) {
    this.setState({ wellIDs });
  }
  render() {
    return (
      <React.Fragment>
        <Map />
        <MatrixFigureV2 />
      </React.Fragment>
    );
  }
}

export default Seism;
