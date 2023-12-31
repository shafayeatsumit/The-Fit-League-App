import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Modal,
  Text,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native'; 

import { HttpUtils } from '../../services/HttpUtils'

const exButton = require('../../../assets/images/exButton.png');


const EmojiProvider = ({emoji, emojiPressed}) => {
  return (
    <View style={styles.emojiHolder}>
      <TouchableHighlight onPress={() => emojiPressed(emoji)} underlayColor='rgba(255, 255, 255, 0.75)'>
        <Image source={{uri: emoji.attributes.icon, width: 80, height: 80 }}/>
      </TouchableHighlight>
      <Text style={styles.emojiText}>
        {emoji.attributes.label}
      </Text>                            
    </View>    
  )
}

class DynamicEmoji extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      chatterKinds: null,
    }

    this.getEmojis = this.getEmojis.bind(this);
    this.emojiPressed = this.emojiPressed.bind(this);
  }

  getEmojis() {
    //TODO: change the token
    // token:0740118cb24781dc5dcf0e58679679e5
    HttpUtils.get('chatter_kinds', this.props.token)
      .then((response) => {
        this.setState({chatterKinds: response.data,loading:false})
    }).catch((err) => {
      this.setState({ loading: false })
    }).done()        
  }

  emojiPressed(emoji) {
    this.props.switchModal({ modalName:'addComment', emoji })
  }

  componentDidMount() {
    this.getEmojis()
  }

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeaderContainer}>
          <View>
            <TouchableHighlight style={styles.exButtonContainer}  underlayColor='transparent' onPress={this.props.exitModal}>
              <Image style={styles.exButton} source={exButton} />
            </TouchableHighlight>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}> 
              Step 1: Pick an Emoji
            </Text>
          </View>
        </View>

        <View style={styles.modalBody} >              
          <View style={styles.scrollable}>
            <View style={styles.scrollableTitle}>
              <Text style={styles.scrollableTitleText}> GIVE LOVE </Text>
            </View>      
            {
              this.state.loading ?
              <ActivityIndicator size="large" style={styles.loadingConainer} color="#B6B7C2" />
              :
                <ScrollView >
                  {this.state.chatterKinds &&
                    this.state.chatterKinds.map((emoji, indx) => {
                    if (emoji.attributes.sentiment === 'positive') {
                      return (
                        <EmojiProvider 
                          emoji={emoji}
                          emojiPressed={this.emojiPressed}
                          key={indx}                          
                        />
                      )  
                    }
                  })}
              </ScrollView>                
            }    
          </View>
          <View style={styles.scrollableDivider}/>
          <View style={styles.scrollable}>
            <View style={styles.scrollableTitle}>
              <Text style={styles.scrollableTitleText}> TALK SH*T </Text>
            </View> 
            {
              this.state.loading ?

              <ActivityIndicator size="large" style={styles.loadingConainer} color="#B6B7C2" />
              :
              <ScrollView >                        
                {this.state.chatterKinds && 
                  this.state.chatterKinds.map((emoji, indx) => {
                  if (emoji.attributes.sentiment === 'negative') {
                    return (
                      <EmojiProvider 
                        emoji={emoji}
                        emojiPressed={this.emojiPressed}                          
                        key={indx}
                      />
                    )  
                  }
                })} 
              </ScrollView>                      
          }
          </View>
        </View>
      </View>
    );
  }
}

export default DynamicEmoji;

const styles = StyleSheet.create({
  modalBody: {
    flex:4, 
    backgroundColor: 'white',
    flexDirection:'row'
  },
  scrollable: {
    width: '50%',
  },
  scrollableDivider: {
    width:1,
    backgroundColor:'#B6B7C2'
  },
  scrollableTitle: {
    padding: 10,
  },
  scrollableTitleText: {
    fontFamily:'Avenir-Black', 
    color:'#0E2442', 
    textAlign:'center', 
    fontWeight:'bold'
  },
  emojiHolder: {
    flex:1,
    padding:10, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emojiText: {
    paddingTop:10 ,
    fontWeight:'500',
    textAlign: 'center', 
    fontFamily: 'Avenir-Light', 
    color: '#8691a0'
  },
  modalContainer: {
    height: '80%',
    width: '90%',
    borderWidth: 0,    
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },  
  modalHeaderContainer: {
    flex:1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  exButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop:10,
    paddingRight: 15
  },
  exButton: {
    width: 24,
    height: 24,
    tintColor:'#8691a0'
  },
  titleContainer: {
    flex:1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontFamily: 'Avenir-Light',
    color: '#8691a0',
    fontSize: 24,
    backgroundColor: 'transparent'
  },        
  title: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  loadingConainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})