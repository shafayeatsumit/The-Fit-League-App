import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard, 
  Platform,
  AlertIOS,
  Image
} from 'react-native';

const Form = t.form.Form;

import { DynamicSourceGenerator } from '../services/DynamicSourceGenerator'
import { Workout } from '../services/Workout'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'
import SpecificExercises from './SpecificExercises'

export default class NewWorkoutHowMany extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      hasSpecificExercises: props.workoutKind.attributes.has_specific_exercises,
      workoutSchema: { quantity: t.Number },
      workoutValues: {},
      specificWorkouts: { totalQuantity: 0 },
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey',
      options: {
        fields: {
          quantity: {
            auto: 'none',
            placeholder: this.props.workoutKind.attributes.quantity_question,
            placeholderTextColor: 'white',
            selectionColor: 'white'
          },
          notes: {
            auto: 'none',
            placeholder: 'Add notes',
            placeholderTextColor: 'white',
            selectionColor: 'white'
          }
        }
      }
    }
    if (this.state.hasSpecificExercises) {
      let schema = props.workoutKind.attributes.specific_exercise_schema
      this.state.totalField = Object.keys(schema).find((k) => schema[k].total_quantity)
    }
    this.onSpecificWorkoutChange = this.onSpecificWorkoutChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.forward = this.forward.bind(this)
    this.addNotes = this.addNotes.bind(this)
    // Awful hack from https://stackoverflow.com/questions/41616457/keyboardavoidingview-reset-height-when-keyboard-is-hidden
    this.keyboardHideListener = this.keyboardHideListener.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  }

  // BEGIN HACKETY HACK HACK
  keyboardHideListener() {
    this.setState({
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey' + new Date().getTime()
    });
  }

  componentDidMount() {
    this.keyboardHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide': 'keyboardWillHide', this.keyboardHideListener);
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove()
  }
  // END HACKETY HACK HACK


  onSpecificWorkoutChange(specificWorkouts) {
    this.setState({ specificWorkouts })
  }

  addNotes() {
    let { workoutSchema } = this.state
    workoutSchema.notes = t.maybe(t.String)
    this.setState({ workoutSchema })
  }

  onChange(workoutValues) {
    this.setState({ workoutValues })
  }

  forward() {
    let self = this
    let { workout } = self.props
    if (self.state.hasSpecificExercises) {
      let { specificWorkouts } = self.state
      workout.quantity = specificWorkouts.totalQuantity
      workout.specific_exercises = specificWorkouts.specificExerciseValues.filter((v) => parseInt(v[self.state.totalField]))
      self.setState({ loading: true })
      Workout.save(workout, self.props.token, self.props.thisWeek, () => self.setState({ loading: false }))
    } else {
      if (self.state.workoutValues.quantity) {
        workout = Object.assign(workout, self.state.workoutValues)
        self.setState({ loading: true })
        Workout.save(workout, self.props.token, self.props.thisWeek, () => self.setState({ loading: false }))
      }
    }
  }

  render() {
    const { hasSpecificExercises } = this.state
    const quantity = hasSpecificExercises ? this.state.specificWorkouts.totalQuantity : this.state.workoutValues.quantity
    return (
      <KeyboardAvoidingView behavior='height' key={this.state.keyboardAvoidingViewKey} style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <NewWorkoutTitle token={this.props.token} text='Log a workout' />
          { this.state.loading ?
            <ActivityIndicator size="large" style={styles.activityIndicator} color="rgba(255, 255, 255, 0.8)" />
          :
            <View style={styles.formContainer}>   
              { hasSpecificExercises ? 
                <SpecificExercises
                  specificWorkouts={this.state.specificWorkouts}
                  workout={this.props.workout}
                  workoutKind={this.props.workoutKind}
                  totalField={this.state.totalField}
                  specificWorkoutChange={this.onSpecificWorkoutChange} />
              :
                <View>
                  <Text style={styles.howManyUnits}>Enter number of {this.props.workoutKind.attributes.unit}s</Text>
                  <View style={styles.headerHolder}>
                    <View style={styles.workoutIcon}>
                      <Image source={DynamicSourceGenerator.call({ label: this.props.workoutKind.attributes.label, shade: 'light', fallback: 'running'})} style={styles.workoutIconImage} />
                    </View>
                  </View>
                  <Form
                    ref="form"
                    value={this.state.workoutValues}
                    type={t.struct(this.state.workoutSchema)}
                    onChange={this.onChange}
                    options={this.state.options} />
                  { !this.state.workoutSchema.notes &&
                    <TouchableHighlight style={styles.addNotes} onPress={this.addNotes} underlayColor='transparent'>
                      <Text style={styles.addNotesText}>Add notes</Text>
                    </TouchableHighlight>
                  }
                </View>
              }
            </View>
          }
        </LinearGradient>
        <BottomNavBar forward={this.forward} hideForward={!quantity} />
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
    flex: 10
  },
  activityIndicator: {
    flex: 10
  },
  workoutIcon: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#2857ED',
    alignItems: 'center',
    justifyContent: 'center'
  },
  workoutIconImage: {
    height: 80,
    width: 80
  },
  headerHolder: {
    alignItems: 'center',
    margin: 10,
    marginBottom: 15,
  },
  addNotes: {
    padding: 10,
  },
  addNotesText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  howManyUnits: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  }
});