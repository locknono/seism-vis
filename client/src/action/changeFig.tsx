export const CHANGE_PLANE = "CHANGE_PLANE";
export const CHANGE_DEPTH = "CHANGE_DEPTH";
export const CHANGE_SIZE = "CHANGE_SIZE";
export const GET_SCALER = "GET_SCALER";

export function changePlane(planeName: string) {
  return {
    type: CHANGE_PLANE,
    planeName
  };
}

export function changeDepth(depth: number) {
  return {
    type: CHANGE_DEPTH,
    depth
  };
}

export function changeSizePosition(
  width: number,
  height: number,
  left: number,
  top: number
) {
  return {
    type: CHANGE_SIZE,
    width,
    height,
    left,
    top
  };
}

export function getScaler(scaler: any) {
  return {
    type: GET_SCALER,
    scaler
  };
}
