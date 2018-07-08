import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Text,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk'

import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

import { LeagueSharer } from '../services/LeagueSharer'

import DynamicIcon from './DynamicIcon'
import PickEmoji from './PickEmoji'
import AddComment from './AddComment';

const thumbsUp = require('../../assets/images/thumbsUp.png')
const thumbsDown = require('../../assets/images/thumbsDown.png')
const trophies = require('../../assets/images/trophies.png')

// Dependency in app/models/chatter.rb in the Rails API.
const actions = {
  positive: [
    { label: 'Fist Bump', icon: require('../../assets/images/fistBump.png') },
    { label: 'High Five', icon: require('../../assets/images/highFive.png') },
    { label: 'Thumbs Up', icon: require('../../assets/images/bigThumbsUp.png') },
  ],
  negative: [
    { label: 'Gut Punch',   icon: require('../../assets/images/gutPunch.png') },
    { label: 'Talk Sh*t',   icon: require('../../assets/images/talkSht.png') },
    { label: 'Thumbs Down', icon: require('../../assets/images/bigThumbsDown.png') },
  ]
}

export default class Chatterbox extends Component {
  constructor(props) {
    super(props)
    this.showModal = this.showModal.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.sendChatter = this.sendChatter.bind(this)
    this.getChatters = this.getChatters.bind(this)
    this.copyInviteUrl = this.copyInviteUrl.bind(this)
    this.getChattersByUrl = this.getChattersByUrl.bind(this)
    this.changeModal = this.changeModal.bind(this)
    this.state = { 
      modalVisible: true,
      modalData: {},
      loading: true,
      refreshing: false,
      modalInfo: {
        modalName: 'pickEmoji',
        data: {}
      }
    }
  }

  sendChatter(action) {
    let { id, user_image_url } = this.state.modalData
    let { label } = action
    HttpUtils.post('chatters', { label, workout_id: id }, this.props.token).done();
    this.props.fireChatter(action.icon, { uri: user_image_url })
    this.hideModal()
    AppEventsLogger.logEvent('Sent Chatter', { label })
  }

  hideModal() {
    this.setState({ modalVisible: false, modalData: {} })
  }

  refresh() {
    this.setState({ refreshing: true })
    this.getChatters()
  }

  showModal(user, sentiment) {
    let { id, attributes } = user
    let { user_name, user_image_url } = attributes
    this.setState({ modalVisible: true, modalData: { id, user_image_url, user_name, sentiment } })
  }

  changeModal(modalInfo) {
    if (modalInfo && modalInfo.modalName === 'pickEmoji'){
    
      this.setState({modalInfo, modalVisible: false})
    }
    this.setState({modalInfo})
    // this.setState({modalName})
  }

  viewPlayer(chatter) {
    Actions.playerCard({ player: {
      name: chatter.attributes.user_name,
      image_url: chatter.attributes.user_image_url,
      bio: chatter.attributes.user_bio
    }, image_url: this.props.image_url, token: this.props.token })
  }

  getChattersByUrl(url) {
    HttpUtils.get(url, this.props.token)
      .then((responseData) => {
        this.setState({ 
          chatters: responseData.data, 
          inviteUrl: responseData.meta.invite_url,
          playoffs: responseData.meta.playoffs, 
          leagueName: responseData.meta.league_name,
          loading: false, refreshing: false 
        })
      }).catch((err) => {
        this.setState({ loading: false, refreshing: false, chatters: [] })
      }).done()
  }

  getChatters() {
    SessionStore.getLeagueId((leagueId) => {
      this.setState({leagueId})
      this.getChattersByUrl('leagues/' + leagueId.toString() + '/chatters')
    }, () => {
      this.getChattersByUrl('chatters')
    })
  }

  getEmojis() {
    HttpUtils.get('chatter_kinds', this.props.token)
      .then((response) => this.setState({chatterKinds: response.data}))
  }

  componentDidMount() {
    this.getChatters()
  }

  copyInviteUrl() {
    LeagueSharer.call(this.state.inviteUrl, this.state.leagueName, 'Chatterbox')
  }

  render() {
    let { modalData } = this.state
    return ( 
      <View style={styles.container}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.hideModal}>
          { this.state.modalVisible &&
             <View style={styles.modalBackground}>
              {
                this.state.modalInfo.modalName === 'addComment' ?
                    <AddComment 
                    {...this.props} 
                    exitModal={this.hideModal} 
                    changeModal={this.changeModal}
                    modalInfo={this.state.modalInfo}
                    leagueId={this.state.leagueId}
                  />
                  :                
                  <PickEmoji 
                    {...this.props} 
                    exitModal={this.hideModal} 
                    changeModal={this.changeModal}
                  />
              }
                
             </View>             
          }
        </Modal>
        <View style={styles.titleHolder}>
          <Text style={styles.title}>Workout Feed</Text>
        </View>
        { this.state.loading ?
          <View style={styles.loadingColumn}>
            <ActivityIndicator size="large" color="#B6B7C2" />
          </View>
          :
          <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh.bind(this)} />
          } style={styles.chatterColumn}>
            { this.state.playoffs && 
              <Image source={trophies} style={styles.trophies} />
            }
            { this.state.chatters.map((c, i) => {
                return <TouchableOpacity activeOpacity={1} style={styles.chatter} key={i}>
                  <View style={styles.chatterRow}>
                    <View style={styles.chatterAction}>
                      <TouchableHighlight style={styles.chatterActionButton} onPress={() => this.showModal(c, 'negative')} underlayColor='rgba(255, 255, 255, 0.75)'>
                        <Image source={thumbsDown} />
                      </TouchableHighlight>
                    </View>
                    <View style={styles.chatterDetails}>
                      <TouchableHighlight onPress={() => this.viewPlayer(c)} underlayColor='transparent'>
                        <Image style={styles.userImage} source={{ uri: c.attributes.user_image_url }} />
                      </TouchableHighlight>
                      <View style={styles.workoutIconContainer}>
                        <DynamicIcon 
                          label={c.attributes.kind} 
                          shade={'dark'}
                          {...StyleSheet.flatten(styles.workoutIcon)} />
                      </View>
                    </View>
                    <View style={styles.chatterAction}>
                      <TouchableHighlight style={styles.chatterActionButton} onPress={() => this.showModal(c, 'positive')} underlayColor='rgba(255, 255, 255, 0.75)'>
                        <Image source={thumbsUp} />
                      </TouchableHighlight>
                    </View>
                  </View>
                  <View style={styles.chatterRow}>
                    <View style={styles.chatterDetails}>
                      <Text style={styles.chatterName}>{ c.attributes.user_name }</Text>
                      <Text style={styles.chatterLabel}>{ c.attributes.kind }</Text>
                      <Text style={styles.chatterQuantity}>{ c.attributes.quantity } { c.attributes.unit }s</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              })
            }
            { this.state.chatters.length == 0 && 
              <View style={styles.chatterRow}>
                <View style={styles.chatterDetails}>
                  <View style={styles.inviteUrlWrapper}>
                    <Text style={styles.chatterLabel}>There's no chatter</Text>
                    <Text style={styles.chatterLabel}>in your league yet.</Text>
                  </View>
                  { this.state.inviteUrl &&
                    <TouchableHighlight onPress={this.copyInviteUrl} underlayColor='transparent'>
                      <View style={styles.inviteUrlWrapper}>
                        <Text style={styles.chatterLabel}>Invite your crew!</Text>
                        <Text style={styles.inviteUrl}>{this.state.inviteUrl}</Text>
                      </View>
                    </TouchableHighlight>
                  }
                </View>
              </View>
            }
          </ScrollView>
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#B6B7C2'
  },
  modalBackground: {
    backgroundColor:'rgba(0,0,0,0.8)', 
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  modalContainer: {
    height: '80%',
    width: '90%',
    borderWidth: 0,    
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },    
  titleHolder: {
    borderLeftColor: '#1DD65B',
    borderLeftWidth: 3,
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  loadingColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatterColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  trophies: {
    resizeMode: 'repeat',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  chatter: {
    height: 140,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'  
  },
  chatterAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatterActionButton: {
    padding: 10
  },
  chatterRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatterDetails: {
    flexDirection: 'column',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  workoutIconContainer: {
    marginTop: -20,
    height: 30,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 15
  },
  workoutIcon: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: '#7A8DA0',
    borderRadius: 15
  },
  chatterName: {
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  chatterLabel: {
    fontSize: 14,
    fontFamily: 'Avenir-Light',
    color: '#8691A0',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  chatterQuantity: {
    fontSize: 11,
    fontFamily: 'Avenir-Light',
    color: '#8691A0',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
  },
  modalHeaderHolder: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalHeader: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    color: 'black',
    fontSize: 18,
    padding: 20,
  },
  modalNevermindHolder: {
    flex: 2,
    justifyContent: 'flex-start'
  },
  negativeModalNevermind: {
    backgroundColor: '#E9005A',
    padding: 10,
  },
  positiveModalNevermind: {
    backgroundColor: '#2857ED',
    padding: 10,
  },
  modalNevermindText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2
  },
  action: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    paddingTop: 20,
    paddingBottom: 20
  },
  actionIcon: {
    height: 75,
    width: 75,
  },
  actionLabel: {
    paddingTop: 20,
    fontFamily: 'Avenir-Light',
    color: '#8691A0',
    textAlign: 'center',
    fontSize: 12
  },
  inviteUrlWrapper: {
    paddingTop: 80
  },
  inviteUrl: {
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    color: '#508CD8',
    backgroundColor: 'transparent',
    textAlign: 'center',
  }
})
