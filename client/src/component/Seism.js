import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";

const Seism = function(props) {
  return (
    <div className="seism">
      <Map />
      <Matrix />
    </div>
  );
};

export default Seism;
