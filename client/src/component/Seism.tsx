import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
import ControlPanel from "./ControlPanel";
const Seism = function() {
  return (
    <React.Fragment>
      <div className="seism">
        <Map />
        <WellMatch />
      </div>
      <ControlPanel />
    </React.Fragment>
  );
};

export default Seism;
