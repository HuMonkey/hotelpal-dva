import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Index from './routes/Index/';
import Course from './routes/Course/';
import Lesson from './routes/Lesson/';
import Jdbs from './routes/Jdbs/';
import Profile from './routes/Profile/';
import Bought from './routes/Bought/';
import CourseDetail from './routes/CourseDetail/';
import BoughtRecord from './routes/BoughtRecord/';
import About from './routes/About/';
import WeChat from './routes/WeChat/';
import Modify from './routes/Modify/';
import Login from './routes/Login/';

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
        <Route path="/br" exact component={BoughtRecord} />
        <Route path="/coursedetail" exact component={CourseDetail} />
        <Route path="/about" exact component={About} />
        <Route path="/modify" exact component={Modify} />
        <Route path="/wechat" exact component={WeChat} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
