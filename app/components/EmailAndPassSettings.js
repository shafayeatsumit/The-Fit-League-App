import React, { Component } from 'react';
import { 
  Text, 
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'

class EmailAndPassSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailPlaceHolder: "",
      oldPassword: "",
      newPassword: "",
      from_facebook: false,
      loading: true,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    HttpUtils.get('profile', this.props.token)
      .then((response) => {
        const { notification_email, from_facebook } = response.data.attributes
        this.setState({emailPlaceHolder: notification_email, from_facebook, loading: false})
      }).catch((err)=>{
        // TODO: sentry stuff
        this.setState({'loading': false})
      }).done()
  }

  handleSave() {
    const { email, newPassword, oldPassword, from_facebook } = this.state;
    const { token } = this.props;
    this.setState({ email: "", oldPassword: "", newPassword: "", loading: true })
    // TODO: email validation needs to be added
    HttpUtils.put('profile', { notification_email: email }, token).then((response) => {

      if (from_facebook === false) {
          HttpUtils.put('profile/password', { current_password: oldPassword , new_password: newPassword }, token).then((passResponse) => {
          this.setState({ loading: false })
          this.props.exitModal()
        }).catch((error) => {
          this.setState({ loading: false })
          Alert.alert("Sorry! Update failed.", error.message)
        }).done()
      }else {
        this.setState({ loading: false })
        this.props.exitModal()
      }

    }).catch((error) => {
      Alert.alert("Sorry! Update failed.", error.message)
    }).done()  
  }

  handleChange(name, val) {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  render() {
    const { from_facebook } = this.state;
    
    return (
      <View style={styles.mainContainer}>
        {this.state.loading ?
          <View style={styles.loadingConainer}>
            <ActivityIndicator size="large" style={styles.loading} color="#B6B7C2" />
          </View>      
          :
          <View style={styles.mainContainer}>
            <View style={styles.emailConatinaer}>
            <Text style={styles.explanationText}>Set Preffered Email</Text>
            <Text style={styles.explinationDetail}>
              Make Sure this is a valid email! You don't want to miss the weekly report cards!
            </Text>
            <TextInput
              style={styles.Input}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder = {this.state.emailPlaceHolder}
              keyboardType="email-address"  
              value={this.state.email}
              onChangeText={v => this.handleChange('email', v)}          
            />          
          </View> 
          { this.state.from_facebook === false &&
            <View>
              <View style={styles.passwordContainer}>
                <Text style={styles.explanationText}>Update Password</Text>
                <TextInput
                  style={styles.Input}
                  value={this.state.oldPassword}
                  placeholder = {this.state.from_facebook ? "Locked For Facebook" : "Old Password"}
                  secureTextEntry
                  editable={this.state.from_facebook ? false : true}
                  onChangeText={v => this.handleChange('oldPassword', v)}
                />          
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.Input}
                  value={this.state.newPassword}
                  placeholder = {this.state.from_facebook ? "Locked For Facebook" : "New Password"}
                  editable={this.state.from_facebook ? false : true}
                  secureTextEntry
                  onChangeText={v => this.handleChange('newPassword', v)}
                />          
              </View>        
            </View>          
          }

          <View style={styles.buttonContainer}>
            <TouchableHighlight style={styles.saveButton} underlayColor='rgba(44,92,233,0.6)' onPress={this.handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableHighlight>          
          </View> 
        </View>         
        }

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
    paddingLeft: 20,
    paddingRight: 10
  },  
  emailConatinaer: {
    paddingVertical:20
  },
  explanationText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 18,
    paddingLeft: 20
  },  
  Input: {
    fontSize: 16,
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
    paddingTop: 5
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
    fontSize: 18,
    padding: 5    
  },
  loadingConainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default EmailAndPassSettings;