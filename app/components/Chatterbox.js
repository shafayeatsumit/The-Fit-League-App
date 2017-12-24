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
    let { id, user_image_url } = this.state.modalData
    let { label } = action
    HttpUtils.post('chatters', { label, workout_id: id }, this.props.token).done();
    this.props.fireChatter(action.icon, { uri: user_image_url })
    this.hideModal()
  }

  hideModal() {
    this.setState({ modalVisible: false, modalData: {} })
  }

  showModal(user, sentiment) {
    let { id, attributes } = user
    let { user_name, user_image_url } = attributes
    this.setState({ modalVisible: true, modalData: { id, user_image_url, user_name, sentiment } })
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
          presentationStyle='fullScreen'
          visible={this.state.modalVisible}
          onRequestClose={this.hideModal} >
          { this.state.modalVisible &&
            <View style={styles.modal}>
              <View style={styles.modalHeaderHolder}>
                <Text style={styles.modalHeader}>How do you want to {modalData.sentiment == 'positive' ? 'root for' : 'boo'} {modalData.user_name.split(' ')[0]}?</Text>
              </View>
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
              <View style={styles.modalNevermindHolder}>
                <TouchableHighlight style={styles[modalData.sentiment + 'ModalNevermind']} onPress={this.hideModal} underlayColor={modalData.sentiment == 'positive' ? '#508CD8' : '#D61D5A' }>
                  <Text style={styles.modalNevermindText}>Nevermind</Text>
                </TouchableHighlight>
              </View>
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
                return <TouchableOpacity activeOpacity={1} style={styles.chatter} key={i}>
                  <View style={styles.chatterRow}>
                    <View style={styles.chatterAction}>
                      <TouchableHighlight style={styles.chatterActionButton} onPress={() => this.showModal(c, 'negative')} underlayColor='rgba(255, 255, 255, 0.75)'>
                        <Image source={thumbsDown} />
                      </TouchableHighlight>
                    </View>
                    <View style={styles.chatterDetails}>
                      <Image style={styles.userImage} source={{ uri: c.attributes.user_image_url }} />
                      <Image style={styles.workoutIcon} source={DynamicSourceGenerator.call({ label: c.attributes.kind, shade: 'dark', fallback: 'running'})} />
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
    fontWeight: '900',
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
    fontWeight: '900',
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
    fontFamily: 'Avenir-Black',
    fontWeight: '400',
    color: '#8691A0',
    textAlign: 'center',
    fontSize: 12
  }
})