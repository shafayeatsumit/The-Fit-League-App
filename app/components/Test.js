import React, { Component } from 'react';
import { 
  Text, 
  View ,
  Dimensions,
  Image,
  StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const { height,width} = Dimensions.get('window')
const PushNotification = require('react-native-push-notification')

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'

const profileImage1 = 'https://randomuser.me/api/portraits/men/3.jpg'; 
const profileImage2 = 'https://randomuser.me/api/portraits/men/1.jpg';
const profileImage3 =  'https://randomuser.me/api/portraits/men/20.jpg';
const profileImage4 =  'https://randomuser.me/api/portraits/men/44.jpg';
const lastWeek = require('../../assets/images/lastWeek.png')
const nextWeek = require('../../assets/images/nextWeek.png')

const demoProps = {"navigation":{"state":{"params":{"hideNavBar":true,"title":"Your Matchup","init":true,"token":"0740118cb24781dc5dcf0e58679679e5","image_url":"https://tfl-images-production.s3.amazonaws.com/uploads/profile_pic/image/799/image.jpeg","routeName":"matchup"},"key":"id-1533810987250-4","routeName":"matchup"}},"hideNavBar":true,"title":"Your Matchup","init":true,"token":"0740118cb24781dc5dcf0e58679679e5","image_url":"https://tfl-images-production.s3.amazonaws.com/uploads/profile_pic/image/799/image.jpeg","routeName":"matchup","name":"matchup"}

class Test extends Component {

  render() {
    return (
      <HamburgerBasement {...demoProps}>
        <OtherHeader style={styles.headerContainer} {...demoProps} title=" Matchups" />
        <View style={styles.container}>
          <View style={styles.listContainer}>
            <View style={styles.dateRow}>

            </View>
          </View>
        </View>
      </HamburgerBasement>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },
  container: {
    flex: 8,
    borderTopColor: '#D5D7DC',
    borderTopWidth: 1,
  },
  loading: {
    paddingTop: 20
  },
  listContainer: {
    flexDirection: 'column',
    flex: 1
  },
  dateRow: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  }, 
  dateButtonHolder: {
    padding: 20
  },
  dateText: {
    fontFamily: 'Avenir-Light',
    color: '#818D9C',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  contestLabel: {
    flexDirection: 'column',
  },     
})

export default Test;