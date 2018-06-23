import React, { Component } from 'react';
import { 
  Text, 
  View,
  Image,
  TouchableHighlight,
  TextInput,
  Switch,
  StyleSheet
} from 'react-native';

const settings = [
  {
    title: 'Sunday Reminder',
    subtitle: 'Weekly reminder to log workouts'
  },
  {
    title: 'New Matchup',
    subtitle: 'Monday announcement of new parter and opponents'
  },
  {
    title: 'Matchup Status',
    subtitle: 'Daily updates on matchup "status"(winning, losing or tied)'
  },
  {
    title: 'Partner Workout',
    subtitle: 'Notified every time your partner logs a workout'
  },
  {
    title: 'Opponent Workout',
    subtitle: 'Notified every time your opponent logs a workout'
  }
]

class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    return (
      <View style={styles.mainContainer}>
       { settings.map((setting, i)=> {
          return(
            <View style={styles.notificationSettings} key={i}>
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{setting.title}</Text>
                <Text style={styles.subtitleText}>{setting.subtitle}</Text>
              </View>
              <View style={styles.switchContainer}>
                <Switch/>
              </View>
            </View>    
          )
        })
      }
      </View>    
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  notificationSettings: {
    flex:1,
    flexDirection: 'row'
  },
  textContainer: {
    flex:4,
    paddingLeft: 20,
  },
  switchContainer: {
    flex:1,
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    fontSize: 18,
  },
  subtitleText: {
    fontFamily: 'Avenir-Light',
    color: '#8691a0',
    fontSize: 16,
  }
})

export default NotificationSettings;