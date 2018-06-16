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
import Coupon from './routes/Coupon/';
import UselessCoupon from './routes/UselessCoupon/';
import Invite from './routes/Invite/';
import InvitePage from './routes/InvitePage/';
import WeChat from './routes/WeChat/';
import Modify from './routes/Modify/';
import Login from './routes/Login/';
import GotoWechat from './routes/GotoWechat/';
import Hongbao from './routes/Hongbao/';

import { ua } from './utils';

function requireWechat (Component) {
  if (!ua.wechat) {
    return <Redirect to="/gotoWechat"/>;
  }
  return <Component />
}

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact render={() => requireWechat(Index)} />
        <Route path="/live/:id" exact render={() => requireWechat(Live)} />
        <Route path="/live/:id/invitor/:token" exact render={() => requireWechat(Live)} />
        <Route path="/course/:id" exact render={() => requireWechat(Course)} />
        <Route path="/hongbao/:id" exact render={() => requireWechat(Lesson)} />
        <Route path="/lesson/pay/:id" exact render={() => requireWechat(Lesson)} />
        <Route path="/lesson/free/:id" exact render={() => requireWechat(Lesson)} />
        <Route path="/hb/:id" exact render={() => requireWechat(Hongbao)} />
        <Route path="/jdbs" exact render={() => requireWechat(Jdbs)} />
        <Route path="/profile" exact render={() => requireWechat(Profile)} />
        <Route path="/bought" exact render={() => requireWechat(Bought)} />
        <Route path="/jdbs" exact render={() => requireWechat(Jdbs)} />
        <Route path="/br" exact render={() => requireWechat(BoughtRecord)} />
        <Route path="/coursedetail" exact render={() => requireWechat(CourseDetail)} />
        <Route path="/about" exact render={() => requireWechat(About)} />
        <Route path="/coupon" exact render={() => requireWechat(Coupon)} />
        <Route path="/coupon/useless" exact render={() => requireWechat(UselessCoupon)} />
        <Route path="/invite" exact render={() => requireWechat(Invite)} />
        <Route path="/invitepage" exact render={() => requireWechat(InvitePage)} />
        <Route path="/modify" exact render={() => requireWechat(Modify)} />
        <Route path="/wechat" exact render={() => requireWechat(WeChat)} />
        <Route path="/login" exact component={Login} />
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
