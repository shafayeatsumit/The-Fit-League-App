import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  StatusBar
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'
import { Actions } from 'react-native-router-flux'

const _ = require('lodash')

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'
import MatchupStatusBanner from './MatchupStatusBanner'
import MatchupLegend from './MatchupLegend'

const lastWeek = require('../../assets/images/lastWeek.png')
const nextWeek = require('../../assets/images/nextWeek.png')

export default class Workouts extends Component {
  constructor(props) {
    super(props);
    this.getContest = this.getContest.bind(this)
    this.toLastWeek = this.toLastWeek.bind(this)
    this.toNextWeek = this.toNextWeek.bind(this)
    this.getContestByUrl = this.getContestByUrl.bind(this)
    this.viewPlayer = this.viewPlayer.bind(this)
    this.state = { loading: true };
  }

  toLastWeek() {
    this.setState({ loading: true })
    this.getContest(this.state.weeksAgo + 1)
    AppEventsLogger.logEvent('Last week of matchups')
  }

  toNextWeek() {
    this.setState({ loading: true })
    this.getContest(this.state.weeksAgo - 1)
    AppEventsLogger.logEvent('Next week of matchups')
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    this.getContest(0)
    AppEventsLogger.logEvent('Viewed Matchup')
  }

  getContestByUrl(weeksAgo, endPoint) {
    HttpUtils.get('weeks/' + weeksAgo.toString() + endPoint, this.props.token)
      .then((responseData) => {
        let matchup = responseData.data ? responseData.data.attributes : null
        this.setState({
          weeksAgo, matchup,
          startDate: responseData.meta.dates.starts_at,
          endDate: responseData.meta.dates.ends_at,
          loading: false
        })
      }).catch((err) => {
        this.setState({ loading: false })
      }).done()

  }

  getContest(weeksAgo) {
    SessionStore.getLeagueId((leagueId) => {
      this.getContestByUrl(weeksAgo, '/contest?league_id=' + leagueId.toString())
    }, () => {
      this.getContestByUrl(weeksAgo, '/contest')
    })
  }

  viewPlayer(player) {
    Actions.playerCard({ player, image_url: this.props.image_url, token: this.props.token })
  }

  render() {
    const teams = this.state.matchup ? Object.values(_.groupBy(this.state.matchup.participants, 'team')) : []
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Your Partner & Matchup" />
        <View style={styles.container}>
          { this.state.loading ?
            <ActivityIndicator size="large" style={styles.loading} color="#818D9C" />
          :
            <View style={styles.listContainer}>
              <View style={styles.dateRow}>
                <TouchableHighlight style={styles.dateButtonHolder} onPress={this.toLastWeek} underlayColor='#508CD8'>
                  <Image source={lastWeek} />
                </TouchableHighlight>
                <View style={styles.contestLabel}>
                  { this.state.matchup && 
                    <Text style={styles.contestLabelText}>{ this.state.matchup.label }</Text>
                  }
                  <Text style={styles.dateText}>{ this.state.startDate } - { this.state.endDate }</Text>
                </View>
                <TouchableHighlight style={styles.dateButtonHolder} onPress={this.toNextWeek} underlayColor='#508CD8'>
                  <Image source={nextWeek} />
                </TouchableHighlight>
              </View>
              { this.state.matchup ?
                <View style={styles.matchup}>
                  <MatchupStatusBanner
                    style={styles.banner}
                    status={this.state.matchup.status}
                    current={this.state.weeksAgo == 0} />
                  <View style={styles.matchupDetails}>
                    <MatchupLegend />
                    <View style={styles.matchupTable}>
                      <View style={styles.matchupImageRow}>
                        { teams.map((team, index) => {
                            return <View key={index} style={styles.matchupColumn}>
                              { team.map((m, i) => <TouchableHighlight key={m.id} onPress={() => this.viewPlayer(m)} underlayColor='transparent'>
                                  <Image style={i > 0 ? styles.participantImageRight : styles.participantImage} source={{uri: m.image_url}} />
                                </TouchableHighlight>) 
                              }
                            </View>
                          })
                        }
                      </View>
                      {
                        ['days_worked_out', 'cardio_points', 'strength_points', 'diversity_points'].map((metric) => {
                          return <View key={metric} style={styles.matchupStatRow}>
                            { teams.map((team, index) => {
                                return <View key={index} style={index > 0 ? styles.matchupColumnRight : styles.matchupColumn}>
                                  { _.any(team, (m) => m.summary === null) ? 
                                    <Text style={styles.matchupStat}>?</Text>
                                    :
                                    <Text style={styles.matchupStat}>{_.sum(team, (m) => m.summary[metric])}</Text>
                                  }
                                </View>
                              })
                            }
                          </View>
                        })
                      }
                    </View>
                  </View>
                </View>
                :
                <View style={styles.matchup}>
                  <Text style={styles.noMatchupFound}>Sorry! No matchup found.</Text>
                </View>
              }
            </View>
          }
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
  container: {
    flex: 8,
    borderTopColor: '#D5D7DC',
    borderTopWidth: 1,
  },
  loading: {
    paddingTop: 20
  },
  listContainer: {
    flexDirection: 'column',
    flex: 1
  },
  dateRow: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dateButtonHolder: {
    padding: 20
  },
  dateText: {
    fontFamily: 'Avenir-Light',
    color: '#818D9C',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  contestLabel: {
    flexDirection: 'column',
  },
  contestLabelText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  noMatchupFound: {
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    paddingTop: 20,
    backgroundColor: 'transparent'
  },
  matchup: {
    flexDirection: 'column',
    flex: 10,
    backgroundColor: 'white'
  },
  banner: {
    flex: 1
  },
  matchupDetails: {
    flex: 9,
    flexDirection: 'row',
  },
  matchupTable: {
    flex: 4,
    flexDirection: 'column',
  },
  matchupColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  matchupColumnRight: {
    borderLeftColor: '#D5D7DC',
    borderLeftWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  matchupImageRow: {
    flex: 2,
    flexDirection: 'row'
  },
  participantImage: {
    borderColor: '#D5D7DC',
    borderWidth: 2,
    borderRadius: 25,
    width: 50,
    height: 50
  },
  participantImageRight: {
    borderColor: '#D5D7DC',
    borderWidth: 2,
    marginLeft: -15,
    borderRadius: 25,
    width: 50,
    height: 50
  },
  matchupStatRow: {
    flex: 1,
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  matchupStat: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#0E2442',
    fontSize: 22    
  }
});