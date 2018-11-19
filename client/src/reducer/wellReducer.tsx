import {
  GET_ALL_WELLS,
  GET_COUPLEWELL_PATH,
  GET_COUPLE_WELL,
  GET_COUPLE_WELL_LAYER,
  GET_FIG_URI,
  GET_WELLID_NEARLINE,
  GET_WELLIDNEARLINE_INDEX,
  GET_WELL_CURVE,
  GET_MATRIX_DATA
} from "../action/changeWell";

interface WellState {
  allWells: object[];
  coupleWell: string[];
  coupleWellLayer: any[];
  coupleWellPath: any[] | null | undefined;
  figURI: string;
  wellIDNearLine: string[];
  wellIDNearLineIndex: number[];
  curvePaths: any;
  matrixData: any;
}

const initialState: WellState = {
  allWells: [],
  coupleWell: [],
  coupleWellLayer: [],
  coupleWellPath: null,
  figURI: "",
  wellIDNearLine: [],
  wellIDNearLineIndex: [],
  curvePaths: null,
  matrixData: null
};

export default function wellReducer(
  state = initialState,
  action: any
): WellState {
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
    case GET_WELLID_NEARLINE:
      return {
        ...state,
        wellIDNearLine: action.wellID
      };
    case GET_WELLIDNEARLINE_INDEX:
      return {
        ...state,
        wellIDNearLineIndex: action.index
      };
    case GET_WELL_CURVE:
      return {
        ...state,
        curvePaths: action.wellCurve
      };
    case GET_MATRIX_DATA:
      return {
        ...state,
        matrixData: action.matrixData
      };
    default:
      return state;
  }
}
