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

import { HttpUtils } from '../services/HttpUtils'

const exButton = require('../../assets/images/exButton.png');
const checkbox = require('../../assets/images/checkbox.png');
const checkboxOutline = require('../../assets/images/checkboxOutline.png');

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkBox: false,
      commentText: null,
    }
    this.handleSave = this.handleSave.bind(this)
    this.exitModal = this.exitModal.bind(this)
  }
  handleSave() {
    const { modalInfo, leagueId } = this.props;
    console.log("leagUeID",leagueId)
    console.log("is_private", this.state.checkBox)
    console.log("text", this.state.commentText)
    console.log("chatterKindId", modalInfo.emoji.id)
    HttpUtils.post('chatters', { 
      league_id: leagueId, 
      is_private: this.state.checkBox,
      text: this.state.commentText,
      chatter_kind_id: modalInfo.emoji.id

    }, this.props.token)
    .then((response) => {
      this.props.exitModal()
    }).catch((error)=> {
      console.error(error)
      this.props.exitModal()
    }).done()
  }

  exitModal() {
    this.props.changeModal({
      modalName: 'pickEmoji',
      data: {}
    })    
  }

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeaderContainer}>
          <View>
            <TouchableHighlight style={styles.exButtonContainer}  underlayColor='transparent' onPress={this.exitModal}>
              <Image style={styles.exButton} source={exButton} />
            </TouchableHighlight>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}> 
              Step 2: Add Comment
            </Text>
          </View>        
        </View>
        <View style={styles.modalBody} >              
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines = {4}
            placeholder = "Type here ..."
            onChangeText={(val) => this.setState({ commentText: val })}
          />
          <View style={{height:'10%'}}>
            <TouchableHighlight                              
              underlayColor='transparent'
              onPress = {()=> this.setState({checkBox: !this.state.checkBox})}              
            >                  
              <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20, paddingTop:10}}>
              {
                this.state.checkBox ?
                  <Image source={checkbox} style={{height:20, width:20}}/>
                  :
                  <Image source={checkboxOutline} style={{height:20, width:20, tintColor:'#C4CAD1'}}/>
              }
                
                <Text style={{paddingLeft:10, fontSize:16,fontFamily: 'Avenir-Light',color:'#5B7182' }}>
                  send privately
                </Text>
              </View>
            </TouchableHighlight>
          </View>  
          <View style={styles.buttonContainer}>
            <TouchableHighlight style={styles.saveButton} underlayColor='transparent' onPress={this.handleSave}>
              <Text style={styles.saveButtonText}>Send!!</Text>
            </TouchableHighlight>          
          </View>        
        </View>        
      </View>
    );
  }
}

export default AddComment;

const styles = StyleSheet.create({
  modalContainer: {
    height: '80%',
    width: '90%',
    borderWidth: 0,    
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },  
  modalBody: {
    flex:4, 
    backgroundColor: 'white',
    //flexDirection:'row'
  },  
  input: {
    fontSize: 17,
    fontFamily: 'Avenir-Light',
    color: '#5B7182',
    borderWidth: 1,
    borderColor: '#C4CAD1',
    borderRadius: 5,
    height: 120,
    paddingLeft: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 0,  
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  saveButton: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    backgroundColor:'#2C5CE9',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#F1F4FD',
    fontSize: 20,
    padding: 5    
  }  
})