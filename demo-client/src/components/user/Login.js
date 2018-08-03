import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button, notification } from 'antd';

import './Login.css';
import { signin } from '../../api/UserApi';

const FormItem = Form.Item;

class Login extends Component {
  render(){
    const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
    return (
      <div className="login-container">
        <h1 className="page-title">Login</h1>
        <div className="login-content">
          <WrappedNormalLoginForm />
        </div>
      </div>
    );
  }
}

class NormalLoginForm extends React.Component {

  state = {
    loginSuccessRedirect: false
  }

  loginSuccessRedirect = () => {
    if (this.state.loginSuccessRedirect) {
      return <Redirect to='/todo' />
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        signin(values)
        .then(json => {
          notification.success({
            message: 'Successfull login',
            description: 'Welcome user!'
          });
          this.setState({loginSuccessRedirect: true});
        })
        .catch(error => {
          if(error.status === 401) {
            notification.error({
              message: 'Incorrect Username or Password',
              description: 'Your Username or Password is incorrect, please try again.'
            });
          } else {
            notification.error({
              message: 'Error',
              description: 'An error occured, please try again later.'
            });
          }
        })
      };
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      {this.loginSuccessRedirect()}
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('usernameOrEmail', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username or Email" />
          )}
        </FormItem>
        <FormItem >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {/*{getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>*/}
          <Button type="primary" htmlType="submit" size="large" className="login-form-button">
            Log in
          </Button>
          Or <NavLink onClick={this.logout} key="signup" to="/signup">register now!</NavLink>
        </FormItem>
      </Form>
      </div>
    );
  }
}

export default Login;
