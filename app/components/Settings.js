import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  StatusBar
} from 'react-native';

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
    this.logoutPressed = this.logoutPressed.bind(this)
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

  logoutPressed() {
    // TODO: need send request to server.
  }

  render() {
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Settings" />
        <SettingsModals show={this.state.showModal} modalName={this.state.modalName} exitModal={this.closeModal} />
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
          <TouchableHighlight style={styles.logoutButton} underlayColor='#E9005A' onPress={this.logoutPressed}>
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
    marginVertical:10
  },
  lastTouchableItem: {
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column',
    borderBottomColor: '#D5D7DC',
    marginHorizontal:20,
    marginVertical:10    
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 20,
    backgroundColor: 'transparent'
  }, 
  subtitleText: {
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    fontSize: 18,
    backgroundColor: 'transparent'
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
    width: '80%',
    height: '50%',
    borderRadius: 5,
    borderColor: '#E9005A',
    alignItems: 'center',
    justifyContent: 'center'     
  },
  logoutButtonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#E6105C',
    fontSize: 20,
    padding: 5
  },  
})


export default Settings;