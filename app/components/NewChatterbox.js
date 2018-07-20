import React, { Component } from 'react';
import { 
  Text,
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  View 
} from 'react-native';

import ChatterProvider from './ChatterProvider';
import RecipientsList from './chatter_modal/RecipientsList';
import HamburgerBasement from './HamburgerBasement';
import SpeckledHeader from './SpeckledHeader';
import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

const likeButton = require('../../assets/images/bigThumbsUp.png');
const badgbe = require('../../assets/images/badge.png');

class NewChatterbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTab: 'youTab',
      activeModal: null,
      loading: false,
      chatters: [],
      modalVisible: true
    }
    this.switchTab = this.switchTab.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  getChattersByUrl(url) {
    // TODO: replace this with this.props.token
    this.setState({loading: true})
    HttpUtils.get(url, '0740118cb24781dc5dcf0e58679679e5')
      .then((response)=> this.setState({ chatters: response.data, loading:false }))
      .catch((error)=> {
        // TODO : sentry catch error
        this.setState({loading: false})        
      }).done()
  }

  getChatters() {
    SessionStore.getLeagueId((leagueId) => {
      const chatterboxUrl = 'leagues/' + leagueId.toString() + '/chatterbox';
      this.getChattersByUrl(chatterboxUrl)
      this.setState({leagueId})
    }, () => {
      // TODO: what is the use of this call back thing
    })
  }

  switchModal(modalName) {

  }

  switchTab(tabName) {
    const { leagueId } = this.state;
    const personalChatterUrl = 'leagues/' + leagueId.toString() + '/chatterbox/personal';
    const chatterboxUrl = 'leagues/' + leagueId.toString() + '/chatterbox';

    this.setState({ activeTab: tabName})
    tabName === 'youTab' ? this.getChattersByUrl(personalChatterUrl) : this.getChattersByUrl(chatterboxUrl)
  }

  hideModal() {
    this.setState({ modalVisible: false })
  }

  componentDidMount() {
    this.getChatters()
  }


  render() {
    return (
      <HamburgerBasement {...this.props}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalBackground}>
            <RecipientsList 
              {...this.props} 
              exitModal={this.hideModal} 
            />
          </View>
        </Modal>
        <SpeckledHeader style={styles.headerContainer} {...this.props} title="Chatterbox" />
        <View style={styles.bodyContainer}>
          {/* tab container */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabTouchable} onPress={() => this.switchTab('youTab')}>
              <View style={[this.state.activeTab === 'youTab' ? styles.activeTabContent : styles.tabContent]}>
                <Text style={[this.state.activeTab === 'youTab'? styles.activeTablabel : styles.tabLabel]}>YOU</Text>
                <View style={styles.chatterInbox} >
                  <Text style={styles.chatterInboxText}>4</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabTouchable} onPress={() => this.switchTab('leagueTab')}>
              <View style={[this.state.activeTab === 'leagueTab' ? styles.activeTabContent : styles.tabContent]}>
                <Text style={[this.state.activeTab === 'leagueTab'? styles.activeTablabel : styles.tabLabel]}>LEAGUE</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* tab container ends */}

          {/* scrollable continer */}
          <View style={styles.scrollContainer} >
          {
            this.state.loading ?          
              <View style={styles.loadingConainer}>
                <ActivityIndicator size="large"  color="#B6B7C2" />
              </View>
            :
            <ScrollView >
              <ChatterProvider chatters={this.state.chatters} />
            </ScrollView>
          }
            
            
          </View>          
          {/* scrollable container end */}

          {/* send message button */}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                Send a message
              </Text>
            </View>
          </View>
          {/* send message button Ends*/}
        </View>
      </HamburgerBasement>
    );
  }
}

export default NewChatterbox;

const styles = StyleSheet.create({
  headerContainer: {
    flex:2,
    backgroundColor: '#2C5CE9'
  },
  bodyContainer: {
    flex:7,
    backgroundColor: 'white',
    backgroundColor: '#F7F7F8'
  },
  buttonContainer: {
    flex:3, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:'#F7F7F8'
  },
  button: {
    backgroundColor:'#2857ED', 
    width:'80%', 
    height:'60%', 
    borderRadius:5, 
    justifyContent:'center', 
    alignItems:'center'
  },
  buttonText: {
    fontFamily: 'Avenir-Light', 
    fontWeight:'700', 
    color:'white', 
    fontSize:18    
  },
  tabContainer: {
    flex:2,
    flexDirection: 'row',
    backgroundColor: 'white'    
  },
  tabTouchable: {
    flex:1
  },
  activeTabContent: {
    flex:1,
    justifyContent:'center', 
    alignItems:'center', 
    flexDirection:'row', 
    borderBottomColor:'#2857ED', 
    borderBottomWidth:5
  },
  activeTablabel: {
    fontSize:15, 
    padding:10, 
    fontFamily:'Avenir-Black', 
    color:'#0E2442' 
  },
  tabContent: {
    flex:1,
    justifyContent:'center', 
    alignItems:'center', 
    flexDirection:'row'
  },
  tabLabel: {
    fontSize:15, 
    padding:10, 
    fontFamily:'Avenir-Black', 
    color:'gray' 
  },
  chatterInbox: {
    height:30, 
    width:30, 
    borderRadius:15, 
    backgroundColor:'#1DD65B', 
    paddingHorizontal:10, 
    justifyContent:'center',
    alignItems:'center'
  },
  chatterInboxText: {
    fontSize:15, 
    fontWeight:'bold', 
    color:'white'
  },
  scrollContainer: {
    flex:12, 
    backgroundColor:'#F7F7F8',
    paddingTop:10    
  } ,
  loadingConainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBackground: {
    backgroundColor:'rgba(0,0,0,0.8)', 
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }          
})