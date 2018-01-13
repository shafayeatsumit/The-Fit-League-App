import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar
} from 'react-native'

import { AppEventsLogger } from 'react-native-fbsdk'

import HamburgerBasement from './HamburgerBasement'
import OtherHeader from './OtherHeader'

export default class GameRules extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
    AppEventsLogger.logEvent('Viewed Game Rules')
  }

  render() {
    return (
      <HamburgerBasement ignoreLeagueRequirement={true} {...this.props}>
        <OtherHeader style={styles.headerContainer} title="Game Rules" {...this.props} />
        <View style={styles.container}>
          <ScrollView>
            <TouchableOpacity activeOpacity={1}>
              <Text style={styles.headerText}>Game overview.</Text>
              <Text style={styles.bodyText}>As a participant in TheFitLeague (TFL), you compete in a private exercise league comprised of you and your friends. Log workouts directly in the app, those workouts then get translated into stats, and those stats determine whether you win or lose on a weekly basis. Each league is 10 weeks long. 8 weeks for the “regular season”, and 2 weeks for “playoffs” (not all participants will make the playoffs). In the end, 3 members of your league will be crowned champions, and will receive the spoils ($$$) of victory.</Text>

              <Text style={styles.headerText}>TFL is a team game, sort of.</Text>
              <Text style={styles.bodyText}>Each week you are assigned a new partner. During the week, your stats combine with those of your partner as you compete against another pair. At the end of the week (Sunday night), your matchup ends. Your team either wins, loses or ties, and you move on to the next week, a new partner and new opponents. Since your partner is always changing, your “ranking” in the league is as an individual, not as a team.</Text>

              <Text style={styles.headerText}>All exercise are valid. Weightings make them comparable.</Text>
              <Text style={styles.bodyText}>You can log any kind of workout: spin class, weightlifting, yoga, basketball, running, etc. You can provide lots of detail, or just a single figure (“25 minutes of biking”). No matter what, your workout will get scored across 4 categories (explained in the next section). The key to this is the “Exercise Weightings”, which in the background translate “25 minutes of biking” into certain values for each of the 4 categories. Not all exercises have the same weighting!</Text>

              <Text style={styles.headerText}>The 4 categories.</Text>
              <Text style={styles.bodyText}>Over the course of a week, you accumulate a total score in 4 categories:</Text>
              <Text style={styles.bodyText}>1. Days worked out</Text>
              <Text style={styles.bodyText}>2. Sets of Strength-based exercise</Text>
              <Text style={styles.bodyText}>3. Minutes of Cardio</Text>
              <Text style={styles.bodyText}>4. Variety of your individual workouts</Text>
              <Text style={styles.bodyText}>For each category, your total is added to your partner’s and compared against your opponent’s total. If your team wins the “Days” category, your team gets 2 points. And the same goes for Strength and Cardio: 2 points. Winning Variety is only worth 1 point. So, for example, if your team wins Days and Cardio, but loses Strength and Variety, your team would win 4 - 3.</Text>

              <Text style={styles.headerText}>It takes $$ to make $$$.</Text>
              <Text style={styles.bodyText}>The buy-in to a TFL league is $20. 100% of this money gets paid back out to the champions of your league. (TFL makes $0 from the buy-ins)… But let’s be clear: TFL is first and foremost about fun and health. We established the buy-in model through experimentation. What we found: people are more motivated when there’s a little money on the line ;)</Text>

              <Text style={styles.headerText}>We are here to help!</Text>
              <Text style={styles.bodyText}>You may have more questions: how are Exercise Weightings determined? How do the playoffs work? Who am I?? Visit our FAQs or email us anytime: support@thefitleague.io</Text>
            </TouchableOpacity>
          </ScrollView>
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
    padding: 10
  },
  headerText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '900',
    color: '#1DD65B',
    fontSize: 26,
    margin: 10
  },
  bodyText: {
    fontFamily: 'Avenir-Black',
    backgroundColor: 'transparent',
    fontWeight: '400',
    color: '#0E2442',
    fontSize: 16,
    margin: 10
  }
});