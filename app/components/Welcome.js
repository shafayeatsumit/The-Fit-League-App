import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  StatusBar,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

import Instabug from 'instabug-reactnative'
import LinearGradient from 'react-native-linear-gradient'
import { Sentry } from 'react-native-sentry'
import { Actions } from 'react-native-router-flux'
import { AppEventsLogger } from 'react-native-fbsdk'

import { HttpUtils } from '../services/HttpUtils'
import { Session } from '../services/Session'
import { SessionStore } from '../services/SessionStore'
import { LeagueJoiner } from '../services/LeagueJoiner'

const badge = require('../../assets/images/badge.png')
const logo = require('../../assets/images/logo.png')

const FBSDK = require('react-native-fbsdk')

const { 
  LoginButton, 
  AccessToken,
} = FBSDK;

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, useFacebook: true }
    this.facebookSave = this.facebookSave.bind(this)
    this.emailSave = this.emailSave.bind(this)
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    AppEventsLogger.logEvent('Saw Facebook Login');
  }

  facebookSave() {
    this.setState({ loading: true });
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        LeagueJoiner.getSlug((slug) => {
          let params = { access_token: data.accessToken.toString() }
          if (slug) {
            params.league_slug = slug
            AppEventsLogger.logEvent('Joined League On Registration')
          }
          HttpUtils.post('login', params).then((responseData) => {
            let { token, image_url, email, name } = responseData.data.attributes
            Instabug.identifyUserWithEmail(email, name)
            Instabug.setUserAttribute("ID", responseData.data.id)
            AppEventsLogger.logEvent('Logged in with Facebook')
            SessionStore.save({ token, imageUrl: image_url, leagueId: responseData.meta.league_id })
            Session.save(token)
            Actions.home({ token })
          }).catch((error) => {
            AlertIOS.alert("Sorry! Login failed.", error.message)
            AppEventsLogger.logEvent('Failed to log in with Facebook', { message: error.message })
            this.setState({ loading: false })
          }).done();          
        })
      }
    )
  }

  emailSave() {
    this.setState({ loading: true });
    LeagueJoiner.getSlug((slug) => {
      let params = this.state
      if (slug) {
        params.league_slug = slug
        AppEventsLogger.logEvent('Joined League On Email Registration')
      }
      HttpUtils.post('email_login', params).then((responseData) => {
        let { token, image_url, email, name } = responseData.data.attributes
        Instabug.identifyUserWithEmail(email, name)
        Instabug.setUserAttribute("ID", responseData.data.id)
        AppEventsLogger.logEvent('Logged in with Email')
        SessionStore.save({ token, imageUrl: image_url, leagueId: responseData.meta.league_id })
        Session.save(token)
        Actions.home({ token })
      }).catch((error) => {
        AlertIOS.alert("Sorry! Login failed.", error.message)
        AppEventsLogger.logEvent('Failed to log in with Email', { message: error.message })
        this.setState({ loading: false })
      }).done();          
    })
  }

  render() {
    return (
      <LinearGradient 
        start={{x: 0, y: 1}} end={{x: 1, y: 0}}
        colors={['#2857ED', '#1DD65B']}
        style={styles.contentContainer}>
        <View style={styles.badgeHolder}>
          <Image resizeMode='contain' style={styles.badge} source={badge} />
        </View>      
        <View style={styles.logoHolder}>
          <Image resizeMode='contain' style={styles.logo} source={logo} />
        </View>
        { !this.state.loading &&
          <View style={styles.loginButtonHolder}>
            { this.state.useFacebook ?
              <LoginButton
                style={styles.loginButton}
                readPermissions={['public_profile', 'email']}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      Sentry.captureException(error)
                      alert('Sorry! Login failed.')
                    } else if (result.isCancelled) {
                      alert('Login was cancelled')
                    } else {
                      this.facebookSave()
                    }
                  }
                }
                onLogoutFinished={() => alert("Now you're completely logged out!")}/>
              :
              <View style={styles.loginColumn}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={this.state.email}
                  onChangeText={(email) => this.setState({ email })}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({ password })}
                />
                <TouchableHighlight style={styles.emailRegBtn} onPress={this.emailSave} underlayColor='transparent'>
                  <Text style={styles.emailRegText}>Sign Up or Log In</Text>
                </TouchableHighlight>
              </View>
            }
          </View>
        }
        <View style={styles.textHolder}>
          <Text style={styles.text}>
            10-week exercise competitions
          </Text>
          <Text style={styles.text}>
            for you and your crew.
          </Text>
        </View>
        <TouchableHighlight style={styles.noFacebook} onPress={() => this.setState({ useFacebook: !this.state.useFacebook })} underlayColor='transparent'>
          <Text style={styles.noFacebookText}>{ this.state.useFacebook ? 'Not on Facebook?' : 'Have a Facebook?'}</Text>
        </TouchableHighlight>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  badgeHolder: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    width: 100
  },
  logoHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 300
  },
  textHolder: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 18,
    fontFamily: 'Avenir-Light',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  loginColumn: {
    flexDirection: 'column',
    flex: 1,
    width: '80%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 22,
    fontFamily: 'Avenir-Light',
    borderWidth: 1,
    borderRadius: 0,
    height: 50,
    padding: 14,
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
    marginBottom: 10,
  },
  loginButtonHolder: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noFacebook: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noFacebookText: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  emailRegBtn: {
    backgroundColor: '#2857ED',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  emailRegText: {
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});