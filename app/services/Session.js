import { AsyncStorage } from 'react-native';

const TOKEN_STORAGE_KEY = 'auth_token';

const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
}

const checkStorage = async (key, presentCallback, nonExistentCallback) => {
  let value = await AsyncStorage.getItem(key);
  if (value !== null) {
    presentCallback(value);
  } else {
    if (nonExistentCallback) nonExistentCallback();
  }
}

export const Session = {
  save: (token) => {
    saveToStorage(TOKEN_STORAGE_KEY, token)
  },
  check: (presentCallback, nonExistentCallback) => {
    checkStorage(TOKEN_STORAGE_KEY, presentCallback, nonExistentCallback);
  }
}