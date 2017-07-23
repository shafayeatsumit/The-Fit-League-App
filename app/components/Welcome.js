import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import AltAuthLink from '../components/AltAuthLink'

import { HttpUtils } from '../services/HttpUtils'
import { Session } from '../services/Session'

const Form = t.form.Form;

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
    this.submit = this.submit.bind(this);
  }

  submit() {
    let value = this.refs.form.getValue();
    if (value) {
      HttpUtils.post(this.props.endpoint, {
        name: value.name,
        email: value.email,
        password: value.password
      }).then((responseData) => {
        let { token } = responseData.data.attributes
        Session.save(token);
        Actions.home({ token });
      }).catch((error) => {
        AlertIOS.alert("Sorry! " + this.props.label + " failed.", error.message)
      }).done();
    }
  }

  render() {
    let existingUser = this.props.endpoint === 'sessions'
    let fields = existingUser ?  {} : { name: t.String };
    fields.email = t.String;
    fields.password = t.String;
    let user = t.struct(fields);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome{ existingUser ? ' Back ' : ' ' }to FanFit!
        </Text>
        <Form
          ref="form"
          type={user}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.submit} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>{this.props.label}</Text>
        </TouchableHighlight>
        { existingUser ?
          <AltAuthLink
            question='New here?'
            endpoint='registrations'
            label='Join'
          />
        :
          <AltAuthLink
            question='Already have an account?'
            endpoint='sessions'
            label='Sign In'
          />
        }
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