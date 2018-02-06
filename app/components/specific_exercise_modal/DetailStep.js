import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import PreviousExerciseList from './PreviousExerciseList'

import { HttpUtils } from '../../services/HttpUtils'

export default class DetailStep extends Component {
  constructor(props) {
    super(props)
    this.applyPreviousEntry = this.applyPreviousEntry.bind(this)
    this.getSchemaKeys = this.getSchemaKeys.bind(this)
    this.labelForExercise = this.labelForExercise.bind(this)
    this.getPreviousEntries = this.getPreviousEntries.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.state = { pastExercises: [], schemaAttributes: { label: this.props.label } }
  }

  componentDidMount() {
    HttpUtils.get('workout_kinds/' + this.props.workoutKindId.toString() + '/specific_exercises?label=' + this.props.label, this.props.token)
      .then((responseData) => {
        this.setState({ pastExercises: responseData.data })
      })
  }

  getSchemaKeys() {
    const { schema } = this.props
    return Object.keys(schema).filter(k => schema[k].label != 'Exercise')
  }

  applyPreviousEntry(d) {
    let newState = this.state
    this.getSchemaKeys().forEach((k) => {
      if (d.exercise.attributes[k]) newState.schemaAttributes[k] = d.exercise.attributes[k].toString()
    })
    this.setState(newState)
  }

  labelForExercise(exercise) {
    return this.getSchemaKeys().map((k) => {
      if (exercise.attributes[k]) return [exercise.attributes[k], this.props.schema[k].label].join(' ')
    }).filter((x) => x).join(', ')
  }

  getPreviousEntries() {
    return this.state.pastExercises.map((exercise) => {
      return { 
        exercise,
        label: [exercise.attributes.workout_date, '-', this.labelForExercise(exercise)].join(' ') 
      }
    })
  }

  updateValue(key) {
    return (val) => {
      let newState = this.state
      newState.schemaAttributes[key] = val.toString()
      this.setState(newState)
    }
  }

  render() {
    const { schema } = this.props
    const schemaKeys = this.getSchemaKeys()
    return (
      <View style={styles.container}>
        <View style={styles.schemaColumn}>
          { schemaKeys.map((k) => {
            return <View key={k} style={styles.schemaRow}>
              <TextInput ref={k} value={this.state.schemaAttributes[k]} keyboardType={"numeric"} onChangeText={this.updateValue(k)} style={styles.input} placeholder="#" />
              <Text style={styles.labelText}>{ schema[k].label }</Text>
            </View>
          })}
        </View>
        <PreviousExerciseList
          exercises={this.getPreviousEntries()}
          numExercises={3}
          cb={this.applyPreviousEntry}
          label="previous entries"
        />
        <TouchableHighlight style={styles.saveButton} onPress={() => this.props.save(this.state.schemaAttributes)} underlayColor='#508CD8'>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 15,
    flexDirection: 'column'
  },
  schemaColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 10,
    marginBottom: 20
  },
  schemaRow: {
    flexDirection: 'row',
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: '#508CD8',
    borderWidth: 2,
    borderRightWidth: 0,
    fontSize: 15,
    padding: 10,
    height: 40,
    width: 100,
    fontFamily: 'Avenir',
    fontWeight: '300',
    color: 'black',
  },
  labelText: {
    backgroundColor: 'transparent',
    fontFamily: 'Avenir',
    fontWeight: '300',
    color: 'black',
    width: 100,
    fontSize: 18,
    marginTop: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  saveButton: {
    backgroundColor: '#508CD8',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  loading: {
    flex: 12
  }
})