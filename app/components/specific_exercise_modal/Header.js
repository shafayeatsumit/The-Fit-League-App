import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} from 'react-native';

const exButton = require('../../../assets/images/grayExButton.png')

export default class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.exButton} onPress={this.props.hide} underlayColor='transparent'>
          <Image style={styles.exImage} source={exButton} />
        </TouchableHighlight>
        <Text style={styles.header}>{this.props.header}</Text>
        <Text style={styles.subheader}>{this.props.subheader}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: 'column'
  },
  header: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'black',
    fontSize: 18,
    flex: 1,
  },
  subheader: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: 'black',
    fontSize: 14,
    flex: 1,
  },
  exButton: {
    flex: 1,
    alignSelf: 'flex-end',
    padding: 10
  },
  exImage: {
    width: 32,
    height: 32,
  },
})