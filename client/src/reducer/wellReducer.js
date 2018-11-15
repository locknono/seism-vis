import {
  GET_ALL_WELLS,
  GET_COUPLEWELL_PATH,
  GET_COUPLE_WELL,
  GET_COUPLE_WELL_LAYER,
  GET_FIG_URI
} from "../action/changeWell";

const initialState = {
  allWells: [],
  coupleWell: [],
  coupleWellLayer: [],
  coupleWellPath: null,
  figURI: ""
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
        coupleWell: [...action.coupleWell]
      };
    case GET_COUPLE_WELL_LAYER:
      return {
        ...state,
        coupleWellLayer: [...action.coupleWellLayer]
      };
    case GET_FIG_URI:
      return {
        ...state,
        figURI: action.figURI
      };
    default:
      return state;
  }
}
