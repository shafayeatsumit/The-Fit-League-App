import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import { Actions } from 'react-native-router-flux';

const TOKEN_STORAGE_KEY = 'auth_token';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = { animating: true };
  }

  async _checkSession() {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token !== null){
      Actions.home({ token });
    } else {
      Actions.welcome();
    }
  }

  componentWillMount() {
    this._checkSession()
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={styles.activityIndicator}
          size="large"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
  activityIndicator: {

  },
});