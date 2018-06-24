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
    name: 'sundayReminder',
    title: 'Sunday Reminder',
    subtitle: 'Weekly reminder to log workouts'
  },
  {
    name: 'newMatchup',
    title: 'New Matchup',
    subtitle: 'Monday announcement of new parter and opponents'
  },
  {
    name: 'matchupStatus',
    title: 'Matchup Status',
    subtitle: 'Daily updates on matchup "status"(winning, losing or tied)'
  },
  {
    name: 'partnerWorkout',
    title: 'Partner Workout',
    subtitle: 'Notified every time your partner logs a workout'
  },
  {
    name: 'oponentWorkout',
    title: 'Opponent Workout',
    subtitle: 'Notified every time your opponent logs a workout'
  }
]

class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switches : {
        sundayReminder: false,
        newMatchup: false,
        matchupStatus: false,
        partnerWorkout: false,
        oponentWorkout: false,
      }
    }
    this.switchHandler = this.switchHandler.bind(this);
  }

  switchHandler(switchName) {
    const switchValue = this.state.switches[switchName];
    // TODO: handle switches
    this.setState({
      switches: {
        ...this.state.switches,
        [switchName]: !switchValue
      }
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        { settings.map((setting, i)=> {
            const switchName = setting.name;
            return(
              <View style={styles.notificationSettings} key={i}>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>{setting.title}</Text>
                  <Text style={styles.subtitleText}>{setting.subtitle}</Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch onValueChange={this.switchHandler.bind(this, switchName)} value={this.state.switches[switchName]}/>
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