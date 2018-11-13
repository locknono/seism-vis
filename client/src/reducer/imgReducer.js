import { CHANGE_PLANE, CHANGE_DEPTH } from "../action/changeImgPara";
const initialState = {
  planeName: "xy",
  depth: 0
};

export default function imgReducer(state = initialState, action) {
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
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
    default:
      return state;
  }
}
