import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  DatePickerIOS,
  TimePickerAndroid,
  DatePickerAndroid,
  TouchableHighlight,
  Platform
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

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
    this.state = { date: (props.workout ? new Date(props.workout.attributes.occurred_at) : new Date()) }
    this.onDateChange = this.onDateChange.bind(this)
    this.pickTimeAndroid = this.pickTimeAndroid.bind(this)
    this.pickDateAndroid = this.pickDateAndroid.bind(this)
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

  async pickTimeAndroid(date) {
    try {
      const currentDate = new Date()
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        is24Hour: false,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        date.setHours(hour)
        date.setMinutes(minute)
        Actions.newWorkoutWhat({ 
          workout: { occurred_at: date, occurred_at_timezone: date.getTimezoneOffset() / -60 },
          workoutKinds: this.state.workoutKinds,
          token: this.props.token,
          thisWeek: this.props.thisWeek })
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  async pickDateAndroid() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({ 
        date: new Date() 
      }); 
      if (action !== DatePickerAndroid.dismissedAction) {
        this.pickTimeAndroid(new Date(year, month, day))
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  forward() {
    if (this.state.workoutKinds) {
      AppEventsLogger.logEvent('Picked a time of workout')
      Actions.newWorkoutWhat({ 
        workout: { occurred_at: this.state.date, occurred_at_timezone: this.state.date.getTimezoneOffset() / -60 },
        workoutKinds: this.state.workoutKinds,
        token: this.props.token,
        thisWeek: this.props.thisWeek });
    } else {
      AppEventsLogger.logEvent('Failed to load WorkoutKinds in time')
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
                <TouchableHighlight style={styles.pickDateButton} onPress={this.pickDateAndroid} underlayColor='transparent'>
                  <Text style={styles.pickDateText}>Pick a Date</Text>
                </TouchableHighlight>
              :
              <DatePickerIOS
                style={styles.datePicker}
                date={this.state.date}
                mode="datetime"
                minuteInterval={10}
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
  },
  pickDateButton: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#508CD8',
    height: 60
  },
  pickDateText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 24,
  }
});