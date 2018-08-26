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

const settingsContent = [
  {title:'Name and Profile Pic' , subtitle:'Update your display name and image'},
  {title:'Email and Password' , subtitle:'Change preferred email and password'},
  {title:'About Me' , subtitle:'Describe yourself'},
  {title:'Notifications' , subtitle:'Manage push notifications'},
  {title:'Pause or Quit' , subtitle:'Go temporarily inactive or quit league'},
]


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false ,
      modalName: null,
      updatedImage: null,
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
    if (this.state.showModal) {
      return (
        <View style={styles.modalBackground}>
          <SettingsModals show={this.state.showModal} modalName={this.state.modalName} exitModal={this.closeModal} {...this.props}/>
        </View>
      )
    }

    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Settings" />
        <View style={styles.touchablesRow}>     
          {
            settingsContent.map((content) => {
              return(
                <TouchableHighlight 
                  style={[styles.touchableItem, content.title === 'Pause or Quit'? {borderBottomWidth:0} : {borderBottomWidth:1}]} 
                  underlayColor='#DCDCDC' 
                  onPress={this.handlePress.bind(this, "nameAndPic")} 
                  key={content.name}
                >
                  <View>
                    <Text style={styles.titleText}>
                      {content.title}
                    </Text> 
                    <Text style={styles.subtitleText}>
                      {content.subtitle}
                    </Text>
                  </View>
                </TouchableHighlight>                
              )
            })
          }
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
  modalBackground: {
    backgroundColor:'rgba(0,0,0,0.8)', 
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },  
  touchableItem: {
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column',
    borderBottomColor: '#D5D7DC',
    marginHorizontal:20,
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 17,
    backgroundColor: 'transparent',
    textAlign: 'justify',
    lineHeight: 25,
  }, 
  subtitleText: {
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    fontSize: 15,
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
    fontFamily: 'Avenir-Light',
    fontWeight: '400',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 17,
    padding: 5
  },  
})


export default Settings;