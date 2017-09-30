import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native';

const workoutIcon = require('../../assets/images/workoutIcon.png');

export default class WorkoutKindOptions extends Component {
  render() {
    let { kindOptions } = this.props
    let half = Math.ceil(kindOptions.length / 2)
    let rows = [{ key: 0, start: 0, end: half }, { key: 1, start: half, end: kindOptions.length }]
    return (
      <View style={styles.container}>
        { rows.map((row) => {
          return <View key={row.key} style={styles.workoutRow}>
            { kindOptions.slice(row.start, row.end).map((kind) => {
              return <View key={kind.id} style={styles.workoutColumn}>
                <TouchableHighlight style={styles.workoutIcon} onPress={() => this.props.pickWorkout(kind.id)} underlayColor='#AADD9A'>
                  <Image source={workoutIcon} style={styles.workoutIconImage} />
                </TouchableHighlight>
                <Text style={styles.workoutLabel} key={kind.id}>{ kind.attributes.label }</Text>
              </View>
            }) }
          </View>
        }) }
        <View style={styles.workoutRow}></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workoutRow: {
    flexDirection: 'row',
    flex: 1
  },
  workoutColumn: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center'
  },
  workoutIcon: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#2857ED',
    shadowColor: '#0E2442',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  workoutIconText: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white'
  },
  workoutIconImage: {
    height: 40,
    width: 40
  },
  workoutLabel: {
    fontSize: 10,
    paddingTop: 5,
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white'
  }
});