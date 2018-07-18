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

const likeButton = require('../../assets/images/bigThumbsUp.png');
const badgbe = require('../../assets/images/badge.png');



class NewChatterbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTab: 'youTab'
    }
  }

  render() {
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
    height:'10%', 
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
  }    
})