/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { AppRegistry } from 'react-native';

import App from './app/components/App';

export default class FanFit extends Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('FanFit', () => FanFit);
