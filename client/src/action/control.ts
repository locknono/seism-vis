export const CHANGE_FOCUS = "CHANGE_FOCUS";
export const CHANGE_WEIGHT = "CHANGE_WEIGHT";
export function changeFocus(focusFlag: boolean) {
  return {
    type: CHANGE_FOCUS,
    focusFlag
  };
}

export function changeWeight(weightList: number[]) {
  return {
    type: CHANGE_WEIGHT,
    weightList
  };
}
