const BASE_URL = 'https://fan-fit.herokuapp.com/v1';
// const BASE_URL = 'http://localhost:5100/v1';

let headersFor = (token) => {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

const handleErrors = (response) => {
  return response.json().then(responseData => {
    if (responseData.errors) {
      throw Error(responseData.errors.join('. ') + '.');
    }
    return responseData;
  });
}

export const HttpUtils = {
  handleErrors,
  get: (endpoint, token) => {
    let headers = headersFor(token);
    return fetch([BASE_URL, endpoint].join('/'), { 
      method: 'GET', headers
    }).then(handleErrors);
  },
  post: (endpoint, data, token) => {
    let headers = headersFor(token);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    let body = JSON.stringify(data);
    return fetch([BASE_URL, endpoint].join('/'), { 
      method: 'POST', headers, body
    }).then(handleErrors);
  },
  delete: (endpoint, token) => {
    let headers = headersFor(token);
    return fetch([BASE_URL, endpoint].join('/'), { 
      method: 'DELETE', headers
    }).then(handleErrors);
  },
}