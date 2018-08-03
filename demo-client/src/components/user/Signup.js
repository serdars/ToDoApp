import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Input, Icon, Button, notification } from 'antd';

import './Signup.css';
import { signup } from '../../api/UserApi';

const FormItem = Form.Item;

class Signup extends Component {
  render(){
    const WrappedRegistrationForm = Form.create()(RegistrationForm);
    return <div className="registration-form-container">
      <h1 className="page-title">Signup</h1>
      <WrappedRegistrationForm />
    </div>
  }
}

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    signupSuccessRedirect: false,
  };

  signupSuccessRedirect = () => {
    if (this.state.signupSuccessRedirect) {
      return <Redirect to='/signin' />
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        signup(values)
        .then(json => {
          notification.success({
            message: 'Successfull signup',
            description: 'You can login with your Username and Password now.'
          });
          this.setState({signupSuccessRedirect: true});
        })
        .catch(error => {
            notification.error({
              message: 'Error',
              description: error.message ? error.message : 'An error occured, please try again later.',
            });
        })
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
      {this.signupSuccessRedirect()}
      <Form onSubmit={this.handleSubmit}>
      <FormItem>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
        })(
          <Input size="large" prefix={<Icon type="star-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Name" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
        })(
          <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('email', {
          rules: [{
            type: 'email', message: 'The input is not valid E-mail!',
          }, {
            required: true, message: 'Please input your E-mail!',
          }],
        })(
          <Input size="large" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: 'Please input your password!',
          }, {
            validator: this.validateToNextPassword,
          }],
        })(
          <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('confirm', {
          rules: [{
            required: true, message: 'Please confirm your password!',
          }, {
            validator: this.compareToFirstPassword,
          }],
        })(
          <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Cofirm Password" onBlur={this.handleConfirmBlur}/>
        )}
      </FormItem>
      {/*<FormItem {...tailFormItemLayout}>
        <Button type="primary" size="large" htmlType="submit" caseName="signup-form-button">Register</Button>
      </FormItem>*/}
      <FormItem>
        <Button type="primary" htmlType="submit" size="large" className="signup-form-button">Register</Button>
      </FormItem>
      </Form>
      </div>
    );
  }
}

export default Signup;
