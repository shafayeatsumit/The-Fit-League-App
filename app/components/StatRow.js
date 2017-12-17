import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

export default class StatRow extends Component {
  render() {
    const dynamicStyles = this.props.mini ? miniStyles : defaultStyles
    return (
      <View style={[styles.statRow, dynamicStyles.statRow]}>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.daysWorkedOut }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.mini ? 'D' : 'DAYS'}</Text>
          </View>
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.cardioPoints }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.mini ? 'C' : 'CARDIO'}</Text>
          </View>
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.strengthPoints }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.mini ? 'S' : 'STRENGTH'}</Text>
          </View>
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.varietyPoints }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.mini ? 'V' : 'VARIETY'}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const miniStyles = StyleSheet.create({
  statRow: {
    paddingTop: 25
  },
  statLabelText: {
    fontSize: 9,
    color: '#8691A0',
  },
  statNumberText: {
    fontSize: 18,
    color: '#8691A0',
  }
});

const defaultStyles = StyleSheet.create({
  statRow: {
    paddingTop: 55
  },
  statLabelText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statNumberText: {
    fontSize: 36,
    color: 'white',
  }
});

const styles = StyleSheet.create({
  statRow: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statCol: {
    flex: 1, 
    flexDirection: 'column'
  },
  statLabel: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  statNumber: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  statLabelText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent'
  },
  statNumberText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent'
  }
});
