import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  Platform,
  Keyboard,
} from 'react-native'

import { AppEventsLogger } from 'react-native-fbsdk'

import DynamicIcon from './DynamicIcon'

const topSixify = (arr) => {
  return arr
    .filter((w) => w.attributes.workout_count > 0)
    .sort((a, b) => {
      if (a.attributes.workout_count > b.attributes.workout_count) {
        return -1
      } else if (b.attributes.workout_count > a.attributes.workout_count) {
        return 1
      } else {
        return 0
      }
    })
    .slice(0, 6)
}

const alphabetical = (a, b) => a.attributes.label.localeCompare(b.attributes.label)

import BottomNavBar from './BottomNavBar'
import NewWorkoutTitle from './NewWorkoutTitle'
import WorkoutKindOptions from './WorkoutKindOptions'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

export default class NewWorkoutWhat extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      search: '',
      showingKeyboard: false,
      filteredKinds: this.props.workoutKinds,
      topSix: topSixify(this.props.workoutKinds),
    }
    this.keyboardDidShow = this.keyboardDidShow.bind(this)
    this.keyboardDidHide = this.keyboardDidHide.bind(this)
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

  componentWillMount () {
    let showEv = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow'
    this.keyboardDidShowListener = Keyboard.addListener(showEv, this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow () {
    this.setState({ showingKeyboard: true })
  }

  keyboardDidHide () {
    this.setState({ showingKeyboard: false })
  }
  
  onChange(search) {
    let filteredKinds = this.props.workoutKinds.filter((kind) => {
      let kindLabel = kind.attributes.label.toLowerCase()
      if (kind.attributes.specific_exercise_labels && kind.attributes.specific_exercise_labels.length) {
        kindLabel += kind.attributes.specific_exercise_labels.join(' ').toLowerCase()
      }
      return kindLabel.indexOf(search.toLowerCase()) !== -1
    })
    this.setState({ search, filteredKinds })
  }

  componentDidMount() {
    if (this.state.topSix.length == 0) this.refs.search.focus()
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
            <Text style={styles.header}>Choose workout type</Text>
            <TextInput
              ref="search"
              style={styles.input}
              value={this.state.search}
              tintColor="white"
              selectionColor="white"
              onChangeText={this.onChange} />
            { this.state.showingKeyboard &&
              <View style={styles.listHolder}>
                <ScrollView keyboardShouldPersistTaps={'always'}>
                  { this.state.filteredKinds.sort(alphabetical).map((kind) => {
                    return <TouchableHighlight key={kind.id} onPress={() => this.forward(kind.id)} underlayColor='transparent'>
                        <View style={styles.kindRow}>
                          <DynamicIcon 
                            label={kind.attributes.label} 
                            shade={'dark'} 
                            {...StyleSheet.flatten(styles.workoutIconImage)} />
                            <Text style={styles.kindRowLabel}>{kind.attributes.label}</Text>
                        </View>
                      </TouchableHighlight>
                    })
                  }
                </ScrollView>
              </View>
            }
            { this.state.topSix.length > 0 && !this.state.showingKeyboard &&
              <WorkoutKindOptions kindOptions={this.state.topSix} pickWorkout={this.forward} />
            }
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
  header: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 24,
    marginBottom: 5
  },
  input: {
    fontSize: 14,
    fontFamily: 'Avenir-Light',
    borderWidth: 1,
    borderRadius: 0,
    height: 50,
    paddingLeft: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
  },
  listHolder: {
    flex: 2,
  },
  kindRow: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomColor: '#C6C6C6',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  kindRowLabel: {
    backgroundColor: 'transparent',
    color: 'black',
    fontFamily: 'Avenir-Light',
    fontSize: 14,
    padding: 5,
    paddingLeft: 10
  },
  workoutIconImage: {
    height: 30,
    width: 30,
    borderRadius: 15, 
    borderWidth: 1,
    borderColor: '#768DA1'
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