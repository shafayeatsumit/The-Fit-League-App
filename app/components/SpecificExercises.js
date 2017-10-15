import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  AlertIOS,
  Image,
  Modal,
  TouchableHighlight
} from 'react-native';

const Form = t.form.Form
const _ = require('lodash')

const workoutIcon = require('../../assets/images/workoutIcon.png');
const smallAddButton = require('../../assets/images/smallAddButton.png');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = { flexDirection: 'row' };

export default class SpecificExercises extends Component {
  constructor(props) {
    super(props)
    this.newExercise = this.newExercise.bind(this)
    this.newExerciseValue = this.newExerciseValue.bind(this)
    this.buildFieldsHash = this.buildFieldsHash.bind(this)
    this.onChange = this.onChange.bind(this)
    this.pastExercisesModal = this.pastExercisesModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.applyLabel = this.applyLabel.bind(this)
    this.state = { 
      loading: false, 
      totalQuantity: 0,
      exerciseLabelModalVisible: false,
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
      this.state.specificExercises = [this.newExercise(), this.newExercise(), this.newExercise()]
      this.state.specificExerciseValues = [this.newExerciseValue(), this.newExerciseValue(), this.newExerciseValue()]
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

  newExerciseValue() {
    let schema = this.props.workoutKind.attributes.specific_exercise_schema
    let exerciseValue = {}
    Object.keys(schema).forEach((k) => exerciseValue[k] = undefined)
    return exerciseValue
  }

  hideModal() {
    this.setState({ exerciseLabelModalVisible: false })
  }

  pastExercisesModal() {
    this.setState({ exerciseLabelModalVisible: true })
  }

  applyLabel(label) {
    let { specificExerciseValues } = this.state
    let noLabelIndex = specificExerciseValues.findIndex((v) => !v.label)
    let update = this.onChange(noLabelIndex)
    let newValue = specificExerciseValues[noLabelIndex]
    newValue.label = label
    update(newValue)
    this.hideModal()
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
      newState.totalQuantity = newState.specificExerciseValues.map(
        (v) => v[self.props.totalField] ? parseInt(v[self.props.totalField]) : 0
      ).reduce((sum, value) => sum + value, 0)
      self.props.specificWorkoutChange(newState)
      self.setState(newState)
    }
  }

  render() {
    const schema = this.props.workoutKind.attributes.specific_exercise_schema
    const pastExercises = this.props.workoutKind.attributes.specific_exercise_labels
    return (
      <View>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.exerciseLabelModalVisible}
          onRequestClose={this.hideModal} >
          <View style={styles.pastExercisesModal}>
            <Text style={styles.modalHeader}>Choose a Past Exercise</Text>
            <ScrollView style={styles.modalScrollView}> 
            { pastExercises.map((exercise) => {
              return <TouchableHighlight key={exercise} style={styles.exerciseLabel} onPress={ () => { this.applyLabel(exercise) }} underlayColor='transparent'>
                <Text style={styles.exerciseLabelText}>{ exercise }</Text>
              </TouchableHighlight>
            })}
            </ScrollView>
            <TouchableHighlight style={styles.modalNevermind} onPress={this.hideModal} underlayColor='#508CD8'>
              <Text style={styles.modalNevermindText}>Nevermind</Text>
            </TouchableHighlight>
          </View>
        </Modal>
        <View style={styles.headerHolder}>
          <View style={styles.workoutIconColumn}>
            <View style={styles.workoutIcon}>
              <Image source={workoutIcon} style={styles.workoutIconImage} />
            </View>
          </View>
          <Text style={styles.workoutKindTitle}>{this.props.workoutKind.attributes.label}</Text>
          <Text style={styles.workoutQuantity}>{this.state.totalQuantity} total {this.props.workoutKind.attributes.unit}s</Text>
        </View>
        <ScrollView style={styles.scrollView}> 
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
          <View>
          { pastExercises.length > 0 &&
            <TouchableHighlight style={styles.pastExercisesLinkHolder} onPress={this.pastExercisesModal} underlayColor='transparent'>
              <Text style={styles.pastExercisesLink}>Choose from past exercises</Text>
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
    height: 60
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
    marginTop: 5
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
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  pastExercisesLinkHolder: {
    padding: 20
  },
  pastExercisesLink: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  modalHeader: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'black',
    fontSize: 18,
    padding: 20,
    paddingBottom: 0
  },
  modalScrollView: {
    padding: 20,
    marginBottom: 20
  },
  modalNevermind: {
    backgroundColor: '#508CD8',
    padding: 10
  },
  modalNevermindText: {
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  exerciseLabel: {
    padding: 15,
    paddingLeft: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
  },
  exerciseLabelText: {
    fontSize: 16,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir',
    fontWeight: '300',
    color: '#2857ED'
  },
  pastExercisesModal: {
    margin: 20,
    marginTop: 92,
    height: 450,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)'
  }
});