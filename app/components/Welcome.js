import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Keyboard,
  Animated,
  View,
  Image,
  TextInput,
  StatusBar,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

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
const blankImageUrl = "https://s3.amazonaws.com/fitbots/no-profile-image.png"

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

    this.badgeHolderFlex = new Animated.Value(2);
    this.badgeHeight = new Animated.Value(100);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    AppEventsLogger.logEvent('Saw Facebook Login');
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);    
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = (event) => {
    Animated.parallel([
      Animated.timing(this.badgeHolderFlex, {
        toValue: 0.5,
      }),      
      Animated.timing(this.badgeHeight, {
        toValue: 40,
      })
    ]).start()    
  };

  keyboardDidHide = (event) => {
    Animated.parallel([
      Animated.timing(this.badgeHolderFlex, {
        toValue: 2,
      }),      
      Animated.timing(this.badgeHeight, {
        toValue: 100,
      })
    ]).start()  
  };


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
            let { token, email, name } = responseData.data.attributes
            AppEventsLogger.logEvent('Logged in with Facebook')
            SessionStore.save({ token, leagueId: responseData.meta.league_id })
            Session.save(token)
            Actions.home({ token })
          }).catch((error) => {
            alert("Sorry! Login failed.")
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
        AppEventsLogger.logEvent('Logged in with Email')
        SessionStore.save({ token, imageUrl: image_url, leagueId: responseData.meta.league_id })
        Session.save(token)
        image_url === blankImageUrl ? Actions.profileImage({ token }) : Actions.home({ token })
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
        <Animated.View style={[styles.badgeHolder, { flex: this.badgeHolderFlex }]}>
          <Animated.Image resizeMode='contain' style={[styles.badge, {height:this.badgeHeight}]} source={badge} />
        </Animated.View>
        <View style={styles.logoHolder}>
          <Image resizeMode='contain' style={styles.logo} source={logo} />
        </View>
        <View style={styles.textHolder}>
          <Text style={styles.text}>
            10-week exercise competitions
          </Text>
          <Text style={styles.text}>
            for you and your crew.
          </Text>
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
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    placeholder='Full Name'
                    placeholderTextColor='white'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(name) => this.setState({ name })}
                    />
                <TextInput
                    style={styles.input}
                    value={this.state.email}
                    placeholder='Email'
                    autoCapitalize='none'
                    placeholderTextColor='white'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(email) => this.setState({ email })}
                    />
                <TextInput
                    style={styles.input}
                    value={this.state.password}
                    secureTextEntry={true}
                    placeholder='Password'
                    placeholderTextColor='white'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onChangeText={(password) => this.setState({ password })}
                    />
                <TouchableHighlight style={styles.emailRegBtn} onPress={this.emailSave} underlayColor='transparent'>
                  <Text style={styles.emailRegText}>Sign Up or Log In</Text>
                </TouchableHighlight>
              </View>
          }
        </View>
        }
        <TouchableHighlight style={styles.noFacebook} onPress={() => this.setState({ useFacebook: !this.state.useFacebook })} underlayColor='transparent'>
          <Text style={styles.noFacebookText}>{ this.state.useFacebook ? 'Not on Facebook?' : 'Sign up by Facebook'}</Text>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    width: 100
  },
  logoHolder: {
    flex: 0.5,
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
    flex: 0.8,
    marginTop: 25,
    width: '80%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 20,
    fontFamily: 'Avenir-Light',
    borderWidth: 1,
    borderRadius: 0,
    height: 40,
    padding: 10,
    width: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
    marginBottom: 10,
  },
  placeHolderText: {
    color: 'white',
    fontSize: 18
  },
  loginButtonHolder: {
    flex: 4,
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
    padding: 10,
    marginTop: 8,
  },
  emailRegText: {
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});