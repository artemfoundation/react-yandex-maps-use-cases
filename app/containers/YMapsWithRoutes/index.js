/*
 * YMapsWithRoutes
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer } from 'utils/injectReducer';
import {
  YMaps,
  Map,
  ZoomControl,
  RouteEditor,
  RoutePanel,
  RouteButton,
  MultiRoute,
} from '@innodata/react-yandex-maps';
import { Row, Col } from 'antd';
import config from '../../config';
import 'antd/dist/antd.css';
import { map, filter, assign, debounce, clone } from 'lodash';
import { changeRoutes, changeRequestPoints, clearAll } from './actions';
import reducer from './reducer';
import {
  makeSelectRequestRoutingModes,
  makeSelectRequestPoints,
} from './selectors';
import { createStructuredSelector } from 'reselect';

import CheckboxComponent from './components/Checkbox';
import ResultListComponent from './components/ResultList';

const stateSelector = createStructuredSelector({
  requestRoutingModes: makeSelectRequestRoutingModes(),
  requestPoints: makeSelectRequestPoints(),
});

const key = 'home';
const mapOptions = {
  defaultState: { center: [55.749, 37.524], zoom: 14, controls: [] },
  width: '100%',
  height: 350,
};
const miltiRoutesOptions = {
  options: {
    boundsAutoApply: true,
    wayPointDraggable: true,
    preventDragUpdate: true,
  },
};

export function YMapsWithRoutes() {
  useInjectReducer({ key, reducer });

  const dispatch = useDispatch();
  const { requestRoutingModes, requestPoints } = useSelector(stateSelector);
  const routingModes = map(
    filter(requestRoutingModes, mode => mode.checked),
    route => ({
      routingMode: route.value,
    }),
  );

  // RouteEditor
  const routeEditorHandler = inst => {
    if (inst && inst.events) {
      inst.events.add(['deselect'], () => {
        const route = inst.getRoute();
        const { requestPoints } = route;
        route.state.set({
          preventDragUpdate: true,
        });

        dispatch(changeRequestPoints(requestPoints));
      });

      inst.events.add(['select'], () => {
        dispatch(clearAll());
      });
    }
  };

  // MultiRoute
  const onMultiRouteRequestSuccess = (e, inst) => {
    const multiRouteModel = e.get('target');

    multiRouteModel.getRoutes().map(route => {
      const key =
        route.properties.get('type') === 'driving'
          ? 'auto'
          : route.properties.get('type'); // hack
      dispatch(
        changeRoutes({
          [key]: {
            type: key,
            distance: route.properties.get('distance').text,
            duration: route.properties.get('duration').text,
            inst,
            multiRouteModel,
          },
        }),
      );
    });
  };

  const multiRouteHandler = inst => {
    if (inst && inst.model.events) {
      inst.model.events.add(['requestsuccess'], e =>
        onMultiRouteRequestSuccess(e, inst),
      );
    }
  };

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <YMaps
            query={{
              apikey: config.apikey,
            }}
          >
            <div>
              <Map
                defaultState={mapOptions.defaultState}
                width={mapOptions.width}
                height={mapOptions.height}
                modules={['package.full']}
              >
                <RouteEditor instanceRef={routeEditorHandler} />
                {routingModes.length
                  ? map(routingModes, (route, index) => (
                    <MultiRoute
                      key={index}
                      referencePoints={requestPoints}
                      params={{ routingMode: route.routingMode, results: 1 }}
                      options={miltiRoutesOptions.options}
                      instanceRef={multiRouteHandler}
                    />
                  ))
                  : null}
                <ZoomControl options={{ float: 'right' }} />
              </Map>
            </div>
          </YMaps>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <CheckboxComponent />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col>
          <ResultListComponent />
        </Col>
      </Row>
    </div>
  );
}

export default YMapsWithRoutes;
