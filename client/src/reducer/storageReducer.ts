/**
 * It could not store the whole state in redux store
 * I don't know the reason up to now
 */
import { CHANGE_COLOR } from "../action/changeStorage";

const initalState = {
  color: "blue",
  coupleWell: []
};

export default function storageReducer(state = initalState, action: any) {
  switch (action.type) {
    case CHANGE_COLOR:
      return { ...state, color: action.color };
    default:
      return state;
  }
}
