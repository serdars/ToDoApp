import React, { Component } from "react";
import { Form, Icon, Input, Button, DatePicker, notification } from 'antd';

import './ToDoItemForm.css';
import { createToDoItem } from '../../api/ToDoItemApi';

const FormItem = Form.Item;

class ToDoItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {mode: 'CREATE'};
  }

  render(){
    const WrappedForm = Form.create()(ToDoItemFormInner);
    return <WrappedForm toDoList={this.props.toDoList}
                        onSuccess={this.props.onSuccess}
                        onCancel={this.props.onCancel}
                        onError={this.props.onError}/>;
  }
}

class ToDoItemFormInner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {mode: 'CREATE'};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        createToDoItem({...values, toDoListId: this.props.toDoList.id})
        .then(json => {
          this.props.onSuccess();
          notification.success({
            message: 'Task Created',
            description: 'Your task is created.',
            duration: 1,
          });
        })
        .catch(error => {
            this.props.onError();
            notification.error({message: 'Error',
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
            rules: [{ required: true, message: 'Please input your task name.' }],
          })(
            <Input size="large" prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Task Name" />
          )}
        </FormItem>
        <FormItem label="Deadline">
          {getFieldDecorator('deadline', {
            rules: [{ type: 'object', required: true, message: 'Please pick a deadline.' }],
          })(
            <DatePicker size="large" />
          )}
        </FormItem>
        <FormItem label="Description">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input your description for the task.' }],
          })(
            <Input size="large" prefix={<Icon type="bars" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Description" />
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

export default ToDoItemForm;
