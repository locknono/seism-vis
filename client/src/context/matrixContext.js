import React from "react";
export const matrixContextDefaultValue = {
  xStart: 20652500,
  yStart: 4190300.16,
  xEnd: 20660500,
  yEnd: 4198000.16,
  xySection: 25,
  colCount: 309,
  rowCount: 321,
  zDepth: 3000
};
export const matrixContext = React.createContext(matrixContextDefaultValue);
