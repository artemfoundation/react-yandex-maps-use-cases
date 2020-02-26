import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPolygon = state => state.polygon || initialState;

const makeSelectData = () =>
  createSelector(
    selectPolygon,
    selectPolygon => selectPolygon.selectedCompetitors,
  );

export { makeSelectData };
