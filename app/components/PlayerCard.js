import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Text,
  TextInput,
  StatusBar,
  Alert,
  AsyncStorage,
  Dimensions,
  ActivityIndicator
} from 'react-native'

import Instabug from 'instabug-reactnative'
import LinearGradient from 'react-native-linear-gradient'

import { AppEventsLogger } from 'react-native-fbsdk'

import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

import HamburgerBasement from './HamburgerBasement'
import PlayerHeader from './PlayerHeader'

const MAX_BIO_LENGTH = 90

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class PlayerCard extends Component {
  constructor(props) {
    super(props)
    this.updateBio = this.updateBio.bind(this)
    this.confirmInjuredReserve = this.confirmInjuredReserve.bind(this)
    this.confirmLeagueQuit = this.confirmLeagueQuit.bind(this)
    this.logOut = this.logOut.bind(this)
    this.state = { loading: true, player: props.player, saveLabel: 'Save' }  
  }

  updateBio() {
    let { player } = this.state
    player.bio = this.state.bio
    this.setState({ player, saveLabel: 'Saving...' })
    HttpUtils.put('profile', { bio: this.state.bio }, this.props.token)
      .then((responseData) => {
        this.setState({ saveLabel: 'Saved!' })
      }).done();
  }

  confirmInjuredReserve() {
    AppEventsLogger.logEvent('Considered Injured Reserve')
    Alert.alert(
      'Are you sure?',
      'Do you really want to go on Injured Reserve?',
      [ { text: 'Nevermind', style: 'cancel' },
        { text: 'Yep!', 
          onPress: () => {
            AppEventsLogger.logEvent('Actually requested Injured Reserve')
            HttpUtils.post('profile/injured_reserve', {}, this.props.token)
              .then((responseData) => {
                Alert.alert('Injured Reserve', 'We will be in touch shortly!')
              }).done()
          } 
        } ]
    )
  }

  confirmLeagueQuit() {
    AppEventsLogger.logEvent('Considered Quitting League')
    Alert.alert(
      'Are you sure?',
      'Do you really want to quit the league?',
      [ { text: 'Nevermind', style: 'cancel' },
        { text: 'Yep!', 
          onPress: () => {
            AppEventsLogger.logEvent('Actually Quit League')
            HttpUtils.post('profile/quit_league', {}, this.props.token)
              .then((responseData) => {
                Alert.alert('League Exited', 'We will be in touch shortly!')
              }).done()
          } 
        } ]
    )
  }

  logOut() {
    Instabug.logOut()
    AppEventsLogger.logEvent('Logged Out')
    // Can delete when we rip out Session.js
    AsyncStorage.removeItem('auth_token').then(() => {
      AsyncStorage.removeItem(SessionStore.key).then(() => {
        Actions.welcome({})
      })
    })
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    // Nasty hack to sniff out whether this is my card
    let mine = !this.state.player || (this.state.player.image_url === this.props.image_url)
    if (mine) {
      HttpUtils.get('profile', this.props.token)
        .then((responseData) => {
          this.setState({ mine: true, bio: responseData.data.attributes.bio, player: responseData.data.attributes, loading: false })
        }).catch((err) => {
          this.setState({ loading: false })
        }).done()
    } else {
      this.setState({ loading: false })
    }
    AppEventsLogger.logEvent(mine ? 'Viewed My Card' : 'Viewed Player Card')
  }

  render() {
    return (
      <HamburgerBasement token={this.props.token} image_url={this.props.image_url}>
        { this.state.player &&
          <Image style={styles.playerImage} source={{ uri: this.state.player.image_url  }} />
        }
        <PlayerHeader style={styles.headerContainer} {...this.props} />
        <View style={styles.container}>
          { this.state.loading ? 
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#818D9C" />
            </View>
            :
            <View style={styles.playerColumn}>
              <Text style={styles.playerName}>{ this.state.player.name }</Text>
              { this.state.mine ? 
                <View style={styles.myProfileHolder}>
                  <View style={styles.updateBioRow}>
                    <View style={styles.updateBioColumn}>
                      <TextInput 
                        style={styles.bioInput} multiline={true} 
                        ref='bio'
                        placeholder='Enter your Fit League bio...'
                        maxLength={MAX_BIO_LENGTH}
                        onChangeText={(bio) => this.setState({ bio, saveLabel: 'Save' })}
                        value={this.state.bio} />
                      <TouchableHighlight style={StyleSheet.flatten([styles.updateBioButton, (this.state.bio === this.state.player.bio ? styles.updateBioButtonWaiting : styles.updateBioButtonReady)])} onPress={this.updateBio} underlayColor='#508CD8'>
                        <Text style={styles.updateBioText}>{this.state.saveLabel}</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                  <View style={styles.dangerRow}>
                    <View style={styles.dangerColumn}>
                      <View style={styles.dangerZoneHeader}>
                        <Text style={styles.dangerZoneHeaderText}>Danger Zone</Text>
                      </View>
                      <View style={styles.dangerActionsRow}>
                        <View style={styles.dangerAction}>
                          <Text style={styles.dangerActionText}>Injured?</Text>
                          <TouchableHighlight style={styles.dangerButton} onPress={this.confirmInjuredReserve} underlayColor='#D61D5A'>
                            <Text style={styles.dangerButtonText}>Go on Injured Reserve</Text>
                          </TouchableHighlight>
                        </View>
                        <View style={styles.dangerAction}>
                          <Text style={styles.dangerActionText}>Giving up?</Text>
                          <TouchableHighlight style={styles.dangerButton} onPress={this.confirmLeagueQuit} underlayColor='#E9005A'>
                            <Text style={styles.dangerButtonText}>Quit the League</Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.logOutRow}>
                    <TouchableHighlight onPress={this.logOut} underlayColor='transparent'>
                      <Text style={styles.logOutText}>Log Out</Text>
                    </TouchableHighlight>
                  </View>
                </View>
                :
                <View>
                  <Text style={styles.bio}>{this.state.player.bio}</Text>
                  <Text style={styles.comingSoon}>Player Cards coming soon!</Text>
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
    flex: 4,
    borderTopColor: '#D5D7DC',
    borderTopWidth: 1,
    backgroundColor: 'white'
  },
  loading: {
    padding: 20
  },
  playerColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  playerImage: {
    top: (SCREEN_HEIGHT / 5) - 60,
    left: (SCREEN_WIDTH / 2) - 60,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'white',
    position: 'absolute',
    zIndex: 100
  },
  playerName: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 20,
    backgroundColor: 'transparent',
    padding: 20,
    marginTop: 55
  },
  myProfileHolder: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  updateBioRow: {
    flex: 4,
    flexDirection: 'row'
  },
  updateBioColumn: {
    flexDirection: 'column'
  },
  dangerRow: {
    backgroundColor: '#F7F8F9',
    flex: 3,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  logOutRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bioInput: {
    backgroundColor: '#EAEBEB',
    borderWidth: 1,
    height: 60,
    width: 300,
    borderColor: '#CECFCF',
    fontSize: 15,
    padding: 10,
    paddingTop: 10,
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    textAlign: 'center'
  },
  updateBioButton: {
    marginTop: 20,
    padding: 10,
  },
  updateBioButtonReady: {
    backgroundColor: '#2857ED',
  },
  updateBioButtonWaiting: {
    backgroundColor: '#CECFCF',
  },
  updateBioText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  bio: {
    width: 300,
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    textAlign: 'center',
    fontSize: 15  
  },
  comingSoon: {
    fontFamily: 'Avenir-Light',
    color: '#8691A0',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 12  
  },
  logOutText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    textDecorationLine: 'underline',
    textDecorationColor: '#508CD8',
    color: '#508CD8',
    fontSize: 14
  },
  dangerColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  dangerZoneHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dangerZoneHeaderText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#0E2442',
    fontSize: 14,
    paddingTop: 30
  },
  dangerActionsRow: {
    flexDirection: 'row',
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dangerAction: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dangerActionText: {
    fontFamily: 'Avenir-Light',
    backgroundColor: 'transparent',
    color: '#0E2442',
    fontSize: 14,
    padding: 5
  },
  dangerButton: {
    borderWidth: 1,
    width: '80%',
    borderRadius: 5,
    borderColor: '#E9005A',
  },
  dangerButtonText: {
    fontFamily: 'Avenir-Light',
    backgroundColor: 'transparent',
    color: '#E9005A',
    fontSize: 10,
    textAlign: 'center',
    padding: 5
  },
});