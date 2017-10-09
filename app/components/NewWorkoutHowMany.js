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

import { Workout } from '../services/Workout'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'

const workoutIcon = require('../../assets/images/workoutIcon.png');

export default class NewWorkoutHowMany extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      loading: false,
      workoutSchema: { quantity: t.Number, notes: t.maybe(t.String) },
      keyboardAvoidingViewKey: 'keyboardAvoidingViewKey',
      options: {
        fields: {
          quantity: {
            auto: 'none',
            placeholder: this.props.workoutKind.attributes.quantity_question,
            placeholderTextColor: 'white'
          },
          notes: {
            auto: 'none',
            placeholder: 'Add notes',
            placeholderTextColor: 'white'
          }
        }
      }
    }
    this.forward = this.forward.bind(this);
    // Awful hack from https://stackoverflow.com/questions/41616457/keyboardavoidingview-reset-height-when-keyboard-is-hidden
    this.keyboardHideListener = this.keyboardHideListener.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
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

  forward() {
    let value = this.refs.form.getValue();
    if (value && value.quantity) {
      let workout = this.props.workout
      workout.quantity = value.quantity;
      workout.notes = value.notes;
      if (this.props.workoutKind.attributes.has_specific_exercises) {
        Actions.newWorkoutSpecificExercises(Object.assign(this.props, { workout }));
      } else {
        let self = this
        self.setState({ loading: true })
        Workout.save(workout, self.props.token, self.props.thisWeek, () => self.setState({ loading: false }))
      }
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior='height' key={this.state.keyboardAvoidingViewKey} style={styles.container}>
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
                <View style={styles.workoutIcon}>
                  <Image source={workoutIcon} style={styles.workoutIconImage} />
                </View>
              </View>
              <Text style={styles.workoutKindTitle}>{this.props.workoutKind.attributes.label}</Text>
              <Form
                ref="form"
                type={t.struct(this.state.workoutSchema)}
                options={this.state.options} />
            </View>
          }
        </LinearGradient>
        <BottomNavBar forward={this.forward} />
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
    height: 40,
    width: 40
  },
  headerHolder: {
    alignItems: 'center'
  },
  workoutKindTitle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 25,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  }
});