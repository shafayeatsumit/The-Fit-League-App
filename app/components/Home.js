import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  AsyncStorage,
  StatusBar
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'

import { Actions } from 'react-native-router-flux';
const addButton = require('../../assets/images/addButton.png');

import Widgets from './Widgets'
import HomeHeader from './HomeHeader'
import HamburgerBasement from './HamburgerBasement'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this);
    this.newWorkout = this.newWorkout.bind(this);
    this.loadProfile = this.loadProfile.bind(this);
    this.state = { loading: true };
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
    // setTimeout(() => {
    //   try {
    //     AsyncStorage.removeItem('auth_token');
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }, 1000)
  }

  render() {
    return (
      <HamburgerBasement token={this.props.token} image_url={this.state.image_url}>
        <HomeHeader style={styles.headerContainer} {...this.state} />
        <View style={styles.widgetsDashboard}>
          <Widgets token={this.props.token} />
          <View style={styles.buttonHolder}>
            { !this.state.loading &&
              <TouchableHighlight style={styles.newWorkoutButton} onPress={this.newWorkout} underlayColor='#1DD65B'>
                <Image style={styles.newWorkoutButtonPlus} source={addButton} />
              </TouchableHighlight>
            }
          </View>
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
    alignItems: 'center'
  },
  newWorkoutButtonPlus: {
    height: 39,
    width: 39
  },
  newWorkoutButton: {
    height: 70,
    width: 70,
    backgroundColor: 'rgba(40, 87, 237, 0.89)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 35,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(40, 87, 237, 0.37)',
    shadowOffset: { width: 0, height: 7 },
  }
});