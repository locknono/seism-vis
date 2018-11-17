/*Since i imported redux and stored all state in redux-store
this file is useless now*/
import * as React from "react";

interface MatrixContextDefaultValue {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  xySection: number;
  colCount: number;
  rowCount: number;
  zDepth: number;
}
export const matrixContextDefaultValue: MatrixContextDefaultValue = {
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
