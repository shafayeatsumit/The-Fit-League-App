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


export default class SpeckledHeader extends Component {
  constructor(props) {
    super(props)
    this.myPlayerCard = this.myPlayerCard.bind(this)
  }

  myPlayerCard() {
    Actions.playerCard({ mine: true, image_url: this.props.image_url, token: this.props.token })
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
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