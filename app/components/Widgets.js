import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'
import Widget from './Widget'

export default class Widgets extends Component {
  
  constructor(props) {
    super(props);
    this.state = { widgets: [{ attributes: { loading: true }}, { attributes: { loading: true }}] };
  }

  componentDidMount() {
    HttpUtils.get('widgets', this.props.token)
      .then((responseData) => {
        this.setState({ widgets: responseData.data })
      }).done();
  }

  render() {
    return (
      <View style={styles.widgetsHolder}>
        <View style={styles.leftWidgets}>
          {
            this.state.widgets.map((widget, index) => {
              widget.attributes.bottom = index > 0;
              return <Widget key={index} {...widget.attributes} />
            })
          }
        </View>
        <View style={styles.rightChatterbox}>
          <View style={styles.chatterboxTitleHolder}>
            <Text style={styles.chatterboxTitle}>Chatterbox</Text>
          </View>
          <Text style={styles.chatterboxPlaceholder}>The chatterbox is coming soon!</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  widgetsHolder: {
    flex: 6,
    flexDirection: 'row'
  },
  leftWidgets: {
    flex: 1,
    flexDirection: 'column'
  },
  rightChatterbox: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#B6B7C2'
  },
  chatterboxTitleHolder: {
    borderLeftColor: '#1DD65B',
    borderLeftWidth: 3,
    marginTop: 15,
    marginBottom: 10,
  },
  chatterboxTitle: {
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    color: '#0E2442',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  chatterboxPlaceholder: {
    fontSize: 14,
    fontFamily: 'Avenir-Black',
    color: '#B6B7C2',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '400',
    paddingTop: 130,
    padding: 20
  },
})
