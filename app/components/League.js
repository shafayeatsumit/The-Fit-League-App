import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  StatusBar
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'
import { LeagueSharer } from '../services/LeagueSharer'

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'

export default class Workouts extends Component {
  constructor(props) {
    super(props);
    this.getMembers = this.getMembers.bind(this)
    this.toggleDetails = this.toggleDetails.bind(this)
    this.copyInviteUrl = this.copyInviteUrl.bind(this)
    this.viewPlayer = this.viewPlayer.bind(this)
    this.state = { loading: true, viewingDetails: false, columns: {}, inviteUrl: null };
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    this.getMembers()
    AppEventsLogger.logEvent('Viewed League')
  }

  viewPlayer(user) {
    Actions.playerCard({ player: user.attributes, image_url: this.props.image_url, token: this.props.token })
  }

  toggleDetails() {
    this.setState({ viewingDetails: !this.state.viewingDetails }, () => {
      if (this.state.viewingDetails) AppEventsLogger.logEvent('Viewed League Details')
    })
  }

  copyInviteUrl() {
    LeagueSharer.call(this.state.inviteUrl, this.state.leagueName, 'League Details')
  }

  getMembers() {
    HttpUtils.get('standings', this.props.token)
      .then((responseData) => {
        this.setState({
          columns: responseData.meta.columns,
          inviteUrl: responseData.meta.invite_url,
          leagueName: responseData.meta.league_name,
          users: responseData.data,
          loading: false
        })
      }).catch((err) => {
        this.setState({ loading: false, columns: [], users: [] })
      }).done()
  }

  render() {
    const columns = this.state.viewingDetails ? this.state.columns.details : this.state.columns.basic
    return (
      <HamburgerBasement {...this.props}>
        <OtherHeader style={styles.headerContainer} {...this.props} />
        <View style={styles.container}>
          { this.state.loading ?
            <ActivityIndicator size="large" style={styles.loading} color="#818D9C" />
          :
            <View style={styles.listContainer}>
              <View style={styles.headerRow}>
                <View style={styles.rankHeaderColumn}>
                  <Text style={styles.rankHeaderLabel}>Standings</Text>
                </View>
                { columns.map((column) => {
                    return <View key={['header', column.key].join('-')} style={styles.headerColumn}>
                      <Text style={styles.headerLabel}>{ column.label }</Text>
                    </View>
                  })
                }
              </View>
              <View style={styles.viewDetailsRow}>
                <TouchableHighlight style={styles.viewDetailsButton} onPress={this.toggleDetails} underlayColor='transparent'>
                  <Text style={styles.viewDetailsText}>{ this.state.viewingDetails ? 'Hide Details' : 'View Details' }</Text>
                </TouchableHighlight>
              </View>
              <ScrollView>
                {
                  this.state.users.map((user, index) => {
                    return <TouchableOpacity activeOpacity={1} style={index % 2 == 0 ? styles.evenRow : styles.oddRow} key={index}>
                      <View style={styles.rankColumn}>
                        <Text style={styles.dataLabel}>{ index + 1 }</Text>
                      </View>
                      <View style={styles.nameColumn}>
                        <TouchableHighlight onPress={() => this.viewPlayer(user)} underlayColor='transparent'>
                          <Image style={styles.userImage} source={{ uri: user.attributes.image_url }} />
                        </TouchableHighlight>
                        <Text style={styles.dataLabel}>{ user.attributes.name.split(' ').map((s) => s[0]).join('') }</Text>
                      </View>
                      { columns.map((column) => {
                        return <View key={['user', index, column.key].join('-')} style={styles.dataColumn}>
                          <Text style={styles.dataLabel}>{ user.attributes[column.key] }</Text>
                        </View>
                        })
                      }
                    </TouchableOpacity>
                  })
                }
                { this.state.inviteUrl &&
                  <TouchableHighlight onPress={this.copyInviteUrl} underlayColor='transparent'>
                    <View style={styles.inviteUrlButton}>
                      <Text style={styles.inviteUrlText}>Invite your crew with this link!</Text>
                      <Text style={styles.inviteUrlLink}>{this.state.inviteUrl}</Text>
                    </View>
                  </TouchableHighlight>
                }
              </ScrollView>
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
  viewDetailsRow: {
    alignItems: 'flex-end',
    borderBottomColor: '#D5D7DC',
    borderBottomWidth: 1,
  },
  viewDetailsButton: {
    padding: 5
  }, 
  viewDetailsText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '400',
    color: '#508CD8',
    fontSize: 12
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
  inviteUrlButton: {
    borderTopColor: '#D5D7DC',
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  inviteUrlText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '400',
    color: '#0E2442',
    fontSize: 12
  },
  inviteUrlLink: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#508CD8',
    fontSize: 14
  }
});