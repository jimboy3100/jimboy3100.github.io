# Legend Mod — Mobile Apps

## 🤖 Android (TWA via PWABuilder)

### Steps
1. Go to [pwabuilder.com](https://www.pwabuilder.com/)
2. Enter `https://jimboy3100.github.io/play.html`
3. Click **Package for stores** → **Android**
4. Download the generated project

### Signing
```bash
keytool -genkey -v -keystore legendmod.keystore -alias legendmod -keyalg RSA -keysize 2048 -validity 10000
```

### Get SHA-256 fingerprint (for assetlinks.json)
```bash
keytool -list -v -keystore legendmod.keystore -alias legendmod
```
Copy the SHA-256 fingerprint and paste it into `/.well-known/assetlinks.json`, replacing `REPLACE_WITH_YOUR_KEYSTORE_SHA256_FINGERPRINT`.

### Publish
Upload `.aab` to [Google Play Console](https://play.google.com/console) ($25 one-time).

---

## 🍎 iOS (WKWebView)

### Prerequisites
- Mac with Xcode 15+
- Apple Developer account ($99/year)

### Steps
1. Open Xcode → **File → New → Project → App**
2. Set:
   - Product Name: `LegendMod`
   - Bundle ID: `com.legendmod.expandingland`
   - Interface: **Storyboard**
   - Language: **Swift**
3. Delete the auto-generated `ViewController.swift`
4. Copy files from `apps/ios/LegendMod/` into your Xcode project:
   - `AppDelegate.swift` (replace existing)
   - `GameViewController.swift` (add new)
   - `Info.plist` (replace existing)
5. Add app icon: drag `banners/icon128.png` into **Assets.xcassets → AppIcon**
6. Delete `SceneDelegate.swift` and remove Scene references from Info.plist if present
7. Build and run on a real device or simulator
8. Archive → Upload to App Store Connect

### Key features in the iOS app
- Landscape-only, fullscreen, no status bar
- External links (Discord OAuth) open in Safari
- `window.LM_IOS_APP = true` injected for app-specific logic
- WebSocket and all network requests allowed via ATS exception
