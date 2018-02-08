import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
} from 'react-native';

const MAX_LENGTH = 20

export default class LabelDefiner extends Component {
  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
    this.state = { value: null }
  }

  save() {
    this.props.pickNewLabel(this.state.value)
  }

  componentDidMount() {
    this.refs.value.focus()
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.input}
          ref='value'
          placeholder='Decline Seated Dumbell Raise'
          maxLength={MAX_LENGTH}
          onChangeText={(value) => this.setState({ value })}
        />
        <TouchableHighlight style={styles.saveButton} onPress={this.save} underlayColor='#508CD8'>
          <Text style={styles.saveButtonText}>Add new</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    flexDirection: 'column'
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: '#508CD8',
    borderWidth: 2,
    fontSize: 15,
    margin: 20,
    padding: 10,
    paddingTop: 10,
    height: 40,
    fontFamily: 'Avenir-Light',
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#508CD8',
    padding: 15,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
})