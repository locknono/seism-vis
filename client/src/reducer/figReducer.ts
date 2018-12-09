import {
  CHANGE_PLANE,
  CHANGE_DEPTH,
  CHANGE_SIZE,
  GET_SCALER
} from "../action/changeFig";

interface FigState {
  planeName: string;
  depth: number;
  figWidth: number | null | undefined;
  figHeight: number | null | undefined;
  figLeft: number | null | undefined;
  figTop: number | null | undefined;
  scaler: any;
}
const initialState: FigState = {
  planeName: "xy",
  depth: 300,
  figWidth: null,
  figHeight: null,
  figLeft: null,
  figTop: null,
  scaler: null
};

export default function figReducer(
  state = initialState,
  action: any
): FigState {
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
