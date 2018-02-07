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

import { Actions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'

export default class EditWorkoutSuccess extends Component {
  constructor(props) {
    super(props)
    this.home = this.home.bind(this);
  }

  home() {
    Actions.home({ token: this.props.token });
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.backgroundGradient}>
          <View style={styles.editWorkoutContainer}>
            <View style={styles.editWorkoutSpacer}></View>
            <View style={styles.editWorkoutBox}>
              <Text style={styles.editWorkoutTitle}>You updated your workout!</Text>
              <Text style={styles.statsWillUpdate}>Your weekly stats will reflect those changes.</Text>
            </View>
            <View style={styles.editWorkoutSpacer}>
              <Text style={styles.howDoIEdit}>Go to Your Workouts to view or edit this workout.</Text>
            </View>
          </View>
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
  editWorkoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  editWorkoutSpacer: {
    flex: 1,
    justifyContent: 'center'
  },
  editWorkoutBox: {
    borderRadius: 2,
    borderWidth: 2,
    borderColor: 'white',
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    margin: 20
  },
  editWorkoutTitle: {
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
  howDoIEdit: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontWeight: '400'
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