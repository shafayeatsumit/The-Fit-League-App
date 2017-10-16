import { AlertIOS } from 'react-native';

import { Actions } from 'react-native-router-flux';

import { HttpUtils } from './HttpUtils'

export const Workout = {
  save: (workout, token, thisWeek, requestFinished) => {
    return HttpUtils.post('workouts', workout, token).then((responseData) => {
      let { attributes } = responseData.data
      let contribution = {}
      Object.keys(attributes.summary).forEach((k) => {
        contribution[k] = attributes.summary[k] - thisWeek[k]
      })
      let occurredAt = new Date(attributes.occurred_at)
      let rightNow = new Date()
      Actions.newWorkoutSuccess({
        contribution, token,
        workoutInTheFuture: (occurredAt > rightNow),
        successMessage: attributes.success_message,
        wellDoneMessage: attributes.well_done_message
      });
    }).catch((error) => {
      requestFinished()
      AlertIOS.alert("Sorry! failed to add Workout.", error.message)
    }).done();
  }
}