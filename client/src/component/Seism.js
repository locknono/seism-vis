import * as React from "react";
import Map from "./Map";
import Matrix from "./Matrix";

const Seism = function(props) {
  return (
    <React.Fragment>
      <Map />
      <Matrix />
    </React.Fragment>
  );
};

export default Seism;
