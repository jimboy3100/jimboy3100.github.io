import UIKit
import WebKit

class GameViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {

    private var webView: WKWebView!
    private let gameURL = "https://jimboy3100.github.io/play.html"

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0, green: 0x24/255, blue: 0x3e/255, alpha: 1) // #00243e

        setupWebView()
        loadGame()
    }

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }

    // MARK: - WebView Setup

    private func setupWebView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        // Allow WebSocket connections
        config.preferences.javaScriptCanOpenWindowsAutomatically = true

        // User agent: identify as mobile app
        config.applicationNameForUserAgent = "LegendMod-iOS/1.0"

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.isOpaque = false
        webView.backgroundColor = view.backgroundColor

        // Disable long-press context menu on game canvas
        webView.allowsLinkPreview = false

        view.addSubview(webView)
    }

    private func loadGame() {
        guard let url = URL(string: gameURL) else { return }
        webView.load(URLRequest(url: url))
    }

    // MARK: - WKNavigationDelegate

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Inject JS to signal we're running as an iOS app
        webView.evaluateJavaScript("window.LM_IOS_APP = true;", completionHandler: nil)
    }

    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Open external links (Discord OAuth, etc.) in Safari
        if let url = navigationAction.request.url,
           navigationAction.navigationType == .linkActivated,
           url.host != nil,
           !url.absoluteString.contains("jimboy3100.github.io") &&
           !url.absoluteString.contains("expanding.land") &&
           !url.absoluteString.contains("legendmod.ml") {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    // MARK: - WKUIDelegate (handle window.open for Discord OAuth popup)

    func webView(_ webView: WKWebView,
                 createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction,
                 windowFeatures: WKWindowFeatures) -> WKWebView? {
        // Open popups (Discord auth) in Safari
        if let url = navigationAction.request.url {
            UIApplication.shared.open(url)
        }
        return nil
    }
}
