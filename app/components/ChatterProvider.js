import React, { Component } from 'react';
import { 
  Text,
  Image,
  View,
  StyleSheet 
} from 'react-native';

const trophyIcon = require('../../assets/images/trophy.png');
const tflIcon = require('../../assets/images/badge.png');

console.disableYellowBox = true;

const palyOffCard = (value,indx) => {
  return(
    <View style={styles.fullWidhtContainer} key={indx} onStartShouldSetResponder={() => true}>
      <View style={styles.fullWidthLeftView}>
        <View style={styles.palyOffNumberContainer}>
          <Text  style={styles.palyOffNumberText}>
            2
          </Text>
        </View>
      </View>
      <View style={styles.fullWidthRightView}>
        <Text style={styles.palyOffText}>
          {value.attributes.text}
        </Text>
      </View>              
    </View>
  )
}

const sundayCard = (value, indx) => {
  return (
    <View style={styles.fullWidhtContainer} key={indx} onStartShouldSetResponder={() => true}>
      <View style={styles.fullWidthLeftView}>
        <Image source={tflIcon} style={styles.sudnayBadgeIcon}/>
      </View>
      <View style={styles.fullWidthRightView}>
        <Text style={styles.sundayText}>
          It's sudnay log your workout! k thankx byeee!!!
        </Text>
      </View>              
    </View>
  )
}

const bubbleCard = (value,indx, iconImage) => {
  const bubbleIcon = iconImage || {uri: value.attributes.icon}
  return (
    <View style={styles.bubbleCard} key={indx} onStartShouldSetResponder={() => true}>
      <View style={styles.bubbleCardHeader}>
        <Image source={{uri: value.attributes.user_icon}} style={styles.bubbleCardUserIcon}/>                                    
        <Text style={styles.bubbleCardUserName}>{value.attributes.user_name}</Text>
        <View style={styles.bubbleCardLabelWrap}>
          <Text style={styles.bubbleCardLabel} numberOfLines={2} >
            {value.attributes.label}
          </Text>
        </View>
      </View>
      <View style={styles.bubbleHolder}>
        <View style={styles.bubbleTextWrapper}>
          <Text  style={styles.bubbleText}>
            {value.attributes.text}
          </Text>
        </View>
        <View style={styles.bubbleIconHolder}>
          <Image source={bubbleIcon} style={styles.bubbleIcon}/>
        </View>
      </View>                      
    </View>
  )
}



class ChatterProvider extends Component {
  render() {
    return (
        this.props.chatters.map((value , indx )=> {
          if (value.attributes.kind === 'Chatter'){
            return bubbleCard(value, indx)
          }else if(value.attributes.kind === 'AwardNotification'){
            return bubbleCard(value, indx, trophyIcon)
          }else if(value.attributes.kind === 'PlayoffHeadsUp') {
            return palyOffCard(value, indx)
          }else if(value.attributes.kind === 'Sunday') {
            return sundayCard(value, indx)
          }else {
            return null 
          }
        })  
    )    
  }
}

export default ChatterProvider;

const styles = StyleSheet.create({
  bubbleCard: {
    flex:1,
    paddingVertical:10
  },
  bubbleCardHeader: {
    flexDirection:'row', 
    alignItems:'center', 
    padding:20    
  },
  bubbleCardUserIcon: {
    borderRadius: 15,
    height: 30,
    width: 30    
  },
  bubbleCardLabelWrap: {
    width: 0,
    flex: 1,
  },
  bubbleCardLabel: {
    fontSize:14, 
    paddingLeft:3, 
    fontFamily:'Avenir-Light',
    textAlign: 'auto',
    color: '#8792A0'    
  },
  bubbleHolder: {
    flex:1, 
    flexDirection:'row', 
    paddingHorizontal: 20     
  },
  bubbleTextWrapper: {
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingRight:40,
    borderRadius:5,
    paddingVertical:20
  },
  bubbleCardUserName: {
    fontSize:16, 
    paddingLeft:10, 
    fontFamily:'Avenir-Black',
    color: '#8792A0'    
  },
  bubbleText: {
    fontSize:14,
    color:'#778DA0',                      
    fontFamily: 'Avenir-Light',
    fontWeight: '400',
    textAlign: 'auto'
  },
  bubbleIconHolder: {
    justifyContent:'center',
    alignItems: 'center',
    right:20
  },
  bubbleIcon: {
    height: 40,
    width: 40,
  },
  fullWidhtContainer: {
    flexDirection:'row', 
    backgroundColor:'gray',
    height:80
  },
  fullWidthLeftView: {
    flex:1, 
    backgroundColor:'gray',
    alignItems:'flex-end',
    justifyContent:'center',
    padding:10    
  },
  fullWidthRightView: {
    flex:3, 
    backgroundColor:'gray',
    justifyContent:'center',
    paddingHorizontal:10
  },
  palyOffNumberContainer: {
    height:50, 
    width:50, 
    borderRadius:25,
    backgroundColor:'gray',
    borderWidth:2,
    borderColor: 'white',
    justifyContent:'center',
    alignItems: 'center',    
  },
  palyOffNumberText: {
    fontFamily:'Fenwick',
    textShadowColor: 'white',
    color: 'white',
    fontSize:16    
  },
  palyOffText: {
    fontFamily:'Avenir-Black',
    textShadowColor: 'white',                    
    color: 'white',
    fontSize:12   
  },
  sudnayBadgeIcon: {
    height:40, 
    width:45, 
    resizeMode:'contain'    
  },
  sundayText: {
    fontFamily:'Avenir-Black',
    textShadowColor: 'white',                    
    color: 'white',
    fontSize:12       
  }
})