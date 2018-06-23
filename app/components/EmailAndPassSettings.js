import React, { Component } from 'react';
import { 
  Text, 
  View,
  Image,
  TouchableHighlight,
  TextInput,
  StyleSheet
} from 'react-native';


class EmailAndPassSettings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.emailConatinaer}>
          <Text style={styles.explanationText}>Set Preffered Email</Text>
          <Text style={styles.explinationDetail}>
            Make Sure this is a valid email! You don't want to miss the weekly report cards!
          </Text>
          <TextInput
            style={styles.Input}
            value="ZAC BARRET"
          />          
        </View> 
        <View style={styles.passwordContainer}>
          <Text style={styles.explanationText}>Update Password</Text>
            <TextInput
              style={styles.Input}
              value="LOCKED(connect to facebook)"
            />          
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.saveButton} underlayColor='#E9005A' onPress={()=>Alert.alert('pressed')}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableHighlight>          
        </View>
      </View>    
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  explinationDetail: {
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    fontSize: 16,
    paddingLeft: 20
  },  
  explanationText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 20,
    paddingLeft: 20
  },  
  Input: {
    fontSize: 17,
    fontFamily: 'Avenir-Light',
    color: '#5B7182',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#CECFCF',
    height: 35,
    paddingLeft: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 0,
    backgroundColor: '#F4F4F4'    
  },
  passwordContainer: {
    paddingTop: 10
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  saveButton: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    backgroundColor:'#2C5CE9',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#F1F4FD',
    fontSize: 20,
    padding: 5    
  }
})

export default EmailAndPassSettings;