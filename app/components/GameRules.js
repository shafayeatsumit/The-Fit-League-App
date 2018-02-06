import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
  ActivityIndicator
} from 'react-native'

import { AppEventsLogger } from 'react-native-fbsdk'

import { HttpUtils } from '../services/HttpUtils'

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'

export default class GameRules extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    HttpUtils.get('rules', this.props.token)
      .then((responseData) => {
        this.setState({ rules: responseData.data, loading: false })
      }).catch((err) => {
        this.setState({ loading: false, rules: [] })
      }).done()
    AppEventsLogger.logEvent('Viewed Game Rules')
  }

  render() {
    return (
      <HamburgerBasement ignoreLeagueRequirement={true} {...this.props}>
        <OtherHeader style={styles.headerContainer} title="Game Rules" {...this.props} />
        <View style={styles.container}>
          { this.state.loading ? 
            <View>
              <ActivityIndicator size="large" color="#818D9C" />
            </View>
            :
            <ScrollView>
              <TouchableOpacity activeOpacity={1}>
                { this.state.rules.map((rule, i) => <Text key={i} style={styles[rule.kind]}>{ rule.text }</Text>) }
              </TouchableOpacity>
            </ScrollView>
          }
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
  container: {
    flex: 8,
    borderTopColor: '#D5D7DC',
    borderTopWidth: 1,
    padding: 10
  },
  header: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#1DD65B',
    fontSize: 26,
    margin: 10
  },
  paragraph: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '400',
    color: '#0E2442',
    fontSize: 16,
    margin: 10
  }
});