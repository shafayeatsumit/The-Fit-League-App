import React, {Component} from 'react';
import {
  Modal, 
  Text, 
  TouchableHighlight, 
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import NameAndPicSettings from './NameAndPicSettings'
import NotificationSettings from './NotificationSettings'
import EmailAndPassSettings from './EmailAndPassSettings'
import AboutMeSettings from './AboutMeSettings'
import PauseQuitSettings from './PauseQuitSettings'

const exButton = require('../../assets/images/exButton.png');

class SettingsModal extends Component {
  constructor(props){
    super(props);
    this.modalBoby = this.modalBoby.bind(this)
    this.modalHeader = this.modalHeader.bind(this)
  }

  modalHeader (modalTitle) {
    return (
      <View style={styles.modalHeader}>
        <View style={styles.crossIconContainer}>
          <TouchableHighlight style={styles.exButtonContainer}  underlayColor='transparent' onPress={this.props.exitModal}>
            <Image style={styles.exButton} source={exButton} />
          </TouchableHighlight>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}> 
            {modalTitle}
          </Text>
        </View>
      </View>  
    )
  }

  modalBoby () {
    const { modalName } = this.props;
    if ( modalName === 'nameAndPic') {
      const title = "Name and Profile Pic"
      return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'> 
            {this.modalHeader(title)}
          <View style={styles.modalBoby} behavior='padding'>
            <NameAndPicSettings/>
          </View>
        </KeyboardAvoidingView>
      )  
    }else if( modalName === "emailAndPass"){
      const title = "Email and Password"
      return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'> 
            {this.modalHeader(title)}
          <View style={styles.modalBoby}>
            <EmailAndPassSettings/>
          </View>
        </KeyboardAvoidingView>        
      )
    }else if ( modalName === "aboutMe"){
      const title = "About Me"
      return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior='padding'> 
          {this.modalHeader(title)}
          <View style={styles.modalBoby}>
            <AboutMeSettings/>
          </View>
        </KeyboardAvoidingView>         
      )
    }else if (modalName === "notifications"){
      const title = "Notifications Manager"
      return (
        <View style={styles.mainContainer}> 
            {this.modalHeader(title)}
          <View style={styles.modalBoby}>
            <NotificationSettings/>
          </View>
        </View>         
      )
    } else {
      const title = "Pause and Quit"
      return (
        <View style={styles.mainContainer}> 
            {this.modalHeader(title)}
          <View style={styles.modalBoby}>
            <PauseQuitSettings/>
          </View>
        </View>         
      )      
    }
  }
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.show}
      >
        <View style={styles.modalBackground} >
          { this.props.show && this.modalBoby()} 
        </View>
    </Modal>  
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor:'rgba(0,0,0,0.5)', 
    flex:1
  },
  mainContainer: {
    flex:1,
    marginHorizontal: '5%',
    marginVertical:'25%', 
    borderWidth:0,
    backgroundColor: 'white',
    borderRadius:10  
  },
  modalHeader: {
    flex:1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  modalBoby: {
    flex:4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
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
  }  
})

export default SettingsModal;