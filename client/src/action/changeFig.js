export const CHANGE_PLANE = "CHANGE_PLANE";
export const CHANGE_DEPTH = "CHANGE_DEPTH";
export const CHANGE_SIZE = "CHANGE_SIZE";
export const GET_SCALER = "GET_SCALER";

export function changePlane(planeName) {
  return {
    type: CHANGE_PLANE,
    planeName
  };
}

export function changeDepth(depth) {
  return {
    type: CHANGE_DEPTH,
    depth
  };
}

export function changeSizePosition(width, height, left, top) {
  return {
    type: CHANGE_SIZE,
    width,
    height,
    left,
    top
  };
}

export function getScaler(scaler) {
  return {
    type: GET_SCALER,
    scaler
  };
}
