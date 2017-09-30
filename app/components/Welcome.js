import React, { Component } from 'react';

import t from 'tcomb-form-native';

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import AltAuthLink from '../components/AltAuthLink'

import { HttpUtils } from '../services/HttpUtils'
import { Session } from '../services/Session'

const Form = t.form.Form;

Form.stylesheet.controlLabel.normal.fontFamily = 'Avenir-Black';
Form.stylesheet.controlLabel.error.fontFamily = 'Avenir-Black';

const options = {
  fields: {
    name: {
      auto: 'none',
      placeholder: 'Name',
      placeholderTextColor: 'white'
    },
    email: {
      auto: 'none',
      placeholder: 'Email',
      placeholderTextColor: 'white'
    },
    password: {
      auto: 'none',
      placeholder: 'Password',
      placeholderTextColor: 'white',
      password: true,
      secureTextEntry: true
    }
  }
}; 

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submit = this.submit.bind(this);
  }

  submit() {
    let value = this.refs.form.getValue();
    if (value) {
      this.setState({ loading: true });
      HttpUtils.post(this.props.endpoint, {
        name: value.name,
        email: value.email,
        password: value.password
      }).then((responseData) => {
        let { token } = responseData.data.attributes
        Session.save(token);
        Actions.home({ token });
        this.setState({ loading: false });
      }).catch((error) => {
        AlertIOS.alert("Sorry! " + this.props.label + " failed.", error.message)
        this.setState({ loading: false });
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
        <LinearGradient 
          start={{x: 0, y: 1}} end={{x: 1, y: 0}}
          colors={['#2857ED', '#1DD65B']}
          style={styles.contentContainer}>
          <View style={styles.wrapper}>
            <Text style={styles.welcome}>
              Welcome{ existingUser ? ' Back ' : ' ' }to FanFit!
            </Text>
            { this.state.loading ?
              <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.8)" />
            :
              <View>
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
                    label='JOIN'
                  />
                :
                  <AltAuthLink
                    question='Already have an account?'
                    endpoint='sessions'
                    label='SIGN IN'
                  />
                }
              </View>
            }
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F8F9'
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40
  },
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  wrapper: {
    padding: 20
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    fontFamily: 'Avenir-Black',
    letterSpacing: 2
  },
  button: {
    height: 36,
    backgroundColor: '#2857ED',
    borderColor: '#2857ED',
    borderWidth: 1,
    borderRadius: 0,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});