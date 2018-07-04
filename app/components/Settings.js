import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  StatusBar,
  TouchableHighlight
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { AppEventsLogger } from 'react-native-fbsdk';

import { SessionStore } from '../services/SessionStore'
import HamburgerBasement from './HamburgerBasement'
import SettingsModals from './SettingsModals'
import OtherHeader from './OtherHeader'

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false ,
      modalName: null,
    }
    this.closeModal = this.closeModal.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  componentDidMount(){
    StatusBar.setBarStyle('dark-content', true)
  }

  handlePress(modalName){
    this.setState({modalName, showModal: true})
  }

  closeModal() {
    this.setState({showModal: false})
  }

  logOut() {
    // TODO: need to check facebook logout option.
    AppEventsLogger.logEvent('Logged Out')
    AsyncStorage.removeItem('auth_token').then((res) => {
      AsyncStorage.removeItem(SessionStore.key).then(() => {
        Actions.welcome({})
      })
    })    
  }

  render() {
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Settings" />
        <SettingsModals show={this.state.showModal} modalName={this.state.modalName} exitModal={this.closeModal} {...this.props}/>
        <View style={styles.touchablesRow}>     
          <TouchableHighlight style={styles.touchableItem} underlayColor='#DCDCDC' onPress={this.handlePress.bind(this, "nameAndPic")}>
            <View>
              <Text style={styles.titleText}>
                Name and Profile Pic
              </Text> 
              <Text style={styles.subtitleText}>
                Update your display name and image
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.touchableItem} underlayColor='#DCDCDC' onPress={this.handlePress.bind(this, "emailAndPass")}>
            <View >
              <Text style={styles.titleText}>
                Email and Password
              </Text> 
              <Text style={styles.subtitleText}>
                Change preferred email and password
              </Text>                               
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.touchableItem} underlayColor='#DCDCDC' onPress={this.handlePress.bind(this, "aboutMe")}>
            <View >
              <Text style={styles.titleText}>
                About Me
              </Text> 
              <Text style={styles.subtitleText}>
                Describe yourself
              </Text>                               
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.touchableItem} underlayColor='#DCDCDC' onPress={this.handlePress.bind(this, "notifications")}>
            <View>
              <Text style={styles.titleText}>
                Notifications
              </Text> 
              <Text style={styles.subtitleText}>
                Manage push notifications
              </Text>                               
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.lastTouchableItem} underlayColor='#DCDCDC' onPress={this.handlePress.bind(this, "pause")}>
          <View >
            <Text style={styles.titleText}>
              Pause or Quit
            </Text> 
            <Text style={styles.subtitleText}>
              Go temporarily inactive or quit league
            </Text>                               
          </View>              
          </TouchableHighlight>
        </View>
        <View style={styles.logoutRow}>
          <TouchableHighlight style={styles.logoutButton} underlayColor='#E9005A' onPress={this.logOut}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableHighlight>
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex:1
  },
  touchablesRow: {
    flex: 6,
    backgroundColor: 'white'    
  },
  touchableItem: {
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column',
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
    marginHorizontal:20,
  },
  lastTouchableItem: {
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column',
    borderBottomColor: '#D5D7DC',
    marginHorizontal:20, 
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'justify',
    lineHeight: 25,
  }, 
  subtitleText: {
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'justify',
  },    
  logoutRow: {
    flex:1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  logoutButton: {
    borderWidth: 1,
    width: '50%',
    height: '50%',
    borderRadius: 5,
    borderColor: '#E9005A',
    backgroundColor: '#E9005A',
    alignItems: 'center',
    justifyContent: 'center'     
  },
  logoutButtonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20,
    padding: 5
  },  
})


export default Settings;