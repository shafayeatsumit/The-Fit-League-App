import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

const Form = t.form.Form;

Form.stylesheet.controlLabel.normal.fontSize = 24;
Form.stylesheet.controlLabel.error.fontSize = 24;
Form.stylesheet.controlLabel.normal.color = 'white';
Form.stylesheet.controlLabel.error.color = 'white';
Form.stylesheet.controlLabel.normal.fontFamily = 'Avenir-Black';
Form.stylesheet.controlLabel.error.fontFamily = 'Avenir-Black';

Form.stylesheet.textbox.normal.fontSize = 14;
Form.stylesheet.textbox.error.fontSize = 14;
Form.stylesheet.textbox.normal.fontFamily = 'Avenir-Light';
Form.stylesheet.textbox.error.fontFamily = 'Avenir-Light';
Form.stylesheet.textbox.normal.borderWidth = 1;
Form.stylesheet.textbox.error.borderWidth = 1;
Form.stylesheet.textbox.normal.borderRadius = 0;
Form.stylesheet.textbox.error.borderRadius = 0;
Form.stylesheet.textbox.normal.height = 50;
Form.stylesheet.textbox.error.height = 50;
Form.stylesheet.textbox.normal.paddingLeft = 15;
Form.stylesheet.textbox.error.paddingLeft = 15;
Form.stylesheet.textbox.normal.backgroundColor = 'rgba(255, 255, 255, 0.10)';
Form.stylesheet.textbox.error.backgroundColor = 'rgba(255, 255, 255, 0.10)';
Form.stylesheet.textbox.normal.borderColor = 'rgba(255, 255, 255, 0.25)';
Form.stylesheet.textbox.error.borderColor = 'rgba(255, 255, 255, 0.25)';
Form.stylesheet.textbox.normal.color = 'white';
Form.stylesheet.textbox.error.color = 'white';

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
    let { workout, specificExercises } = props
    specificExercises = specificExercises || []
    let kind = specificExercises.length > 0 ? 'detailed' : 'basic'
    let quantity = workout.attributes && workout.attributes.quantity ? workout.attributes.quantity : undefined
    this.state = {
      kind,
      loading: false,
      canGoDetailed: props.workoutKind.attributes.has_specific_exercises,
      workoutSchema: { quantity: t.Number },
      workoutValues: { quantity },
      specificWorkouts: { totalQuantity: quantity || 0, specificExercises },
      options: {
        fields: {
          quantity: {
            auto: 'none',
            placeholder: '# of total ' + this.props.workoutKind.attributes.unit + 's',
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
      AppEventsLogger.logEvent('Tapped Detailed')
      this.setState({ kind: 'detailed' })
    } else {
      AppEventsLogger.logEvent('Tapped Detailed (Coming soon)')
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
      workout.specific_exercises = specificWorkouts.specificExercises.filter((v) => parseInt(v[self.state.totalField]))
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
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <NewWorkoutTitle token={this.props.token} backTo={this.props.workout.id ? 'workouts' : 'home'} text='Log a workout' />
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
                  <View style={styles.quantityForm}>
                    <Form
                      ref="form"
                      value={this.state.workoutValues}
                      type={t.struct(this.state.workoutSchema)}
                      onChange={this.onChange}
                      options={this.state.options} />
                  </View>
                </View>
              }
            </View>
          }
        </LinearGradient>
        <BottomNavBar hideBack={this.props.workout.id} forward={this.forward} hideForward={!quantity} />
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
    fontFamily: 'Avenir-Light',
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
    fontFamily: 'Avenir-Light',
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
    fontFamily: 'Avenir-Black'
  },
  workoutLabel: {
    paddingTop: 10
  },
  quantityForm: {
    paddingLeft: 75,
    paddingRight: 75
  },
  workoutLabelText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Avenir-Light',
  }
});