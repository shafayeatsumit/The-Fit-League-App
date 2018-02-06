import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight
} from 'react-native';

import Header from './Header'
import LabelPicker from './LabelPicker'
import LabelDefiner from './LabelDefiner'
import DetailStep from './DetailStep'

export default class NewSpecificExerciseModal extends Component {
  constructor(props) {
    super(props)
    this.defineNewLabel = this.defineNewLabel.bind(this)
    this.pickNewLabel = this.pickNewLabel.bind(this)
    this.save = this.save.bind(this)
    this.hide = this.hide.bind(this)
    this.state = { label: null, definingNewLabel: false }
  }

  pickNewLabel(label) {
    this.setState({ label, definingNewLabel: false })
  }

  defineNewLabel() {
    this.setState({ definingNewLabel: true })
  }

  hide() {
    this.props.hide()
    this.setState({ label: null, definingNewLabel: false })
  }

  save(schemaAttributes) {
    this.props.cb(schemaAttributes)
    this.hide()
  }

  render() {
    const { label, definingNewLabel } = this.state
    const pickingLabel = !(label || definingNewLabel)
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.hide}>
        <View style={styles.background}>
          <View style={styles.container}>
            <Header
              header={label ? label : "Add a specific exercise"}
              subheader={label ? "Enter details:" : (definingNewLabel ? "Name your new exercise:" : "Select an exercise:")}
              hide={this.hide}
            />
            { pickingLabel && 
              <LabelPicker
                pastExercises={this.props.pastExercises}
                pickNewLabel={this.pickNewLabel}
                defineNewLabel={this.defineNewLabel}
              />
            }
            { definingNewLabel && 
              <LabelDefiner pickNewLabel={this.pickNewLabel} />
            }
            { label && 
              <DetailStep
                save={this.save}
                label={label}
                workoutKindId={this.props.workoutKindId}
                schema={this.props.schema}
                token={this.props.token}
              />
            }
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%'
  },
  container: {
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    flex: 1,
    flexDirection: 'column'
  },
  saveButton: {
    backgroundColor: '#508CD8',
    padding: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonText: {
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
})
