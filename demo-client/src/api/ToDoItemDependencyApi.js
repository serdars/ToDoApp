import { API_BASE_URL, JWT } from '../constants';

export function getItemDependency(dependentItemId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todoitem/dependency/' + dependentItemId, {
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

export function createItemDependency(dependentItemId, itemId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todoitem/depend/' + dependentItemId + '/' + itemId, {
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

export function deleteItemDependency(dependentItemId, itemId) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/todoitem/free/' + dependentItemId + '/' + itemId, {
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
