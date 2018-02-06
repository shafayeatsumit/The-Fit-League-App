import React, { Component } from 'react'

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native'

export default class PreviousExerciseList extends Component {
  render() {
    return (
      <View style={styles.container}>
        { this.props.exercises.length > 0 &&
          <View style={styles.box}>
            <Text style={styles.header}>Or, choose from your {this.props.label}:</Text>
            { this.props.exercises.slice(0, this.props.numExercises).map((exercise) => {
              return <TouchableHighlight key={exercise.label} style={styles.label} onPress={ () => { this.props.cb(exercise) }} underlayColor='transparent'>
                <Text style={styles.text}>{ exercise.label }</Text>
              </TouchableHighlight>
            })}
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 0,
    flex: 12,
  },
  box: {
    borderTopColor: '#DFDFDF',
    borderTopWidth: 1,
    marginTop: 30,
  },
  header: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: 'black',
    fontSize: 16,
    padding: 20,
  },
  label: {
    marginBottom: 10,
    borderRadius: 2,
    backgroundColor: '#F4F4F4'
  },
  text: {
    fontSize: 14,
    backgroundColor: 'transparent',
    fontFamily: 'Avenir',
    fontWeight: '300',
    color: 'black',
    padding: 10,
    paddingLeft: 20
  },
})
