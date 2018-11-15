export const GET_ALL_WELLS = "GET_ALL_WELLS";
export const GET_COUPLEWELL_PATH = "GET_COUPLEWELL_PATHF";
export const GET_COUPLE_WELL = "GET_COUPLE_WELL";
export const GET_COUPLE_WELL_LAYER = "GET_COUPLE_WELL_LAYER";

export function getAllWells(allWells) {
  return {
    type: GET_ALL_WELLS,
    allWells
  };
}

export function getCoupleWellPath(path) {
  return {
    type: GET_COUPLEWELL_PATH,
    coupleWellPath: path
  };
}

export function getCoupleWell(coupleWell) {
  return {
    type: GET_COUPLE_WELL,
    coupleWell
  };
}

export function getCoupleWellLayer(coupleWellLayer) {
  return {
    type: GET_COUPLE_WELL_LAYER,
    coupleWellLayer
  };
}
