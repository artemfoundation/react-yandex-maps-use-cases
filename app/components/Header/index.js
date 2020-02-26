import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { map } from 'lodash';
import { Layout, Menu } from 'antd';
const { Header } = Layout;

const routes = {
  '/': {
    name: 'Мультимаршрут',
    link: '/',
  },
  '/case-2': {
    name: 'Полигон',
    link: '/case-2',
  },
  '/case-3': {
    name: 'Метка',
    link: '/case-3',
  },
};

function HeaderComponent() {
  const { path } = useRouteMatch();

  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[path]}
        style={{ lineHeight: '64px' }}
      >
        {map(routes, route => (
          <Menu.Item key={route.link}>
            <Link to={route.link}>{route.name}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
}

export default HeaderComponent;
