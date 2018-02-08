import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
  ScrollView,
  Image
} from 'react-native'

import PreviousExerciseList from './PreviousExerciseList'

const downArrow = require('../../../assets/images/downArrow.png')
const hamburger = require('../../../assets/images/hamburgerDark.png')

const DEGREE_INTERPOLATION = { inputRange: [0, 1], outputRange: ['0deg', '180deg'] }
const ANIMATION_DURATION = 200
const NUM_TOP_EXERCISES = 5

export default class NewSpecificExerciseLabelPicker extends Component {
  constructor(props) {
    super(props)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.state = { 
      showingDropdown: false, 
      arrowAngle: new Animated.Value(0)
    }
  }

  toggleDropdown() {
    let newOrientation = this.state.showingDropdown ? 0 : 1
    Animated.timing(
      this.state.arrowAngle, 
      { toValue: newOrientation, duration: ANIMATION_DURATION }
    ).start();
    this.setState({ showingDropdown: !this.state.showingDropdown })
  }

  render() {
    const rotation = this.state.arrowAngle.interpolate(DEGREE_INTERPOLATION)
    const arrowAngle = { transform: [ { rotate: rotation  }, { perspective: 1000 } ] }
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.exerciseDropdown} onPress={this.toggleDropdown} underlayColor='transparent'>
          <View style={styles.exerciseDropdownRow}>
            <Image style={styles.hamburger} source={hamburger} />              
            <Animated.Image style={StyleSheet.flatten([styles.downArrow, arrowAngle])} source={downArrow} />
          </View>
        </TouchableHighlight>
      { this.state.showingDropdown ? 
        <View style={styles.dropdownList}>
          <ScrollView style={styles.modalScrollView}>
            <TouchableHighlight style={styles.newExerciseLabel} onPress={this.props.defineNewLabel} underlayColor='transparent'>
              <Text style={styles.newExerciseLabelText}>(+) Add new</Text>
            </TouchableHighlight>
            { this.props.pastExercises.sort().map((exercise) => {
              return <TouchableHighlight key={exercise} style={styles.exerciseLabel} onPress={ () => { this.props.pickNewLabel(exercise) }} underlayColor='transparent'>
                <Text style={styles.exerciseLabelText}>{ exercise }</Text>
              </TouchableHighlight>
            })}
          </ScrollView>
        </View>
      :
        <PreviousExerciseList
          exercises={ this.props.pastExercises.map((label) => { return { label } }) }
          numExercises={NUM_TOP_EXERCISES}
          cb={ (ex) => this.props.pickNewLabel(ex.label) }
          label="top exercises"
        />
      }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 15,
    flexDirection: 'column'
  },
  newExerciseLabel: {
    padding: 10,
    paddingLeft: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
  },
  newExerciseLabelText: {
    fontSize: 16,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    color: '#508CD8'
  },
  exerciseLabel: {
    padding: 10,
    paddingLeft: 0,
  },
  exerciseLabelText: {
    fontSize: 16,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Light',
    color: '#508CD8'
  },
  exerciseDropdown: {
    backgroundColor: '#F1F1F1',
    borderWidth: 2,
    borderColor: '#C6C6C6',
    margin: 20,
    marginBottom: 0,
    flex: 2,
  },
  exerciseDropdownRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hamburger: {
    marginLeft: 10
  },
  downArrow: {
    marginRight: 10,
  },
  dropdownList: {
    margin: 20,
    marginTop: 0,
    flex: 12,
    borderBottomColor: '#C6C6C6',
    borderBottomWidth: 2,
    borderRightColor: '#C6C6C6',
    borderRightWidth: 2,
    borderLeftColor: '#C6C6C6',
    borderLeftWidth: 2
  },
  modalScrollView: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20
  },
})
