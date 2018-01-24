import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  StatusBar,
  ActivityIndicator
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

import { AppEventsLogger } from 'react-native-fbsdk'

import { HttpUtils } from '../services/HttpUtils'

import HamburgerBasement from './HamburgerBasement'
import PlayerHeader from './PlayerHeader'

const hamburger = require('../../assets/images/hamburger.png')

export default class PlayerCard extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    // Get the user data
    HttpUtils.get('rules', this.props.token)
      .then((responseData) => {
        this.setState({ rules: responseData.data, loading: false })
      }).done()
    AppEventsLogger.logEvent(this.props.mine ? 'Viewed My Card' : 'Viewed Player Card')
  }

  render() {
    return (
      <HamburgerBasement token={this.props.token} image_url={this.props.image_url}>
        <PlayerHeader style={styles.headerContainer} {...this.props} />
        <View style={styles.container}>
          { this.state.loading ? 
            <View>
              <ActivityIndicator size="large" color="#818D9C" />
            </View>
            :
            <View>
              <Text>Player details here</Text>
            </View>
          }
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
  topBar: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
  },
  hamburgerButton: {
    flex: 2,
    paddingTop: 10
  },
  container: {
    flex: 8,
    borderTopColor: '#D5D7DC',
    borderTopWidth: 1,
    padding: 10
  }
});