/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  CHANGE_RESULT_ROUTES_DATA,
  REMOVE_RESULT_ROUTES_DATA,
  CHANGE_REQUEST_POINTS,
  CHANGE_REQUEST_ROUTING_MODES,
  CLEAR_ALL,
} from './constants';

export function changeRoutes(routeData) {
  return {
    type: CHANGE_RESULT_ROUTES_DATA,
    routeData,
  };
}

export function removeRoutes(modeType) {
  return {
    type: REMOVE_RESULT_ROUTES_DATA,
    modeType,
  };
}

export function changeRequestPoints(requestPoints) {
  return {
    type: CHANGE_REQUEST_POINTS,
    requestPoints,
  };
}

export function changeRequestRoutingModes(routingMode) {
  return {
    type: CHANGE_REQUEST_ROUTING_MODES,
    routingMode,
  };
}

export function clearAll() {
  return {
    type: CLEAR_ALL,
  };
}
