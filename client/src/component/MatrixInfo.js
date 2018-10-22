import React from "react";
const MatrixInfo = ({ plane, depth }) => {
  return (
    <div>
      <span>{`平面:${plane}`}</span>
      <br />
      <span>{`深度:${depth}`}</span>
    </div>
  );
};
export default MatrixInfo;
