import * as d3 from "d3";

const wellMinDepth = 1082;
const wellMaxDepth = 1850;
const wellMatchSvgWidth = 300;
const wellMatchSvgHeight = 700;
const wellMatchSvgPaddingRatio = 0.1;

const wellMatchDepthScale = d3
  .scaleLinear()
  .domain([wellMinDepth, wellMaxDepth])
  .range([
    wellMatchSvgHeight * wellMatchSvgPaddingRatio,
    wellMatchSvgHeight * (1 - wellMatchSvgPaddingRatio)
  ]);

const initialState = {
  xStart: 20652500,
  yStart: 4190300.16,
  xEnd: 20660500,
  yEnd: 4198000.16,
  xySection: 25,
  colCount: 309,
  rowCount: 321,
  zDepth: 3000,
  wellMinDepth,
  wellMaxDepth,
  wellMatchSvgHeight,
  wellMatchSvgWidth,
  wellMatchSvgPaddingRatio,
  wellMatchDepthScale
};

export default function globalVarReducer(state = initialState, action) {
  return state;
}
