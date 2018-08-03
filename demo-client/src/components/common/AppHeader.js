import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Layout, Menu } from 'antd';

import { JWT } from '../../constants';

const { Header} = Layout;

class AppHeader extends Component {

  logout() {
    sessionStorage.setItem(JWT, '');
    //TODO Server call to kill jwt
  }

  render() {
    /*this.props.history.listen((location, action) => {
      console.log(location.pathname.substr(1));
    });*/

    let todo;
    let signin;
    let signup;
    let logout;
    if(sessionStorage.getItem(JWT)){
      todo = <Menu.Item><NavLink key="todo" to="/todo">My To Do Lists</NavLink></Menu.Item>;
      logout = <Menu.Item style={{ float: 'right' }}><NavLink onClick={this.logout} key="welcome" to="/">Logout</NavLink></Menu.Item>;
    } else {
      signin = <Menu.Item style={{ float: 'right' }}><NavLink key="signin" to="/signin">Login</NavLink></Menu.Item>;
      signup = <Menu.Item style={{ float: 'right' }}><NavLink key="signup" to="/signup">Signup</NavLink></Menu.Item>;
    }

    return (
      <Header className="header">
        <div className="logo"/>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[]}
          style={{ lineHeight: '60px', width: '100%' }}
        >
          <Menu.Item><NavLink key="welcome" to="/"><font size="3" color="#FFFFF">To Do List Demo App</font></NavLink></Menu.Item>
          {todo}
          {signup}
          {signin}
          {logout}
        </Menu>
      </Header>
    );
  }
}

export default withRouter(AppHeader);
