import { GET_ALL_WELLS } from "../action/changeWell";

const initialState = {
  allWells: []
};

export default function wellReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_WELLS:
      return { ...state, allWells: action.allWells };
      break;

    default:
      return state;
  }
}
