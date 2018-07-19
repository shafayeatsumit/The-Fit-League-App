import { AsyncStorage } from 'react-native'

import { Sentry } from 'react-native-sentry'
import { Actions } from 'react-native-router-flux'

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
      if (responseData.errors.indexOf('Invalid token') != -1) {
        return AsyncStorage.removeItem('auth_token').then(() => {
          let err = Error('Invalid auth token')
          Sentry.captureException(err)
          throw err
        })
      } else {
        let err = Error(responseData.errors.join('. ') + '.')
        Sentry.captureException(err)
        throw err
      }
    }
    return responseData
  });
}

const sadConnection = (token) => {
  return () => {
    if (Actions.currentScene != 'sadConnection') Actions.sadConnection({ token })
  }
}

const TIMEOUT = 15000 * 3

const hitEndpoint = (method, endpoint, token, body) => {
  let headers = headersFor(token)
  let url = [BASE_URL, endpoint].join('/')
  let timeout = setTimeout(sadConnection(token), TIMEOUT)

  return fetch(url, { method, headers, body }).then((response) => {
    clearTimeout(timeout)
    return handleErrors(response)
  }).catch((err) => {
    clearTimeout(timeout)
    if (err.message == 'Network request failed') sadConnection(token)()
    Sentry.captureException(err)
    throw err
  });
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