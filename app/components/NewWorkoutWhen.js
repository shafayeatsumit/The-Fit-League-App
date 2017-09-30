import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  AlertIOS
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


// Form.stylesheet.datepicker.normal.textColor = 'white';
// Form.stylesheet.datepicker.error.textColor = 'white';

import { HttpUtils } from '../services/HttpUtils'
import { DateConfig } from '../services/DateConfig'

import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

export default class NewWorkoutWhen extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      workoutSchema: { when: t.Date },
      options: {
        fields: {
          when: {
            auto: 'none',
            config: DateConfig          
          }
        }
      }
    }
    this.getWorkoutKinds = this.getWorkoutKinds.bind(this);
    this.forward = this.forward.bind(this);
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

  componentDidMount() {
    this.getWorkoutKinds();
  }

  forward() {
    let value = this.refs.form.getValue();
    if (value && value.when && this.state.workoutKinds) {
      Actions.newWorkoutWhat({ 
        workout: { occurred_at: value.when },
        workoutKinds: this.state.workoutKinds,
        token: this.props.token, 
        successCallback: this.props.successCallback });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <NewWorkoutTitle text='Log or Schedule a workout' />
          <View style={styles.formContainer}>
            <Form
              ref="form"
              type={t.struct(this.state.workoutSchema)}
              options={this.state.options} />
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
  formContainer: {
    paddingTop: 20,
    flex: 10
  }
});