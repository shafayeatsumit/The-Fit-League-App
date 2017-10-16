import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image
} from 'react-native';

const Form = t.form.Form;

import { HttpUtils } from '../services/HttpUtils'

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

const buttSlapIcon = require('../../assets/images/buttSlap.png');

const contributionLabels = {
  days_worked_out: 'DAYS',
  cardio_points: 'CARDIO',
  strength_points: 'SETS',
  diversity_points: 'DIVERSITY'
}

export default class NewWorkoutSuccess extends Component {
  constructor(props) {
    super(props)
    this.home = this.home.bind(this);
  }

  home() {
    Actions.home({ token: this.props.token });
  }

  render() {
    const { contribution } = this.props
    const positiveContributions = Object.keys(contribution).filter(k => contribution[k] > 0)
    return (
      <View style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          { this.props.workoutInTheFuture ? 
            <View style={styles.futureWorkoutContainer}>
              <View style={styles.futureWorkoutSpacer}></View>
              <View style={styles.futureWorkoutBox}>
                <Text style={styles.futureWorkoutTitle}>You scheduled a future workout!</Text>
                <Text style={styles.statsWillUpdate}>Your weekly stats will update after the workout is completed.</Text>
              </View>
              <View style={styles.futureWorkoutSpacer}>
                <Text style={styles.howDoIEdit}>Go to Your Workouts to view or edit this workout.</Text>
              </View>
            </View>
            :
            <View style={styles.successContainer}>
              <View style={styles.headerHolder}>
                <View style={styles.successIcon}>
                  <Image source={buttSlapIcon} style={styles.successIconImage} />
                </View>
              </View>
              <Text style={styles.successTitle}>{this.props.successMessage}</Text>
              { positiveContributions.length > 0 && 
                <Text style={styles.youAdded}>YOU ADDED</Text>
              }
              <View style={styles.statRow}>
                { positiveContributions.map((k) => {
                  return <View key={k} style={styles.statColumn}>
                    <View style={styles.statCircle}>
                      <Text style={styles.statNumber}>{ parseInt(contribution[k]) }</Text>
                    </View>
                    <Text style={styles.statLabel}>{ contributionLabels[k] }</Text>
                  </View>
                  })
                }
              </View>
              <Text style={styles.wellDone}>{this.props.wellDoneMessage}</Text>
              <Text style={styles.howDoIEdit}>Go to Your Workouts to view or edit this workout.</Text>
            </View>
          }
        </LinearGradient>
        <View style={styles.bottomBar}>
          <TouchableHighlight style={styles.backToHomeHolder} onPress={this.home} underlayColor='#508CD8'>
            <Text style={styles.backToHome}>Back to home</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  backgroundGradient: {
    flex: 5,
    flexDirection: 'column',
  },
  successContainer: {
    padding: 20,
    paddingTop: 5,
    flex: 10
  },
  futureWorkoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  futureWorkoutSpacer: {
    flex: 1,
    justifyContent: 'center'
  },
  futureWorkoutBox: {
    borderRadius: 2,
    borderWidth: 2,
    borderColor: 'white',
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    margin: 20
  },
  futureWorkoutTitle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 30,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  statsWillUpdate: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 30,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  bottomBar: {
    flex: 1,
    backgroundColor: '#508CD8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIcon: {
    height: 122,
    width: 112,
    alignItems: 'center',
    justifyContent: 'center'
  },
  successIconImage: {
    height: 122,
    width: 112
  },
  headerHolder: {
    alignItems: 'center',
    paddingTop: 40
  },
  successTitle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 30,
    padding: 10,
    paddingTop: 20,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  youAdded: {
    fontSize: 12,
    backgroundColor: 'transparent',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  wellDone: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  howDoIEdit: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '400'
  },
  statRow: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statColumn: {
    flex: 1, 
    flexDirection: 'column',
    alignItems: 'center'
  },
  statLabel: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    paddingTop: 10,
    fontSize: 12
  },
  statNumber: {
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    fontSize: 30
  },
  statCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backToHome: {
    color: 'white',
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'Avenir-Black',
    fontWeight: '900'
  },
  backToHomeHolder: {
    padding: 20
  }
});