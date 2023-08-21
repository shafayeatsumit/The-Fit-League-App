# TheFitLeague App 🏋️‍♂️🏀🚴‍♀️🧘‍♂️🏋️‍♀️

TFL applies the format of fantasy sports to personal exercise. Form a league with your friends and compete over a 10-week season. Each week you are paired with a new partner and match up against another duo. All types of exercise are valid (basketball, spin, weightlifting, yoga, Crossfit, etc). It’s free to play. 💪👫🏆

⚠️ The app is no longer on the App Store. We made the decision to discontinue it in mid-2020. Regrettably, both user numbers and our interactions with potential investors have been unsatisfactory. 😔


### Running iOS 📱

    react-native run-ios

If you have trouble running, make sure that the Facebook iOS SDK is installed and linked. Ensure that the downloaded SDK matches: `TheFitLeague > Build Settings > Framework Search Paths`. 🤖❌

### Building iOS 🛠️

In Xcode: 

- Bump the version within the General -> Identity tab, 
- then go Product -> Archive
- then upload to the App Store. 📦🚀

You may have to remove:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
  <key>NSAllowsArbitraryLoadsInWebContent</key>
  <true/>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

from `ios/TheFitLeague/Info.plist`, but be sure to add it back next time you want to build locally and you get a `No bundle URL present` error. ⚠️📝

### Running Android 📱

    react-native run-android

If you get an error about no connected devices, and `adb devices` returns nothing, you'll need either:

**An Emulator** 📱 Open up Android Studio, go Tools -> Android -> AVD Manager and pick a device you want to install. Click the Play icon on the device to start it.

**A Device** 📲 Simply plug the device in and turn it on. If `adb devices` returns unauthorized, go into the phone's settings and toggle USB Debugging on and off.

### Building Android 🛠️

Some instructions here: https://facebook.github.io/react-native/docs/signed-apk-android.html

```bash
./clean-before-build.sh
npm install
cd android && ./gradlew assembleRelease
cd .. && react-native run-android --variant=release
```

If you have trouble building, go into Android Studio and look for build errors. They may take you to a `build.gradle` file. Make sure that those build files have values that match the `compileSdkVersion`, `buildToolsVersion`, and `targetSdkVersion` of the main build file: `build.gradle (Module: app)`

`buildToolsVersion` 26.0.1 (paired with `compileSdkVersion` 26) often fixes issues. You may have to apply it to `node_modules/react-native-fbsdk/android/build.gradle` as well.

If you get an error like

```bash
com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: Failed to finalize session : INSTALL_FAILED_DUPLICATE_PERMISSION: Package com.thefitleague attempting to redeclare permission com.thefitleague.permission.C2D_MESSAGE already owned by com.thefitleague
```

You may have to uninstall the app from your phone and try again.

Before deploying to the store, bump the version code in `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.thefitleague"
    android:versionCode="2"
    android:versionName="1.1">
```

and bump `versionCode` and `versionName` in the `build.gradle`

Build with `react-native run-android --variant=release`

Once you have built, upload `android/app/build/outputs/apk/app-release.apk` to the app store! 📦🚀

### Propagating icons 🖼️

    yo rn-toolbox:assets --icon icon.png
