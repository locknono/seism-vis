import { CHANGE_FOCUS } from "../action/control";

const initialState = {
  focusFlag: false
};

export default function controlReducer(state = initialState, action: any) {
  switch (action.type) {
    case CHANGE_FOCUS:
      return { ...state, focusFlag: action.focusFlag };
      break;
    default:
      return state;
  }
}
