import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import { Session } from '../services/Session'
import { SessionStore } from '../services/SessionStore'
import { LeagueJoiner } from '../services/LeagueJoiner'

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = { animating: true };
  }

  componentWillMount() {
    Session.check((token) => {
      // CAN REMOVE WHEN WE RIP OUT Session.js
      SessionStore.save({ token })
      Actions.home({ token })
    }, () => {
      Actions.welcome({})
      LeagueJoiner.listen(LeagueJoiner.saveSlug)
    })
  }

  render() {
    return (
      <LinearGradient 
        start={{x: 0, y: 1}} end={{x: 1, y: 0}}
        colors={['#2857ED', '#1DD65B']}
        style={styles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={styles.activityIndicator}
          color="rgba(255, 255, 255, 0.8)"
          size="large"
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  activityIndicator: {

  }
});