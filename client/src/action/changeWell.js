export const GET_ALL_WELLS = "GET_ALL_WELLS";

export function getAllWells(allWells) {
  return {
    type: GET_ALL_WELLS,
    allWells
  };
}
