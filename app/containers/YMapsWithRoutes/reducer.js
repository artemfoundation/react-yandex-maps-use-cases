/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { assign } from 'lodash';
import {
  CHANGE_RESULT_ROUTES_DATA,
  REMOVE_RESULT_ROUTES_DATA,
  CHANGE_REQUEST_POINTS,
  CHANGE_REQUEST_ROUTING_MODES,
  CLEAR_ALL,
} from './constants';

// The initial state of the App
export const initialState = {
  requestPoints: [],
  requestRoutingModes: {
    auto: {
      label: 'Auto',
      value: 'auto',
      disabled: false,
      checked: true,
    },
    pedestrian: {
      label: 'Pedestrian',
      value: 'pedestrian',
      disabled: false,
      checked: true,
    },
    masstransit: {
      label: 'Masstransit',
      value: 'masstransit',
      disabled: false,
      checked: true,
    },
  },
  resultRoutesData: {},
};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_RESULT_ROUTES_DATA:
        draft.resultRoutesData = assign(
          {},
          draft.resultRoutesData,
          action.routeData,
        );
        break;
      case REMOVE_RESULT_ROUTES_DATA:
        const { [action.modeType]: value, ...without } = draft.resultRoutesData;
        draft.resultRoutesData = without;
        break;
      case CHANGE_REQUEST_POINTS:
        draft.requestPoints = action.requestPoints;
        break;
      case CHANGE_REQUEST_ROUTING_MODES:
        draft.requestRoutingModes = assign(
          {},
          draft.requestRoutingModes,
          action.routingMode,
        );
        break;
      case CLEAR_ALL:
        draft.requestPoints = initialState.requestPoints;
        draft.resultRoutesData = initialState.resultRoutesData;
        break;
    }
  });

export default homeReducer;
