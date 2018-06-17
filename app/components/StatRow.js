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
    const small = this.props.kind == 'mini' || this.props.kind == 'multi'
    return (
      <View style={[styles.statRow, dynamicStyles.statRow]}>
        { this.props.initials &&
          <View style={styles.statCol}>
            <View style={styles.statNumber}>
              <Text style={[dynamicStyles.statNumberText, styles.initialsText]}>{this.props.initials}</Text>
            </View>
          </View>
        }
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.daysWorkedOut }</Text>
          </View>
          { !this.props.hideLabels &&
            <View style={styles.statLabel}>
              <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{small ? 'D' : 'DAYS'}</Text>
            </View>
          }
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.cardioPoints }</Text>
          </View>
          { !this.props.hideLabels &&
            <View style={styles.statLabel}>
              <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{small ? 'C' : 'CARDIO'}</Text>
            </View>
          }
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.strengthPoints }</Text>
          </View>
          { !this.props.hideLabels &&
            <View style={styles.statLabel}>
              <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{small ? 'S' : 'STRENGTH'}</Text>
            </View>
          }
        </View>
        <View style={styles.statCol}>
          <View style={styles.statNumber}>
            <Text style={[styles.statNumberText, dynamicStyles.statNumberText]}>{ this.props.varietyPoints }</Text>
          </View>
          { !this.props.hideLabels &&
            <View style={styles.statLabel}>
              <Text style={[styles.statLabelText, dynamicStyles.statLabelText]}>{small ? 'V' : 'VARIETY'}</Text>
            </View>
          }
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
    minHeight: 20
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

const multiStyles = StyleSheet.create({
  statRow: {
    paddingTop: 22
  },
  statLabelText: {
    fontSize: 8,
    color: '#8691A0',
  },
  statNumberText: {
    fontSize: 14,
    color: '#8691A0',
  }
});

const defaultStyles = StyleSheet.create({
  statRow: {
    flex: 2,
    alignItems: 'center',
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
  dark: darkStyles,
  multi: multiStyles
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
  },
  initialsText: {
    color: '#0E2442',
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent'
  }
});
