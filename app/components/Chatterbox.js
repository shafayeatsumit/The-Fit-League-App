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
  ActivityIndicator
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'
import { DynamicSourceGenerator } from '../services/DynamicSourceGenerator'

const thumbsUp = require('../../assets/images/thumbsUp.png');
const thumbsDown = require('../../assets/images/thumbsDown.png');

const actions = {
  positive: [
    { label: 'Butt Slap', icon: require('../../assets/images/bigButtSlap.png') },
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
    this.state = { 
      modalVisible: false,
      modalData: {},
      loading: true
    }
  }

  sendChatter(action) {
    this.hideModal()
    this.props.fireChatter(action.icon)
  }

  hideModal() {
    this.setState({ modalVisible: false, modalData: {} })
  }

  showModal(id, user_name, sentiment) {
    this.setState({ modalVisible: true, modalData: { id, user_name, sentiment } })
  }

  componentDidMount() {
    HttpUtils.get('chatters', this.props.token)
      .then((responseData) => {
        this.setState({ chatters: responseData.data, loading: false })
      }).done();
  }

  render() {
    let { modalData } = this.state
    return ( 
      <View style={styles.container}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.hideModal} >
          { this.state.modalVisible &&
            <View style={styles.modal}>
              <Text style={styles.modalHeader}>How do you want to {modalData.sentiment == 'positive' ? 'root for' : 'boo'} {modalData.user_name.split(' ')[0]}?</Text>
              <View style={styles.actionRow}>
                { actions[modalData.sentiment].map((action, i) => {
                    return <View key={i} style={styles.action}>
                      <TouchableHighlight onPress={() => this.sendChatter(action)} underlayColor='rgba(255, 255, 255, 0.75)'>
                        <Image style={styles.actionIcon} source={action.icon} />
                      </TouchableHighlight>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                    </View>
                  })
                }
              </View>
              <TouchableHighlight style={styles.modalNevermind} onPress={this.hideModal} underlayColor='#508CD8'>
                <Text style={styles.modalNevermindText}>Nevermind</Text>
              </TouchableHighlight>
            </View>
          }
        </Modal>
        <View style={styles.titleHolder}>
          <Text style={styles.title}>Chatterbox</Text>
        </View>
        { this.state.loading ?
          <View style={styles.loadingColumn}>
            <ActivityIndicator size="large" color="#B6B7C2" />
          </View>
          :
          <ScrollView style={styles.chatterColumn}>
            { this.state.chatters.map((c, i) => {
                return <TouchableOpacity style={styles.chatter} key={i}>
                  <View style={styles.chatterRow}>
                    <View style={styles.chatterAction}>
                      <TouchableHighlight onPress={() => this.showModal(c.id, c.attributes.user_name, 'negative')} underlayColor='rgba(255, 255, 255, 0.75)'>
                        <Image source={thumbsDown} />
                      </TouchableHighlight>
                    </View>
                    <View style={styles.chatterDetails}>
                      <Image style={styles.userImage} source={{ uri: c.attributes.user_image_url }} />
                      <Image style={styles.workoutIcon} source={DynamicSourceGenerator.call({ label: c.attributes.kind, shade: 'dark', fallback: 'running'})} />
                    </View>
                    <View style={styles.chatterAction}>
                      <TouchableHighlight onPress={() => this.showModal(c.id, c.attributes.user_name, 'positive')} underlayColor='rgba(255, 255, 255, 0.75)'>
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
  workoutIcon: {
    marginTop: -20,
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: '#7A8DA0',
    backgroundColor: 'white',
    borderRadius: 15
  },
  chatterName: {
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '900'
  },
  chatterLabel: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: '#8691A0',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '400'
  },
  chatterQuantity: {
    fontSize: 11,
    fontFamily: 'Avenir-Black',
    color: '#8691A0',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '400'
  },
  modal: {
    margin: 20,
    marginTop: 92,
    height: 225,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)'
  },
  modalHeader: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'black',
    fontSize: 18,
    padding: 20,
    paddingBottom: 0
  },
  modalNevermind: {
    backgroundColor: '#E9005A',
    padding: 10
  },
  modalNevermindText: {
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: '#8691A0',
    textAlign: 'center',
    fontSize: 12
  }
})
