import { API_BASE_URL, JWT } from '../constants';

export function signup(signupRequest) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/auth/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signupRequest)
    })
    .then(response => response.json())
    .then(json => {
      if ((json.status && json.status!==200)||!json.success) {
        reject(json);
      } else {
        resolve(json);
      }
    });
  });
}

export function signin(signinRequest) {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + '/api/auth/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signinRequest)
    })
    .then(response => response.json())
    .then(json => {
      if (json.status && json.status!==200) {
        reject(json);
      } else {
        sessionStorage.setItem(JWT, json.accessToken);
        resolve(json);
      }
    });
  });
}
