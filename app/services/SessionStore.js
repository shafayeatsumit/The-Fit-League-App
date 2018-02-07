import { AsyncStorage } from 'react-native'
import { AppEventsLogger } from 'react-native-fbsdk'

import { Session } from './Session'
import { HttpUtils } from './HttpUtils'

const SESSION_STORAGE_KEY = 'sessionz'

const saveToStorage = async (newData) => {
  let rawData = await AsyncStorage.getItem(SESSION_STORAGE_KEY)
  let object = rawData ? JSON.parse(rawData) : {}
  Object.keys(newData).forEach((k) => {
    if (newData[k]) object[k] = newData[k]
  })
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(object))
}

const checkStorage = async (presentCallback, nonExistentCallback) => {
  let value = await AsyncStorage.getItem(SESSION_STORAGE_KEY)
  if (value !== null) {
    presentCallback(JSON.parse(value))
  } else {
    if (nonExistentCallback) nonExistentCallback()
  }
}

const cbWithLeagueId = (leagueId, presentCallback, nonExistentCallback) => {
  return () => {
    return leagueId ? presentCallback(leagueId) : nonExistentCallback()
  }
}

const requestLeagues = (token, cb) => {
  return HttpUtils.get('leagues', token).then((responseData) => cb(responseData.data)).done()
}

const fetchLeague = (presentCallback, nonExistentCallback, data) => {
  // If there is a token in the SessionStore, use it
  return () => {
    if (data && data.token) {
      AppEventsLogger.logEvent('Fell back on requestLeagues in SessionStore.js')
      requestLeagues(data.token, (leagues) => {
        let leagueId = leagues[0] && leagues[0].id
        saveToStorage({ token: data.token, leagueId }).then(cbWithLeagueId(leagueId, presentCallback, nonExistentCallback))
      })
    // If there isn't, get one
    } else {
      AppEventsLogger.logEvent('Fell back on legacy Session.js')
      Session.check((token) => {
        requestLeagues(token, (leagues) => {
          let leagueId = leagues[0] && leagues[0].id
          saveToStorage({ token, leagueId }).then(cbWithLeagueId(leagueId, presentCallback, nonExistentCallback))
        })
      })
    }
  }
}

export const SessionStore = {
  key: SESSION_STORAGE_KEY,
  save: async (data, cb) => {
    await saveToStorage(data)
    if (cb) cb()
  },
  get: (presentCallback, nonExistentCallback) => {
    checkStorage(presentCallback, nonExistentCallback)
  },
  getLeagueId: (presentCallback, nonExistentCallback) => {
    checkStorage((data) => {
      return data.leagueId ? presentCallback(data.leagueId) : fetchLeague(presentCallback, nonExistentCallback, data)()
    }, fetchLeague(presentCallback, nonExistentCallback))
  }
}