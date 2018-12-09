import {
  GET_ALL_WELLS,
  GET_COUPLEWELL_PATH,
  GET_COUPLE_WELL,
  GET_COUPLE_WELL_LAYER,
  GET_FIG_URI,
  GET_WELLID_NEARLINE,
  GET_WELLIDNEARLINE_INDEX,
  GET_WELL_CURVE,
  GET_MATRIX_DATA,
  GET_TRACE_PATH,
  GET_ALL_TRACK,
  GET_TRACK_VERTEX,
  GET_UC_PATH,
  GET_WELL_ATTR_DATA,
  GET_ATTR_DIFF,
  GET_CUR_INDEX,
  GET_TOP_RECORDS
} from "../action/changeWell";
import {
  AllDiff,
  AllMatchCurve,
  CurSelectedIndex,
  AllRecords
} from "src/ts/Type";
import { matchViewWidth } from "src/constraint";

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
  paths: any;
  allTrack: any;
  vertex: any[];
  ucPath: any[];
  wellAttrData: any[];
  allDiff: AllDiff;
  curSelectedIndex: CurSelectedIndex;
  topRecords: AllRecords | undefined;
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
  matrixData: null,
  paths: null,
  allTrack: null,
  vertex: [],
  ucPath: [],
  wellAttrData: [],
  allDiff: undefined,
  curSelectedIndex: undefined,
  topRecords: undefined
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
      const curvePaths = [...sortMatchCurve(action.wellCurve)];

      return {
        ...state,
        curvePaths
      };
    case GET_MATRIX_DATA:
      return {
        ...state,
        matrixData: action.matrixData
      };
    case GET_TRACE_PATH:
      return {
        ...state,
        paths: action.paths
      };
    case GET_ALL_TRACK:
      return {
        ...state,
        allTrack: action.allTrack
      };
    case GET_TRACK_VERTEX:
      return {
        ...state,
        vertex: action.vertex
      };
    case GET_UC_PATH:
      return {
        ...state,
        ucPath: action.path
      };
    case GET_WELL_ATTR_DATA:
      return {
        ...state,
        wellAttrData: action.wellAttrData
      };
    case GET_ATTR_DIFF:
      return {
        ...state,
        allDiff: action.allDiff
      };
    case GET_CUR_INDEX:
      return {
        ...state,
        curSelectedIndex: action.curSelectedIndex
      };
    case GET_TOP_RECORDS:
      return {
        ...state,
        topRecords: action.topRecords
      };
    default:
      return state;
  }
}

function sortMatchCurve(matchCurve: AllMatchCurve) {
  matchCurve.sort((a, b) => {
    return a[0][1] - b[0][1];
  });
  return matchCurve;
}
