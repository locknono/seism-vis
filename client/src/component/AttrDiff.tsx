import * as React from "react";
import { AllDiff } from "src/ts/Type";
import * as d3 from "d3";
import { v4 } from "uuid";
import { matchViewWidth, rectColor } from "../constraint";
interface Props {
  allDiff: AllDiff;
}

const svgWidth = matchViewWidth,
  svgHeight = 300,
  leftPaddingRatio = 0.1,
  topPaddingRatio = 0.1;
const drawSvgWidth = svgWidth * (1 - 2 * leftPaddingRatio);
const drawSvgHeight = svgHeight * (1 - 2 * topPaddingRatio);
const horizontalPad = drawSvgWidth / 5;

export function AttrDiff(props: Props) {
  const { allDiff } = props;
  let rects;
  if (allDiff) {
    const verticalPad = drawSvgHeight / allDiff.length;
    const barHeight = verticalPad * 0.8;
    const scales = getScales(allDiff) as d3.ScaleLinear<number, number>[];
    rects = allDiff.map((e, i) => {
      const y = drawSvgHeight * topPaddingRatio + verticalPad * i;
      return e.map((v, j) => {
        const width = scales[j](allDiff[i][j]);
        const x = svgWidth * leftPaddingRatio + j * horizontalPad;
        return (
          <rect
            key={v4()}
            x={x}
            y={y}
            width={width}
            height={barHeight}
            fill={rectColor}
            rx="2px"
          />
        );
      });
    });
  }
  return (
    <div className="attr-diff-div panel panel-default">
      <svg style={{ width: svgWidth, height: svgHeight }}>{rects}</svg>
    </div>
  );
}

function getScales(allDiff: AllDiff) {
  const minList = Array(5).fill(Number.MAX_SAFE_INTEGER);
  const maxList = Array(5).fill(Number.MIN_SAFE_INTEGER);
  if (!allDiff) return;
  for (let i = 0; i < allDiff.length; i++) {
    for (let j = 0; j < allDiff[i].length; j++) {
      if (allDiff[i][j] > maxList[j]) {
        maxList[j] = allDiff[i][j];
      }
      if (allDiff[i][j] < minList[j]) {
        minList[j] = allDiff[i][j];
      }
    }
  }
  const scales = minList.map((e, i: number) => {
    return d3
      .scaleLinear()
      .domain([minList[i], maxList[i]])
      .range([0.1 * horizontalPad, horizontalPad * 0.9]);
  });
  return scales;
}
