import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import { Session } from '../services/Session'

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = { animating: true };
  }

  componentWillMount() {
    Session.check(
      (token) => Actions.home({ token }), 
      () => Actions.welcome({ endpoint: 'registrations', label: 'Join' })
    )
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

  }
});