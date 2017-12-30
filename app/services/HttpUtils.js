const BASE_URL = 'https://fan-fit.herokuapp.com/v1';
// const BASE_URL = 'http://localhost:5100/v1';

const headersFor = (token) => {
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

const hitEndpoint = (method, endpoint, token, body) => {
  let headers = headersFor(token)
  let url = [BASE_URL, endpoint].join('/')
  return fetch(url, { method, headers, body }).then(handleErrors);
}

export const HttpUtils = {
  get: (endpoint, token) => hitEndpoint('GET', endpoint, token),
  delete: (endpoint, token) => hitEndpoint('DELETE', endpoint, token),
  post: (endpoint, data, token) => {
    let body = JSON.stringify(data)
    return hitEndpoint('POST', endpoint, token, body)
  },
  put: (endpoint, data, token) => {
    let body = JSON.stringify(data)
    return hitEndpoint('PUT', endpoint, token, body)
  }
}