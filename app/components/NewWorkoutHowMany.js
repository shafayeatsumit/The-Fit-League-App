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

import { AppEventsLogger } from 'react-native-fbsdk'

const Form = t.form.Form;

import DynamicIcon from './DynamicIcon'
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
      kind: 'basic',
      canGoDetailed: props.workoutKind.attributes.has_specific_exercises,
      workoutSchema: { quantity: t.Number },
      workoutValues: {},
      specificWorkouts: { totalQuantity: 0 },
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
    if (this.state.canGoDetailed) {
      let schema = props.workoutKind.attributes.specific_exercise_schema
      this.state.totalField = Object.keys(schema).find((k) => schema[k].total_quantity)
    }
    this.onSpecificWorkoutChange = this.onSpecificWorkoutChange.bind(this)
    this.onChange = this.onChange.bind(this)
    this.forward = this.forward.bind(this)
    this.addNotes = this.addNotes.bind(this)
    this.goBasic = this.goBasic.bind(this)
    this.goDetailed = this.goDetailed.bind(this)
  }

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

  goBasic() {
    this.setState({ kind: 'basic' })
  }

  goDetailed() {
    if (this.state.canGoDetailed) {
      this.setState({ kind: 'detailed' })
    } else {
      // Tried to go detailed
    }
  }

  forward() {
    let self = this
    let { workout } = self.props
    let detailed = this.state.kind == 'detailed'
    AppEventsLogger.logEvent('Entered a workout quantity', { with_specific_exercises: detailed })
    if (detailed) {
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
    const { kind } = this.state
    const detailed = kind == 'detailed'
    const quantity = detailed ? this.state.specificWorkouts.totalQuantity : this.state.workoutValues.quantity
    return (
      <KeyboardAvoidingView behavior='height' style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <NewWorkoutTitle token={this.props.token} text='Log a workout' />
          { this.state.loading ?
            <ActivityIndicator size="large" style={styles.activityIndicator} color="rgba(255, 255, 255, 0.8)" />
          :
            <View style={styles.formContainer}>
              <Text style={styles.howManyUnits}>Quantify your workout</Text>
              <View style={styles.basicVsDetailedBar}>
                <TouchableHighlight style={detailed ? styles.basicVsDetailedButton : styles.basicVsDetailedButtonSelected} onPress={this.goBasic} underlayColor='transparent'>
                  <Text style={styles.basicVsDetailedText}>Quick Entry</Text>
                </TouchableHighlight>
                <TouchableHighlight style={detailed ? styles.basicVsDetailedButtonSelected : styles.basicVsDetailedButton} onPress={this.goDetailed} underlayColor='transparent'>
                  <View style={styles.basicVsDetailedTextColumn}>
                    <Text style={styles.basicVsDetailedText}>Detailed</Text>
                    { !this.state.canGoDetailed && 
                      <Text style={styles.comingSoonText}>Coming Soon!</Text>
                    }
                  </View>
                </TouchableHighlight>
              </View>
              { detailed ? 
                <SpecificExercises
                  token={this.props.token}
                  specificWorkouts={this.state.specificWorkouts}
                  workout={this.props.workout}
                  workoutKind={this.props.workoutKind}
                  totalField={this.state.totalField}
                  specificWorkoutChange={this.onSpecificWorkoutChange} />
              :
                <View>
                  <View style={styles.headerHolder}>
                    <View style={styles.workoutIcon}>
                      <DynamicIcon 
                        label={this.props.workoutKind.attributes.label} 
                        shade={'light'} 
                        {...StyleSheet.flatten(styles.workoutIconImage)} />
                    </View>
                    <View style={styles.workoutLabel}>
                      <Text style={styles.workoutLabelText}>{ this.props.workoutKind.attributes.label }</Text>
                    </View>
                  </View>
                  <Form
                    ref="form"
                    value={this.state.workoutValues}
                    type={t.struct(this.state.workoutSchema)}
                    onChange={this.onChange}
                    options={this.state.options} />
                  <Text style={styles.workoutLabelText}>total {this.props.workoutKind.attributes.unit}s</Text>
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
  basicVsDetailedBar: {
    flexDirection: 'row',
    borderRadius: 20,
    height: 40,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  basicVsDetailedButton: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  basicVsDetailedButtonSelected: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  basicVsDetailedText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '400'
  },
  basicVsDetailedTextColumn: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  comingSoonText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    marginLeft: 5
  },
  formContainer: {
    padding: 20,
    paddingTop: 0,
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
    margin: 10
  },
  addNotes: {
    padding: 10,
  },
  howManyUnits: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  workoutLabel: {
    paddingTop: 10
  },
  workoutLabelText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '400'
  }
});