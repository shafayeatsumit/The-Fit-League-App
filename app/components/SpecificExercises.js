import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  AlertIOS,
  Image,
  TouchableHighlight
} from 'react-native';

import DynamicIcon from './DynamicIcon'
import NewSpecificExerciseModal from './specific_exercise_modal/NewSpecificExerciseModal'

const Form = t.form.Form
const _ = require('lodash')

const smallAddButton = require('../../assets/images/smallAddButton.png')
const addButton = require('../../assets/images/addButton.png')

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = { flexDirection: 'row' };

export default class SpecificExercises extends Component {
  constructor(props) {
    super(props)
    this.newExercise = this.newExercise.bind(this)
    this.newExerciseValue = this.newExerciseValue.bind(this)
    this.addNewExercise = this.addNewExercise.bind(this)
    this.buildFieldsHash = this.buildFieldsHash.bind(this)
    this.onChange = this.onChange.bind(this)
    this.newExercisesModal = this.newExercisesModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.applyNewState = this.applyNewState.bind(this)
    this.state = { 
      loading: false, 
      totalQuantity: 0,
      newExercisesModalVisible: false,
      options: {
        stylesheet,
        fields: this.buildFieldsHash()
      }
    }
    // Should probably store this state on the parent... (NewWorkoutHowMany)
    if (props.specificWorkouts.specificExercises) {
      this.state.specificExercises = props.specificWorkouts.specificExercises
      this.state.specificExerciseValues = props.specificWorkouts.specificExerciseValues
    } else {
      this.state.specificExercises = []
      this.state.specificExerciseValues = []
    }
  }

  buildFieldsHash() {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let hash = {}
    let fields = Object.keys(schema)
    fields.forEach((k, index) => {
      let stylesheet = _.cloneDeep(t.form.Form.stylesheet)
      stylesheet.formGroup.normal.flex = schema[k].width
      stylesheet.formGroup.error.flex = schema[k].width
      hash[k] = { auto: 'none', selectionColor: 'white', stylesheet }
    })
    return hash
  }

  newExercise() {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let exercise = {}
    Object.keys(schema).forEach((k) => exercise[k] = t[schema[k].kind])
    return exercise
  }

  newExerciseValue(schemaAttributes) {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let exerciseValue = {}
    Object.keys(schema).forEach((k) => {
      exerciseValue[k] = schemaAttributes ? schemaAttributes[k] : undefined
    })
    return exerciseValue
  }

  hideModal() {
    this.setState({ newExercisesModalVisible: false })
  }

  newExercisesModal() {
    this.setState({ newExercisesModalVisible: true })
  }

  applyNewState(newState) {
    let self = this
    newState.totalQuantity = newState.specificExerciseValues.map(
      (v) => v[self.props.totalField] ? parseInt(v[self.props.totalField]) : 0
    ).reduce((sum, value) => sum + value, 0)
    self.props.specificWorkoutChange(newState)
    self.setState(newState)
  }

  addNewExercise(schemaAttributes) {
    let self = this
    let { specificExerciseValues, specificExercises } = this.state
    let newState = { specificExerciseValues, specificExercises }
    newState.specificExerciseValues.push(this.newExerciseValue(schemaAttributes))
    newState.specificExercises.push(this.newExercise())
    this.applyNewState(newState)
  }

  onChange(index) {
    return (value) => {
      let self = this
      let { specificExerciseValues, specificExercises } = self.state
      specificExerciseValues[index] = value
      let newState = { specificExerciseValues, specificExercises }
      if (index == specificExerciseValues.length - 1) {
        newState.specificExerciseValues.push(self.newExerciseValue())
        newState.specificExercises.push(self.newExercise())
      }
      this.applyNewState(newState)
    }
  }

  render() {
    const workoutKindAttrs = this.props.workoutKind.attributes
    const schema = workoutKindAttrs.specific_exercise_schema
    const pastExercises = workoutKindAttrs.specific_exercise_labels
    return (
      <View>
        <NewSpecificExerciseModal
          cb={this.addNewExercise}
          workoutKindId={this.props.workoutKind.id}
          schema={schema}
          token={this.props.token}
          hide={this.hideModal}
          pastExercises={pastExercises}
          visible={this.state.newExercisesModalVisible}
        />
        <View style={styles.headerHolder}>
          <View style={styles.workoutIconColumn}>
            <View style={styles.workoutIcon}>
              <DynamicIcon 
                label={workoutKindAttrs.label} 
                shade={'light'} 
                {...StyleSheet.flatten(styles.workoutIconImage)} />
            </View>
          </View>
          <Text style={styles.workoutKindTitle}>{workoutKindAttrs.label}</Text>
          <Text style={styles.workoutQuantity}>{this.state.totalQuantity} total {workoutKindAttrs.unit}s</Text>
        </View>
        { this.state.specificExercises.length > 0 &&
          <View style={styles.labelRow}>
            { Object.keys(schema).map((k) => {
              return <View key={k} style={{ flex: schema[k].width }}>
                <Text style={styles.labelText}>{ schema[k].label }</Text>
              </View>                  
            })}
          </View>
        }
        <ScrollView style={styles.scrollView}> 
          { this.state.specificExercises.map((exercise, index) => {
            return <Form
              key={index}
              value={this.state.specificExerciseValues[index]}
              onChange={this.onChange(index)}
              type={t.struct(exercise)}
              options={this.state.options} />
            })
          }
          <View>
          { pastExercises.length > 0 &&
            <TouchableHighlight onPress={this.newExercisesModal} underlayColor='transparent'>
              <View style={styles.newExerciseRow}>
                <View style={styles.newExerciseButton}>
                  <Image style={styles.newExerciseButtonPlus} source={addButton} />
                </View>
                <Text style={styles.newExerciseLink}>Add a specific exercise</Text>
              </View>
            </TouchableHighlight>
          }
          </View>
          <View style={styles.spacer}></View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  spacer: {
    height: 130
  },
  workoutIconColumn: {
    flex: 1,
    alignItems: 'center',
  },
  workoutIcon: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  workoutIconImage: {
    height: 30,
    width: 30
  },
  headerHolder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 15,
    marginTop: 10,
    marginBottom: 10
  },
  workoutKindTitle: {
    backgroundColor: 'transparent',
    flex: 4,
    color: 'white',
    fontSize: 18,
    padding: 10,
    textAlign: 'left',
    fontFamily: 'Avenir-Black',
    fontWeight: '400'
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
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  newExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 80
  },
  newExerciseLink: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    fontSize: 18,
  },
  newExerciseButton: {
    height: 30,
    width: 30,
    backgroundColor: 'rgba(40, 87, 237, 0.89)',
    borderColor: 'rgba(40, 87, 237, 0.89)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(40, 87, 237, 0.37)',
    shadowOffset: { width: 0, height: 7 },
    marginRight: 10
  },
  newExerciseButtonPlus: {
    height: 15,
    width: 15
  },
});