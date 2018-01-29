import React, { Component } from 'react'

import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Text
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import { AppEventsLogger } from 'react-native-fbsdk'

const background = require('../../assets/images/basementBackground.png')

export default class SadConnection extends Component {

  componentDidMount() {
    AppEventsLogger.logEvent('Had Slow Connection')
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.backgroundImage} source={background} />
        <Text style={styles.header}>Oops!</Text>
        <Text style={styles.text}>It looks like you have a slow connection.</Text>
        <Text style={styles.text}>TFL works best on a stable network.</Text>
        <TouchableHighlight style={styles.homeButton} onPress={() => Actions.home({ token: this.props.token })} underlayColor='#1DD65B'>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  header: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    fontSize: 32,
  },
  text: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: 'white',
    fontSize: 16,
  },
  backgroundImage: {
    backgroundColor: '#0E2442',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  homeButton: {
    backgroundColor: '#2857ED',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20
  },
  buttonText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    fontSize: 18
  },
});