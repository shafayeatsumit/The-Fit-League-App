import { Clipboard, Share } from 'react-native'

import { AppEventsLogger } from 'react-native-fbsdk'

export const LeagueSharer = {
  call: (url, leagueName, currentView) => {
    Clipboard.setString(url)
    Share.share({
      message: 'Join my league on TFL!',
      url: url,
      title: leagueName
    }, {
      // Android only:
      dialogTitle: 'Share your League'
    })
    AppEventsLogger.logEvent('Copied League Link from ' + currentView)
  }
}