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

const timeSince = (date) => {
	
	let measures = {
		second: 1,
		minute: 60,
		hour: 3600,
		day: 86400,
		week: 604800,
		month: 2592000,
		year: 31536000
	};
	
	let chkMultiple = (amount, type) => {
		return (amount > 1) ? amount + " " + type + "s":"1 " + type;
	};
  
  let dateStr, amount, denomination
  let current = new Date()

  let diff = (current - date) / 1000; // work with seconds
    
	  if(diff > measures.year) {
	    denomination = "year";
	  } else if(diff > measures.month) {
	    denomination = "month";
	  } else if(diff > measures.week) {
	    denomination = "week";
	  } else if(diff > measures.day) {
	    denomination = "day";
	  } else if(diff > measures.hour) {
	    denomination = "hour";
	  } else if(diff > measures.minute) {
	    denomination = "minute";
	  } else {
	    dateStr = "Few seconds ago";
	    return dateStr;
	  }	
	  amount = Math.round(diff/measures[denomination]);
    dateStr =  chkMultiple(amount, denomination) ;
    
	  return dateStr;    
};

const playOffCard = (value,indx) => {
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
          weeks untill playoffs!
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
      <View style={[styles.fullWidthRightView,{flex:5}]}>
        <Text style={styles.sundayText} numberOfLines={3}>
          {value.attributes.text}
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
        <View style={styles.bubbleCardLabelContainer}>
          <Text>
            <Text style={styles.bubbleCardUserName}>{value.attributes.user_name} </Text>
            <Text style={styles.bubbleCardLabel} numberOfLines={2} >
              {value.attributes.label}
            </Text>
          </Text>
          <Text style={styles.bubbleCardLabel}>
            {timeSince(new Date(value.attributes.created_at))} 
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
          }else
           if(value.attributes.kind === 'PlayoffHeadsUp') {
            return playOffCard(value, indx)
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
    paddingVertical:19
  },
  bubbleCardHeader: {
    flexDirection:'row', 
    alignItems:'center', 
    paddingHorizontal:20, 
    paddingBottom: 8,
  },
  bubbleCardUserIcon: {
    borderRadius: 15,
    height: 30,
    width: 30    
  },
  bubbleCardLabelContainer: {
    width: 0,
    flex: 1,
    paddingLeft:10
  },
  bubbleCardLabel: {
    fontSize:14, 
    paddingLeft:3, 
    fontFamily:'Avenir-Light',
    textAlign: 'auto',
    color: '#828F9F'    
  },
  bubbleCardTime: {
    fontSize:12, 
    paddingLeft:3, 
    fontFamily:'Avenir-Light',
    textAlign: 'auto',
    color: '#828F9F'    
  },
  bubbleHolder: {
    flex:1, 
    flexDirection:'row', 
    paddingHorizontal: 20     
  },
  bubbleTextWrapper: {
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingRight:30,
    borderRadius:5,
    paddingVertical:15
  },
  bubbleCardUserName: {
    fontSize:14, 
    paddingLeft:5, 
    fontFamily:'Avenir-Medium',
    color: '#808D9E'    
  },
  bubbleText: {
    fontSize:14,
    color:'#4A5F77',                      
    fontFamily: 'Avenir-Light',
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
    backgroundColor:'#949cab',
    height:80,
    marginVertical:19
  },
  fullWidthLeftView: {
    flex:1, 
    alignItems:'flex-end',
    justifyContent:'center',
    padding:10    
  },
  fullWidthRightView: {
    flex:3, 
    justifyContent:'center',
    paddingHorizontal:10
  },
  palyOffNumberContainer: {
    height:50, 
    width:50, 
    borderRadius:25,
    borderWidth:2,
    borderColor: 'white',
    justifyContent:'center',
    alignItems: 'center',    
  },
  palyOffNumberText: {
    fontFamily:'Fenwick',
    textShadowColor: 'white',
    color: 'white',
    fontSize:30    
  },
  palyOffText: {
    fontFamily:'Avenir-Black',
    textShadowColor: 'white',                    
    color: 'white',
    fontSize:20 
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
    fontSize:16,
    paddingRight:10      
  }
})