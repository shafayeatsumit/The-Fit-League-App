import React, { Component, PropTypes } from 'react'

import { Actions } from 'react-native-router-flux'

import branch, { BranchEvent } from 'react-native-branch'

import { AppEventsLogger } from 'react-native-fbsdk'

import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  Alert,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Clipboard
} from 'react-native'

import { LeagueJoiner } from '../services/LeagueJoiner'
import { LeagueSharer } from '../services/LeagueSharer'
import { HttpUtils } from '../services/HttpUtils'

const background = require('../../assets/images/basementBackground.png')
const logo = require('../../assets/images/badge.png')
const forwardButton = require('../../assets/images/forwardButton.png')

const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 20
const NO_NAME_ERROR = 'Enter a name for your league.'
const lengthError = (name) => 'Come up with a league name longer than "' + name + '".'

STANDARD_DESCRIPTION = 'a 10-week workout competition. Simply tap this link to start competing for the prize!'

export default class NoLeagueModal extends Component {
  constructor(props) {
    super(props)
    this.newLeague = this.newLeague.bind(this)
    this.getStarted = this.getStarted.bind(this)
    this.copyShareableLink = this.copyShareableLink.bind(this)
    this.state = { creatingLeague: false, leagueName: '', newLeague: false, loading: false, allowedToProceed: false  }
  }

  newLeague() {
    AppEventsLogger.logEvent('Tapped New League')
    this.setState({ creatingLeague: true }, () => this.refs.leagueName.focus())
  }

  getStarted() {
    if (this.state.leagueName.length < MIN_NAME_LENGTH) {
      let errorMessage = this.state.leagueName.length == 0 ? NO_NAME_ERROR : lengthError(this.state.leagueName)
      AppEventsLogger.logEvent('Entered Too Short of a League Name')
      Alert.alert('Oops!', errorMessage, [{ text: 'OK' } ], { cancelable: true })
    } else {
      let { token } = this.props
      this.setState({ loading: true })
      HttpUtils.post('leagues', { name: this.state.leagueName }, token).then(async (responseData) => {
        let savedLeague = responseData.data
        const universalObject = await branch.createBranchUniversalObject(savedLeague.attributes.slug, {
          title: savedLeague.attributes.name + ' on The Fit League',
          contentDescription: responseData.meta.creator + ' created ' + savedLeague.attributes.name + ', ' + STANDARD_DESCRIPTION
        })
        const { url } = await universalObject.generateShortUrl({ 
          channel: 'leagueReferral',
          campaign: savedLeague.attributes.slug 
        })
        this.setState({ savedLeague, shareableLink: url, loading: false })
        Clipboard.setString(url)
        HttpUtils.put('leagues/' + savedLeague.id.toString(), { invite_url: url }, token).done();
        AppEventsLogger.logEvent('Created a League')
      })
    }
  }

  copyShareableLink() {
    LeagueSharer.call(this.state.shareableLink, this.state.leagueName, 'League Creation')
    this.setState({ allowedToProceed: true })
  }

  componentDidMount() {
    const { token, callback } = this.props
    LeagueJoiner.listen((slug) => {
      LeagueJoiner.call(slug, token).then((responseData) => {
        AppEventsLogger.logEvent('Invited to League After Registration')
        callback(responseData.data)
      }).done();
    })
  }

  body() {
    if (!this.state.creatingLeague) {
      return (
        <View style={styles.actionHolder}>
          <Text style={styles.biggerExplanationText}>TFL is for competing with your friends.</Text>
          <Text style={styles.biggerExplanationText}>If your crew already has a league,</Text>
          <Text style={styles.biggerExplanationText}>get them to send you an invite link.</Text>
          <Text style={styles.biggerExplanationText}>If not, start your own league.</Text>
          <TouchableHighlight style={styles.newLeagueButton} onPress={this.newLeague} underlayColor='#1DD65B'>
            <Text style={styles.buttonText}>Start a League</Text>
          </TouchableHighlight>
          <TouchableHighlight  onPress={this.props.viewRules} underlayColor='transparent'>
            <Text style={styles.explanationLink}>Read Game Overview</Text>
          </TouchableHighlight>
        </View>
      )
    } else if (this.state.loading) {
      return(
        <View style={styles.actionHolder}>
          <ActivityIndicator animating={this.state.loading} color="rgba(255, 255, 255, 0.8)" size="large" />
        </View>
      )
    } else if (this.state.savedLeague) {
      let { savedLeague, shareableLink } = this.state
      return (
        <View style={styles.actionHolder}>
          <Text style={styles.finalStepText}>And the final step...</Text>
          <Text style={styles.spreadTheWordText}>Invite your Crew.</Text>
          <Text style={styles.explanationText}>Copy and share this link:</Text>
          <TouchableHighlight style={styles.shareableLinkButton}  onPress={this.copyShareableLink} underlayColor='transparent'>
            <Text style={styles.shareableLink}>{ shareableLink }</Text>
          </TouchableHighlight>
          <Text style={styles.biggerExplanationText}>(we recommend 12+ people per league)</Text>
          { this.state.allowedToProceed &&
            <View style={styles.backToDash}>
              <TouchableHighlight onPress={() => this.props.callback(savedLeague)} underlayColor='transparent'>
                <Image source={forwardButton} />
              </TouchableHighlight>
            </View>
          }
        </View>
      )
    } else {
      return(
        <View style={styles.actionHolder}>
          <Text style={styles.explanationText}>Pick a name for your league:</Text>
          <TextInput
            ref='leagueName'
            style={styles.leagueNameInput}
            maxLength={MAX_NAME_LENGTH}
            onChangeText={(leagueName) => this.setState({ leagueName })}
            value={this.state.leagueName}
          />
          <TouchableHighlight style={styles.newLeagueButton} onPress={this.getStarted} underlayColor='#1DD65B'>
            <Text style={styles.buttonText}>Get Started!</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }

  render() {
    const { savedLeague } = this.state
    return (
      <Modal
        animationType='slide'
        presentationStyle='fullScreen'
        visible={this.props.show }>
        { this.props.show &&
          <View style={styles.container}>
            <Image
              style={styles.backgroundImage}
              source={background} />
              { !savedLeague && 
                <View style={styles.headerHolder}>
                  <Image
                    style={styles.logoIcon}
                    resizeMode='contain'
                    source={logo} />
                </View>
              }
              { this.body() }
          </View>
        }
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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
  logoIcon: {
    alignSelf: 'center',
    width: '75%',
    height: '75%'
  },
  headerHolder: {
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 40
  },
  actionHolder: {
    flex: 3,
  },
  newLeagueButton: {
    backgroundColor: '#2857ED',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin: 20
  },
  explanationText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: 'white',
    fontSize: 14,
    paddingRight: 10,
    paddingLeft: 10
  },
  explanationLink: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: '#2857ED',
    fontSize: 14
  },
  finalStepText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: 'white',
    fontSize: 14,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 60
  },
  biggerExplanationText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: 'white',
    fontSize: 18,
    paddingRight: 10,
    paddingLeft: 10
  },  
  spreadTheWordText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    fontSize: 58,
    paddingRight: 20,
    paddingLeft: 20,
    margin: 20
  },
  buttonText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    fontSize: 18
  },
  leagueNameInput: {
    fontSize: 30,
    fontFamily: 'Avenir',
    fontWeight: '300',
    borderWidth: 1,
    borderRadius: 0,
    height: 80,
    paddingLeft: 15,
    margin: 20,
    marginBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
  },
  shareableLinkButton: {
    borderWidth: 0,
    borderRadius: 0,
    height: 40,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.10)'
  },
  shareableLink: {
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: '300',
    color: 'white',
  },
  backToDash: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})