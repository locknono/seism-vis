import React from "react";
export const matrixContextDefaultValue = {
  u1: 652500,
  u2: 4190300.16,
  u3: 660200,
  u4: 4198300.16,
  colCount: 309,
  rowCount: 321,
  zDepth: 3000
};
export const matrixContext = React.createContext(matrixContextDefaultValue);
