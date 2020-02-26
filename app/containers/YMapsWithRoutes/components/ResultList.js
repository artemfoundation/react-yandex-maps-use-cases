import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, List, Card, Icon, Divider } from 'antd';
import { createStructuredSelector } from 'reselect';
import { values } from 'lodash';
import { makeSelectResultRoutesData } from '../selectors';

const stateSelector = createStructuredSelector({
  routesData: makeSelectResultRoutesData(),
});

export default function ResultListComponent() {
  const { routesData } = useSelector(stateSelector);

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 6,
        xxl: 3,
      }}
      dataSource={values(routesData)}
      renderItem={route => (
        <List.Item>
          <Card title={route.type}>
            <Row type="flex" align="middle">
              <Col>
                <Icon type="environment" style={{ verticalAlign: 'middle' }} />
                {` ${route.distance} `}
              </Col>
              <Divider dashed />
              <Col>
                <Icon type="clock-circle" style={{ verticalAlign: 'middle' }} />
                {` ${route.duration} `}
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );
}
