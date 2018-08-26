import React, { Component } from 'react';
import { 
  Text,
  StyleSheet, 
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  View 
} from 'react-native';

import ChatterProvider from './ChatterProvider';
import RecipientsList from './chatter_modal/RecipientsList';
import AddComment from './chatter_modal/AddComment';
import PickEmoji from './chatter_modal/PickEmoji';
import HamburgerBasement from './HamburgerBasement';
import SpeckledHeader from './SpeckledHeader';
import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

export default class Chatterbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTab: 'youTab',                    //options(youTab, leagueTab)
      activeModal: 'recipientsModal',        //options(emojiPicker, addComment, recipientsModal)
      loading: false,
      chatters: [],
      modalVisible: false,
      recipientsList: [],
      emojiData: [],
    }
    this.switchTab = this.switchTab.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.switchModal = this.switchModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
  }

  getChattersByUrl(url) {
    // TODO: replace this with this.props.token
    this.setState({loading: true})
    HttpUtils.get(url, this.props.token)
      .then((response)=> {
        this.setState({ chatters: response.data, loading:false })
      })
      .catch((error)=> {
        // TODO : sentry catch error
        this.setState({loading: false})        
      }).done()
  }

  getChatters() {
    SessionStore.getLeagueId((leagueId) => {
      const chatterboxUrl = 'leagues/' + leagueId.toString() + '/chatterbox/personal';
      this.getChattersByUrl(chatterboxUrl)
      this.setState({leagueId})
    }, () => {
      // TODO: what is the use of this call back thing
    })
  }

  switchModal(args) {
    const { modalName, emoji, recipients } = args
  
    if(modalName === 'emojiPicker'){
      this.setState({activeModal: modalName, recipientsList: recipients})
    } else if (modalName === 'addComment') {
      this.setState({activeModal: modalName, emojiData:emoji})
    } else {
      this.setState({activeModal: modalName})
    }    
  }


  switchTab(tabName) {
    const { leagueId } = this.state;
    const personalChatterUrl = 'leagues/' + leagueId.toString() + '/chatterbox/personal';
    const chatterboxUrl = 'leagues/' + leagueId.toString() + '/chatterbox';

    this.setState({ activeTab: tabName})
    tabName === 'youTab' ? this.getChattersByUrl(personalChatterUrl) : this.getChattersByUrl(chatterboxUrl)
  }

  hideModal() {
    this.setState({ modalVisible: false, activeModal: 'recipientsModal' })
  }

  componentDidMount() {
    this.getChatters()
  }

  renderModal() {
    const { activeModal } = this.state;
    if (activeModal === 'recipientsModal') {
      return (
        <RecipientsList 
          {...this.props} 
          exitModal={this.hideModal} 
          switchModal={this.switchModal}
        />
      )
    }else if(activeModal === 'emojiPicker') {
      return(
        <PickEmoji
          {...this.props}
          exitModal={this.hideModal} 
          switchModal={this.switchModal}
        />
      )
    }else {
      return (
        <AddComment
          {...this.props}
          recipients={this.state.recipientsList}
          emoji={this.state.emojiData}
          leagueId={this.state.leagueId}
          exitModal={this.hideModal}
          switchModal={this.switchModal} 
        />
      ) 
    }
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
            {this.renderModal()}
          </View>
        </Modal>
        <SpeckledHeader  {...this.props} title="Chatterbox" />
        <View style={styles.bodyContainer}>
          {/* tab container */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabTouchable} onPress={() => this.switchTab('youTab')}>
              <View style={[this.state.activeTab === 'youTab' ? styles.activeTabContent : styles.tabContent]}>
                <Text style={[this.state.activeTab === 'youTab'? styles.activeTablabel : styles.tabLabel]}>YOU</Text>
                {this.props.chatterInboxCount && 
                  <View style={styles.chatterInbox} >                  
                    <Text style={styles.chatterInboxText}>{this.props.chatterInboxCount}</Text>
                  </View>
                }
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
            <ScrollView style={{flex:1}}>
              <ChatterProvider chatters={this.state.chatters} />
            </ScrollView>
          }
            
            
          </View>          
          {/* scrollable container end */}

          {/* send message button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={()=> this.setState({modalVisible:true})}>
              <Text style={styles.buttonText}>
                Send Chatter
              </Text>
            </TouchableOpacity>          
          </View>


          {/* send message button Ends*/}
        </View>
      </HamburgerBasement>
    );
  }
}


const styles = StyleSheet.create({
  bodyContainer: {
    flex:8,
    backgroundColor: 'white',
    backgroundColor: '#F7F7F8'
  },
  buttonContainer: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 10,
    width:'80%',
    height: 60,
    marginHorizontal:'10%',
    
  },
  button: {
    width:'100%',
    height: 60,
    backgroundColor:'#2857ED',
    justifyContent:'center', 
    alignItems:'center',
    borderRadius:5,
  },
  buttonText: {
    fontFamily: 'Avenir-Light', 
    fontWeight:'700', 
    color:'white', 
    fontSize:18    
  },
    tabContainer: {
    flex:1.5,
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