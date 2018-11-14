import {
  CHANGE_PLANE,
  CHANGE_DEPTH,
  CHANGE_SIZE,
  GET_SCALER
} from "../action/changeFigPara";

const initialState = {
  planeName: "xy",
  depth: 300,
  figWidth: null,
  figHeight: null,
  figLeft: null,
  figTop: null,
  scaler: null
};

export default function figReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PLANE:
      return {
        ...state,
        planeName: action.planeName
      };
    case CHANGE_DEPTH:
      return {
        ...state,
        depth: action.depth
      };
    case CHANGE_SIZE:
      return {
        ...state,
        figWidth: action.width,
        figHeight: action.height,
        figLeft: action.left,
        figTop: action.top
      };
    case GET_SCALER:
      return {
        ...state,
        scaler: action.scaler
      };
    default:
      return state;
  }
}
