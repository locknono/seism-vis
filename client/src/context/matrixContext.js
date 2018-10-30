import React from "react";
export const matrixContextDefaultValue = {
  u1: 652500,
  u2: 4190300,
  u3: 660525,
  u4: 4198025,
  colCount: 886,
  rowCount: 716,
  zDepth: 2902
};
export const matrixContext = React.createContext(matrixContextDefaultValue);
