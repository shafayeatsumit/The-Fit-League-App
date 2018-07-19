import React, { Component } from 'react';
import { 
  Text,
  Image,
  View,
  StyleSheet 
} from 'react-native';


class ChatterProvider extends Component {
  render() {
    return (
        this.props.chatters.map((value , indx )=> {
          if(value.attributes.kind === 'Chatter') {
            return (
              <View style={styles.commentCard} key={indx} onStartShouldSetResponder={() => true}>
                <View style={styles.commentCardHeader}>
                  <Image source={{uri: value.attributes.user_icon}} style={styles.commentCardUserIcon}/>                  
                  <Text style={styles.commentCardUserName}>{value.attributes.user_name}</Text>
                  <Text style={styles.commentCardLabel}>{value.attributes.label}</Text>
                </View>
                <View style={styles.commentHolder}>
                  <View style={styles.commentTextWrapper}>
                    <Text  style={styles.commentText}>
                      {value.attributes.text}
                    </Text>
                  </View>
                  <View style={styles.commentIconHolder}>
                    <Image source={{ uri:value.attributes.icon }} style={styles.commentIcon}/>
                  </View>
                </View>                      
              </View>
            )  
          }
        })  
    )    
  }
}

export default ChatterProvider;

const styles = StyleSheet.create({
  commentCard: {
    flex:1,
  },
  commentCardHeader: {
    flexDirection:'row', 
    alignItems:'center', 
    padding:20    
  },
  commentCardUserIcon: {
    borderRadius: 20,
    height: 40,
    width: 40    
  },
  commentCardLabel: {
    fontSize:14, 
    paddingLeft:5, 
    fontFamily:'Avenir-Light',
    fontWeight: '500',
    color: '#8792A0'    
  },
  commentHolder: {
    flex:1, 
    flexDirection:'row', 
    paddingHorizontal: 20     
  },
  commentTextWrapper: {
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingRight:40,
    borderRadius:5,
    paddingVertical:20
  },
  commentCardUserName: {
    fontSize:16, 
    paddingLeft:10, 
    fontFamily:'Avenir-Black',
    color: '#8792A0'    
  },
  commentText: {
    fontSize:14,
    color:'#778DA0',                      
    fontFamily: 'Avenir-Black',
  },
  commentIconHolder: {
    justifyContent:'center',
    alignItems: 'center',
    right:20
  },
  commentIcon: {
    height: 40,
    width: 40,
  },
})