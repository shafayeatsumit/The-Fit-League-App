import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  StatusBar
} from 'react-native';

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'

export default class Workouts extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);
  }

  render() {
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Your Matchup" />
        <View style={styles.listContainer}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1
  },
  listContainer: {
    flex: 4
  },
  comingSoonText: {
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent'
  }
});