import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  AlertIOS,
  Image,
  TouchableHighlight
} from 'react-native';

import DynamicIcon from './DynamicIcon'
import NewSpecificExerciseModal from './specific_exercise_modal/NewSpecificExerciseModal'

const smallAddButton = require('../../assets/images/smallAddButton.png')
const addButton = require('../../assets/images/addButton.png')
const smallTrash = require('../../assets/images/smallTrash.png')

export default class SpecificExercises extends Component {
  constructor(props) {
    super(props)
    this.newExercise = this.newExercise.bind(this)
    this.addNewExercise = this.addNewExercise.bind(this)
    this.removeExerciseAtIndex = this.removeExerciseAtIndex.bind(this)
    this.onChange = this.onChange.bind(this)
    this.newExercisesModal = this.newExercisesModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.applyNewState = this.applyNewState.bind(this)
    this.state = { 
      loading: false, 
      totalQuantity: 0,
      newExercisesModalVisible: false
    }
    // Should probably store this state on the parent... (NewWorkoutHowMany)
    if (props.specificWorkouts.specificExercises) {
      this.state.totalQuantity = props.specificWorkouts.totalQuantity
      this.state.specificExercises = props.specificWorkouts.specificExercises
    } else {
      this.state.specificExercises = []
    }
  }

  newExercise(schemaAttributes) {
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
    newState.totalQuantity = newState.specificExercises.map(
      (v) => v[self.props.totalField] ? parseInt(v[self.props.totalField]) : 0
    ).reduce((sum, value) => sum + value, 0)
    self.props.specificWorkoutChange(newState)
    self.setState(newState)
  }

  addNewExercise(schemaAttributes) {
    let {  specificExercises } = this.state
    let newState = { specificExercises }
    newState.specificExercises.push(this.newExercise(schemaAttributes))
    this.applyNewState(newState)
  }

  removeExerciseAtIndex(index) {
    return () => {
      let { specificExercises } = this.state
      specificExercises.splice(index, 1)
      this.applyNewState({ specificExercises })
    }
  }

  onChange(index, key) {
    return (value) => {
      let { specificExercises } = this.state
      specificExercises[index][key] = value
      let newState = { specificExercises }
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
          totalField={this.props.totalField}
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
            <View style={{ flex: 1 }}></View>  
          </View>
        }
        <ScrollView style={styles.scrollView}> 
          { this.state.specificExercises.map((exercise, index) => {
            return <View style={styles.exerciseRow} key={index}>
              { Object.keys(schema).map((key) => {
                return <TextInput
                  key={key + index.toString()}
                  keyboardType={schema[key].kind == 'Integer' ? 'numeric' : 'default'}
                  style={StyleSheet.flatten([styles.input, { flex: schema[key].width }])}
                  value={this.state.specificExercises[index][key]}
                  onChangeText={this.onChange(index, key)}
                />
              }) }
                <View style={styles.trashBin}>
                  <TouchableHighlight onPress={this.removeExerciseAtIndex(index)} underlayColor='transparent'>
                    <Image source={smallTrash} />
                  </TouchableHighlight>
                </View>
              </View>
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
  exerciseRow: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 10
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
  input: {
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: '300',
    borderWidth: 1,
    borderRadius: 0,
    height: 50,
    paddingLeft: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
  },
  trashBin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
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