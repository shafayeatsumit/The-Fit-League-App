import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} from 'react-native';

import { Actions } from 'react-native-router-flux'

const hamburger = require('../../assets/images/hamburgerDark.png');
const xOutIcon = require('../../assets/images/xOutDark.png');

export default class OtherHeader extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.topBar}>
            <TouchableHighlight style={styles.hamburgerButton} onPress={this.context.toggleBasement} underlayColor='transparent'>
              <Image  source={hamburger} />
            </TouchableHighlight>
            <View style={styles.topBarSpacer}></View>
            
            <TouchableHighlight style={styles.xOutButton} onPress={()=> Actions.home({token: this.props.token})} underlayColor='transparent'>
              <Image  source={xOutIcon} style={styles.xOutIcon}/>
            </TouchableHighlight>
            
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>{ this.props.title }</Text>
          </View>
        </View>
      </View>
    )
  }
}

OtherHeader.contextTypes = {
  toggleBasement: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: '#F6F7F8'
  },
  topBar: {
    flexDirection: 'row',
    height: 30
  },
  topBarSpacer: {
    flex: 8,
  },
  hamburgerButton: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  xOutButton: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight:20,
  },
  xOutIcon: {
    height:25,
    width:25
  },
  title: {
    alignItems: 'center',
    height: 30
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 20,
    backgroundColor: 'transparent'
  }
})
