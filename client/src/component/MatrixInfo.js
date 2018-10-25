import React from "react";
const MatrixInfo = ({ plane, depth }) => {
  return (
    <div>
      <span>{`当前平面:  ${plane}`}</span>
      <br />
      <span>{`当前深度:  ${depth}`}</span>
    </div>
  );
};
export default MatrixInfo;
