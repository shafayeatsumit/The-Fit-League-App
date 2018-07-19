import React, { Component } from 'react';
import { 
  Text,
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  View 
} from 'react-native';

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
      data: []
    }
  }

  getChattersByUrl(url) {
    // '0740118cb24781dc5dcf0e58679679e5'
    HttpUtils.get(url, '0740118cb24781dc5dcf0e58679679e5')
      .then((response)=> this.setState({ data: response.data }))
      .catch((error)=> {
        console.log("error",error)
        // TODO : sentry catch error
      }).done()
  }

  getChatters() {
    SessionStore.getLeagueId((leagueId) => {
      this.getChattersByUrl('leagues/' + leagueId.toString() + '/chatterbox')
    }, () => {
      // TODO: what is the use of this call back thing
    })
  }

  componentDidMount() {
    this.getChatters()
  }

  render() {
    console.log("data",this.state.data)
    return (
      <HamburgerBasement {...this.props}>
        <SpeckledHeader style={styles.headerContainer} {...this.props} title="Chatterbox" />
        <View style={styles.bodyContainer}>
          {/* tab container */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabTouchable} onPress={()=> this.setState({activeTab: 'youTab'})}>
              <View style={[this.state.activeTab === 'youTab' ? styles.activeTabContent : styles.tabContent]}>
                <Text style={[this.state.activeTab === 'youTab'? styles.activeTablabel : styles.tabLabel]}>YOU</Text>
                <View style={styles.chatterInbox} >
                  <Text style={styles.chatterInboxText}>4</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabTouchable} onPress={()=> this.setState({activeTab: 'leagueTab'})}>
              <View style={[this.state.activeTab === 'leagueTab' ? styles.activeTabContent : styles.tabContent]}>
                <Text style={[this.state.activeTab === 'leagueTab'? styles.activeTablabel : styles.tabLabel]}>LEAGUE</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* tab container ends */}

          {/* scrollable continer */}
          <View style={styles.scrollContainer} >
            <ScrollView >
              {
                this.state.data && 
                this.state.data.map((value , indx )=> {
                  if(value.attributes.kind === 'Chatter') {
                    return (
                      <View style={styles.commentCard} key={indx} onStartShouldSetResponder={() => true}>
                        <View style={{flexDirection:'row', alignItems:'center', padding:20}}>
                          <Image source={{uri: value.attributes.user_icon}} style={styles.commentCardUserIcon}/>                  
                          <Text style={styles.commentCardUserName}>{value.attributes.user_name}</Text>
                          <Text style={styles.commentCardLabel}>{value.attributes.label}</Text>
                        </View>
                        <View style={styles.commentHolder}>
                          <View style={styles.commentTextWrapper}>
                            <Text  style={styles.commentText}>
                              {value.attributes.text}
                            </Text>
                          </View>
                          <View style={styles.commentIconHolder}>
                            <Image source={{ uri:value.attributes.icon }} style={styles.commentIcon}/>
                          </View>
                        </View>                      
                      </View>
                    )  
                  }
                })
              }
            </ScrollView>
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
  commentCard: {
    flex:1,
  },
  commentCardUserIcon: {
    borderRadius: 20,
    height: 40,
    width: 40    
  },
  commentCardLabel: {
    fontSize:14, 
    paddingLeft:5, 
    fontFamily:'Avenir-Light',
    fontWeight: '500',
    color: '#8792A0'    
  },
  commentHolder: {
    flex:1, 
    flexDirection:'row', 
    paddingHorizontal: 20     
  },
  commentTextWrapper: {
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingRight:40,
    borderRadius:5,
    paddingVertical:20
  },
  commentCardUserName: {
    fontSize:16, 
    paddingLeft:10, 
    fontFamily:'Avenir-Black',
    color: '#8792A0'    
  },
  commentText: {
    fontSize:14,
    color:'#778DA0',                      
    fontFamily: 'Avenir-Black',
  },
  commentIconHolder: {
    justifyContent:'center',
    alignItems: 'center',
    right:20
  },
  commentIcon: {
    height: 40,
    width: 40,
  }      
})