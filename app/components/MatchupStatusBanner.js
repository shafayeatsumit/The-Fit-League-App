import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const presentTense = {
  win: "You're winning",
  lose: "You're losing",
  tie: "You're tied"
}

const pastTense = {
  win: "You won",
  lose: "You lost",
  tie: "You tied"
}

export default class MatchupStatusBanner extends Component {
  render() {
    const verbs = this.props.current ? presentTense : pastTense
    return (
      <View style={styles[this.props.status]}>
        <Text style={styles.label}>{verbs[this.props.status].toUpperCase()}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  win: {
    backgroundColor: '#1DD65B',
    alignItems: 'center'
  },
  lose: {
    backgroundColor: '#E9005A',
    alignItems: 'center'
  },
  tie: {
    backgroundColor: '#2857ED',
    alignItems: 'center'
  },
  label: {
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 12,
    backgroundColor: 'transparent',
    padding: 10
  }
})