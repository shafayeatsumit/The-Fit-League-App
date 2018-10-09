import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image,
  StatusBar,
  ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux'

const hamburgerIcon = require('../../assets/images/hamburger.png');
const headerBackground = require('../../assets/images/speckledBackground.png');
const xOutIcon = require('../../assets/images/xOutWhite.png');

export default class SpeckledHeader extends Component {
  constructor(props) {
    super(props)
    
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
  }

  render() {
    return (
      <ImageBackground source={headerBackground} style={styles.container}>
        <TouchableHighlight style={styles.hamburgerButton} onPress={this.context.toggleBasement} underlayColor='transparent'>
          <Image source={hamburgerIcon} />
        </TouchableHighlight>      
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>ChatterBox</Text>
        </View>
        <TouchableHighlight style={styles.xOutButton} onPress={()=> Actions.home({token: this.props.token})} underlayColor='transparent'>
          <Image source={xOutIcon} style={{height:25,width:25}}/>
        </TouchableHighlight>        
      </ImageBackground >
      
    )
  }
}

SpeckledHeader.contextTypes = {
  toggleBasement: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row', 
    paddingTop:15
  },
  hamburgerButton: {
    flex:1,  
    alignItems:'center',
    justifyContent: 'center'
  },
  titleContainer: {
    flex:4, 
    justifyContent:'center', 
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    fontSize: 20,
    backgroundColor: 'transparent',
    alignSelf:'center'
  },
  xOutButton: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})