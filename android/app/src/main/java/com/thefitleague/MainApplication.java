package com.thefitleague;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import io.sentry.RNSentryPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.BV.LinearGradient.LinearGradientPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import java.util.Arrays;
import java.util.List;

// import Branch and RNBranch
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      mCallbackManager = new CallbackManager.Factory().create();
      ReactPackage packages[] = new ReactPackage[]{
        new MainReactPackage(),
            		new RNInstabugReactnativePackage.Builder("YOUR_ANDROID_APPLICATION_TOKEN",MainApplication.this)
							.setInvocationEvent("shake")
							.setPrimaryColor("#1D82DC")
							.setFloatingEdge("left")
							.setFloatingButtonOffsetFromTop(250)
							.build(),
            new RNSentryPackage(MainApplication.this),
            new PickerPackage(),
        new RNSentryPackage(MainApplication.this),
        new FBSDKPackage(mCallbackManager),
        new LinearGradientPackage(),
        new RNBranchPackage(),
        new ReactNativePushNotificationPackage(),
      };
      return Arrays.<ReactPackage>asList(packages);
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    Branch.getAutoInstance(this);
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
  }
}
