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
const profileImage = "data:image/png;base64,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";

export default class SpeckledHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'you'
    }
    this.myPlayerCard = this.myPlayerCard.bind(this)
    this.switchTab = this.switchTab.bind(this)
  }

  myPlayerCard() {
    Actions.playerCard({ mine: true, image_url: this.props.image_url, token: this.props.token })
  }
  
  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
  }

  switchTab(tabName) {
    this.setState({selectedTab:tabName})
  }

  render() {
    const { image_url, title } = this.props;

    return (
      <ImageBackground source={headerBackground} style={styles.container}>
        <TouchableHighlight style={styles.hamburgerButton} onPress={this.context.toggleBasement} underlayColor='transparent'>
          <Image source={hamburgerIcon} />
        </TouchableHighlight>      
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}> { title } </Text>
        </View>
        <View style={styles.userImageHolder}>
          { image_url && 
              <TouchableHighlight onPress={this.myPlayerCard} underlayColor='transparent'>
                <Image style={styles.userImage} source={{uri: image_url}} />
              </TouchableHighlight>
          }        
        </View>       
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
    paddingTop:20
  },
  hamburgerButton: {
    flex:1,  
    paddingLeft:10,
    justifyContent: 'center'
  },
  titleContainer: {
    flex:2, 
    justifyContent:'center', 
    alignItems: 'center' 
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    fontSize: 20,
    backgroundColor: 'transparent'
  },
  userImageHolder: {
    flex:1, 
    justifyContent:'center', 
    alignItems:'flex-end', 
    paddingRight:10 
  },
  userImage: {
    borderColor: 'white',
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36,
  }
})