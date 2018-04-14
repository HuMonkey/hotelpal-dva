import React from 'react';
import { Router, Route, Switch, Redirect, history } from 'dva/router';
import Index from './routes/Index/';
import Live from './routes/Live/';
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
import GotoWechat from './routes/GotoWechat/';

import { ua, isLogin } from './utils';

function requireWechatAndAuth (Component, location) {
  // TODO 判断是否微信，判断是否登录
  // console.log(222, location.href)
  // if (!ua.wechat) {
  //   return <Redirect to="/gotoWechat"/>;
  // }
  // if (!isLogin) {
  //   return <Redirect to="/login"/>
  // }
  return <Component />
}

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact render={() => requireWechatAndAuth(Index, location)} />
        <Route path="/live/:id" exact render={() => requireWechatAndAuth(Live)} />
        <Route path="/course/:id" exact render={() => requireWechatAndAuth(Course)} />
        <Route path="/lesson/:id" exact render={() => requireWechatAndAuth(Lesson)} />
        <Route path="/jdbs" exact render={() => requireWechatAndAuth(Jdbs)} />
        <Route path="/profile" exact render={() => requireWechatAndAuth(Profile)} />
        <Route path="/bought" exact render={() => requireWechatAndAuth(Bought)} />
        <Route path="/jdbs" exact render={() => requireWechatAndAuth(Jdbs)} />
        <Route path="/br" exact render={() => requireWechatAndAuth(BoughtRecord)} />
        <Route path="/coursedetail" exact render={() => requireWechatAndAuth(CourseDetail)} />
        <Route path="/about" exact render={() => requireWechatAndAuth(About)} />
        <Route path="/modify" exact render={() => requireWechatAndAuth(Modify)} />
        <Route path="/wechat" exact render={() => requireWechatAndAuth(WeChat)} />
        <Route path="/login" exact component={Login} />
        <Route path="/login/:redirect" exact component={Login} />
        <Route path="/gotoWechat" exact render={() => {
            if (ua.wechat) {
              return <Redirect to="/"/>;
            } else {
              return <GotoWechat />
            }
          }} 
        />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
