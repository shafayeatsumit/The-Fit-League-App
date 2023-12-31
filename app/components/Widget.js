import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux'

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

const nextWorkoutArrow = require('../../assets/images/nextWorkoutArrow.png')

import DynamicIcon from './DynamicIcon'
import StatRow from './StatRow'

export default class Widget extends Component {
    constructor(props) {
    super(props)
    this.takeAction = this.takeAction.bind(this)
  }

  takeAction() {
    let { action_key, player, userAttributes } = this.props
    if (action_key) {
      Actions[action_key](userAttributes)
    } else if (player) {
      Actions.playerCard({ player, image_url: userAttributes.image_url, token: userAttributes.token })
    }
  }

  render() {
    return (
      <View style={this.props.bottom ? styles.widgetBottom : styles.widget}>
        { this.props.loading ?
          <View style={styles.loadingHolder}>
            <ActivityIndicator size="large" color="#B6B7C2" />
          </View>
        :
          <TouchableHighlight onPress={this.takeAction} underlayColor='transparent'>
            <View>
              <View style={styles.widgetTitleHolder}>
                <Text style={styles.widgetTitle}>{this.props.title}</Text>
              </View>
              { this.props.image && 
                <View style={styles.widgetImageHolder}>
                  <DynamicIcon
                    {...this.props.image} 
                    {...StyleSheet.flatten(styles.widgetImage)} />
                </View>
              }
              { this.props.bordered_image && !this.props.bordered_images &&
                <View style={styles.widgetImageHolder}>
                  <DynamicIcon 
                    {...this.props.bordered_image} 
                    {...StyleSheet.flatten(styles.widgetPartnerImage)} />
                </View>
              }
              { this.props.bordered_images &&
                <View style={styles.widgetImageHolder}>
                  { this.props.bordered_images.map((image, index) => {
                    let stylesheet = this.props.bordered_images.length > 1 ? (index > 0 ? styles.widgetMultiPartnerImageRight : styles.widgetMultiPartnerImage) : styles.widgetPartnerImage
                    return <DynamicIcon 
                      key={index}
                      {...image}
                      {...StyleSheet.flatten(stylesheet)} />
                    })
                  }
                </View>
              }
              { this.props.number != undefined && 
                <View style={styles.widgetNumberHolder}>
                  <View style={styles.widgetNumberCircle}>
                    <Text style={styles.widgetNumber}>{this.props.number}</Text>
                  </View>
                </View>
              }
              { this.props.header != undefined && 
                <View style={styles.widgetNumberHolder}>
                  <Text style={styles.widgetHeader}>{this.props.header}</Text>
                </View>
              }
              <View style={styles.widgetSubtitleHolder}>
                <Text style={styles.widgetSubtitle}>{this.props.subtitle}</Text>
              </View>
              { this.props.text &&
                <View style={styles.widgetTextHolder}>
                  <Text style={styles.widgetText}>{this.props.text}</Text>
                </View>
              }
              { this.props.stat_rows &&
                <View style={styles.widgetStatsHolder}>
                  { this.props.stat_rows.map((row, index) => {
                    return <StatRow
                      kind={this.props.stat_rows.length > 1 ? "multi" : "mini"}
                      key={index}
                      hideLabels={index != this.props.stat_rows.length - 1}
                      initials={this.props.stat_rows.length > 1 && row.initials}
                      daysWorkedOut={parseInt(row.days_worked_out)}
                      cardioPoints={parseInt(row.cardio_points)}
                      strengthPoints={parseInt(row.strength_points)}
                      varietyPoints={parseInt(row.diversity_points)} />                    
                    })
                  }
                </View>
              }
              { (this.props.banner) &&
                <View style={styles.bannerRow}>
                  <View style={[styles.banner, { backgroundColor: this.props.banner.color }]}>
                    <Text style={styles.bannerLabel}>{this.props.banner.text}</Text>
                  </View>
                </View>
              }
              { this.props.next_workout_arrow && 
                <View style={styles.widgetImageHolder}>
                  <Image source={nextWorkoutArrow} style={styles.nextWorkoutArrowImage} />
                </View>
              }
            </View>
          </TouchableHighlight>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  widgetBottom: {
    flex: 3,
    borderTopWidth: 1,
    borderTopColor: '#B6B7C2'
  },  
  widget: {
    flex: 3,
  },
  loadingHolder: {
    flex: 1,
    justifyContent: 'center'
  },
  widgetTitleHolder: {
    borderLeftColor: '#1DD65B',
    borderLeftWidth: 3,
    marginTop: 15,
    marginBottom: 10,
  },
  widgetTitle: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  widgetSubtitleHolder: {
    marginTop: 10,
  },
  widgetSubtitle: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: '#5A708E',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  widgetTextHolder: {
    marginTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  widgetText: {
    fontSize: 14,
    fontFamily: 'Avenir-Light',
    color: '#8691A0',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  widgetImageHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  widgetImage: {
    width: 80,
    height: 80  
  },
  widgetMultiPartnerImage: {
    borderColor: '#8092A2',
    borderRadius: 25,
    borderWidth: 2,
    width: 50,
    height: 50
  },
  widgetMultiPartnerImageRight: {
    borderColor: '#8092A2',
    borderRadius: 25,
    marginLeft: -15,
    borderWidth: 2,
    width: 50,
    height: 50
  },
  widgetPartnerImage: {
    borderColor: '#8092A2',
    borderRadius: 40,
    borderWidth: 2,
    width: 80,
    height: 80
  },
  widgetNumberHolder: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  widgetNumberCircle: {
    borderColor: '#8092A2',
    borderRadius: 40,
    borderWidth: 2,
    width: 80,
    padding: 6,
    height: 80
  },
  widgetHeader: {
    fontSize: 36,
    fontFamily: 'Avenir-Black',
    color: '#0A2645',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  widgetNumber: {
    fontSize: 48,
    fontFamily: 'Avenir-Black',
    color: '#0A2645',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  nextWorkoutArrowImage: {
    maxWidth: '100%',
    marginLeft: 35
  },
  bannerRow: {
    alignItems: 'center',
    padding: 20
  },
  banner: {
    width: 120,
    height: 40,
    borderRadius: 20,
  },
  bannerLabel: {
    padding: 12,
    fontSize: 12,
    fontFamily: 'Avenir-Black',
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'  
  }
})
