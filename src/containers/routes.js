import React from 'react';
import { Route } from 'react-router-dom';
import * as app from './index';

const routes = [
  {
    path: '/',
    component: app.Home,
    exact: true,
  },
  {
    path: '/login',
    component: app.Login,
  },
  {
    path: '/note',
    component: app.Note,
    routes: [
      {
        path: '/note/:noteid',
        component: app.NoMatch,
      },
    ],
  },
  {
    component: app.NoMatch,
  },
];

export default routes;

export function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
