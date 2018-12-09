export const CHANGE_COLOR = "CHANGE_COLOR";

export function changeColor(color: string): object {
  return {
    type: CHANGE_COLOR,
    color
  };
}
