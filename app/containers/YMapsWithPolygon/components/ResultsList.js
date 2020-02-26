import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, List, Card, Icon } from 'antd';
import { createStructuredSelector } from 'reselect';
import { values } from 'lodash';
import { makeSelectData } from '../selectors';

const stateSelector = createStructuredSelector({
  data: makeSelectData(),
});

export default function PolygonResultListComponent() {
  const { data } = useSelector(stateSelector);

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
      dataSource={values(data)}
      renderItem={route => (
        <List.Item key={`polygon-${route.id}`}>
          <Card title={route.name}>
            <Row type="flex" align="middle">
              <Col>
                <Icon type="info-circle" style={{ verticalAlign: 'middle' }} />
                {` ${route.description} `}
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );
}
