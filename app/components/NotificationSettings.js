import React, { Component } from 'react';
import { 
  Text, 
  View,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  Switch,
  ScrollView,
  StyleSheet
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils';

const settings = [
  {
    name: 'sunday_reminder',
    title: 'Sunday Reminder',
    subtitle: 'Weekly reminder to log workouts'
  },
  {
    name: 'new_matchup',
    title: 'New Matchup',
    subtitle: 'Monday announcement of new parter and opponents'
  },
  {
    name: 'matchup_status',
    title: 'Matchup Status',
    subtitle: 'Daily updates on matchup "status"(winning, losing or tied)'
  },
  {
    name: 'partner_workout',
    title: 'Partner Workout',
    subtitle: 'Notified every time your partner logs a workout'
  },
  {
    name: 'opponent_workout',
    title: 'Opponent Workout',
    subtitle: 'Notified every time your opponent logs a workout'
  }
]


class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      switches : {
        sunday_reminder: true,
        new_matchup: true,
        matchup_status: true,
        partner_workout: true,
        opponent_workout: true,
      }
    }
    this.switchHandler = this.switchHandler.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.loadProfile = this.loadProfile;
  }

  switchHandler(switchName) {
    const switchValue = this.state.switches[switchName];
    this.setState({
      switches: {
        ...this.state.switches,
        [switchName]: !switchValue
      }
    });
  }

  loadProfile() {
    HttpUtils.get('profile', this.props.token)
      .then((responseData) => {
        let { notification_preferences } = responseData.data.attributes
        this.setState({
          loading: false,
          switches: {
            ...notification_preferences
          }
        })        
      }).catch((err) => {
        // TODO: Nothing
        this.setState({loading: false})
    }).done()
  }

  handleSave() {
    const { token } = this.props;
    const { switches } = this.state;
    const falseNotifications = {}
    Object.keys(switches).forEach((key)=> {
      if(switches[key] === false) {
        falseNotifications[key] = false 
      } 
    })
    this.setState({ loading: true })
    HttpUtils.put('profile', { notification_preferences: switches }, token).then((response) => {
      this.setState({ loading: false })
      Alert.alert("YaY! Notification Update Successful.")  
    }).catch((error) => {
      this.setState({ loading: false })
      Alert.alert("Sorry! Update failed.", error.message)
    }).done()       
  }

  componentDidMount() {
    this.loadProfile()  
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {
          this.state.loading ? 
          <View style={styles.loadingConainer}>
            <ActivityIndicator size="large" style={styles.loading} color="black" />
          </View>
          :    
          <View style={styles.mainContainer}>  
          <ScrollView style={styles.settingsContainer} >
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
          </ ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableHighlight style={styles.saveButton} underlayColor='transparent' onPress={this.handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableHighlight>          
          </View>
          </View>
        }                  
      </View>    
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  settingsContainer: {
    flex:1,
  },
  loadingConainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },  
  notificationSettings: {
    flex:1,
    padding: 5,
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
  },
  buttonContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  saveButton: {
    width: '50%',
    height: 50,
    borderRadius: 5,
    backgroundColor:'#2C5CE9',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    color: '#F1F4FD',
    fontSize: 20,
    padding: 5    
  }    
})

export default NotificationSettings;