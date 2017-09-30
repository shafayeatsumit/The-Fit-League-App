# FanFit App


### Running iOS

    react-native run-ios

### Building iOS

In Xcode: 

 - Bump the version within the General -> Identity tab, 
 - then go Product -> Archive
 - then upload to App Store.

You may have to remove:

      <key>NSAppTransportSecurity</key>
      <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
        <key>NSAllowsArbitraryLoadsInWebContent</key>
        <true/>
        <key>NSAllowsLocalNetworking</key>
        <true/>
      </dict>

from `ios/FanFit/Info.plist`, but be sure to add it back next time you want to build locally and you get a `No bundle url present` error.

### Propagating icons

    yo rn-toolbox:assets --icon icon.png

