import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

const Form = t.form.Form;

Form.stylesheet.controlLabel.normal.fontSize = 24;
Form.stylesheet.controlLabel.error.fontSize = 24;
Form.stylesheet.controlLabel.normal.color = 'white';
Form.stylesheet.controlLabel.error.color = 'white';
Form.stylesheet.controlLabel.normal.fontFamily = 'Avenir-Black';
Form.stylesheet.controlLabel.error.fontFamily = 'Avenir-Black';
Form.stylesheet.controlLabel.normal.fontWeight = '900';
Form.stylesheet.controlLabel.error.fontWeight = '900';

Form.stylesheet.textbox.normal.fontSize = 14;
Form.stylesheet.textbox.error.fontSize = 14;
Form.stylesheet.textbox.normal.fontFamily = 'Avenir';
Form.stylesheet.textbox.error.fontFamily = 'Avenir';
Form.stylesheet.textbox.normal.fontWeight = '300';
Form.stylesheet.textbox.error.fontWeight = '300';
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

const options = {
  fields: {
    text: {
      label: 'Choose workout type',
      placeholder: 'Search',
      placeholderTextColor: 'white',
      selectionColor: 'white'
    }
  }
}


const topSixify = arr => arr.slice(0, 6)

import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'
import WorkoutKindOptions from './WorkoutKindOptions'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

const Search = t.struct({ text: t.String });

export default class NewWorkoutWhat extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      search: '',
      topEight: topSixify(this.props.workoutKinds),
    }
    this.forward = this.forward.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  forward(workoutId) {
    if (workoutId) {
      let workout = this.props.workout
      workout.workout_kind_id = workoutId;
      let workoutKind = null
      let i = 0
      while (workoutKind === null && i < this.props.workoutKinds.length) {
        let kind = this.props.workoutKinds[i]
        if (kind.id === workoutId) workoutKind = kind
        i += 1
      }
      AppEventsLogger.logEvent('Picked workout kind')
      Actions.newWorkoutHowMany({ 
        workout, workoutKind,
        token: this.props.token, 
        thisWeek: this.props.thisWeek });
    }
  }

  onChange(search) {
    let topEight = topSixify(this.props.workoutKinds.filter((kind) => {
      let kindLabel = kind.attributes.label.toLowerCase()
      if (kind.attributes.specific_exercise_labels && kind.attributes.specific_exercise_labels.length) {
        kindLabel += kind.attributes.specific_exercise_labels.join(' ').toLowerCase()
      }
      return kindLabel.indexOf(search.text.toLowerCase()) !== -1
    }))
    this.setState({ search, topEight })
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
            <Form
              ref="form"
              type={Search}
              value={this.state.search}
              onChange={this.onChange}
              options={options} />
            <WorkoutKindOptions kindOptions={this.state.topEight} pickWorkout={this.forward} />
          </View>
        </LinearGradient>
        <BottomNavBar hideForward={true} />
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
    padding: 20,
    paddingTop: 0,
    flex: 10
  }
});