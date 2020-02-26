/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

import YMapsWithRoutes from 'containers/YMapsWithRoutes/Loadable';
import YMapsWithPlacemarks from 'containers/YMapsWithPlacemarks/Loadable';
import YMapsWithPolygon from 'containers/YMapsWithPolygon/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import GlobalStyle from '../../global-styles';
import HeaderComponent from '../../components/Header';

const { Footer, Content } = Layout;
const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100vh;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Switch>
        <Route exact path="/">
          <Layout>
            <HeaderComponent />
            <Content>
              <YMapsWithRoutes />
            </Content>
            <Footer>2020</Footer>
          </Layout>
        </Route>
        <Route path="/case-2">
          <Layout>
            <HeaderComponent />
            <Content>
              <YMapsWithPolygon />
            </Content>
            <Footer>2020</Footer>
          </Layout>
        </Route>
        <Route path="/case-3">
          <Layout>
            <HeaderComponent />
            <Content>
              <YMapsWithPlacemarks />
            </Content>
            <Footer>2020</Footer>
          </Layout>
        </Route>
        <Route path="">
          <HeaderComponent />
          <Content>
            <NotFoundPage />
          </Content>
          <Footer>2020</Footer>
        </Route>
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
}
