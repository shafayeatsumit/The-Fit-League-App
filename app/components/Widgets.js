import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'
import Widget from './Widget'
import Chatterbox from './Chatterbox'

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
    const { token, image_url } = this.props
    return (
      <View style={styles.widgetsHolder}>
        <View style={styles.leftWidgets}>
          {
            this.state.widgets.map((widget, index) => {
              widget.attributes.bottom = index > 0
              widget.attributes.userAttributes = { token, image_url }
              return <Widget key={index} {...widget.attributes}  />
            })
          }
          <View style={styles.widgetSpacer}></View>
        </View>
        <Chatterbox token={this.props.token} fireChatter={this.props.fireChatter} />
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
  widgetSpacer: {
    flex: 1
  }
})
