import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Image
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import LinearGradient from 'react-native-linear-gradient';

const hamburger = require('../../assets/images/hamburger.png');

import StatRow from './StatRow'

export default class HomeHeader extends Component {

  constructor(props) {
    super(props)
    this.myPlayerCard = this.myPlayerCard.bind(this)
  }

  myPlayerCard() {
    Actions.playerCard({ mine: true, image_url: this.props.image_url, token: this.props.token })
  }

  render() {
    return (
      <LinearGradient 
        start={{x: 0, y: 1}} end={{x: 1, y: 0}}
        colors={['#2857ED', '#1DD65B']}
        style={styles.container}>
        <View style={styles.topBar}>     
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
                <TouchableHighlight onPress={this.myPlayerCard} underlayColor='transparent'>
                  <Image style={styles.userImage} source={{uri: this.props.image_url}} />
                </TouchableHighlight>
              }
            </View>
          }
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
    paddingTop: 35,
    flexDirection: 'column'
  },
  topBar: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  yourWeekContainer: {
    flex: 8,
    paddingTop: 20,
    alignItems: 'center',
  },
  loading: {
    flex: 1
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
  }
})
