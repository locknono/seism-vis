import { CHANGE_FOCUS, CHANGE_WEIGHT } from "../action/control";

const initialState = {
  focusFlag: false,
  weightList: [0.2, 0.2, 0.2, 0.2, 0.2]
};

export default function controlReducer(state = initialState, action: any) {
  switch (action.type) {
    case CHANGE_FOCUS:
      return { ...state, focusFlag: action.focusFlag };
      break;
    case CHANGE_WEIGHT:
      return { ...state, weightList: action.weightList };
      break;
    default:
      return state;
  }
}
