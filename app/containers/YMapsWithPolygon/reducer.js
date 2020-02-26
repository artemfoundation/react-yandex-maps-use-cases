/*
 * PlacemarksReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { assign } from 'lodash';
import {
  CHANGE_RESULT_DATA,
  REMOVE_RESULT_DATA,
  CLEAR_RESULT_DATA,
} from './constants';

// The initial state of the App
export const initialState = {
  selectedCompetitors: {},
};

/* eslint-disable default-case, no-param-reassign */
const polygonReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_RESULT_DATA:
        draft.selectedCompetitors = assign(
          {},
          draft.selectedCompetitors,
          action.selectedCompetitors,
        );
        break;
      case REMOVE_RESULT_DATA:
        const { [action.id]: value, ...without } = draft.selectedCompetitors;
        draft.selectedCompetitors = without;
        break;
      case CLEAR_RESULT_DATA:
        draft.selectedCompetitors = initialState.selectedCompetitors;
        break;
    }
  });

export default polygonReducer;
