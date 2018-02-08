import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableHighlight,
  Text
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

import NoLeagueModal from './NoLeagueModal'

const exButton = require('../../assets/images/exButton.png')
const background = require('../../assets/images/basementBackground.png')
const check = require('../../assets/images/check.png')

export default class Leagues extends Component {
  constructor(props) {
    super(props)
    this.chooseLeague = this.chooseLeague.bind(this)
    this.goToRules = this.goToRules.bind(this)
    this.state = { leagues: [], creatingLeague: false }
  }

  componentDidMount() {
    SessionStore.get((session) => {
      let { token, imageUrl } = session
      HttpUtils.get('leagues', token).then((responseData) => {
        this.setState({ 
          token, image_url: imageUrl,
          leagues: responseData.data, 
          currentLeagueId: session.leagueId 
        })
      }).done()
    })
  }

  chooseLeague(league) {
    SessionStore.save({ leagueId: league.id }, () => {
      this.setState({ creatingLeague: false })
      Actions.home({ token: this.state.token, image_url: this.state.imageUrl })
    })
  }

  goToRules() {
    this.setState({ creatingLeague: false })
    Actions.rules({ token: this.state.token, image_url: this.state.imageUrl })
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.creatingLeague && this.state.token && <NoLeagueModal 
          show={this.state.creatingLeague}
          viewRules={this.goToRules} 
          callback={this.chooseLeague} 
          token={this.state.token} /> }
        <Image
          style={styles.backgroundImage}
          source={background} />
        <TouchableHighlight style={styles.exButtonHolder} underlayColor='transparent' onPress={Actions.pop}>
          <Image
            style={styles.exButton}
            source={exButton} />
        </TouchableHighlight>
        <Text style={styles.header}>Your Leagues</Text>
        <View style={styles.leagueList}>
          <ScrollView>
          { this.state.leagues.map((league, i) => {
            let currentLeague = league.id == this.state.currentLeagueId
            return <TouchableHighlight onPress={() => this.chooseLeague(league)} key={i} underlayColor='transparent'>
              <View style={styles.leagueRow}>
                <Text style={StyleSheet.flatten([styles.leagueName, currentLeague ? styles.leagueNameBold : styles.leagueNameLight])}>
                  {league.attributes.name}
                </Text>
                { currentLeague && <Image source={check} style={styles.check} /> }
              </View>
            </TouchableHighlight>
          })}
          </ScrollView>
        </View>
        <TouchableHighlight style={styles.createLeague} onPress={() => { this.setState({ creatingLeague: true }) } } underlayColor='transparent'>
          <Text style={styles.createLeagueText}>Create a League</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flex: 1,
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 24,
    marginBottom: 0,
    textAlign: 'center'
  },
  exButtonHolder: {
    alignSelf: 'flex-end',
    paddingTop: 40,
    paddingRight: 20
  },
  backgroundImage: {
    backgroundColor: '#0E2442',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  leagueRow: {
    height: 50,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leagueName: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
    alignSelf: 'center'
  },
  leagueNameBold: {
    fontFamily: 'Avenir-Black',
  },
  leagueNameLight: {
    fontFamily: 'Avenir-Light',
  },
  check: {
    height: 25,
    width: 25,
    alignSelf: 'center'
  },
  leagueList: {
    flex: 8,
    margin: 20
  },
  createLeague: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#508CD8',
  },
  createLeagueText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
});