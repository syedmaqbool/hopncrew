import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
<<<<<<< HEAD

=======
import GoogleMaps
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
<<<<<<< HEAD
=======

    if let apiKey = Bundle.main.object(forInfoDictionaryKey: "GMSApiKey") as? String,
     !apiKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
    GMSServices.provideAPIKey(apiKey)
  } else {
    fatalError("GMSApiKey missing/empty in Info.plist")
  }
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "MyApp",
      in: window,
      launchOptions: launchOptions
    )
<<<<<<< HEAD

=======
  
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
