import { API_BASE_URL, JWT } from '../constants';

export function createToDoItem(toDoItemRequest) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todoitem/createToDoItem', {
      method: 'POST',
      headers: {'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem(JWT),
      },
      body: JSON.stringify(toDoItemRequest)
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

export function completeToDoItem(itemId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todoitem/complete/' + itemId, {
      method: 'POST',
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

export function deleteToDoItem(itemId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todoitem/' + itemId, {
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
