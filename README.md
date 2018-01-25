# TheFitLeague App


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

from `ios/TheFitLeague/Info.plist`, but be sure to add it back next time you want to build locally and you get a `No bundle url present` error.

### Running Android

    react-native run-android

If you get an error about no connected devices, and `adb devices` returns nothing, you'll need either:

**An Emulator** Open up Android Studio, go Tools -> Android -> AVD Manager and pick a device you want to install. Click the Play icon on the device to start it.

**A Device** Simply plug the device in and turn it on. If `adb devices` returns unauthorized, go into the phone's settings and toggle USB Debugging on and off.

### Building Android

Some instructions here: https://facebook.github.io/react-native/docs/signed-apk-android.html

    ./clean-before-build.sh
    cd android && ./gradlew assembleRelease
    cd .. && react-native run-android --variant=release

If you have trouble building, go into Android Studio and look for build errors. They may take you to a `build.gradle` file. Make sure that those build files have values that match the `compileSdkVersion` `buildToolsVersion` and `targetSdkVersion` of the main build file: `build.gradle (Module: app)`

If you get an error like

    com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: Failed to finalize session : INSTALL_FAILED_DUPLICATE_PERMISSION: Package com.thefitleague attempting to redeclare permission com.thefitleague.permission.C2D_MESSAGE already owned by com.thefitleague

You may have to uninstall the app from your phone and try again.

Once you have built, upload `android/app/build/outputs/apk/app-release.apk` to the app store!

### Propagating icons

    yo rn-toolbox:assets --icon icon.png

