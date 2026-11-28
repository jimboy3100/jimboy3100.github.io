# lib/: shared libraries

One copy of each library for every Legend page. A page that needs a library loads it from here with an
absolute address (`https://www.legendmod.ml/lib/...`), so the game, the site pages and the old game page
share one file (and one browser cache entry). Before adding a copy somewhere else, use the one here; before
removing one, search every page, script, test and the other repositories (expandingland, legendworld-help,
LegendWorld, deltav4) and record the removal in `developers/audit/manifest.json`.

| Library | File | Version | Loaded by |
| --- | --- | --- | --- |
| jQuery | `jquery-3.7.1.min.js` | 3.7.1 | play.html, LMexpress/LMexpress.html, index.html, skins/index.html, themes/index.html, Lc/Lc.html, Lc/PROJETOX.HTML/original/lc.html |
| jQuery UI | `jquery-ui-1.13.3-draggable.js` | 1.13.3, Draggable only | play.html, LMexpress/LMexpress.html (Legend Mod uses only `.draggable()`) |
| Bootstrap (JS) | `bootstrap-3.4.1.min.js` | 3.4.1 | play.html, LMexpress/LMexpress.html, themes/index.html, the library guard in ogario/ogario.v4.js |
| Bootstrap Colorpicker | `bootstrap-colorpicker.min.js` / `.css` | 2.3.3 | play.html, LMexpress/LMexpress.html, library guard |
| perfect-scrollbar | `perfect-scrollbar.jquery.min.js` / `.min.css` | 0.6.12 | play.html, LMexpress/LMexpress.html, library guard |
| rangeslider.js | `rangeslider.min.js` / `rangeslider.css` | 2.2.1 | play.html, LMexpress/LMexpress.html, library guard |
| Switchery | `switchery.min.js` / `.css` | | play.html, LMexpress/LMexpress.html |
| toastr | `toastr.min.js` / `.css` | 2.1.2 | play.html, LMexpress/LMexpress.html |
| protobuf.js | `protobuf.min.js` | 6.8.8 | play.html, LMexpress/LMexpress.html |
| GSAP TweenMax | `TweenMax.min.js` | 1.20.2 | play.html, LMexpress/LMexpress.html (HUD tilt effect) |
| context-menu | `context-menu.min.js` / `.css` | | play.html, LMexpress/LMexpress.html |
| YouTube iframe API | `Youtubeiframe_api.js` | | play.html, LMexpress/LMexpress.html |
| Legend language packs | `lm-i18n.js` | generated | the site pages, expanding.land, help.expanding.land |
| Legend theme bridge | `lm-theme-bridge.js` | own code | the site pages, expanding.land, help.expanding.land |

Libraries that belong to one page stay next to it: `skins/jquery.lazyload.min.js` (Lazy Load 1.9.7: the
home page, the skins gallery, the clan pages and the shop window), and the themes page's own plugins in
`themes/` (easing 1.3, Waypoints, countTo, Magnific Popup, Modernizr, Respond).

## Why an older version is still here

- Lazy Load 1.9.7 has no newer jQuery-plugin release; it works with jQuery 3.7.1 (its `.bind()` and
  `jQuery.expr[':']` calls are deprecated in jQuery 3 but still supported).

## Removed

The old jQuery 1.11.1 copy of the site pages, the jQuery 3.2.1 copy `jquery.min.js` (the game page's address until
3.561, named last by the retired service worker's precache list), Bootstrap 3.3.7, the full jQuery UI 1.12.1 build and the
unused renderer libraries (PixiJS 3.0.10 with its canvas helper, litegl, Canvas2DtoWebGL and gl-matrix) are
removed; `developers/audit/manifest.json` says where each one went and why it was safe. None of the current
renderers (Canvas 2D, Legend Mod's own WebGL / WebGL2 batches) used them, and no page, script or other
repository loaded them.
