import * as d3 from "d3";
import {
  CHANGE_SVG_SIZE,
  CHANGE_SVG_SCALE
} from "../action/changeWellMatchSvg";
/* const wellMinDepth = 1082;
const wellMaxDepth = 1850; */
const wellMinDepth = 1.8804;
const wellMaxDepth = 2001.0382;
const wellMatchSvgWidth = 300;
const wellMatchSvgHeight = 700;
const wellMatchSvgPaddingRatio = 0;

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
  switch (action.type) {
    case CHANGE_SVG_SIZE:
      let wellMatchDepthScale = d3
        .scaleLinear()
        .domain([wellMinDepth, wellMaxDepth])
        .range([
          action.height * wellMatchSvgPaddingRatio,
          action.height * (1 - wellMatchSvgPaddingRatio)
        ]);
      return {
        ...state,
        wellMatchSvgWidth: action.width,
        wellMatchSvgHeight: action.height,
        wellMatchDepthScale
      };
    default:
      return state;
  }
}
