import { AsyncStorage } from 'react-native';
import branch from 'react-native-branch'

import { HttpUtils } from './HttpUtils'

const SLUG_STORAGE_KEY = 'league_slug';

const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
}

const checkStorage = async (cb) => {
  let value = await AsyncStorage.getItem(SLUG_STORAGE_KEY);
  cb(value)
}

export const LeagueJoiner = {
  getSlug: (cb) => {
    checkStorage(cb)
  },
  listen: (cb) => {
    branch.subscribe(({ error, params }) => {
      if (!error && !params['+non_branch_link'] && params['+clicked_branch_link']) {
        if (params['~channel'] === 'leagueReferral') {
          cb(params['~campaign'])
        }
      }
    })
  },
  saveSlug: (slug) => {
    saveToStorage(SLUG_STORAGE_KEY, slug)
  },
  call: (slug, token) => {
    return HttpUtils.post('leagues/join', { slug }, token)
  }
}