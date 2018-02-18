/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'

import { AppRegistry } from 'react-native'

import App from './app/components/App'

import Instabug from 'instabug-reactnative'

import { Sentry } from 'react-native-sentry'
Sentry.config('https://b5d6b391f5d74a09a782d73aedb5ab0c:812547673eb74c019a3265a3035882ac@sentry.io/265535').install()

export default class TheFitLeague extends Component {
  componentWillMount() {
    Instabug.isRunningLive(function (isLive) {
      if (isLive) {
        Instabug.startWithToken('d37fbbc1d19f15dc1d5e1eead35db67a', Instabug.invocationEvent.shake)
      } else {
        Instabug.startWithToken('1dc599797a21abc0457ae1e0cd3f7ece', Instabug.invocationEvent.shake)
      }
    });
  }

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('TheFitLeague', () => TheFitLeague)
