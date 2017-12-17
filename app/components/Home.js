import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  AsyncStorage
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

const hamburger = require('../../assets/images/hamburger.png');
const addButton = require('../../assets/images/addButton.png');

import Widgets from './Widgets'
import StatRow from './StatRow'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this);
    this.newWorkout = this.newWorkout.bind(this);
    this.openBasement = this.openBasement.bind(this);
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

  openBasement() {
    alert('hello')
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
      <View style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.contentContainer}>
          { this.state.loading ?
            <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.8)" />
            :
            <View>
              <View style={styles.topBar}>
                <TouchableHighlight style={styles.hamburgerButton} onPress={this.openBasement} underlayColor='transparent'>
                  <Image style={styles.hamburgerButtonIcon} source={hamburger} />
                </TouchableHighlight>
                <View style={styles.topBarSpacer}></View>
                <View style={styles.userImageHolder}>
                  { this.state.image_url && 
                    <Image style={styles.userImage} source={{uri: this.state.image_url}} />
                  }
                </View>
              </View>
              <View style={styles.yourWeek}>
                <Text style={styles.yourWeekText}>Your week</Text>
              </View>
              <StatRow
                daysWorkedOut={parseInt(this.state.days_worked_out)}
                cardioPoints={parseInt(this.state.cardio_points)}
                strengthPoints={parseInt(this.state.strength_points)}
                varietyPoints={parseInt(this.state.diversity_points)} />
            </View>
          }
        </LinearGradient>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F8F9',
    // marginTop: 160,
    // marginLeft: 160,
    // marginRight: -160,
    // marginBottom: -160
  },
  contentContainer: {
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
  },
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