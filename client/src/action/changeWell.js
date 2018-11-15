export const GET_ALL_WELLS = "GET_ALL_WELLS";
export const GET_COUPLEWELL_PATH = "GET_COUPLEWELL_PATHF";

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
