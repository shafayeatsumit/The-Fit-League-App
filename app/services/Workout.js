import { AlertIOS } from 'react-native';

import { Actions } from 'react-native-router-flux';

import { HttpUtils } from './HttpUtils'

export const Workout = {
  save: (workout, token, thisWeek, requestFinished) => {
    if (workout.id) {
      return HttpUtils.put('workouts/' + workout.id.toString(), workout, token)
        .then(() => Actions.editWorkoutSuccess({ token })).catch((error) => {
          requestFinished()
          AlertIOS.alert("Sorry! failed to update Workout.", error.message)
        }).done()
    } else {
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
          successMessage: attributes.success_message
        });
      }).catch((error) => {
        requestFinished()
        AlertIOS.alert("Sorry! failed to add Workout.", error.message)
      }).done()
    }
  }
}