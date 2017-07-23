import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AsyncStorage,
  AlertIOS
} from 'react-native';

import { Actions } from 'react-native-router-flux';

const TOKEN_STORAGE_KEY = 'auth_token';
const BASE_URL = 'http://localhost:5100/v1';

const Form = t.form.Form;

const User = t.struct({
  email: t.String,
  password: t.String
});

const options = {
  fields: {
    password: {
      password: true,
      secureTextEntry: true
    }
  }
}; 

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
  }

  _handleErrors(response) {
    return response.json().then(responseData => {
      if (responseData.errors) {
        throw Error(responseData.errors.join('. ') + '.');
      }
      return responseData
    })
  }

  register() {
    let value = this.refs.form.getValue();
    if (value) {
      fetch(BASE_URL + '/registrations', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: value.email,
          password: value.password
        })
      }).then(this._handleErrors)
        .then((responseData) => {
          let { token } = responseData.data.attributes
          this._onValueChange(TOKEN_STORAGE_KEY, token),
          AlertIOS.alert(
            "Signup Success!",
            ("Just saved your token: " + token)
          )
          Actions.home({ token });
        }).catch((error) => {
          AlertIOS.alert(
            "Failure!",
            error.message
          )
        }).done();
    }
  }

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to FanFit!
        </Text>
        <Form
          ref="form"
          type={User}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.register} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  activityIndicator: {

  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});