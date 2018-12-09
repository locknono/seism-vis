import Vertex from "src/component/Vertex";

type Point = [number, number];

/** An array contains Four point */
export type VertexType = [Point, Point, Point, Point];

/** Array of vertex */
export type AllVertices = VertexType[];

export type MatchCurvePath = Point[];

export type AllMatchCurve = MatchCurvePath[];

export type MatrixData = number[][];

export type Path = Point[];

export interface Peak {
  top: number;
  bottom: number;
  mid: number;
  highestX: number;
  highestY: number;
  value: number;
  positiveFlag: boolean;
  x: number;
}

export type AllPeaks = Peak[];

export type Track = Peak[];

export type AllTracks = Track[];

export interface Well {
  id: string;
  latlng: [number, number];
  x: number;
  xOnMatrix: number;
  y: number;
  yOnMatrix: number;
  index: number;
}

export type AllWells = Well[];

export type CoupleWell = [string, string];

export interface SingleWellAttrData {
  id: string;
  value: [number, number, number, number, number, number][];
}

export type WellAttrData = [SingleWellAttrData, SingleWellAttrData];

export type OneLayerDiff = [number, number, number, number, number];

export type AllDiff = OneLayerDiff[] | undefined;

export type CurSelectedIndex = null | undefined | number;

export interface Record {
  diff: OneLayerDiff;
  diffSum: number;
  vertex: VertexType;
}

export type AllRecords = Record[];
