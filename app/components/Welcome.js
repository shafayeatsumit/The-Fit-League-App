import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  AlertIOS
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import { AppEventsLogger } from 'react-native-fbsdk';

import AltAuthLink from '../components/AltAuthLink'

import { HttpUtils } from '../services/HttpUtils'
import { Session } from '../services/Session'

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
    AppEventsLogger.logEvent('Saw Facebook Login');
  }

  save() {
    this.setState({ loading: true });
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        HttpUtils.post('login', {
          access_token: data.accessToken.toString() 
        }).then((responseData) => {
          let { token } = responseData.data.attributes
          AppEventsLogger.logEvent('Logged in with Facebook');
          Session.save(token);
          Actions.home({ token });
        }).catch((error) => {
          AlertIOS.alert("Sorry! Login failed.", error.message)
          AppEventsLogger.logEvent('Failed to log in with Facebook', { message: error.message });
          this.setState({ loading: false, hideButton: false });
        }).done();
      }
    )
  }

  render() {
    return (
      <View style={styles.container}>
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
          <View style={styles.textHolder}>
            <Text style={styles.text}>
              10 week exercise competitions
            </Text>
            <Text style={styles.text}>
              for you and your crew.
            </Text>
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
                onLogoutFinished={() => alert("User logged out")}/>
            </View>
          }
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F8F9'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  badgeHolder: {
    flex: 4
  },
  badge: {
    width: 100
  },
  logoHolder: {
    flex: 1
  },
  logo: {
    width: 300
  },
  textHolder: {
    flex: 1
  },
  text: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  loginButtonHolder: {
    flex: 4
  },
});