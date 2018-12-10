export const CHANGE_FOCUS = "CHANGE_FOCUS";
export function changeFocus(focusFlag: boolean) {
  return {
    type: CHANGE_FOCUS,
    focusFlag
  };
}
