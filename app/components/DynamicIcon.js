import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

const ICONS = {
  universal: {
    gradientButtSlap: require('../../assets/images/gradientButtSlap.png'),
  },
  dark: {
    basketball:               require('../../assets/images/dark/basketball.png'),
    running:                  require('../../assets/images/dark/running.png'),
    stair_running:            require('../../assets/images/dark/running.png'),
    yoga:                     require('../../assets/images/dark/yoga.png'),
    cycling:                  require('../../assets/images/dark/cycling.png'),
    spin_class:               require('../../assets/images/dark/spin_class.png'),
    hot_yoga:                 require('../../assets/images/dark/hot_yoga.png'),
    weightlifting:            require('../../assets/images/dark/weightlifting.png'),
    lifting_slash_bodyweight: require('../../assets/images/dark/weightlifting.png'),
  },
  light: {
    basketball:               require('../../assets/images/light/basketball.png'),
    running:                  require('../../assets/images/light/running.png'),
    stair_running:            require('../../assets/images/light/running.png'),
    yoga:                     require('../../assets/images/light/yoga.png'),
    cycling:                  require('../../assets/images/light/cycling.png'),
    spin_class:               require('../../assets/images/light/spin_class.png'),
    hot_yoga:                 require('../../assets/images/light/hot_yoga.png'),
    weightlifting:            require('../../assets/images/light/weightlifting.png'),
    lifting_slash_bodyweight: require('../../assets/images/light/weightlifting.png'),
  }
}

const DEFAULT_SIZE = 80

export default class DynamicIcon extends Component {
  
  constructor(props) {
    super(props)
    this.generateSource = this.generateSource.bind(this)
    this.setNativeProps = this.setNativeProps.bind(this)
  }

  setNativeProps(props) {
    this.refs.main.setNativeProps(props)
  }

  generateSource(props) {
    let source = Object.assign({}, props)
    if (source.label) source.filename = source.label.toLowerCase().replace(/\//g, 'slash').replace(/ /g, '_')
    if (source.filename) {
      if (source.shade) {
        return ICONS[source.shade][source.filename]
      } else {
        return ICONS.universal[source.filename]
      }
    } else {
      return source
    }
  }

  render() {
    const source = this.generateSource(this.props)
    const style = { 
      height: this.props.height, 
      width: this.props.width,
      borderWidth: this.props.borderWidth,
      borderColor: this.props.borderColor,
      marginLeft: this.props.marginLeft,
      marginRight: this.props.marginRight,
      borderRadius: this.props.borderRadius
    }
    if (source) {
      return <Image ref='main' source={source} style={style} />
    } else {
      let { shade, label, height, width } = this.props
      let size = height || width || DEFAULT_SIZE
      let acronym = label.split(' ').map((w) => w[0])
      let textColor = shade == 'dark' ? styles.darkText : styles.lightText
      let textSize = { fontSize: (size / 2.5) }
      return (
        <View ref='main' style={StyleSheet.flatten([styles.acronymHolder, style])}>
          <Text style={StyleSheet.flatten([styles.text, textColor, textSize])}>{acronym}</Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  acronymHolder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: 'Avenir-Light',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  darkText: {
    color: '#0E2442',
  },
  lightText: {
    color: 'white',
  }
})
