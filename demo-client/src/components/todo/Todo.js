import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Layout, Menu, Button, Modal } from 'antd';

import './ToDo.css';
import ToDoListForm from './ToDoListForm';
import ToDoList from './ToDoList';
import { JWT } from '../../constants';
import { getToDoLists, deleteToDoList } from '../../api/ToDoApi';

const { Content, Sider } = Layout;

class Todo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toDoLists: [],
      toDoListFormVisible: false,
      toDoListFormMode: '',
      isLoading: true,
      selectedList: '',
    };

    this.executeGetListsApi();

  }

  executeGetListsApi(){
    getToDoLists().then(json => {
      this.setState({
          toDoLists: json.sort(function(a, b){var dA=new Date(a.createdAt); var dB=new Date(b.createdAt); if (dA < dB) return 1;  if (dA > dB) return -1; return 0;}),
          isLoading: false,
        });
      });
  }

  unauthorizedRedirect = () => {
    const jwt = sessionStorage.getItem(JWT);
    if(!jwt){
      return <Redirect to='/' />;
    }
  }

  showtoDoListForm = (e) => {
    this.setState({
      toDoListFormVisible: true,
    });
  }

  handleToDoListFormSuccess = (e) => {
    this.setState({
      toDoListFormVisible: false,
    });
    this.executeGetListsApi();
  }

  handleToDoListFormCancel = (e) => {
    this.setState({
      toDoListFormVisible: false,
    });
  }

  handleMenuItemClick = (toDoList) => {
    this.setState({
      selectedList: toDoList,
    });
  }

  handleDeleteList = (toDoList) => {
    deleteToDoList(toDoList.id).then(json => {
      const newList = this.state.toDoLists.filter(l => l.id !== toDoList.id);
      this.setState({
        toDoLists: newList,
        selectedList: newList[0],
      });
    });
  }

  render() {
    const toDoListMenuItems = [];
    if (this.state.toDoLists) this.state.toDoLists.forEach((toDoList) => {
      toDoListMenuItems.push(<Menu.Item key={toDoList.id} onClick={this.handleMenuItemClick.bind(this, toDoList)} className="task-list-title">{toDoList.name}</Menu.Item>);
      toDoListMenuItems.push(<Menu.Divider key={toDoList.id + '_div'} className="menu-divider"/>);
    });

    return (
      <div>
        {this.unauthorizedRedirect()}
        <Modal title="To-Do List" visible={this.state.toDoListFormVisible} onCancel={this.handleToDoListFormCancel} footer={null}>
          <ToDoListForm onSuccess={this.handleToDoListFormSuccess} onCancel={this.handleToDoListFormCancel} onError={this.handleToDoListFormCancel}/>
        </Modal>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Button type="primary" icon="plus" onClick={this.showtoDoListForm} className="new-list-button">New To Do List</Button>
            <Menu mode="inline" style={{ borderRight: 0 }}>
              {toDoListMenuItems}
            </Menu>
          </Sider>
          <Layout style={{ padding: '20px 40px 10px 10px' }}>
            <Content style={{ minHeight: 280 }}>
              <ToDoList toDoList={this.state.selectedList} deleteList={this.handleDeleteList}/>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Todo;
