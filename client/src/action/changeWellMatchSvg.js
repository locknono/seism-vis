export const CHANGE_SVG_SIZE = "CHANGE_SVG_SIZE";
export const CHANGE_SVG_SCALE = "CHANGE_SVG_SCALE";
export function changeSvgSize(width, height) {
  return {
    type: CHANGE_SVG_SIZE,
    width,
    height
  };
}

export function changeSvgScale() {
  return {
    type: CHANGE_SVG_SCALE
  };
}
