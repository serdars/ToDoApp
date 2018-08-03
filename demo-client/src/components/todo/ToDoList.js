import React, { Component } from "react";
import { Avatar, Button,  Modal, Table, Input, Popconfirm, notification } from 'antd';

import './ToDoList.css';
import ToDoItemForm from './ToDoItemForm';
import { getToDoItems } from '../../api/ToDoApi';
import { completeToDoItem, deleteToDoItem } from '../../api/ToDoItemApi';
import { getItemDependency, createItemDependency, deleteItemDependency } from '../../api/ToDoItemDependencyApi';

class ToDoList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toDoList:{},
      toDoItems: [],
      toDoItemFormVisible: false,
      selectedItem: {},
      toDoItemsTableColumns: this.getToDoItemsTableColumns(),
      mode: 'Tasks',
      dependencyModeId: {},
      dependencies: [],
    };
  }

  executeGetItemsApi(toDoList){
    getToDoItems(toDoList.id).then(json => {
      this.setState({
        toDoList: toDoList,
        toDoItems: json,
        toDoItemFormVisible: false,
      });
    });
  }

  showToDoItemForm = (e) => {
    this.setState({
      toDoItemFormVisible: true,
    });
  }

  handleToDoItemFormSuccess = (e) => {
    this.executeGetItemsApi(this.props.toDoList);
  }

  handleToDoItemFormCancel = (e) => {
    this.setState({
      toDoItemFormVisible: false,
    });
  }

  handleDeleteList = () => {
    this.props.deleteList(this.state.toDoList);
  }

  handleCompleteItem = (toDoItem) => {
    completeToDoItem(toDoItem.id)
    .then(json => {
      this.setState({
        toDoItems: this.state.toDoItems.map(l => l.id===json.id ? json : l),
      });
    })
    .catch(error => {
        notification.error({
          message: 'Error',
          description: error.message ? error.message : 'An error occured, please try again later.',
        });
    })
  }

  handleDeleteItem = (toDoItem) => {
    deleteToDoItem(toDoItem.id).then(json => {
      this.setState({
        toDoItems: this.state.toDoItems.filter(l => l.id !== toDoItem.id),
      });
    });
  }

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  dependencyModeStart = (toDoItem) => {
    getItemDependency(toDoItem.id).then(json => {
      this.setState({
        mode: 'Dependencies',
        dependencyModeId: toDoItem.id,
        dependencies: json,
      });
      notification.info({
        message: 'Dependency Mode',
        description: 'You have entered to dependency mode. After selecting dependencies for the item you can go back to tasks mode by clicking the same button.',
        duration: 8,
      });
    });
  }

  dependencyModeEnd = (toDoItem) => {
    this.setState({
      mode: 'Tasks',
      dependencyModeId: '',
    });
    notification.info({
      message: 'Tasks Mode',
      description: 'You have returned to tasks mode.',
    });
  }

  addDependency = (toDoItem) => {
    createItemDependency(this.state.dependencyModeId, toDoItem.id).then(json => {
      getItemDependency(this.state.dependencyModeId).then(json => {
        this.setState({
          dependencies: json,
        });
      });
    });
  }

  removeDependency = (toDoItem) => {
    deleteItemDependency(this.state.dependencyModeId, toDoItem.id).then(json => {
      getItemDependency(this.state.dependencyModeId).then(json => {
        this.setState({
          dependencies: json,
        });
      });
    });
  }

  getItemActions(toDoItem){

    let completeButton;
    let dependencyModeButton;
    let deleteButton;
    if (this.state.mode==='Tasks'){
      if (toDoItem.itemStatus!=='COMPLETED'){
        completeButton = <Button onClick={this.handleCompleteItem.bind(this, toDoItem)} type="primary" shape="circle" icon="check" className="task-list-action-button"/>;
        dependencyModeButton = <Button onClick={this.dependencyModeStart.bind(this, toDoItem)} shape="circle" icon="link" className="task-list-action-button"/>;
      }
      deleteButton =
      <Popconfirm title="Are you sure delete this task?" onConfirm={this.handleDeleteItem.bind(this, toDoItem)} placement="leftTop" okText="Yes" cancelText="No">
        <Button type="danger" shape="circle" icon="delete" className="task-list-action-button"/>
      </Popconfirm>;
    }

    let dependencyModeEndButton;
    if (this.state.mode==='Dependencies' && this.state.dependencyModeId===toDoItem.id)
      dependencyModeEndButton = <Button onClick={this.dependencyModeEnd.bind(this, toDoItem)} shape="circle" icon="link" className="task-list-action-button"/>;

    let dependButton;
    let freeButton;
    if (this.state.mode==='Dependencies' && this.state.dependencyModeId !== toDoItem.id && toDoItem.itemStatus !== 'COMPLETED'){
      if (this.state.dependencies.includes(toDoItem.id))
        freeButton = <Avatar onClick={this.removeDependency.bind(this, toDoItem)} icon="scan" className="task-list-action-button free-button" />
      else
        dependButton = <Button onClick={this.addDependency.bind(this, toDoItem)} type="danger" shape="circle" icon="scan" className="task-list-action-button"/>;
    }

    return (
      <div>
        {completeButton}
        {dependencyModeButton}
        {deleteButton}
        {dependencyModeEndButton}
        {dependButton}
        {freeButton}
      </div>
    );
  }

  getListActions(){
    if (this.state.mode==='Tasks'){
      return (
        <div>
          <Button onClick={this.showToDoItemForm} type="primary" shape="circle" icon="plus" className="task-list-action-button"/>
          <Popconfirm title="Are you sure delete this list?" onConfirm={this.handleDeleteList} placement="leftTop" okText="Yes" cancelText="No">
            <Button type="danger" shape="circle" icon="delete" className="task-list-action-button"/>
          </Popconfirm>
        </div>
      );
    }
    if (this.state.mode==='Dependencies'){
      return (
        <div>
          <Button onClick={this.dependencyModeEnd.bind(this)} shape="circle" icon="link" className="task-list-action-button"/>
        </div>
      );
    }
  }

  getListHeaderTitle(toDoList){
    if (this.state.toDoList.name)
    return (<div>{toDoList.name + ' ' + this.state.mode}</div>);
  }

  render() {

    if (!this.props.toDoList) return <div/>;
    if (this.props.toDoList.id !== this.state.toDoList.id)
      this.executeGetItemsApi(this.props.toDoList);

    return (
      <div>
        <Modal title="Task" visible={this.state.toDoItemFormVisible} onCancel={this.handleToDoItemFormCancel} footer={null}>
          <ToDoItemForm toDoList={this.state.toDoList} onSuccess={this.handleToDoItemFormSuccess}
            onCancel={this.handleToDoItemFormCancel} onError={this.handleToDoItemFormCancel}/>
        </Modal>
        <div>
          <div>
            <div className="list-header">
              <div className="list-header-left task-list-title">{this.getListHeaderTitle(this.state.toDoList)}</div>
              <div className="list-header-right">
                {this.getListActions()}
              </div>
            </div>
          </div>
          <Table columns={this.state.toDoItemsTableColumns} dataSource={this.state.toDoItems} rowKey={record => record.id}/>
        </div>
      </div>
    );

  }

  getToDoItemsTableColumns(){
    return (
      [{
        title: '',
        key: 'id',
        render: (text, record) => (
          <Avatar style={{ backgroundColor: record.itemStatus==='COMPLETED' ? '#228B22' : '#FF8C00' }} icon={record.itemStatus==='COMPLETED' ? 'check' : 'pushpin'} shape="square" />
        ),
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        className: 'item-table-column',
        sorter: (a, b) => {var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
                           if (nameA < nameB) return -1;  if (nameA > nameB) return 1; return 0;},
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="Search name"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={this.handleSearch(selectedKeys, confirm)}
            />
            <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
            <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
          </div>
        ),
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },
        render: (text) => {
          const { searchText } = this.state;
          return searchText ? (
            <span>
              {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                fragment.toLowerCase() === searchText.toLowerCase()
                  ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
              ))}
            </span>
          ) : text;
        },
      }, {
        title: 'Date Created',
        dataIndex: 'createdAt',
        className: 'item-table-column',
        sorter: (a, b) => {var dA=new Date(a.createdAt), dB=new Date(b.createdAt);
                           if (dA < dB) return -1;  if (dA > dB) return 1; return 0;},
        render: text => {return <div>{new Intl.DateTimeFormat('en-GB', {year: 'numeric',month: 'long',day: '2-digit'}).format(new Date(text))}</div>},
      }, {
        title: 'Deadline',
        dataIndex: 'deadline',
        className: 'item-table-column',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => {var dA=new Date(a.deadline), dB=new Date(b.deadline);
                           if (dA < dB) return -1;  if (dA > dB) return 1; return 0;},
        render: text => {return <div>{new Intl.DateTimeFormat('en-GB', {year: 'numeric',month: 'long',day: '2-digit'}).format(new Date(text))}</div>},
      }, {
        title: 'Status',
        dataIndex: 'itemStatus',
        className: 'item-table-column',
        filters: [{
          text: 'Waiting',
          value: 'WAITING',
        }, {
          text: 'Completed',
          value: 'COMPLETED',
        }],
        render: text => {return <div>{text[0].toUpperCase() + text.substring(1).toLowerCase()}</div>},
        filterMultiple: false,
        onFilter: (value, record) => record.itemStatus.indexOf(value) === 0,
        sorter: (a, b) => {var nameA=a.itemStatus.toUpperCase(), nameB=b.itemStatus.toUpperCase();
                           if (nameA < nameB) return -1;  if (nameA > nameB) return 1; return 0;},
      }, {
        title: 'Description',
        dataIndex: 'description',
        className: 'item-table-column',
      }, {
        title: 'Action',
        key: 'action',
        className: 'item-table-column',
        render: (text, record) => (
          <div>
            {this.getItemActions(record)}
          </div>
        ),
      }]
    )
  }

}

export default ToDoList;
