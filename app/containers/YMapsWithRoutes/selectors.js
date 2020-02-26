/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { filter } from 'lodash';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectResultRoutesData = () =>
  createSelector(
    selectHome,
    homeState => homeState.resultRoutesData,
  );

const makeSelectRequestPoints = () =>
  createSelector(
    selectHome,
    homeState => homeState.requestPoints,
  );

const makeSelectRequestRoutingModes = () =>
  createSelector(
    selectHome,
    homeState => homeState.requestRoutingModes,
  );

const makeSelectFilteredRequestRoutingModes = () =>
  createSelector(
    selectHome,
    homeState => filter(homeState.requestRoutingModes, mode => mode.checked),
  );

export {
  selectHome,
  makeSelectResultRoutesData,
  makeSelectRequestPoints,
  makeSelectRequestRoutingModes,
  makeSelectFilteredRequestRoutingModes,
};
