import React, { Component } from 'react';
import { 
  Text, 
  View,
  Image,
  TouchableHighlight,
  TextInput,
  StyleSheet
} from 'react-native';

class PauseQuitSettings extends Component {
  render(){
    return (
      <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.button} underlayColor='#E9005A' onPress={()=>Alert.alert('pressed')}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableHighlight>          
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.explainText}>If you choose to "pause", you will be placed</Text>
          <Text style={styles.explainText}>on the "Inactive" list. While inactive, you are</Text>
          <Text style={[styles.explainText,{textAlign:'center'}]}>not assigned a matchup. This is a good</Text>
          <Text style={[styles.explainText,{textAlign:'center'}]}>option if you are injured</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.button} underlayColor='#E9005A' onPress={()=>Alert.alert('pressed')}>
            <Text style={styles.buttonText}>Quit</Text>
          </TouchableHighlight>          
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.explainText}>Unlike "pausing", if you quit the league, you</Text>
          <Text style={[styles.explainText,{textAlign:'center'}]}>quit the league permanently.</Text>
          <Text style={[styles.explainText,{textAlign:'center'}]}>We don't recommend it ;)</Text>
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
    color: '#0E2442',
    fontSize: 15,
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
    fontSize: 20,
    padding: 5    
  }  
})

export default PauseQuitSettings;