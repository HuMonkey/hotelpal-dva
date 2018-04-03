import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Index from './routes/Index/';
import Course from './routes/Course/';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/course/:id" exact component={Course} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
