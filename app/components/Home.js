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

const logo = require('../../assets/images/logo.png');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this);
    this.newWorkout = this.newWorkout.bind(this);
    this.onWorkoutAdded = this.onWorkoutAdded.bind(this);
    this.state = { loading: true };
  }

  newWorkout() {
    Actions.newWorkoutWhen({ token: this.props.token, successCallback: this.onWorkoutAdded });
  }

  onWorkoutAdded() {
    // Congratulate?
  }

  loadWeeklyStats() {
    HttpUtils.get('weeks/current', this.props.token)
      .then((responseData) => {
        let { strength_points, cardio_points, diversity_points, days_worked_out} = responseData.data.attributes;
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
          <View style={styles.navbar}>
            <Image style={styles.logo} source={logo} />
          </View>
          { this.state.loading ?
            <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.8)" />
            :
            <View>
              <View style={styles.yourWeek}>
                <Text style={styles.yourWeekText}>Your week</Text>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statCol}>
                  <View style={styles.statLabel}>
                    <Text style={styles.statLabelText}>DAYS</Text>
                  </View>
                  <View style={styles.statNumber}>
                    <Text style={styles.statNumberText}>{ parseInt(this.state.days_worked_out) }</Text>
                  </View>
                </View>
                <View style={styles.statCol}>
                  <View style={styles.statLabel}>
                    <Text style={styles.statLabelText}>CARDIO</Text>
                  </View>
                  <View style={styles.statNumber}>
                    <Text style={styles.statNumberText}>{ parseInt(this.state.cardio_points) }</Text>
                  </View>
                </View>
                <View style={styles.statCol}>
                  <View style={styles.statLabel}>
                    <Text style={styles.statLabelText}>STRENGTH</Text>
                  </View>
                  <View style={styles.statNumber}>
                    <Text style={styles.statNumberText}>{ parseInt(this.state.strength_points) }</Text>
                  </View>
                </View>
                <View style={styles.statCol}>
                  <View style={styles.statLabel}>
                    <Text style={styles.statLabelText}>DIVERSITY</Text>
                  </View>
                  <View style={styles.statNumber}>
                    <Text style={styles.statNumberText}>{ parseInt(this.state.diversity_points) }</Text>
                  </View>
                </View>
              </View>
            </View>
          }
        </LinearGradient>
        <View style={styles.newWorkout}>
          <TouchableHighlight style={styles.newWorkoutButton} onPress={this.newWorkout} underlayColor='#1DD65B'>
            <Text style={styles.newWorkoutButtonPlus}>+</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F8F9'
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  navbar: {
    alignItems: 'center',
    height: 40
  },
  logo: {
    width: 160,
    height: 26
  },
  yourWeek: {
    alignItems: 'center',
    height: 35,
  },
  yourWeekText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: '900'
  },
  statRow: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statCol: {
    flex: 1, 
    flexDirection: 'column'
  },
  statLabel: {
    alignItems: 'center',
  },
  statNumber: {
    alignItems: 'center',
  },
  statLabelText: {
    fontSize: 9,
    fontFamily: 'Avenir-Black',
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'transparent'
  },
  statNumberText: {
    fontSize: 36,
    fontFamily: 'Avenir-Black',
    color: 'white',
    paddingTop: 10,
    backgroundColor: 'transparent'
  },
  newWorkout: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newWorkoutButtonPlus: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Avenir-Black'
  },
  newWorkoutButton: {
    height: 50,
    width: 50,
    backgroundColor: 'rgba(40, 87, 237, 0.89)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 25,
    marginBottom: 10,
    paddingBottom: 2,
    justifyContent: 'center'
  }
});