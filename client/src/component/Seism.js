import React, { Component } from "react";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import Wells from "./Wells";
import Map from "./Map";
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
        {/*   <Matrix /> */}
        {/*   <WellMatch wellIDs={this.state.wellIDs} />
        <Wells getWellIDs={this.getWellIDs} /> */}
      </React.Fragment>
    );
  }
}

export default Seism;
