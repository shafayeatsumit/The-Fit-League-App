import React, { Component, PropTypes } from 'react';

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
        <View>
          <View style={styles.topBar}>         
            <View style={styles.topBarRow}>
              { !this.props.loading &&  
                <TouchableHighlight style={styles.hamburgerButton} onPress={this.context.toggleBasement} underlayColor='transparent'>
                  <Image style={styles.hamburgerButtonIcon} source={hamburger} />
                </TouchableHighlight>
              }
              <View style={styles.yourWeekContainer}>
                <Text style={styles.yourWeekText}>Your week</Text>
              </View>
              { !this.props.loading &&  
                <View style={styles.userImageHolder}>
                  { this.props.image_url && 
                    <Image style={styles.userImage} source={{uri: this.props.image_url}} />
                  }
                </View>
              }
            </View>
          </View>
          { this.props.loading ?
            <ActivityIndicator size="large" style={styles.loading} color="rgba(255, 255, 255, 0.8)" />
          :
          <StatRow
            daysWorkedOut={parseInt(this.props.days_worked_out)}
            cardioPoints={parseInt(this.props.cardio_points)}
            strengthPoints={parseInt(this.props.strength_points)}
            varietyPoints={parseInt(this.props.diversity_points)} />
          }
        </View>
      </LinearGradient>
    )
  }
}

HomeHeader.contextTypes = {
  toggleBasement: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  topBar: {
    height: 60,
    paddingLeft: 20,
    paddingRight: 20
  },
  topBarRow: {
    flexDirection: 'row',
  },
  yourWeekContainer: {
    flex: 8,
    paddingTop: 20,
    alignItems: 'center',
  },
  loading: {
    paddingTop: 20
  },
  hamburgerButton: {
    flex: 2,
    paddingTop: 10
  },
  userImageHolder: {
    flex: 2,
    alignItems: 'flex-end'
  },
  userImage: {
    borderColor: 'white',
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36,
  },
  yourWeekText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    fontSize: 22,
    backgroundColor: 'transparent',
    fontWeight: '900'
  }
})
