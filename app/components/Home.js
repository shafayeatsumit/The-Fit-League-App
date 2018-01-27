import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'
import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'
import { Pusher } from '../services/Pusher'

import Widgets from './Widgets'
import HomeHeader from './HomeHeader'
import HamburgerBasement from './HamburgerBasement'

const addButton = require('../../assets/images/addButton.png')

const CHATTER_USER_IMAGE_WIDTH = 75
const CHATTER_ANIMATION_DURATION = 900
const CHATTER_ANIMATION_MARGIN_BUFFER = 500
const CHATTER_ANIMATION_START_WIDTH = 150
const CHATTER_ANIMATION_END_WIDTH = 25
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CHATTER_ANIMATION_WIDTH_RANGE = SCREEN_WIDTH - (CHATTER_ANIMATION_START_WIDTH / 2)

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this)
    this.newWorkout = this.newWorkout.bind(this)
    this.loadProfile = this.loadProfile.bind(this)
    this.saveDeviceToken = this.saveDeviceToken.bind(this)
    this.fireChatter = this.fireChatter.bind(this)
    this.resetChatter = this.resetChatter.bind(this)
    this.generateChatterIconInitialState = this.generateChatterIconInitialState.bind(this)
    this.generateChatterUserImageInitialState = this.generateChatterUserImageInitialState.bind(this)
    this.randomOffset = this.randomOffset.bind(this)
    this.state = { 
      loading: true,
      chatterIcon: this.generateChatterIconInitialState(),
      chatterUserImage: this.generateChatterUserImageInitialState()
    };
  }

  newWorkout() {
    let thisWeek = this.state
    delete thisWeek.loading
    AppEventsLogger.logEvent('Tapped plus to add a workout')
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

  saveDeviceToken() {
    Pusher.setup(this.props.token, (device_token) => {
      HttpUtils.put('profile', { device_token }, this.props.token)
        .then((responseData) => {
          console.log(responseData);
        }).done();
    })
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
      }).done();
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    this.loadWeeklyStats()
    this.loadProfile()
    this.saveDeviceToken()
    AppEventsLogger.logEvent('Viewed Home')
  }

  generateChatterIconInitialState() {
    return {
      display: 'none',
      top: new Animated.Value(CHATTER_ANIMATION_START_WIDTH + SCREEN_HEIGHT), 
      left: new Animated.Value(this.randomOffset()),
      width: new Animated.Value(CHATTER_ANIMATION_START_WIDTH),
      height: new Animated.Value(CHATTER_ANIMATION_START_WIDTH),
    }
  }

  generateChatterUserImageInitialState() {
    return {
      display: 'none',
      top: new Animated.Value(-CHATTER_USER_IMAGE_WIDTH),
      left: 0        
    }
  }

  resetChatter() {
    this.setState({
      chatterIcon: this.generateChatterIconInitialState(),
      chatterUserImage: this.generateChatterUserImageInitialState()
    })
  }

  fireChatter(chatterIconSource, chatterUserImageSource) {
    let { chatterUserImage, chatterIcon } = this.state
    chatterUserImage.left = this.randomOffset()
    chatterUserImage.display = 'flex'
    chatterIcon.display = 'flex'
    this.setState({ 
      chatterIcon, chatterIconSource, chatterUserImage, chatterUserImageSource
    }, () => {
      Animated.timing(this.state.chatterIcon.top, { 
        toValue: -1 * (CHATTER_ANIMATION_END_WIDTH + (SCREEN_HEIGHT / 3)), duration: CHATTER_ANIMATION_DURATION 
      }).start();
      Animated.timing(this.state.chatterUserImage.top, { 
        toValue: -0.1 * CHATTER_USER_IMAGE_WIDTH, duration: CHATTER_ANIMATION_DURATION / 2
      }).start();
      Animated.timing(this.state.chatterIcon.left, { 
        toValue: chatterUserImage.left + CHATTER_ANIMATION_END_WIDTH, duration: CHATTER_ANIMATION_DURATION 
      }).start();
      Animated.timing(this.state.chatterIcon.width, { 
        toValue: CHATTER_ANIMATION_END_WIDTH, duration: CHATTER_ANIMATION_DURATION 
      }).start();
      Animated.timing(this.state.chatterIcon.height, { 
        toValue: CHATTER_ANIMATION_END_WIDTH, duration: CHATTER_ANIMATION_DURATION 
      }).start();
      setTimeout(() => {
        Animated.timing(this.state.chatterUserImage.top, { 
          toValue: -CHATTER_USER_IMAGE_WIDTH, duration: CHATTER_ANIMATION_DURATION / 2
        }).start(this.resetChatter);
      }, CHATTER_ANIMATION_DURATION)
    })
  }

  render() {
    return (
      <HamburgerBasement token={this.props.token} image_url={this.state.image_url}>
        <Animated.Image style={StyleSheet.flatten([styles.chatterUserImage, this.state.chatterUserImage])} source={this.state.chatterUserImageSource} />
        <HomeHeader {...this.state} token={this.props.token} />
        <View style={styles.widgetsDashboard}>
          <Animated.Image style={StyleSheet.flatten([styles.chatterIcon, this.state.chatterIcon])} source={this.state.chatterIconSource} />
          <Widgets token={this.props.token} image_url={this.props.image_url} fireChatter={this.fireChatter} />
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
    height: 37,
    width: 37
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
  },
  chatterUserImage: {
    position: 'absolute',
    zIndex: 200,
    height: CHATTER_USER_IMAGE_WIDTH,
    width: CHATTER_USER_IMAGE_WIDTH,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: CHATTER_USER_IMAGE_WIDTH / 2,
  }
});