import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

import { HttpUtils } from '../services/HttpUtils'

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'

export default class Workouts extends Component {
  constructor(props) {
    super(props);
    this.getMembers = this.getMembers.bind(this)
    this.state = { loading: true };
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    this.getMembers()
    AppEventsLogger.logEvent('Viewed League')
  }

  getMembers() {
    HttpUtils.get('standings', this.props.token)
      .then((responseData) => {
        this.setState({
          columns: responseData.meta.columns,
          users: responseData.data,
          loading: false
        })
      }).done();
  }

  render() {
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} title="Your League" />
        <View style={styles.container}>
          { this.state.loading ?
            <ActivityIndicator size="large" style={styles.loading} color="#818D9C" />
          :
            <View style={styles.listContainer}>
              <View style={styles.headerRow}>
                <View style={styles.rankHeaderColumn}>
                  <Text style={styles.rankHeaderLabel}>Rank</Text>
                </View>
                { this.state.columns.map((column) => {
                    return <View key={['header', column.key].join('-')} style={styles.headerColumn}>
                      <Text style={styles.headerLabel}>{ column.label }</Text>
                    </View>
                  })
                }
              </View>
              {
                this.state.users.map((user, index) => {
                  return <View key={index} style={index % 2 == 0 ? styles.evenRow : styles.oddRow}>
                    <View style={styles.rankColumn}>
                      <Text style={styles.dataLabel}>{ index + 1 }</Text>
                    </View>
                    <View style={styles.nameColumn}>
                      <Image style={styles.userImage} source={{ uri: user.attributes.image_url }} />
                      <Text style={styles.dataLabel}>{ user.attributes.name.split(' ').map((s) => s[0]).join('') }</Text>
                    </View>
                    { this.state.columns.map((column) => {
                      return <View key={['user', index, column.key].join('-')} style={styles.dataColumn}>
                        <Text style={styles.dataLabel}>{ user.attributes[column.key] }</Text>
                      </View>
                      })
                    }
                  </View>
                })
              }
            </View>
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
  },
  loading: {
    paddingTop: 20
  },
  listContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
  },
  headerRow: {
    height: 65,
    flexDirection: 'row',
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
  },
  headerColumn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#D5D7DC',
    borderRightWidth: 1,
  },
  headerLabel: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#0E2442',
    fontSize: 12
  },
  rankHeaderColumn: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRightColor: '#D5D7DC',
    borderRightWidth: 1,
  },
  rankHeaderLabel: {
    marginLeft: 15,
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#0E2442',
    fontSize: 12
  },
  dataColumn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#D5D7DC',
    borderRightWidth: 1,
  },
  dataLabel: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#0E2442',
    fontSize: 12
  },
  rankColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nameColumn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRightColor: '#D5D7DC',
    borderRightWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  userImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10
  },
  evenRow: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  oddRow: {
    height: 65,
    flexDirection: 'row',
    backgroundColor: '#F7F7F8'
  },
});