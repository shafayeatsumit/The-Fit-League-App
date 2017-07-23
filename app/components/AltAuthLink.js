import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

export default class AltAuthLink extends Component {
  render() {
    return (
      <View style={styles.alternativeCtaContainer}>
        <Text style={styles.alternativeCtaLabel}>{ this.props.question }</Text>
        <TouchableHighlight style={styles.alternativeCtaButton} onPress={() => Actions.welcome(this.props)} underlayColor='#AADD9A'>
          <Text style={styles.alternativeCtaText}>{ this.props.label }</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alternativeCtaContainer: {
    paddingTop: 20,
    alignItems: 'baseline'
  },
  alternativeCtaLabel: {
    alignSelf: 'flex-start'
  },
  alternativeCtaButton: {
    height: 24,
    backgroundColor: '#AADD9A',
    borderColor: '#AADD9A',
    borderWidth: 4,
    borderRadius: 4,
    alignSelf: 'flex-end'
  },
  alternativeCtaText: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  },
});
