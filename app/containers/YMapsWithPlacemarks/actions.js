import {
  CHANGE_RESULT_DATA,
  REMOVE_RESULT_DATA,
  CLEAR_RESULT_DATA,
} from './constants';

export function changeData(selectedCompetitors) {
  return {
    type: CHANGE_RESULT_DATA,
    selectedCompetitors,
  };
}

export function deleteData(id) {
  return {
    type: REMOVE_RESULT_DATA,
    id,
  };
}

export function clearData() {
  return {
    type: CLEAR_RESULT_DATA,
  };
}
