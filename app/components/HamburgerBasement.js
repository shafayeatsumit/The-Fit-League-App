import React, { Component } from 'react'

import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image,
} from 'react-native'

import { Actions } from 'react-native-router-flux'

import { HttpUtils } from '../services/HttpUtils'

const basementBackground = require('../../assets/images/basementBackground.png')
const badge = require('../../assets/images/badge.png')
const logo = require('../../assets/images/logo.png')

const VERTICAL_MARGIN_ANIMATION = 140
const HORIZONTAL_MARGIN_ANIMATION = 180
const ANIMATION_DURATION = 250

const HOME_LINK =     { label: 'Home',         action: 'home'     }
const WORKOUTS_LINK = { label: 'Your Workouts',     action: 'workouts' }
const MATCHUP_LINK =  { label: 'Your Matchup', action: 'matchup'  }
const LEAGUE_LINK =   { label: 'Your League',  action: 'league'   }

const LINKS_BY_FEATURE = {
  matchup: MATCHUP_LINK
}

export default class HamburgerBasement extends Component {
  constructor(props) {
    super(props);
    this.toggleBasement = this.toggleBasement.bind(this)
    this.hideBasement = this.hideBasement.bind(this)
    this.renderChildren = this.renderChildren.bind(this)
    this.state = { 
      links: [HOME_LINK, WORKOUTS_LINK],
      basementShowing: false,
      basementSpace: {
        marginTop: new Animated.Value(0),
        marginLeft: new Animated.Value(0),
        marginRight: new Animated.Value(0),
        marginBottom: new Animated.Value(0)
      }
    }
  }

  componentDidMount() {
    HttpUtils.get('leagues/current', this.props.token)
      .then((responseData) => {
        if (responseData.data) {
          let links = [HOME_LINK, WORKOUTS_LINK]
          responseData.data.attributes.features.forEach((feature) => {
            if (LINKS_BY_FEATURE[feature]) links.push(LINKS_BY_FEATURE[feature])
          })
          links.push(LEAGUE_LINK)
          if (links) this.setState({ links })
        }
      }).done();
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        toggleBasement: this.toggleBasement
      })
    })
  }

  hideBasement() {
    if (this.state.basementShowing) this.toggleBasement()
  }

  toggleBasement() {
    let margins = this.state.basementShowing ? { 
      marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0
    } : {
      marginTop: VERTICAL_MARGIN_ANIMATION, marginLeft: HORIZONTAL_MARGIN_ANIMATION, marginRight: -HORIZONTAL_MARGIN_ANIMATION, marginBottom: -VERTICAL_MARGIN_ANIMATION
    }
    Object.keys(margins).forEach((key) => {
      Animated.timing(this.state.basementSpace[key], { 
        easing: Easing.elastic(), toValue: margins[key], duration: ANIMATION_DURATION 
      }).start();       
    })
    this.setState({ basementShowing: !this.state.basementShowing })
  }

 render() {
    const { basementSpace } = this.state
    const { token, image_url } = this.props
    return (
      <View style={styles.basement}>
        <Image
          style={styles.basementBackgroundImage}
          source={basementBackground} />
        <TouchableHighlight onPress={() => Actions.home({ token, image_url }) } underlayColor='rgba(255, 255, 255, 0.25)'>
          <View style={styles.basementIconRow}>
            <View style={styles.basementBadge}>
              <Image
                style={styles.basementBadgeIcon}
                resizeMode='contain'
                source={badge} />
            </View>
            <View style={styles.basementLogo}>
              <Image
                style={styles.basementLogoIcon}
                resizeMode='contain'
                source={logo} />
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.basementNavColumn}>
          { this.state.links.map((link) => {
            return <TouchableHighlight key={link.action} style={styles.basementNavLink} onPress={() => Actions[link.action]({ token, image_url }) } underlayColor='rgba(255, 255, 255, 0.25)'>
              <Text style={styles.basementNavLinkText}>{ link.label }</Text>
            </TouchableHighlight>
          })}
        </View>
        <TouchableWithoutFeedback onPress={this.hideBasement}>
          <Animated.View style={StyleSheet.flatten([styles.container, basementSpace])}>
            { this.renderChildren() }
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9'
  },
  basement: {
    backgroundColor: '#0E2442',
    flex: 1,
  },
  basementBackgroundImage: {
    backgroundColor: '#0E2442',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  basementIconRow: {
    height: 140,
    width: '100%',
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    padding: 30
  },
  basementBadge: {
    flex: 1,
    padding: 10,
  },
  basementBadgeIcon: {
    width: '100%',
    height: '100%'
  },
  basementLogo: {
    flex: 4,
  },
  basementLogoIcon: {
    width: '100%',
    height: '100%'
  },
  basementNavColumn: {
    position: 'absolute',
    width: '50%',
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    top: 140
  },
  basementNavLink: {
    padding: 15,
    marginBottom: 30,
    borderRadius: 10,
  },
  basementNavLinkText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    fontWeight: '900',
  }
})