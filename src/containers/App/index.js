import React from 'react';
import { Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import routes, { RouteWithSubRoutes } from '../routes';
import './app.less';

const App = () => (
  <Switch>
    {routes.map((route, index) => (
      <RouteWithSubRoutes key={route.path || index} {...route} />
    ))}
  </Switch>
);

export default hot(App);
