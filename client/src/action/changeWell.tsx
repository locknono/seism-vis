import { AllDiff, AllWells, CurSelectedIndex, AllRecords } from "src/ts/Type";

export const GET_ALL_WELLS = "GET_ALL_WELLS";
export const GET_COUPLEWELL_PATH = "GET_COUPLEWELL_PATHF";
export const GET_COUPLE_WELL = "GET_COUPLE_WELL";
export const GET_COUPLE_WELL_LAYER = "GET_COUPLE_WELL_LAYER";
export const GET_FIG_URI = "GET_FIG_URI";
export const GET_WELLID_NEARLINE = "GET_WELLID_NEARLINE";
export const GET_WELLIDNEARLINE_INDEX = "GET_WELLIDNEARLINE_INDEX";
export const GET_WELL_CURVE = "GET_WELL_CURVE";
export const GET_MATRIX_DATA = "GET_MATRIX_DATA";
export const GET_TRACE_PATH = "GET_TRACE_PATH";
export const GET_ALL_TRACK = "GET_ALL_TRACK";
export const GET_TRACK_VERTEX = "GET_TRACK_VERTEX";
export const GET_UC_PATH = "GET_UC_PATH";
export const GET_WELL_ATTR_DATA = "GET_WELL_ATTR_DATA";
export const GET_ATTR_DIFF = "GET_ATTR_DIFF";
export const GET_CUR_INDEX = "GET_CUR_INDEX";
export const GET_TOP_RECORDS = "GET_TOP_RECORDS";

export function getAllWells(allWells: AllWells) {
  return {
    type: GET_ALL_WELLS,
    allWells
  };
}

export function getCoupleWellPath(path: any) {
  return {
    type: GET_COUPLEWELL_PATH,
    coupleWellPath: path
  };
}

export function getCoupleWell(coupleWell: string[]) {
  return {
    type: GET_COUPLE_WELL,
    coupleWell
  };
}

export function getCoupleWellLayer(coupleWellLayer: any) {
  return {
    type: GET_COUPLE_WELL_LAYER,
    coupleWellLayer
  };
}

export function getFigURI(figURI: string) {
  return {
    type: GET_FIG_URI,
    figURI
  };
}

export function getWellIDNearLine(wellID: string[]) {
  return {
    type: GET_WELLID_NEARLINE,
    wellID
  };
}

export function getWellIDNearLineIndex(index: number[]) {
  return {
    type: GET_WELLIDNEARLINE_INDEX,
    index
  };
}

export function getWellCurve(paths: any) {
  return {
    type: GET_WELL_CURVE,
    wellCurve: paths
  };
}

export function getMatrixData(matrixData: any) {
  return {
    type: GET_MATRIX_DATA,
    matrixData
  };
}

export function getTracePath(paths: any) {
  return {
    type: GET_TRACE_PATH,
    paths
  };
}

export function getAllTrack(allTrack: any) {
  return {
    type: GET_ALL_TRACK,
    allTrack
  };
}

export function getTrackVertex(vertex: any) {
  return {
    type: GET_TRACK_VERTEX,
    vertex
  };
}

export function getUcPath(path: any) {
  return {
    type: GET_UC_PATH,
    path
  };
}

export function getWellAttrData(data: any) {
  return {
    type: GET_WELL_ATTR_DATA,
    wellAttrData: data
  };
}

export function getAttrDiff(allDiff: AllDiff) {
  return {
    type: GET_ATTR_DIFF,
    allDiff
  };
}

export function getCurIndex(index: CurSelectedIndex) {
  return {
    type: GET_CUR_INDEX,
    curSelectedIndex: index
  };
}

export function getTopRecords(topRecords: AllRecords) {
  return {
    type: GET_TOP_RECORDS,
    topRecords
  };
}
