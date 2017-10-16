import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  DatePickerIOS,
  DatePickerAndroid,
  Platform
} from 'react-native';

const Form = t.form.Form;

// TODO: Where should these live? Should they really be global?

Form.stylesheet.controlLabel.normal.backgroundColor = 'transparent';
Form.stylesheet.controlLabel.error.backgroundColor = 'transparent';
Form.stylesheet.controlLabel.normal.textAlign = 'center';
Form.stylesheet.controlLabel.error.textAlign = 'center';

Form.stylesheet.dateValue.normal.backgroundColor = 'transparent';
Form.stylesheet.dateValue.error.backgroundColor = 'transparent';
Form.stylesheet.dateValue.normal.color = 'white';
Form.stylesheet.dateValue.error.color = 'white';
Form.stylesheet.dateValue.normal.fontFamily = 'Avenir-Black';
Form.stylesheet.dateValue.error.fontFamily = 'Avenir-Black';
Form.stylesheet.dateValue.normal.textAlign = 'center';
Form.stylesheet.dateValue.error.textAlign = 'center';
Form.stylesheet.dateValue.normal.fontSize = 24;
Form.stylesheet.dateValue.error.fontSize = 24;

import { HttpUtils } from '../services/HttpUtils'

import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

export default class NewWorkoutWhen extends Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
    this.onDateChange = this.onDateChange.bind(this)
    this.getWorkoutKinds = this.getWorkoutKinds.bind(this)
    this.forward = this.forward.bind(this)
  }

  getWorkoutKinds() {
    HttpUtils.get('workout_kinds', this.props.token)
      .then((responseData) => {
        this.setState({ workoutKinds: responseData.data });
      }).catch((error) => {
        console.log('error!');
        console.log(error.message);
      }).done();
  }

  onDateChange(date) {
    this.setState({ date })
  }

  componentDidMount() {
    this.getWorkoutKinds()
  }

  forward() {
    if (this.state.workoutKinds) {
      Actions.newWorkoutWhat({ 
        workout: { occurred_at: this.state.date },
        workoutKinds: this.state.workoutKinds,
        token: this.props.token,
        thisWeek: this.props.thisWeek });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <NewWorkoutTitle token={this.props.token} text='Log a workout' />
          <View style={styles.formContainer}>
            <Text style={styles.dateHeader}>Select a date and time</Text>
            { Platform.OS === 'android' ?
              <DatePickerAndroid
                date={this.state.date}
                style={styles.datePicker}
                mode="spinner"
                onDateChange={this.onDateChange} />
              :
              <DatePickerIOS
                style={styles.datePicker}
                date={this.state.date}
                mode="datetime"
                onDateChange={this.onDateChange} />
            }
          </View>
        </LinearGradient>
        <BottomNavBar forward={this.forward} hideBack={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  backgroundGradient: {
    flex: 5,
    flexDirection: 'column',
  },
  dateHeader: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 24,
    marginBottom: 5
  },
  timeHeader: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    marginBottom: 5
  },
  datePicker: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
    margin: 20
  },
  formContainer: {
    paddingTop: 20,
    flex: 10
  }
});