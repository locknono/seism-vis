import * as React from "react";
import { ViewHeading } from "./ViewHeading";
import {
  AllDiff,
  CurSelectedIndex,
  AllRecords,
  VertexType,
  Direction
} from "src/ts/Type";
import * as d3 from "d3";
import { v4 } from "uuid";
import {
  matchViewWidth,
  rectColor,
  brighterMatchColor,
  matchColor,
  colorScale
} from "../constraint";
import { getRecVertex } from "../action/changeWell";
interface Props {
  allDiff: AllDiff;
  curSelectedIndex: CurSelectedIndex;
  getCurIndex: any;
  topRecords: AllRecords;
  getRecVertex: typeof getRecVertex;
  sameLayerFlags: boolean[];
}

const svgWidth = matchViewWidth,
  svgHeight = 178,
  leftPaddingRatio = 0.05,
  topPaddingRatio = 0.05;
const drawSvgWidth = (svgWidth * (1 - 2 * leftPaddingRatio)) / 2;
const drawSvgHeight = svgHeight * (1 - 2 * topPaddingRatio);
const horizontalPad = drawSvgWidth / 5;
const topPadding = topPaddingRatio * svgHeight;
const padBetweenTwoGraph = 20;
const directionRectLength = 10;

export default function AttrDiff(props: Props) {
  const {
    allDiff,
    curSelectedIndex,
    getCurIndex,
    topRecords,
    getRecVertex,
    sameLayerFlags
  } = props;
  let rects;
  let baseLine;
  let topRecordsDOM;
  let linkLine;
  let directionDOM;
  let topBaseLine;
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
      getCurIndex,
      svgWidth * leftPaddingRatio
    );
    if (normalizedAllDiff) {
      if (topRecords && curSelectedIndex) {
        const { rects, yList } = getTopRecordsDOM(
          topRecords,
          svgWidth / 2 + 30 + padBetweenTwoGraph,
          getRecVertex,
          allDiff
        );
        topRecordsDOM = rects;

        const directions = getLeftRightLegend(topRecords);
        directionDOM = getDerectionDOM(svgWidth / 2 + 20, yList, directions);
        topBaseLine = getTopBaseLine(
          svgWidth / 2 + 30 + padBetweenTwoGraph,
          topRecords,
          sameLayerFlags
        );
        linkLine = getLinkLine(
          curSelectedIndex,
          [
            svgWidth * leftPaddingRatio +
              normalizedAllDiff[0].length * horizontalPad,
            topPadding + verticalPad * curSelectedIndex + verticalPad / 2
          ],
          svgWidth / 2 + 20,
          yList
        );
      }
      rects = normalizedAllDiff.map((e, i) => {
        const y = topPadding + verticalPad * 0.1 + verticalPad * i;
        return e.map((v, j) => {
          const width = scales[j](v);
          const x =
            svgWidth * leftPaddingRatio +
            j * horizontalPad -
            padBetweenTwoGraph;
          return (
            <rect
              key={v4()}
              x={x}
              y={y}
              width={width}
              height={barHeight}
              fill={colorScale(j.toString())}
              rx="2px"
            />
          );
        });
      });
    }
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
        {topRecordsDOM}
        {linkLine}
        {directionDOM}
        {topBaseLine}
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
      .range([0.1 * horizontalPad, horizontalPad * 0.9])
      .clamp(true);
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
  getCurIndex: any,
  xStart: number
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
    path.moveTo(xStart - padBetweenTwoGraph, topPadding + verticalPad * i);
    path.lineTo(
      svgWidth / 2 - padBetweenTwoGraph,
      topPadding + verticalPad * i
    );
    path.lineTo(
      svgWidth / 2 - padBetweenTwoGraph,
      topPadding + verticalPad * (i + 1)
    );
    path.lineTo(
      xStart - padBetweenTwoGraph,
      topPadding + verticalPad * (i + 1)
    );
    path.lineTo(xStart - padBetweenTwoGraph, topPadding + verticalPad * i);
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
          /* getCurIndex(undefined); */
        }}
      />
    );
  }
  return lines;
}

function getTopRecordsDOM(
  topRecords: AllRecords,
  xStart: number,
  getRecVertex: any,
  allDiff: AllDiff
) {
  const horizontalPad = (drawSvgWidth - 20) / 5;
  const topPadding = topPaddingRatio * svgHeight;
  const verticalPad = drawSvgHeight / topRecords.length;
  const barHeight = verticalPad * 0.8;
  const scales = getTopScales(topRecords);
  const singleScale = getTopScale(topRecords);
  const leftScales = getWidthScales(allDiff);
  const rects = [];
  const yList = [];
  for (let i = 0; i < 5; i++) {
    let x = xStart + i * horizontalPad;
    for (let j = 0; j < topRecords.length; j++) {
      if (!leftScales) break;
      const width = leftScales[i](topRecords[j].diff[i]);
      const y = topPadding + verticalPad * 0.1 + verticalPad * j;
      yList.push(y + (verticalPad * 0.8) / 2);
      rects.push(
        <rect
          key={v4()}
          x={x}
          y={y}
          width={width}
          height={barHeight}
          fill={colorScale(i.toString())}
          rx="2px"
          onMouseEnter={function() {
            getRecVertex(topRecords[j].vertex);
          }}
        />
      );
    }
  }
  return { rects, yList };
}

function getTopScales(topRecords: AllRecords) {
  const scales = [];
  for (let i = 0; i < 5; i++) {
    let min = d3.min(topRecords, e => e.diff[i]);
    let max = d3.max(topRecords, e => e.diff[i]);
    let scale = d3
      .scaleLinear()
      .domain([min as number, max as number])
      .range([0.1 * horizontalPad, horizontalPad * 0.9]);
    scales.push(scale);
  }
  return scales;
}

function getTopScale(topRecords: AllRecords) {
  let min = d3.min(topRecords, e => d3.min(e.diff));
  let max = d3.max(topRecords, e => d3.max(e.diff));
  return d3
    .scaleLinear()
    .domain([min as number, max as number])
    .range([0.1 * horizontalPad, horizontalPad * 0.9]);
}

function getLinkLine(
  index: number,
  original: [number, number],
  x: number,
  yList: number[]
) {
  const paths = [];
  const style = {
    stroke: "B2B5FF",
    strokeWidth: 1.4,
    fill: "none"
  };
  for (let i = 0; i < yList.length; i++) {
    const path = d3.path();
    let p2 = [x, yList[i]];
    let [ox, oy] = original;
    ox = ox - padBetweenTwoGraph;
    let c = [(ox + x) / 2, oy];
    path.moveTo(ox, oy);
    path.quadraticCurveTo(c[0], c[1], p2[0], p2[1]);
    paths.push(<path d={path.toString()} key={i} style={style} />);
  }
  return paths;
}

function getLeftRightLegend(topRecords: AllRecords): Direction[] {
  const directions = [];
  for (let i = 0; i < topRecords.length; i++) {
    const mv = topRecords[i].matchVertex;
    const tv = topRecords[i].vertex;
    if (mv[0][1] === tv[0][1] && mv[1][1] === tv[1][1]) {
      directions.push(0);
    } else {
      directions.push(1);
    }
  }
  return directions as Direction[];
}

function getDerectionDOM(
  xStart: number,
  yList: number[],
  directions: Direction[]
) {
  const rects = [];
  const rectHeight = yList[1] - yList[0];
  const verticalPad = drawSvgHeight / directions.length;

  for (let i = 0; i < directions.length; i++) {
    rects.push(
      <rect
        key={i}
        x={directions[i] === 0 ? xStart : xStart + directionRectLength}
        y={yList[i] - (verticalPad * 0.8) / 2}
        width={directionRectLength}
        height={rectHeight}
        fill={directions[i] === 0 ? "grey" : "black"}
        rx="2px"
      />
    );
  }
  return rects;
}

function getTopBaseLine(
  xStart: number,
  topRecords: AllRecords,
  sameLayerFlags: boolean[]
) {
  const horizontalPad = (drawSvgWidth - 20) / 5;
  const topPadding = topPaddingRatio * svgHeight;
  const verticalPad = drawSvgHeight / topRecords.length;
  const barHeight = verticalPad * 0.8;
  const rects = [];
  for (let i = 0; i < topRecords.length; i++) {
    let style;
    if (sameLayerFlags[i]) {
      style = {
        /*   stroke: `black`,
        strokeDasharray: `1,10`, */
        stroke: brighterMatchColor,
        strokeWidth: 0.5,
        fill: brighterMatchColor,
        fillOpacity: 0.2
      };
    } else {
      style = { stroke: "none", fill: "none" };
    }
    rects.push(
      <rect
        key={v4()}
        x={xStart}
        y={topPadding + verticalPad * i}
        width={5 * horizontalPad}
        height={verticalPad}
        rx="2px"
        style={style}
        pointerEvents="none"
        onMouseEnter={function() {}}
      />
    );
  }
  return rects;
}
