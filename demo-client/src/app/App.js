import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, withRouter, Switch} from 'react-router-dom';

import './App.css';
import AppHeader from '../components/common/AppHeader';
import Welcome from '../components/common/Welcome';
import Todo from '../components/todo/Todo';
import Login from '../components/user/Login';
import Signup from '../components/user/Signup';

class App extends Component {

  render() {
    return(
        <Layout theme="light">
          <AppHeader/>
          <Switch>
            <Route exact path="/" component={Welcome}/>
            <Route exact path="/todo" component={Todo}/>
            <Route path="/signin" component={Login}/>
            <Route path="/signup" component={Signup}/>
          </Switch>
        </Layout>
    );
  }
  
}

export default withRouter(App);
