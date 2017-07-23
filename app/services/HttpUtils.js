const BASE_URL = 'http://localhost:5100/v1';

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
  post: (endpoint, data, token) => {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    let body = JSON.stringify(data);
    return fetch([BASE_URL, endpoint].join('/'), { 
      method: 'POST', headers, body
    }).then(handleErrors);
  }
}