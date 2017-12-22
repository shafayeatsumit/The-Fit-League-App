import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Animated,
  Dimensions,
  AsyncStorage,
  StatusBar
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'

import { Actions } from 'react-native-router-flux';

import Widgets from './Widgets'
import HomeHeader from './HomeHeader'
import HamburgerBasement from './HamburgerBasement'

const addButton = require('../../assets/images/addButton.png')

CHATTER_ANIMATION_DURATION = 800
CHATTER_ANIMATION_MARGIN_BUFFER = 500
CHATTER_ANIMATION_START_WIDTH = 150
CHATTER_ANIMATION_END_WIDTH = 25
SCREEN_WIDTH = Dimensions.get('window').width;
CHATTER_ANIMATION_WIDTH_RANGE = SCREEN_WIDTH - (CHATTER_ANIMATION_START_WIDTH / 2)

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this)
    this.newWorkout = this.newWorkout.bind(this)
    this.loadProfile = this.loadProfile.bind(this)
    this.fireChatter = this.fireChatter.bind(this)
    this.randomOffset = this.randomOffset.bind(this)
    this.state = { 
      loading: true,
      chatterIcon: {
        top: new Animated.Value(CHATTER_ANIMATION_MARGIN_BUFFER),
        left: new Animated.Value(this.randomOffset()),
        width: new Animated.Value(CHATTER_ANIMATION_START_WIDTH),
        height: new Animated.Value(CHATTER_ANIMATION_START_WIDTH),
      }
    };
  }

  newWorkout() {
    let thisWeek = this.state
    delete thisWeek.loading
    Actions.newWorkoutWhen({ 
      thisWeek,
      token: this.props.token
    });
  }

  loadProfile() {
    HttpUtils.get('profile', this.props.token)
      .then((responseData) => {
        let { name, image_url } = responseData.data.attributes;
        this.setState({ name, image_url })
      }).done();
  }

  randomOffset() {
    return parseInt(Math.random() * CHATTER_ANIMATION_WIDTH_RANGE)
  }

  loadWeeklyStats() {
    HttpUtils.get('weeks/current', this.props.token)
      .then((responseData) => {
        let { strength_points, cardio_points, diversity_points, days_worked_out } = responseData.data.attributes;
        this.setState({
          strength_points, cardio_points, days_worked_out, diversity_points,
          loading: false
        })
      }).catch((error) => {
        AsyncStorage.removeItem('auth_token');
        this.setState({ loading: false })
      }).done();
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    this.loadWeeklyStats();
    this.loadProfile();
  }

  fireChatter(chatterIconSource) {
    this.setState({ chatterIconSource })
    setTimeout(() => {    
      Animated.timing(this.state.chatterIcon.top, { 
        toValue: -CHATTER_ANIMATION_MARGIN_BUFFER, duration: CHATTER_ANIMATION_DURATION 
      }).start();
      Animated.timing(this.state.chatterIcon.left, { 
        toValue: this.randomOffset(), duration: CHATTER_ANIMATION_DURATION 
      }).start();
      Animated.timing(this.state.chatterIcon.width, { 
        toValue: CHATTER_ANIMATION_END_WIDTH, duration: CHATTER_ANIMATION_DURATION 
      }).start();
      Animated.timing(this.state.chatterIcon.height, { 
        toValue: CHATTER_ANIMATION_END_WIDTH, duration: CHATTER_ANIMATION_DURATION 
      }).start();
      setTimeout(() => {
        this.setState({ chatterIcon: { 
          top: new Animated.Value(CHATTER_ANIMATION_MARGIN_BUFFER), 
          left: new Animated.Value(this.randomOffset()),
          width: new Animated.Value(CHATTER_ANIMATION_START_WIDTH),
          height: new Animated.Value(CHATTER_ANIMATION_START_WIDTH),
        }})  
      }, CHATTER_ANIMATION_DURATION + 10)
    }, 10)
  }

  render() {
    return (
      <HamburgerBasement token={this.props.token} image_url={this.state.image_url}>      
        <HomeHeader style={styles.headerContainer} {...this.state} />
        <View style={styles.widgetsDashboard}>
          <Animated.Image style={StyleSheet.flatten([styles.chatterIcon, this.state.chatterIcon])} source={this.state.chatterIconSource} />
          <Widgets token={this.props.token} fireChatter={this.fireChatter} />
          { !this.state.loading &&
            <TouchableHighlight style={styles.newWorkoutButton} onPress={this.newWorkout} underlayColor='#1DD65B'>
              <Image style={styles.newWorkoutButtonPlus} source={addButton} />
            </TouchableHighlight>
          }
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  widgetsDashboard: {
    flex: 3,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  buttonHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  },
  newWorkoutButtonPlus: {
    height: 39,
    width: 39
  },
  newWorkoutButton: {
    height: 70,
    width: 70,
    position: 'absolute',
    bottom: 10,
    left: (SCREEN_WIDTH / 2) - 35,
    backgroundColor: 'rgba(40, 87, 237, 0.89)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(40, 87, 237, 0.37)',
    shadowOffset: { width: 0, height: 7 },
  },
  chatterIcon: {
    position: 'absolute',
    zIndex: 100
  }
});