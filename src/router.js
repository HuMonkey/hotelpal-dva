import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Index from './routes/Index/';
import Course from './routes/Course/';
import Lesson from './routes/Lesson/';
import Jdbs from './routes/Jdbs/';
import Profile from './routes/Profile/';
import Bought from './routes/Bought/';
import CourseDetail from './routes/CourseDetail/';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/course/:id" exact component={Course} />
        <Route path="/lesson/:id" exact component={Lesson} />
        <Route path="/jdbs" exact component={Jdbs} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/bought" exact component={Bought} />
        <Route path="/jdbs" exact component={Jdbs} />
        <Route path="/coursedetail" exact component={CourseDetail} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
