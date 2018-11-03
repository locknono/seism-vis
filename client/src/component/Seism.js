import React, { Component } from "react";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
class Seism extends Component {
  render() {
    return (
      <React.Fragment>
        <Matrix />
        <WellMatch wellIDs={["GD1-2X815", "GD1-6-611"]} />
      </React.Fragment>
    );
  }
}

export default Seism;
