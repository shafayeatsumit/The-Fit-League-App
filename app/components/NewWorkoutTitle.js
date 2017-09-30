import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';

const exButton = require('../../assets/images/exButton.png');

import { Actions } from 'react-native-router-flux';

export default class NewWorkoutTitle extends Component {
  constructor(props) {
    super(props)
    this.exit = this.exit.bind(this);
  }

  exit() {
    Actions.pop();
  }

  render() {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.centeringPlaceholder}></View>
        <Text style={styles.titleText}>{ this.props.text }</Text>
        <TouchableHighlight style={styles.exButton} onPress={this.exit} underlayColor='transparent'>
          <Image source={exButton} />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20
  },
  centeringPlaceholder: {
    width: 52,
    justifyContent: 'flex-start'
  },
  titleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: '900',
    justifyContent: 'center'
  },
  exButton: {
    width: 52,
    paddingRight: 20,
    justifyContent: 'flex-end'
  }
})
