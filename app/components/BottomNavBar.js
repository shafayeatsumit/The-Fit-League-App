import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';

const backButton = require('../../assets/images/backButton.png');
const forwardButton = require('../../assets/images/forwardButton.png');

import { Actions } from 'react-native-router-flux';

export default class BottomNavBar extends Component {
  constructor(props) {
    super(props)
    this.back = this.back.bind(this);
  }

  back() {
    Actions.pop();
  }

  render() {
    return (
      <View style={styles.bottomBar}>
        <View style={styles.backButton}>
          { !this.props.hideBack && 
          <TouchableHighlight onPress={this.back} underlayColor='#508CD8'>
            <Image source={backButton} />
          </TouchableHighlight> }
        </View>
        { this.props.skipAllowed ? 
          <TouchableHighlight onPress={this.props.forward} underlayColor='#508CD8'>
            <Text style={styles.skipThisStep}>Skip this step</Text>
          </TouchableHighlight>
          :
          <View style={styles.forwardButton}>
            { !this.props.hideForward && 
              <TouchableHighlight onPress={this.props.forward} underlayColor='#508CD8'>
                <Image source={forwardButton} />
              </TouchableHighlight>
            }
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    flex: 1,
    backgroundColor: '#508CD8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    width: 70,
    paddingLeft: 20,
  },
  forwardButton: {
    width: 70,
    paddingRight: 20
  },
  skipThisStep: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'Avenir-Black',
    paddingRight: 20
  }
})
