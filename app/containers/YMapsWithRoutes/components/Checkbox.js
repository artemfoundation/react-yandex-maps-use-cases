import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Checkbox, Row, Col } from 'antd';
import { map } from 'lodash';
import {
  makeSelectRequestRoutingModes,
  makeSelectResultRoutesData,
} from '../selectors';
import { changeRequestRoutingModes, removeRoutes } from '../actions';

const stateSelector = createStructuredSelector({
  requestRoutingModes: makeSelectRequestRoutingModes(),
  routesData: makeSelectResultRoutesData(),
});

export default function CheckboxComponent() {
  const dispatch = useDispatch();
  const { requestRoutingModes, routesData } = useSelector(stateSelector);

  const onChange = e => {
    const targetValue = e.target.value;
    const targetMode = requestRoutingModes[targetValue];
    const { checked } = targetMode;

    dispatch(
      changeRequestRoutingModes({
        [targetValue]: { ...targetMode, checked: !checked },
      }),
    );

    if (checked) {
      const route = routesData[targetValue];

      // Удаляем модель и сам роут
      if (route) {
        route.multiRouteModel.destroy();
        route.inst.getMap().geoObjects.remove(route.inst);
      }

      dispatch(removeRoutes(targetValue));
    }
  };

  return (
    <Row>
      {map(requestRoutingModes, (mode, index) => (
        <Col key={index} span={8} style={{ textAlign: 'center' }}>
          <Checkbox
            value={mode.value}
            checked={mode.checked}
            onChange={onChange}
          >
            {mode.label}
          </Checkbox>
        </Col>
      ))}
    </Row>
  );
}
