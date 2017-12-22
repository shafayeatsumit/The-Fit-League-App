import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default class MatchupLegend extends Component {
  render() {
    return (
      <View style={styles.matchupLegend}>
        <View style={styles.matchupImageRow}>
        </View>
        <View style={styles.matchupLegendBox}>
          <Text style={styles.statLegend}>Days</Text>
          <Text style={styles.statLegendSubtitle}>2 pts</Text>
        </View>
        <View style={styles.matchupLegendBox}>
          <Text style={styles.statLegend}>Cardio</Text>
          <Text style={styles.statLegendSubtitle}>2 pts</Text>
        </View>
        <View style={styles.matchupLegendBox}>
          <Text style={styles.statLegend}>Strength</Text>
          <Text style={styles.statLegendSubtitle}>2 pts</Text>
        </View>
        <View style={styles.matchupLegendBox}>
          <Text style={styles.statLegend}>Variety</Text>
          <Text style={styles.statLegendSubtitle}>1 pts</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  matchupLegend: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6F7F8'
  },
  matchupImageRow: {
    flex: 2,
    flexDirection: 'row'
  },
  matchupLegendBox: {
    flex: 1,
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLegend: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#0E2442',
    fontSize: 12
  },
  statLegendSubtitle: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#0E2442',
    fontSize: 10
  }
})