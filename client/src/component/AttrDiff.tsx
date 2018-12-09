import * as React from "react";
import { ViewHeading } from "./ViewHeading";
import { AllDiff, CurSelectedIndex } from "src/ts/Type";
import * as d3 from "d3";
import { v4 } from "uuid";
import {
  matchViewWidth,
  rectColor,
  brighterMatchColor,
  matchColor
} from "../constraint";
interface Props {
  allDiff: AllDiff;
  curSelectedIndex: CurSelectedIndex;
  getCurIndex: any;
}

const svgWidth = matchViewWidth,
  svgHeight = 200,
  leftPaddingRatio = 0.1,
  topPaddingRatio = 0.1;
const drawSvgWidth = svgWidth * (1 - 2 * leftPaddingRatio);
const drawSvgHeight = svgHeight * (1 - 2 * topPaddingRatio);
const horizontalPad = drawSvgWidth / 5;
const topPadding = topPaddingRatio * svgHeight;

export default function AttrDiff(props: Props) {
  const { allDiff, curSelectedIndex, getCurIndex } = props;
  let rects;
  let baseLine;
  if (allDiff) {
    const verticalPad = drawSvgHeight / allDiff.length;
    const barHeight = verticalPad * 0.8;
    const normalizedAllDiff = normalize(allDiff);
    const scales = getWidthScales(normalizedAllDiff) as d3.ScaleLinear<
      number,
      number
    >[];
    baseLine = getBaseLine(
      verticalPad,
      allDiff.length,
      curSelectedIndex,
      getCurIndex
    );
    if (normalizedAllDiff)
      rects = normalizedAllDiff.map((e, i) => {
        const y = topPadding + verticalPad * 0.1 + verticalPad * i;
        return e.map((v, j) => {
          const width = scales[j](v);
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
    <div className="attr-diff-div panel panel-primary">
      <ViewHeading height={22} title="untitled" />
      <svg
        style={{ width: svgWidth, height: svgHeight }}
        className="attr-diff-svg"
      >
        {baseLine}
        {rects}
      </svg>
    </div>
  );
}

function getWidthScales(allDiff: AllDiff) {
  if (!allDiff) return;
  const [minList, maxList] = getMinMaxList(allDiff);
  const scales = minList.map((e, i: number) => {
    return d3
      .scaleLinear()
      .domain([minList[i], maxList[i]])
      .range([0.1 * horizontalPad, horizontalPad * 0.9]);
  });
  return scales;
}

function normalize(allDiff: AllDiff): AllDiff {
  if (!allDiff) return;
  const [minList, maxList] = getMinMaxList(allDiff);
  const scales = minList.map((e, i: number) => {
    return d3
      .scaleLinear()
      .domain([minList[i], maxList[i]])
      .range([0, 1]);
  });
  const normalizedAllDiff = allDiff.map((e, i) => {
    return e.map((v, j) => {
      return scales[j](v);
    });
  });
  return normalizedAllDiff as AllDiff;
}

function getMinMaxList(allDiff: AllDiff) {
  if (!allDiff) return;
  const minList = Array(5).fill(Number.MAX_SAFE_INTEGER);
  const maxList = Array(5).fill(Number.MIN_SAFE_INTEGER);
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
  return [minList, maxList];
}
function getBaseLine(
  verticalPad: number,
  diffCount: number,
  curSelectedIndex: CurSelectedIndex,
  getCurIndex: any
) {
  const lines = [];
  for (let i = 0; i < diffCount; i++) {
    const style = {
      stroke: brighterMatchColor,
      fill: "none",
      strokeWidth: 0.5,
      fillOpacity: 0.5
    };
    if (i === curSelectedIndex) style.fill = brighterMatchColor;
    const path = d3.path();
    path.moveTo(0, topPadding + verticalPad * i);
    path.lineTo(svgWidth, topPadding + verticalPad * i);
    path.lineTo(svgWidth, topPadding + verticalPad * (i + 1));
    path.lineTo(0, topPadding + verticalPad * (i + 1));
    lines.push(
      <path
        className="diff-baseline"
        key={i}
        d={path.toString()}
        style={style}
        onMouseEnter={function() {
          getCurIndex(i);
        }}
        onMouseLeave={function() {
          getCurIndex(undefined);
        }}
      />
    );
  }
  return lines;
}
