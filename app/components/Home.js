import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  // AsyncStorage
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'

import { Actions } from 'react-native-router-flux';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.loadWeeklyStats = this.loadWeeklyStats.bind(this);
    this.newWorkout = this.newWorkout.bind(this);
    this.onWorkoutAdded = this.onWorkoutAdded.bind(this);
    this.state = { loading: true };
  }

  newWorkout() {
    console.log(this.props.token);
    Actions.newWorkout({ token: this.props.token, successCallback: this.onWorkoutAdded });
  }

  onWorkoutAdded() {
    // Congratulate?
  }

  loadWeeklyStats() {
    HttpUtils.get('weeks/current', this.props.token)
      .then((responseData) => {
        let { strength, cardio, days_worked_out, diversity_points } = responseData.data.attributes;
        this.setState({
          strength, cardio, days_worked_out, diversity_points,
          loading: false
        })
      }).catch((error) => {
        console.log('error!')
        console.log(error.message)
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
        { this.state.loading ?
          <ActivityIndicator size="large" />
          :
          <View  style={styles.contentContainer}>
            <Text>Strength: { this.state.strength }</Text>
            <Text>Cardio: { this.state.cardio }</Text>
            <Text>Days: { this.state.days_worked_out }</Text>
            <Text>Diversity: { this.state.diversity_points }</Text>
          </View>
        }
        <View style={styles.newWorkout}>
          <TouchableHighlight style={styles.newWorkoutButton} onPress={this.newWorkout} underlayColor='#99d9f4'>
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
    marginTop: 50,
    padding: 20
  },
  contentContainer: {
    flex: 1
  },
  newWorkout: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newWorkoutButtonPlus: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center'
  },
  newWorkoutButton: {
    height: 50,
    width: 50,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderRadius: 25,
    marginBottom: 10,
    paddingBottom: 2,
    justifyContent: 'center'
  }
});