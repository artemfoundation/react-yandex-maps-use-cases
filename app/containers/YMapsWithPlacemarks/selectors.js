import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPlacemarks = state => state.placemarks || initialState;

const makeSelectData = () =>
  createSelector(
    selectPlacemarks,
    selectPlacemarks => selectPlacemarks.selectedCompetitors,
  );

export { makeSelectData };
