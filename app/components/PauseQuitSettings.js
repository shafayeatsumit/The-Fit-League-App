import React, { Component } from 'react';
import { 
  Text, 
  View,
  Image,
  Alert,
  AsyncStorage,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk';

import { HttpUtils } from '../services/HttpUtils';

class PauseQuitSettings extends Component {
  constructor(props){
    super(props);
    this.handlePause = this.handlePause.bind(this);
    this.handleQuit = this.handleQuit.bind(this);
  }
  
  handlePause() {
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

  handleQuit() {
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

  render(){
    return (
      <View style={styles.mainContainer}>
        <View style={styles.spacer}/>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.button} underlayColor='#E9005A' onPress={this.handlePause}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableHighlight>          
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.explainText}>If you choose to "pause", you will be placed</Text>
          <Text style={styles.explainText}>on the "Inactive" list. While inactive, you are</Text>
          <Text style={styles.explainText}>not assigned a matchup. This is a good</Text>
          <Text style={styles.explainText}>option if you are injured</Text>
        </View>
        <View style={styles.spacer}/>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.button} underlayColor='#E9005A' onPress={this.handleQuit}>
            <Text style={styles.buttonText}>Quit</Text>
          </TouchableHighlight>          
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.explainText}>Unlike "pausing", if you quit the league, you</Text>
          <Text style={styles.explainText}>quit the league permanently.</Text>
          <Text style={styles.explainText}>We don't recommend it ;)</Text>
        </View>                
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  explainText: {
    fontFamily: 'Avenir-Light',
    textAlign: 'center',
    color: '#0E2442',
    fontSize: 14,
    paddingHorizontal: 20
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  textContainer: {
    paddingTop: 20
  },
  button: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    backgroundColor:'#E6105C',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  buttonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#F1F4FD',
    fontSize: 18,
    padding: 5    
  },
  spacer: {
    paddingVertical:10
  } 
})

export default PauseQuitSettings;