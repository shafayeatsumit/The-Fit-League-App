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
    super(props)
  }

  render() {
    return (
      <HamburgerBasement {...this.props}>
        <SpeckledHeader style={styles.headerContainer} {...this.props} title="Chatterbox" />
      </HamburgerBasement>
    );
  }
}

export default NewChatterbox;

const styles = StyleSheet.create({
  headerContainer: {
    flex:2,
    backgroundColor: '#2C5CE9'
  }  
})