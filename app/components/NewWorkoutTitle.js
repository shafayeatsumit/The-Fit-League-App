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
    let { token } = this.props
    Actions.popTo('home', { token })
  }

  render() {
    return (
      <View style={styles.titleContainer}>
        <View style={styles.centeringPlaceholder}></View>
        <Text style={styles.titleText}>{ this.props.text }</Text>
        <TouchableHighlight style={styles.exButtonContainer} onPress={this.exit} underlayColor='transparent'>
          <Image style={styles.exButton} source={exButton} />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    height: 44,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20
  },
  centeringPlaceholder: {
    width: 44,
    justifyContent: 'flex-start'
  },
  titleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center'
  },
  exButtonContainer: {
    paddingRight: 20,
    paddingTop: 20,
    justifyContent: 'flex-end',
  },
  exButton: {
    width: 24,
    height: 24
  }
})
