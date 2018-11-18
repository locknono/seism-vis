export const GET_ALL_WELLS = "GET_ALL_WELLS";
export const GET_COUPLEWELL_PATH = "GET_COUPLEWELL_PATHF";
export const GET_COUPLE_WELL = "GET_COUPLE_WELL";
export const GET_COUPLE_WELL_LAYER = "GET_COUPLE_WELL_LAYER";
export const GET_FIG_URI = "GET_FIG_URI";
export const GET_WELLID_NEARLINE = "GET_WELLID_NEARLINE";
export const GET_WELLIDNEARLINE_INDEX = "GET_WELLIDNEARLINE_INDEX";

export function getAllWells(allWells: any) {
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
