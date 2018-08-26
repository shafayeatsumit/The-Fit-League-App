import React, { Component } from 'react';
import { 
  Text, 
  View,
  Alert,
  TouchableHighlight,
  ActivityIndicator,
  TextInput,
  StyleSheet
} from 'react-native';

import { HttpUtils } from '../../services/HttpUtils';

export default class AboutMeSettings extends Component {
  constructor(props){
    super(props);
    this.state = { 
      loading: true, 
      aboutMeText: null 
    }
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave() {
    const { token } = this.props;
    this.setState({ loading: true })
    HttpUtils.put('profile', { bio: this.state.aboutMeText }, token).then((response) => {
      this.setState({ loading: false })
      this.props.exitModal() 
    }).catch((error) => {
      this.setState({ loading: false })
      Alert.alert("Sorry! Update failed.", error.message)
    }).done()   
  }

  componentDidMount() {
    HttpUtils.get('profile', this.props.token)
    .then((responseData) => {
      const { bio } = responseData.data.attributes
      this.setState({ loading: false, aboutMeText: bio })
    }).catch((err) => {
      this.setState({ loading: false })
    }).done()        
  }

  render(){
    return (
      <View style={styles.mainContainer}>
        {
          this.state.loading ? 
          <View style={styles.loadingConainer}>
            <ActivityIndicator size="large" style={styles.loading} color="#B6B7C2" />
          </View>
          :
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
              onChangeText={(val) => this.setState({ aboutMeText: val })}
            />  
            <View style={styles.buttonContainer}>
              <TouchableHighlight style={styles.saveButton} underlayColor='transparent' onPress={this.handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableHighlight>          
            </View> 
          </View>
        }       
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  loadingConainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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

