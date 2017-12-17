import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator
} from 'react-native';

import { DynamicSourceGenerator } from '../services/DynamicSourceGenerator'
import StatRow from './StatRow'

export default class Widget extends Component {
  render() {
    return (
      <View style={this.props.bottom ? styles.widgetBottom : styles.widget}>
        { this.props.loading ?
          <View style={styles.loadingHolder}>
            <ActivityIndicator size="large" color="#B6B7C2" />
          </View>
        :
          <View>
            <View style={styles.widgetTitleHolder}>
              <Text style={styles.widgetTitle}>{this.props.title}</Text>
            </View>
            { this.props.image && 
              <View style={styles.widgetImageHolder}>
                <Image style={styles.widgetImage} source={DynamicSourceGenerator.call(this.props.image)} />
              </View>
            }
            { this.props.bordered_image && 
              <View style={styles.widgetImageHolder}>
                <Image style={styles.widgetPartnerImage} source={DynamicSourceGenerator.call(this.props.bordered_image)} />
              </View>
            }
            { this.props.number != undefined && 
              <View style={styles.widgetNumberHolder}>
                <View style={styles.widgetNumberCircle}>
                  <Text style={styles.widgetNumber}>{this.props.number}</Text>
                </View>
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
            { this.props.stats &&
              <View style={styles.widgetStatsHolder}>
                <StatRow
                  mini={true}
                  daysWorkedOut={parseInt(this.props.stats.days_worked_out)}
                  cardioPoints={parseInt(this.props.stats.cardio_points)}
                  strengthPoints={parseInt(this.props.stats.strength_points)}
                  varietyPoints={parseInt(this.props.stats.diversity_points)} />
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
                <Image style={styles.nextWorkoutArrowImage} source={DynamicSourceGenerator.call('nextWorkoutArrow')} />
              </View>
            }
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  widgetBottom: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#B6B7C2'
  },  
  widget: {
    flex: 1,
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
    fontFamily: 'Avenir-Black',
    color: '#8691A0',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '400'
  },
  widgetImageHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  widgetImage: {
    maxWidth: '100%',
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
  widgetNumber: {
    fontSize: 48,
    fontFamily: 'Avenir-Black',
    color: '#0A2645',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '900'
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
    textAlign: 'center',
    fontWeight: '900'  
  }
})
