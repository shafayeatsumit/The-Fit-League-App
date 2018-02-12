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

export default class OtherHeader extends Component {
  constructor(props) {
    super(props)
    this.myPlayerCard = this.myPlayerCard.bind(this)
  }

  myPlayerCard() {
    Actions.playerCard({ mine: true, image_url: this.props.image_url, token: this.props.token })
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.topBar}>
            <TouchableHighlight style={styles.hamburgerButton} onPress={this.context.toggleBasement} underlayColor='transparent'>
              <Image style={styles.hamburgerButtonIcon} source={hamburger} />
            </TouchableHighlight>
            <View style={styles.topBarSpacer}></View>
            <View style={styles.userImageHolder}>
              { this.props.image_url && 
                <TouchableHighlight onPress={this.myPlayerCard} underlayColor='transparent'>
                  <Image style={styles.userImage} source={{uri: this.props.image_url}} />
                </TouchableHighlight>
              }
            </View>
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
  userImageHolder: {
    flex: 1,
    paddingRight: 20
  },
  userImage: {
    borderColor: 'white',
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36,
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
