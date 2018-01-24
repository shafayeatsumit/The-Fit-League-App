import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  AlertIOS
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import { AppEventsLogger } from 'react-native-fbsdk';

import { HttpUtils } from '../services/HttpUtils'
import { Session } from '../services/Session'
import { LeagueJoiner } from '../services/LeagueJoiner'

const badge = require('../../assets/images/badge.png');
const logo = require('../../assets/images/logo.png');

const FBSDK = require('react-native-fbsdk');

const { 
  LoginButton, 
  AccessToken,
} = FBSDK;

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    AppEventsLogger.logEvent('Saw Facebook Login');
  }

  save() {
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
            let { token } = responseData.data.attributes
            AppEventsLogger.logEvent('Logged in with Facebook');
            Session.save(token);
            Actions.home({ token });
          }).catch((error) => {
            AlertIOS.alert("Sorry! Login failed.", error.message)
            AppEventsLogger.logEvent('Failed to log in with Facebook', { message: error.message });
            this.setState({ loading: false, hideButton: false });
          }).done();          
        })
      }
    )
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
            <LoginButton
              style={styles.loginButton}
              readPermissions={['public_profile', 'email']}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert('Login failed with error: ' + result.error);
                  } else if (result.isCancelled) {
                    alert('Login was cancelled');
                  } else {
                    this.save();
                  }
                }
              }
              onLogoutFinished={() => alert("Now you're completely logged out!")}/>
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
    flex: 1,
    justifyContent: 'center'
  },
  badge: {
    width: 100
  },
  logoHolder: {
    flex: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 300
  },
  textHolder: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  loginButtonHolder: {
    flex: 1
  },
});