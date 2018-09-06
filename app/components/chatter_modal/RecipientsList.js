import React, { Component } from 'react';
import { 
  Text,
  StyleSheet, 
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View 
} from 'react-native';

import { HttpUtils } from '../../services/HttpUtils'
import { SessionStore } from '../../services/SessionStore'

const exButton = require('../../../assets/images/exButton.png');
const checkbox = require('../../../assets/images/checkbox.png');
const checkboxOutline = require('../../../assets/images/checkboxOutline.png');
const rigthArrow = require('../../../assets/images/nextWeek.png');


class RecipientsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allRecipientsCheckBox: false,
      recipients: [],
      selectedRecipients: [],
      loading: true,
    }
    this.clickRecipient = this.clickRecipient.bind(this);
    this.selectAllRecipipents = this.selectAllRecipipents.bind(this);
    this.arrowButtonPressed = this.arrowButtonPressed.bind(this);
  }

  getRecipientsByUrl(url) {
    // TODO : replace token
    HttpUtils.get(url, this.props.token)
      .then((response) => {
        this.setState({loading:false, recipients: response.data})
    }).catch((err) => {
      this.setState({ loading: false })
    }).done()        
  }

  getRecipients() {
    SessionStore.getLeagueId((leagueId) => {
      const recipientsListUrl = 'leagues/' + leagueId.toString() + '/chatterbox/recipients';
      this.getRecipientsByUrl(recipientsListUrl)
      this.setState({leagueId})
    }, () => {
      // TODO: what is the use of this call back thing
    })    
  }
  
  clickRecipient(recipient) {
    const { selectedRecipients, recipients } = this.state;
    if(selectedRecipients.includes(recipient)) {
      this.setState({ selectedRecipients: selectedRecipients.filter((val)=> val !== recipient)})
    }else {
      this.setState({ selectedRecipients:[...selectedRecipients, recipient] })
    }
  }

  selectAllRecipipents() {
    const { recipients , selectedRecipients, allRecipientsCheckBox } = this.state;
    if(allRecipientsCheckBox === false) {
      this.setState({ selectedRecipients : recipients, allRecipientsCheckBox: true})
    } else {
      this.setState({ selectedRecipients : [], allRecipientsCheckBox: false})
    }
  }

  componentDidMount() {
    this.getRecipients()
  }

  arrowButtonPressed() {
    const { selectedRecipients, allRecipientsCheckBox, recipients } = this.state;
    
    if (allRecipientsCheckBox || selectedRecipients.length === recipients.length ){
      this.props.switchModal({modalName: 'emojiPicker', recipientsData: {wholeLeague:true, recipients:selectedRecipients} })
    }else{
      this.props.switchModal({modalName: 'emojiPicker', recipientsData:{wholeLeague:false, recipients:selectedRecipients}})
    }
  }

  render() {
    const { selectedRecipients, recipients } = this.state;

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
              Choose Recipients(s)
            </Text>
          </View>
        </View>
        <View style={styles.modalBody}>
        {
          this.state.loading ?

          <ActivityIndicator size="large" style={styles.loading} color="#B6B7C2" />
          :
          <View style={styles.modalBody}>
            <View style={styles.allRecipientsContainer}>
              <TouchableOpacity                              
                  underlayColor='transparent'
                  style={styles.checkboxTouchable}
                  onPress = {this.selectAllRecipipents}
                  activeOpacity={0.8}              
                >             
                {  this.state.allRecipientsCheckBox || selectedRecipients.length === recipients.length
                  ?
                  <Image source={checkbox} style={styles.checkboxTickedImage}/>
                  :
                  <Image source={checkboxOutline} style={styles.checkboxOutlineImage}/>
                }
                <Text style={styles.allmembersText}>
                  ALL  LEAGUE  MEMBERS
                </Text>                 
              </TouchableOpacity>
                         
            </View>
            <View style={styles.scrollableHolder}>
              <ScrollView >
                {
                  this.state.recipients.map((recipient, indx) => {
                    const recipientSelected = this.state.selectedRecipients.includes(recipient)
                    return(
                      <View style={styles.recipientContainer} key={indx}>
                        <TouchableOpacity                              
                          underlayColor='transparent'
                          style={styles.checkboxTouchable}
                          onPress = {() => this.clickRecipient(recipient)}
                          activeOpacity={0.8}              
                        >             
                          {
                            recipientSelected ?
                            <Image source={checkbox} style={styles.checkboxTickedImage}/>
                            :
                            <Image source={checkboxOutline} style={styles.checkboxOutlineImage}/>
                          }
                          <Text style={styles.recipientName}>{recipient.attributes.name}</Text>
                        </TouchableOpacity>               
                        
                      </View>  
                    )
                  })
                }
              
              </ScrollView>
              {
                selectedRecipients.length > 0 && 
                <TouchableHighlight 
                  onPress={this.arrowButtonPressed}
                >
                  <Image source={rigthArrow} style={styles.arrowImage}/>
                </TouchableHighlight>
              }
            </View>
          </View>
        }
        </View> 
      </View>
    )
  }
}

export default RecipientsList;

const styles = StyleSheet.create({
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
  modalBody: {
    flex:4
  },
  allRecipientsContainer: {
    flex:1,
    flexDirection: 'row',
    paddingLeft: 30,
    marginHorizontal: 20,
    borderBottomWidth:1,
    borderColor:'#8691a0'
  },
  scrollableHolder: {
    flex:8,
    marginHorizontal:20,
    paddingTop:20,
    paddingLeft:20
  },
  checkboxOutlineImage: {
    height:20, 
    width:20,
    tintColor:'#C4CAD1',
  },
  checkboxTickedImage: {
    height:20, 
    width:20,
  },
  checkboxTouchable: {
    paddingRight: 15,
    flexDirection:'row'
  },
  allmembersText: {
    fontFamily:'Avenir-Light', 
    paddingLeft: 10,
    color:'#0E2442', 
    fontSize:14,
    fontWeight:'600'
  },
  recipientContainer: {
    paddingHorizontal: 20,
    paddingVertical:10,
    flexDirection:'row'
  },
  recipientName: {
    paddingLeft:10,
    fontWeight:'500',
    textAlign: 'center', 
    fontFamily: 'Avenir-Light', 
    color: '#8691a0'
  },
  arrowImage: {
    height:70,
    width:70, 
    position:'absolute',
    bottom:10, 
    alignSelf:'center'
  },
  loading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }  
})

