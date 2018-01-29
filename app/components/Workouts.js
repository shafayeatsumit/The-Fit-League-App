const _ = require('lodash')

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

import { HttpUtils } from '../services/HttpUtils'
import DynamicIcon from './DynamicIcon'

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'
import StatRow from './StatRow'

const lastWeek = require('../../assets/images/lastWeek.png');
const nextWeek = require('../../assets/images/nextWeek.png');
const trash = require('../../assets/images/trash.png');

export default class Workouts extends Component {
  constructor(props) {
    super(props);
    this.getWorkouts = this.getWorkouts.bind(this)
    this.toLastWeek = this.toLastWeek.bind(this)
    this.toNextWeek = this.toNextWeek.bind(this)
    this.actuallyDelete = this.actuallyDelete.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.state = { loading: true }
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    this.getWorkouts(0)
    AppEventsLogger.logEvent('Viewed Workouts')
  }

  toLastWeek() {
    this.setState({ loading: true })
    this.getWorkouts(this.state.weeksAgo + 1)
    AppEventsLogger.logEvent('Last week of workouts')
  }

  toNextWeek() {
    this.setState({ loading: true })
    this.getWorkouts(this.state.weeksAgo - 1)
    AppEventsLogger.logEvent('Next week of workouts')
  }

  actuallyDelete(id) {
    HttpUtils.delete('workouts/' + id.toString(), this.props.token)
      .then((responseData) => {
        let { workouts } = this.state
        _.remove(workouts, function(workout) {
          return workout.id === id;
        });
        let { strength_points, cardio_points, diversity_points, days_worked_out } = responseData.meta.summary;
        this.setState({ workouts, strength_points, cardio_points, diversity_points, days_worked_out })
      }).done();
    AppEventsLogger.logEvent('Actually deleted workout')
  }

  confirmDelete(id) {
    return () => {
      AppEventsLogger.logEvent('Considered deleting workout') 
      Alert.alert(
        'Are you sure?',
        'Do you really want to delete this workout?',
        [ { text: 'Nevermind', style: 'cancel' },
          { text: 'Delete it!', onPress: () => this.actuallyDelete(id) } ]
      )
    }
  }

  getWorkouts(weeksAgo) {
    HttpUtils.get('weeks/' + weeksAgo.toString() + '/workouts', this.props.token)
      .then((responseData) => {
        let { strength_points, cardio_points, diversity_points, days_worked_out } = responseData.meta.summary;
        this.setState({
          weeksAgo,
          strength_points, cardio_points, diversity_points, days_worked_out,
          startDate: responseData.meta.dates.starts_at,
          endDate: responseData.meta.dates.ends_at,
          workouts: responseData.data,
          loading: false
        })
      }).catch(() => {
        this.setState({ loading: false })
      })
  }


  render() {
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Your Workouts" />
        <View style={styles.container}>
          { this.state.loading ?
            <ActivityIndicator size="large" color="#818D9C" />
          :
            <View style={styles.listContainer}>
              <View style={styles.dateRow}>
                <TouchableHighlight style={styles.dateButtonHolder} onPress={this.toLastWeek} underlayColor='#508CD8'>
                  <Image source={lastWeek} />
                </TouchableHighlight>
                <Text style={styles.dateText}>{ this.state.startDate } - { this.state.endDate }</Text>
                <TouchableHighlight style={styles.dateButtonHolder} onPress={this.toNextWeek} underlayColor='#508CD8'>
                  <Image source={nextWeek} />
                </TouchableHighlight>
              </View>
              <StatRow
                kind="dark"
                style={styles.statRow}
                daysWorkedOut={parseInt(this.state.days_worked_out)}
                cardioPoints={parseInt(this.state.cardio_points)}
                strengthPoints={parseInt(this.state.strength_points)}
                varietyPoints={parseInt(this.state.diversity_points)} />
              <View style={styles.workouts}>
                <ScrollView style={styles.scroll}>
                  { this.state.workouts.map((workout) => {
                    return <TouchableOpacity activeOpacity={1} style={styles.workout} key={workout.id}>
                      <View style={styles.workoutCol}>
                        <View style={styles.workoutDateRow}>
                          <Text style={styles.workoutDay}>{workout.attributes.occurred_day}</Text>
                          <Text style={styles.workoutDate}>{workout.attributes.occurred_date}</Text>
                          <TouchableHighlight style={styles.workoutTrash} onPress={this.confirmDelete(workout.id)} underlayColor='transparent'>
                            <Image source={trash} />
                          </TouchableHighlight>
                        </View>
                        <View style={styles.workoutKindRow}>
                          <DynamicIcon 
                            label={workout.attributes.kind} 
                            shade={'dark'}
                            {...StyleSheet.flatten(styles.workoutIconImage)} />
                          <Text style={styles.workoutKindLabel}>{ workout.attributes.kind }</Text>
                          <Text style={styles.workoutUnit}>{workout.attributes.quantity} {workout.attributes.unit}s</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  })}
                </ScrollView>
              </View>
            </View>
          }
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1
  },
  container: {
    flex: 8
  },
  listContainer: {
    flexDirection: 'column',
    flex: 1
  },
  dateRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
  },
  dateButtonHolder: {
    padding: 20
  },
  dateText: {
    fontFamily: 'Avenir-Black',
    color: '#818D9C',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '400'
  },
  statRow: {
    flex: 2,
  },
  workouts: {
    flexDirection: 'column',
    flex: 10,
    backgroundColor: 'white'
  },
  scroll: {
    flex: 1
  },
  workout: {
    height: 120,
  },
  workoutCol: {
    flex: 1,
    flexDirection: 'column',
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
  },
  workoutDateRow: {
    flexDirection: 'row',
    flex: 3,
    paddingLeft: 30,
    alignItems: 'center'
  },
  workoutDay: {
    fontFamily: 'Avenir-Black',
    color: '#AAAABA',
    fontSize: 20,
    backgroundColor: 'transparent',
    fontWeight: '400',
    paddingRight: 10
  },
  workoutDate: {
    fontFamily: 'Avenir-Black',
    color: '#4F4F6F',
    fontSize: 20,
    backgroundColor: 'transparent',
    fontWeight: '400'
  },
  workoutTrash: {
    marginLeft: 'auto',
    marginRight: 30
  },
  workoutKindRow: {
    flexDirection: 'row',
    flex: 4,
    borderLeftColor: '#1DD65B',
    borderLeftWidth: 3,
    paddingLeft: 30,
    alignItems: 'center'
  },
  workoutIconImage: {
    height: 40,
    width: 40,
    borderRadius: 20, 
    borderWidth: 2,
    borderColor: '#768DA1'
  },
  workoutKindLabel: {
    fontFamily: 'Avenir-Black',
    color: '#4F4F6F',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '900',
    paddingLeft: 10
  },
  workoutUnit: {
    fontFamily: 'Avenir-Black',
    color: '#4F4F6F',
    fontSize: 12,
    backgroundColor: 'transparent',
    fontWeight: '400',
    marginLeft: 'auto',
    marginRight: 30
  }
});