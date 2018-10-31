import React from "react";
export const matrixContextDefaultValue = {
  xStart: 652500,
  yStart: 4190300.16,
  xEnd: 660200,
  yEnd: 4198300.16,
  xySection: 25,
  colCount: 309,
  rowCount: 321,
  zDepth: 3000
};
export const matrixContext = React.createContext(matrixContextDefaultValue);
