export const CHANGE_PLANE = "CHANGE_PLANE";
export const CHANGE_DEPTH = "CHANGE_DEPTH";

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
