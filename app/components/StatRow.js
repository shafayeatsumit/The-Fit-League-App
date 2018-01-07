import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

export default class StatRow extends Component {
  render() {
    const dynamicStyles = stylesByKind[this.props.kind] || defaultStyles
    return (
      <View style={[styles.statRow, dynamicStyles.statRow]}>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.daysWorkedOut }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.kind == 'mini' ? 'D' : 'DAYS'}</Text>
          </View>
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.cardioPoints }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.kind == 'mini' ? 'C' : 'CARDIO'}</Text>
          </View>
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.strengthPoints }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.kind == 'mini' ? 'S' : 'STRENGTH'}</Text>
          </View>
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.varietyPoints }</Text>
          </View>
          <View style={styles.statLabel}>
            <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{this.props.kind == 'mini' ? 'V' : 'VARIETY'}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const darkStyles = StyleSheet.create({
  statRow: {
    paddingTop: 20,
    paddingBottom: 30
  },
  statLabelText: {
    fontSize: 9,
    color: '#0E2442',
  },
  statNumberText: {
    fontSize: 36,
    color: '#0E2442',
  }
});

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
    paddingTop: 0
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

const stylesByKind = {
  mini: miniStyles,
  dark: darkStyles
}

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
