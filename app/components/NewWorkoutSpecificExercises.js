import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard, 
  Platform,
  AlertIOS,
  Image
} from 'react-native';

const Form = t.form.Form
const _ = require('lodash')

import { HttpUtils } from '../services/HttpUtils'
import { Workout } from '../services/Workout'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'

const workoutIcon = require('../../assets/images/workoutIcon.png');
const smallAddButton = require('../../assets/images/smallAddButton.png');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = { flexDirection: 'row' };

export default class NewWorkoutSpecificExercises extends Component {
  constructor(props) {
    super(props)
    this.newExercise = this.newExercise.bind(this)
    this.newExerciseValue = this.newExerciseValue.bind(this)
    this.buildFieldsHash = this.buildFieldsHash.bind(this)
    this.onChange = this.onChange.bind(this)
    this.forward = this.forward.bind(this)
    this.state = { 
      loading: false, 
      specificExercises: [this.newExercise(), this.newExercise()],
      specificExerciseValues: [this.newExerciseValue(), this.newExerciseValue()],
      addedAnExercise: false,
      options: {
        stylesheet,
        fields: this.buildFieldsHash()
      }
    }
    // Awful hack from https://stackoverflow.com/questions/41616457/keyboardavoidingview-reset-height-when-keyboard-is-hidden
    this.keyboardHideListener = this.keyboardHideListener.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  // BEGIN HACKETY HACK HACK
  keyboardHideListener() {
    this.setState({
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey' + new Date().getTime()
    })
  }

  componentDidMount() {
    this.keyboardHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide': 'keyboardWillHide', this.keyboardHideListener)
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove()
  }
  // END HACKETY HACK HACK

  buildFieldsHash() {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let hash = {}
    let fields = Object.keys(schema)
    fields.forEach((k, index) => {
      let stylesheet = _.cloneDeep(t.form.Form.stylesheet)
      stylesheet.formGroup.normal.flex = schema[k].width
      stylesheet.formGroup.error.flex = schema[k].width
      hash[k] = { auto: 'none', stylesheet }
    })
    return hash
  }

  newExercise() {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let exercise = {}
    Object.keys(schema).forEach((k) => exercise[k] = t[schema[k].kind])
    return exercise
  }

  newExerciseValue() {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let exerciseValue = {}
    Object.keys(schema).forEach((k) => exerciseValue[k] = undefined)
    return exerciseValue
  }

  onChange(index) {
    let self = this
    return (value) => {
      let { specificExerciseValues, specificExercises } = self.state
      specificExerciseValues[index] = value
      let newState = { specificExerciseValues, addedAnExercise: true }
      if (index == specificExerciseValues.length - 1) {
        newState.specificExerciseValues.push(self.newExerciseValue())
        specificExercises.push(self.newExercise())
        newState.specificExercises = specificExercises
      }
      self.setState(newState)
    }
  }

  forward() {
    let { workout } = this.props
    let self = this
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let totalField = Object.keys(schema).find((k) => schema[k].total_quantity)
    workout.specific_exercises = self.state.specificExerciseValues.filter((v) => parseInt(v[totalField]))
    let totalQuantity = workout.specific_exercises.map(
      (v) => parseInt(v[totalField])
    ).reduce((sum, value) => sum + value, 0)
    if (workout.specific_exercises.length && totalQuantity != workout.quantity) {
      AlertIOS.alert('Oops!', `You are adding ${ workout.quantity } ${ this.props.workoutKind.attributes.unit }s but your specific exercises add up to ${ totalQuantity } ${ this.props.workoutKind.attributes.unit }s.`)   
    } else {
      self.setState({ loading: true })
      Workout.save(workout, self.props.token, self.props.thisWeek, () => self.setState({ loading: false }))
    }
  }

  render() {
    const schema = this.props.workoutKind.attributes.specific_exercise_schema
    return (
      <KeyboardAvoidingView behavior='height' style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <NewWorkoutTitle text='Log workout' />
          { this.state.loading ?
            <ActivityIndicator size="large" style={styles.activityIndicator} color="rgba(255, 255, 255, 0.8)" />
          :
            <View style={styles.formContainer}>   
              <View style={styles.headerHolder}>
                <View style={styles.workoutIconColumn}>
                  <View style={styles.workoutIcon}>
                    <Image source={workoutIcon} style={styles.workoutIconImage} />
                  </View>
                </View>
                <Text style={styles.workoutKindTitle}>{this.props.workoutKind.attributes.label}</Text>
                <Text style={styles.workoutQuantity}>{this.props.workout.quantity} {this.props.workoutKind.attributes.unit}s</Text>
              </View>
              <ScrollView> 
                <Text style={styles.specificExerciseTitle}>Add specific exercise</Text>
                <View style={styles.labelRow}>
                  { Object.keys(schema).map((k) => {
                    return <View key={k} style={{ flex: schema[k].width }}>
                      <Text style={styles.labelText}>{ schema[k].label }</Text>
                    </View>                  
                  })}
                </View>
                { this.state.specificExercises.map((exercise, index) => {
                  return <Form
                    key={index}
                    value={this.state.specificExerciseValues[index]}
                    onChange={this.onChange(index)}
                    type={t.struct(exercise)}
                    options={this.state.options} />
                  })
                }
              </ScrollView>
            </View>
          }
        </LinearGradient>
        <BottomNavBar forward={this.forward} skipAllowed={!this.state.addedAnExercise} />
      </KeyboardAvoidingView>
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
    padding: 20,
    paddingTop: 5,
    paddingBottom: 0,
    flex: 10,
  },
  activityIndicator: {
    flex: 10
  },
  labelRow: {
    flexDirection: 'row'
  },
  labelText: {
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 12,
    fontFamily: 'Avenir-Black',
    fontWeight: '900'    
  },
  workoutIconColumn: {
    flex: 1,
    alignItems: 'center',
  },
  workoutIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#2857ED',
    alignItems: 'center',
    justifyContent: 'center'
  },
  workoutIconImage: {
    height: 15,
    width: 15
  },
  headerHolder: {
    borderRadius: 2,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 20
  },
  workoutKindTitle: {
    backgroundColor: 'transparent',
    flex: 4,
    color: 'white',
    fontSize: 14,
    padding: 10,
    textAlign: 'left',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  workoutQuantity: {
    backgroundColor: 'transparent',
    flex: 2,
    color: 'white',
    fontSize: 14,
    padding: 10,
    textAlign: 'right',
    fontFamily: 'Avenir-Black',
    fontWeight: '400'
  },
  specificExerciseTitle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 24,
    paddingTop: 25,
    paddingBottom: 25,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  buttonHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newWorkoutButtonPlus: {
    height: 22,
    width: 22
  },
  newWorkoutButton: {
    height: 40,
    width: 40,
    backgroundColor: 'rgba(40, 87, 237, 0.89)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(40, 87, 237, 0.37)',
    shadowOffset: { width: 0, height: 7 },
  }
});