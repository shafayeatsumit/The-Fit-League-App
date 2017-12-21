import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Image
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const hamburger = require('../../assets/images/hamburger.png');

import StatRow from './StatRow'

export default class HomeHeader extends Component {
  render() {
    return (
      <LinearGradient 
        start={{x: 0, y: 1}} end={{x: 1, y: 0}}
        colors={['#2857ED', '#1DD65B']}
        style={styles.container}>
        { this.props.loading ?
          <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.8)" />
          :
          <View>
            <View style={styles.topBar}>
              <TouchableHighlight style={styles.hamburgerButton} onPress={this.props.toggleBasement} underlayColor='transparent'>
                <Image style={styles.hamburgerButtonIcon} source={hamburger} />
              </TouchableHighlight>
              <View style={styles.topBarSpacer}></View>
              <View style={styles.userImageHolder}>
                { this.props.image_url && 
                  <Image style={styles.userImage} source={{uri: this.props.image_url}} />
                }
              </View>
            </View>
            <View style={styles.yourWeek}>
              <Text style={styles.yourWeekText}>Your week</Text>
            </View>
            <StatRow
              daysWorkedOut={parseInt(this.props.days_worked_out)}
              cardioPoints={parseInt(this.props.cardio_points)}
              strengthPoints={parseInt(this.props.strength_points)}
              varietyPoints={parseInt(this.props.diversity_points)} />
          </View>
        }
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
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
    paddingLeft: 20
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
  yourWeek: {
    alignItems: 'center',
    height: 30
  },
  yourWeekText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    fontSize: 22,
    backgroundColor: 'transparent',
    fontWeight: '900'
  }
})
