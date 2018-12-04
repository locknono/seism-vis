import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel/InfoPanel";
const Seism = function() {
  return (
    <React.Fragment>
      <div className="seism">
        <Map />
        <WellMatch />
      </div>
      <ControlPanel />
      <InfoPanel />
    </React.Fragment>
  );
};

export default Seism;
