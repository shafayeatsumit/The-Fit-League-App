import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import { HttpUtils } from '../services/HttpUtils'
import { SessionStore } from '../services/SessionStore'

import Widget from './Widget'
import WorkoutFeed from './WorkoutFeed'

export default class Widgets extends Component {
  
  constructor(props) {
    super(props);
    this.getWidgetsByUrl = this.getWidgetsByUrl.bind(this)
    this.state = { widgets: [{ attributes: { loading: true }}, { attributes: { loading: true }}] };
  }

  getWidgetsByUrl(url) {
    HttpUtils.get(url, this.props.token)
      .then((responseData) => {
        this.setState({ widgets: responseData.data })
      }).catch((err) => {
        this.setState({ widgets: [] })
      }).done() 
  }

  componentDidMount() {
    SessionStore.getLeagueId((leagueId) => {
      this.getWidgetsByUrl('leagues/' +  leagueId.toString() + '/widgets')
    }, () => {
      this.getWidgetsByUrl('widgets')
    })
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
        <WorkoutFeed token={this.props.token} image_url={this.props.image_url} fireChatter={this.props.fireChatter} />
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
