import * as d3 from "d3";

const wellMinDepth = 1082;
const wellMaxDepth = 1850;
const wellMatchSvgWidth = 300;
const wellMatchSvgHeight = 700;
const wellMatchSvgPaddingRatio = 0.1;

function getTraceMinMaxDepth() {
  let d0 = 3846;
  let beta = 0.2444;
  let minDepth = d0 * (Math.exp(beta * 0.002) - 1);
  let maxDepth = d0 * (Math.exp(beta * 6) - 1);
  return [minDepth, maxDepth];
}

const [traceMinDepth, traceMaxDepth] = getTraceMinMaxDepth();

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
  wellMatchDepthScale,
  traceMinDepth,
  traceMaxDepth
};

export default function globalVarReducer(state = initialState, action) {
  return state;
}
