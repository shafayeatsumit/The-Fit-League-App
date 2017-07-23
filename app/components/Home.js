import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  AsyncStorage
} from 'react-native';

export default class Home extends Component {

  componentDidMount() {
    setTimeout(() => {
      console.log('right here')
      try {
        AsyncStorage.removeItem('auth_token');
        console.log('removed token')
      } catch (error) {
        console.log('failed to remove token')
        console.log(error)
      }
    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{ this.props.token }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
});