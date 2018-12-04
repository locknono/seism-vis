type Point = [number, number];

export type Vertices = [Point, Point, Point, Point];

export type AllVertices = Vertices[];

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
}

export type AllWells = Well[];

export type CoupleWell = [string, string];
