import { GET_ALL_WELLS } from "../action/changeWell";
import { GET_COUPLEWELL_PATH } from "../action/changeWell";
import { GET_COUPLE_WELL } from "../action/changeWell";

const initialState = {
  allWells: [],
  coupleWell: ["GD1-2X815", "GD1-6-611"],
  coupleWellPath: null
};

export default function wellReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_WELLS:
      return { ...state, allWells: action.allWells };
      break;
    case GET_COUPLEWELL_PATH:
      return {
        ...state,
        coupleWellPath: action.coupleWellPath
      };
    case GET_COUPLE_WELL:
      return {
        ...state,
        coupleWell: action.coupleWell
      };
    default:
      return state;
  }
}
