import { API_BASE_URL, JWT } from '../constants';

export function getToDoLists() {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todolist/lists', {
      method: 'GET',
      headers: {'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem(JWT),
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.status && json.status!==200) {
        reject(json);
      } else {
        resolve(json);
      }
    });
  });
}

export function getToDoItems(listId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todolist/' + listId + '/todoitems', {
      method: 'GET',
      headers: {'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem(JWT),
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.status && json.status!==200) {
        reject(json);
      } else {
        resolve(json);
      }
    });
  });
}

export function createToDoList(toDoListRequest) {
    return new Promise(function(resolve, reject) {
      fetch(API_BASE_URL + '/api/todolist/createToDoList', {
        method: 'POST',
        headers: {'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem(JWT),
        },
        body: JSON.stringify(toDoListRequest)
      })
      .then(response => response.json())
      .then(json => {
        if (json.status && json.status!==200) {
          reject(json);
        } else {
          resolve(json);
        }
      });
    });
}

export function deleteToDoList(listId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todolist/' + listId, {
      method: 'DELETE',
      headers: {'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem(JWT),
      }
    })
    .then(response => response.json())
    .then(json => {
      if (json.status && json.status!==200) {
        reject(json);
      } else {
        resolve(json);
      }
    });
  });
}
