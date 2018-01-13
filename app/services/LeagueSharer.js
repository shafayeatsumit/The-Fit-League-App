import { Clipboard, Share } from 'react-native'

export const LeagueSharer = {
  call: (url, leagueName) => {
    Clipboard.setString(url)
    Share.share({
      message: 'Come join ' + leagueName + ' and compete to get in shape!',
      url: url,
      title: leagueName
    }, {
      // Android only:
      dialogTitle: 'Share your League'
    })
  }
}