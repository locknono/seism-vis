export const CHANGE_PLANE = "CHANGE_PLANE";
export const CHANGE_DEPTH = "CHANGE_DEPTH";
export const CHANGE_SIZE = "CHANGE_SIZE";

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

export function changeSize(width, height) {
  return {
    type: CHANGE_SIZE,
    figWidth: width,
    figHeight: height
  };
}
