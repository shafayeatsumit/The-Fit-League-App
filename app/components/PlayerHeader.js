import React, { Component, PropTypes } from 'react'

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient';

import { Actions } from 'react-native-router-flux'

const exButton = require('../../assets/images/exButton.png')
const hamburger = require('../../assets/images/hamburger.png')

export default class PlayerHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.headerContainer}>
          <View style={styles.topBar}>
            <TouchableHighlight style={styles.hamburgerButton} onPress={this.context.toggleBasement} underlayColor='transparent'>
              <Image style={styles.hamburgerButtonIcon} source={hamburger} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.exButtonHolder} underlayColor='transparent' onPress={Actions.pop}>
              <Image style={styles.exButton} source={exButton} />
            </TouchableHighlight>
          </View>
        </LinearGradient>
      </View>
    )
  }
}

PlayerHeader.contextTypes = {
  toggleBasement: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8'
  },
  headerContainer: {
    flex: 1,
    paddingTop: 35,
    flexDirection: 'column'
  },
  topBar: {
    flexDirection: 'row',
    height: 30
  },
  hamburgerButton: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'flex-start'
  },
  exButtonHolder: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 15,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  exButton: {
    width: 24,
    height: 24
  }
})
