import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

const Form = t.form.Form;

const options = {};

import { Actions } from 'react-native-router-flux';

import { HttpUtils } from '../services/HttpUtils'

export default class NewWorkout extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      workoutSchema: { 
        occurred_at: t.Date,
        quantity: t.Number
      }
    }
    this.getWorkoutKinds = this.getWorkoutKinds.bind(this);
    this.save = this.save.bind(this);
  }

  getWorkoutKinds() {
    HttpUtils.get('workout_kinds', this.props.token)
      .then((responseData) => {
        let workoutKinds = {};
        responseData.data.forEach((kind) => {
          workoutKinds[kind.id] = kind.attributes.label;
        })
        let { workoutSchema } = this.state
        workoutSchema.workout_kind_id = t.enums(workoutKinds)
        this.setState({ workoutSchema })
      }).catch((error) => {
        console.log('error!')
        console.log(error.message)
      }).done();
  }

  componentDidMount() {
    this.getWorkoutKinds();
  }

  save() {
    let value = this.refs.form.getValue();
    if (value) {
      HttpUtils.post('workouts', {
        occurred_at: value.occurred_at,
        quantity: value.quantity,
        workout_kind_id: value.workout_kind_id
      }, this.props.token).then((responseData) => {
        this.props.successCallback(responseData);
        Actions.home({ token: this.props.token });
      }).catch((error) => {
        AlertIOS.alert("Sorry! failed to add Workout.", error.message)
      }).done();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Add a workout
        </Text>
        <Form
          ref="form"
          type={t.struct(this.state.workoutSchema)}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.save} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});