import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";
import WellMatch from "./WellMatch";
const Seism = function(props) {
  return (
    <div className="seism">
      <Map />
      <Matrix />
      <WellMatch />
    </div>
  );
};

export default Seism;
