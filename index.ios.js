/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'

import { AppRegistry } from 'react-native'

import App from './app/components/App'

import { Sentry } from 'react-native-sentry'

Sentry.config('https://b5d6b391f5d74a09a782d73aedb5ab0c:812547673eb74c019a3265a3035882ac@sentry.io/265535').install()

export default class TheFitLeague extends Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('TheFitLeague', () => TheFitLeague)
