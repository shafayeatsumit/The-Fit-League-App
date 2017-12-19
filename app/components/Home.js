import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image,
  AsyncStorage
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

const hamburger = require('../../assets/images/hamburger.png');
const addButton = require('../../assets/images/addButton.png');
const basementBackground = require('../../assets/images/basementBackground.png');
const badge = require('../../assets/images/badge.png');
const logo = require('../../assets/images/logo.png');

const VERTICAL_MARGIN_ANIMATION = 20;
const HORIZONTAL_MARGIN_ANIMATION = 180;

import Widgets from './Widgets'
import StatRow from './StatRow'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this);
    this.newWorkout = this.newWorkout.bind(this);
    this.toggleBasement = this.toggleBasement.bind(this);
    this.hideBasement = this.hideBasement.bind(this);
    this.loadProfile = this.loadProfile.bind(this);
    this.state = { 
      loading: true,
      basementShowing: false,
      basementSpace: {
        marginTop: new Animated.Value(0),
        marginLeft: new Animated.Value(0),
        marginRight: new Animated.Value(0),
        marginBottom: new Animated.Value(0)
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

  hideBasement() {
    if (this.state.basementShowing) this.toggleBasement();
  }

  toggleBasement() {
    let margins = this.state.basementShowing ? { 
      marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0
    } : {
      marginTop: VERTICAL_MARGIN_ANIMATION, marginLeft: HORIZONTAL_MARGIN_ANIMATION, marginRight: -HORIZONTAL_MARGIN_ANIMATION, marginBottom: -VERTICAL_MARGIN_ANIMATION - 150
    }
    Object.keys(margins).forEach((key) => {
      Animated.timing(this.state.basementSpace[key], { 
        easing: Easing.elastic(), toValue: margins[key], duration: 250 
      }).start();       
    })
    this.setState({ basementShowing: !this.state.basementShowing })
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
    const { basementSpace } = this.state
    return (
      <View style={styles.basement}>
        { this.state.basementShowing &&
          <Image
            style={styles.basementBackgroundImage}
            source={basementBackground} />
        }
        { this.state.basementShowing &&
          <View style={styles.basementIconRow}>
            <View style={styles.basementBadge}>
              <Image
                style={styles.basementBadgeIcon}
                resizeMode='contain'
                source={badge} />
            </View>
            <View style={styles.basementLogo}>
              <Image
                style={styles.basementLogoIcon}
                resizeMode='contain'
                source={logo} />
            </View>
          </View>
        }
        <TouchableWithoutFeedback onPress={this.hideBasement}>
          <Animated.View style={
            StyleSheet.flatten([styles.container, basementSpace])}>
            <LinearGradient 
              start={{x: 0, y: 1}} end={{x: 1, y: 0}}
              colors={['#2857ED', '#1DD65B']}
              style={styles.contentContainer}>
              { this.state.loading ?
                <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.8)" />
                :
                <View>
                  <View style={styles.topBar}>
                    <TouchableHighlight style={styles.hamburgerButton} onPress={this.toggleBasement} underlayColor='transparent'>
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
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  basement: {
    backgroundColor: '#0E2442',
    flex: 1,
  },
  basementBackgroundImage: {
    backgroundColor: '#0E2442',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  basementIconRow: {
    height: 140,
    padding: 40,
    flexDirection: 'row',
  },
  basementBadge: {
    flex: 1,
    padding: 10,
  },
  basementBadgeIcon: {
    width: '100%',
    height: '100%'
  },
  basementLogo: {
    flex: 4,
  },
  basementLogoIcon: {
    width: '100%',
    height: '100%'

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F8F9'
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