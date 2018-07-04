import React, { Component } from 'react';
import { 
  Text, 
  View,
  Alert,
  TouchableHighlight,
  TextInput,
  StyleSheet
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils';

class AboutMeSettings extends Component {
  constructor(props){
    super(props);
    this.state = { aboutMeText:"" }
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave() {
    const { token } = this.props;
    this.setState({ aboutMeText: "" })
    HttpUtils.put('profile', { bio: this.state.aboutMeText }, token).then((response) => {
      this.props.exitModal() 
    }).catch((error) => {
      Alert.alert("Sorry! Update failed.", error.message)
    }).done()   
  }

  render(){
    return (
      <View style={styles.mainContainer}>
        <View style={styles.explainTextContainer}>
          <Text style={styles.explainText}>
            This little bio appears on your Player Card.
          </Text>
          <Text style={styles.explainText}>Everyone will see it. it's really important.</Text>
          <Text style={styles.explainText}>Be funny. Do it. </Text>
        </View>
        <TextInput
          style={styles.Input}
          multiline={true}
          numberOfLines = {4}
          value = {this.state.aboutMeText}
          placeholder = "Type here ..."
          onChangeText={(val) => this.setState({ aboutMeText: val })}
        />  
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.saveButton} underlayColor='transparent' onPress={this.handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableHighlight>          
        </View>        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  explainTextContainer: {
    paddingTop:10,
  },
  explainText: {
    fontFamily: 'Avenir-Light',
    color: '#0E2442',
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
  },
  Input: {
    fontSize: 17,
    fontFamily: 'Avenir-Light',
    color: '#5B7182',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#CECFCF',
    height: 120,
    paddingLeft: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 0,
    backgroundColor: '#F4F4F4'    
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

export default AboutMeSettings;