import React, { Component, PropTypes } from 'react'

import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image,
  Alert,
  Linking
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

import NoLeagueModal from './NoLeagueModal'

const basementBackground = require('../../assets/images/basementBackground.png')
const badge = require('../../assets/images/badge.png')
const logo = require('../../assets/images/logo.png')

const VERTICAL_MARGIN_ANIMATION = 140
const HORIZONTAL_MARGIN_ANIMATION = 180
const ANIMATION_DURATION = 250

const FAQ_URL = 'https://thefitleague.freshdesk.com'

const HOME_LINK =     { label: 'Home', action: 'home', props: {} }
const WORKOUTS_LINK = { label: 'Your Workouts', action: 'workouts', props: {} }
const MATCHUP_LINK =  { label: 'Your Matchup', action: 'matchup', props: {} }
const LEAGUE_LINK =   { label: 'Your League',  action: 'league' }
const RULES_LINK =    { label: 'Game Rules',  action: 'rules' }

const LINKS_BY_FEATURE = {
  matchup: MATCHUP_LINK
}

export default class HamburgerBasement extends Component {
  constructor(props) {
    super(props)
    this.toggleBasement = this.toggleBasement.bind(this)
    this.hideBasement = this.hideBasement.bind(this)
    this.setLeagueLinks = this.setLeagueLinks.bind(this)
    this.getChildContext = this.getChildContext.bind(this)
    this.viewRules = this.viewRules.bind(this)
    this.state = { 
      leagueRequired: !props.ignoreLeagueRequirement,
      links: [HOME_LINK, WORKOUTS_LINK, RULES_LINK],
      basementShowing: false,
      noLeague: false,
      currentLeague: null,
      basementSpace: {
        marginTop: new Animated.Value(0),
        marginLeft: new Animated.Value(0),
        marginRight: new Animated.Value(0),
        marginBottom: new Animated.Value(0)
      }
    }
  }

  getChildContext() {
    return { toggleBasement: this.toggleBasement }
  }

  setLeagueLinks(league) {
    let links = [HOME_LINK, WORKOUTS_LINK]
    league.attributes.features.forEach((feature) => {
      if (LINKS_BY_FEATURE[feature]) links.push(LINKS_BY_FEATURE[feature])
    })
    let leagueLink = Object.assign({ props: { title: league.attributes.name } }, LEAGUE_LINK);
    links.push(leagueLink)
    // May want this to depend on league type?
    links.push(RULES_LINK)
    SessionStore.save({ leagueId: league.id }, () => {    
      this.setState({ links, currentLeague: league, noLeague: false })
    })
  }

  componentDidMount() {
    let { token } = this.props
    HttpUtils.get('leagues', token).then((responseData) => {
      if (responseData.data.length > 0) {
        SessionStore.getLeagueId((leagueId) => {
          let currentLeague = responseData.data.filter((league) => league.id === leagueId)[0]
          this.setLeagueLinks(currentLeague ? currentLeague : responseData.data[0])
        }, () => {
          this.setLeagueLinks(responseData.data[0])
        })
      } else {
        this.setState({ noLeague: true })
      }
    }).catch((err) => {
      // Nuthin'
    }).done()
  }

  viewRules() {
    let { token, image_url } = this.props
    this.setState({ leagueRequired: false }, () => {    
      Actions.rules({ token, image_url })
    })
  }

  hideBasement() {
    if (this.state.basementShowing) this.toggleBasement()
  }

  toggleBasement() {
    let margins = this.state.basementShowing ? { 
      marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0
    } : {
      marginTop: VERTICAL_MARGIN_ANIMATION, marginLeft: HORIZONTAL_MARGIN_ANIMATION, marginRight: -HORIZONTAL_MARGIN_ANIMATION, marginBottom: -VERTICAL_MARGIN_ANIMATION
    }
    Object.keys(margins).forEach((key) => {
      Animated.timing(this.state.basementSpace[key], { 
        easing: Easing.elastic(), toValue: margins[key], duration: ANIMATION_DURATION 
      }).start();       
    })
    this.setState({ basementShowing: !this.state.basementShowing })
  }

  render() {
    const { basementSpace } = this.state
    const { token, image_url } = this.props
    return (
      <View style={styles.basement}>
        <NoLeagueModal show={this.state.leagueRequired && this.state.noLeague} viewRules={this.viewRules} callback={this.setLeagueLinks} token={this.props.token} />
        <Image
          style={styles.basementBackgroundImage}
          source={basementBackground} />
        <TouchableHighlight onPress={() => Actions.leagues({ viewRules: this.viewRules, setLeagueLinks: this.setLeagueLinks })} underlayColor='rgba(255, 255, 255, 0.25)'>
          <View style={styles.basementIconRow}>
            <View style={styles.basementBadge}>
              <Image
                style={styles.basementBadgeIcon}
                resizeMode='contain'
                source={badge} />
            </View>
            <View style={styles.leagueToggle}>
              { this.state.currentLeague && <Text style={styles.currentLeagueLabel}>Current League</Text> }
              { this.state.currentLeague && <Text style={styles.currentLeagueText}>{ this.state.currentLeague.attributes.name }</Text> }
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.basementNavColumn}>
          { this.state.links.map((link) => {
            return <TouchableHighlight key={link.action} style={styles.basementNavLink} onPress={() => Actions[link.action]({ token, image_url, ...link.props }) } underlayColor='rgba(255, 255, 255, 0.25)'>
              <View>
                <Text style={styles.basementNavLinkText}>{ link.label }</Text>
              </View>
            </TouchableHighlight>
          })}
          <TouchableHighlight style={styles.basementNavLink} onPress={() => Linking.openURL(FAQ_URL) } underlayColor='rgba(255, 255, 255, 0.25)'>
            <View>
              <Text style={styles.basementNavLinkText}>FAQ</Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableWithoutFeedback onPress={this.hideBasement}>
          <Animated.View style={StyleSheet.flatten([styles.container, basementSpace])}>
            { this.props.children }
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

HamburgerBasement.childContextTypes = {
  toggleBasement: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9'
  },
  basement: {
    backgroundColor: '#0E2442',
    flex: 1,
  },
  basementBackgroundImage: {
    backgroundColor: '#0E2442',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  basementIconRow: {
    height: 140,
    width: '100%',
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    padding: 30
  },
  basementBadge: {
    flex: 1,
    padding: 10,
  },
  basementBadgeIcon: {
    width: '100%',
    height: '100%'
  },
  leagueToggle: {
    flex: 3,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  currentLeagueLabel: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 12,
    fontWeight: '400',
  },
  currentLeagueText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 25,
    fontWeight: '900',
  },
  basementNavColumn: {
    position: 'absolute',
    width: '50%',
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    top: 140
  },
  basementNavLink: {
    padding: 15,
    marginBottom: 30,
    borderRadius: 10,
  },
  basementNavLinkText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    fontWeight: '900',
  }
})