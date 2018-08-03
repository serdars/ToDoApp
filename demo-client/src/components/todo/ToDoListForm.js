import React, { Component } from "react";
import { Form, Icon, Input, Button, notification } from 'antd';

import './ToDoListForm.css';
import { createToDoList } from '../../api/ToDoApi';

const FormItem = Form.Item;

class ToDoListForm extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: 'CREATE'};
  }

  render(){
    const WrappedForm = Form.create()(ToDoListFormInner);
    return <WrappedForm onSuccess={this.props.onSuccess}
                        onCancel={this.props.onCancel}
                        onError={this.props.onError}/>;
  }
}

class ToDoListFormInner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {mode: 'CREATE'};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        createToDoList(values)
        .then(json => {

          this.props.onSuccess();
          notification.success({
            message: 'List Created',
            description: 'Your list is created.',
            duration: 1,
          });
        })
        .catch(error => {
            this.props.onError();
            notification.error({
              message: 'Error',
              description: 'An error occured, please try again later.'
            });
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your list name.' }],
          })(
            <Input size="large" prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Enter list name" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" size="large" className="modal-form-button"> Submit </Button>
          <Button size="large" onClick={this.props.onCancel} className="modal-form-button">Cancel</Button>
        </FormItem>
      </Form>
    );
  }
}

export default ToDoListForm;
