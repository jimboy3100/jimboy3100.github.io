# Legend Mod — Visual Acceptance Test Checklist

> **Purpose**: Verify that all theme/HUD audit changes (T1-T7, D3) render correctly
> across custom themes, rounded/square corners, accessibility scaling, and mobile layouts.

## Prerequisites
- Load a custom dark theme (e.g., non-default `--lm-pc`, `--lm-mc`, `--lm-tc`)
- Load a custom light theme (inverted colors)
- Have at least one teammate in the lobby
- Have Legend Mod profiles configured

---

## 1. HUD Variables (T1)

| # | Check | Theme | Status |
|---|-------|-------|--------|
| 1.1 | Theme > HUD font Bold / regular changes the weight of the leaderboard (`#overlays-hud`) and of the bell and quick bar (`--lm-hud-fw`) | Dark/Light | ☐ |
| 1.2 | Theme > HUD scale grows and shrinks the leaderboard and the HUD parts on body (`--lm-hud-scale`; each sizes its own text from it) | Dark/Light | ☐ |
| 1.3 | Minimap HUD respects `--lm-hud-font` | Dark/Light | ☐ |
| 1.4 | Stats HUD respects `--lm-hud-font` | Dark/Light | ☐ |

## 2. Rounded/Square Corners (T2)

| # | Check | Rounded | Square | Status |
|---|-------|---------|--------|--------|
| 2.1 | Main menu panels use `--lm-radius` | ☐ | ☐ | ☐ |
| 2.2 | Settings tabs use `--lm-radius` top corners | ☐ | ☐ | ☐ |
| 2.3 | Buttons use `--lm-radius-s` | ☐ | ☐ | ☐ |
| 2.4 | Input fields use `--lm-radius-s` | ☐ | ☐ | ☐ |
| 2.5 | Leaderboard HUD uses `--lm-radius * 1.5` | ☐ | ☐ | ☐ |
| 2.6 | Minimap HUD uses `--lm-radius * 1.5` bottom | ☐ | ☐ | ☐ |
| 2.7 | Stats info HUD uses `--lm-radius-s` | ☐ | ☐ | ☐ |
| 2.8 | Notes panel uses `--lm-radius-s` | ☐ | ☐ | ☐ |
| 2.9 | Search log uses `--lm-radius-s` | ☐ | ☐ | ☐ |
| 2.10 | Shop modal cards use `--lm-radius` | ☐ | ☐ | ☐ |
| 2.11 | Replay controls use `--lm-radius-s` | ☐ | ☐ | ☐ |
| 2.12 | Profile picture uses `--lm-radius * 3.2` | ☐ | ☐ | ☐ |
| 2.13 | Color picker dots use `--lm-radius * 5` | ☐ | ☐ | ☐ |
| 2.14 | LM extended UI modals use `--lm-radius` | ☐ | ☐ | ☐ |

## 3. Mobile Theme (T3)

| # | Check | Custom Theme | Status |
|---|-------|-------------|--------|
| 3.1 | Meta `theme-color` reads `--lm-pc` | ☐ | ☐ |
| 3.2 | Ping radial highlight uses `--lm-mc` | ☐ | ☐ |
| 3.3 | Ping radial default background uses `--lm-pc` | ☐ | ☐ |
| 3.4 | Editor overlay uses `color-mix` with `--lm-pc` | ☐ | ☐ |
| 3.5 | Editor buttons text uses `--lm-tc` | ☐ | ☐ |
| 3.6 | Editor input text uses `--lm-tc` | ☐ | ☐ |
| 3.7 | Editor control border uses `--lm-mc` | ☐ | ☐ |
| 3.8 | Editor pixel buttons use `--lm-mc` border | ☐ | ☐ |
| 3.9 | Mobile fonts use `--lm-hud-font` | ☐ | ☐ |

## 4. Popup Consistency (T4)

| # | Check | Theme | Status |
|---|-------|-------|--------|
| 4.1 | Modal container uses `--lm-hud-font` | ☐ | ☐ |
| 4.2 | Modal footer exists with `.lm-modal-footer` class | ☐ | ☐ |
| 4.3 | Modal CSS hook (`_lmEnsureModalCSS`) is callable | ☐ | ☐ |
| 4.4 | Weekly leagues modal has consistent styling | ☐ | ☐ |
| 4.5 | Shop modals use shared CSS | ☐ | ☐ |

## 5. Website Bridge (T5)

| # | Page | Has Bridge `<script>` | Status |
|---|------|----------------------|--------|
| 5.1 | `monitor/index.html` | ☐ | ☐ |
| 5.2 | `monitor/history.html` | ☐ | ☐ |
| 5.3 | `privacy.html` | ☐ | ☐ |
| 5.4 | `terms.html` | ☐ | ☐ |
| 5.5 | `LMexpress/olddeals.html` | ☐ | ☐ |

## 6. Theme Handoff for Links (T6)

| # | Check | Status |
|---|-------|--------|
| 6.1 | All `lmThemeUrl()` links open with theme params | ☐ |
| 6.2 | Monitor link preserves theme | ☐ |
| 6.3 | Old deals link preserves theme | ☐ |
| 6.4 | External links (Discord, Twitter, etc.) open normally | ☐ |

## 7. Bridge Security (T7)

| # | Check | Status |
|---|-------|--------|
| 7.1 | A background image with user:pass@ or a non-https address is refused; its fragment and any query part other than size / version ones are dropped and the image kept (`image()` in lm-theme-bridge.js) | ☐ |
| 7.2 | Bridge only accepts the exact https origins www.legendmod.ml, legendmod.ml and jimboy3100.github.io (agar.io too as the game page) | ☐ |
| 7.3 | Invalid CSS property names are rejected | ☐ |

## 8. WebGL Hybrid Renderer (D3)

| # | Check | WebGL ON | WebGL OFF | Status |
|---|-------|----------|-----------|--------|
| 8.1 | Special effects (hats/crowns) visible on cells | ☐ | ☐ | ☐ |
| 8.2 | Chat bubbles visible above cells | ☐ | ☐ | ☐ |
| 8.3 | Merge progress rings visible on own cells | ☐ | ☐ | ☐ |
| 8.3b | Merge timer visible above cells | ☐ | ☐ | ☐ |
| 8.4 | Teammate indicators visible above cells | ☐ | ☐ | ☐ |
| 8.5 | FB skin arrow on overlay canvas (GL) | ☐ | ☐ | ☐ |
| 8.6 | Rings/contours still work (Canvas2D fallback) | ☐ | ☐ | ☐ |
| 8.7 | Cell selection ring visible | ☐ | ☐ | ☐ |

## 9. Accessibility (Settings Audit)

| # | Check | Status |
|---|-------|--------|
| 9.1 | Text scaling affects leaderboard | ☐ |
| 9.2 | Text scaling affects stats HUD | ☐ |
| 9.3 | Text scaling affects target HUD | ☐ |
| 9.4 | Text scaling affects time HUD | ☐ |
| 9.5 | Mobile layout profiles selector works | ☐ |

---

## How to Test

### Quick Smoke Test
1. Open `play.html` in Chrome
2. Toggle "Rounded Corners" button — verify all panels change
3. Apply a custom theme — verify all HUD elements update
4. Enable WebGL renderer — verify cell effects are visible
5. Open each modal — verify consistent styling

### Full Matrix
Run each section above with:
- Default theme + Rounded corners
- Default theme + Square corners  
- Custom dark theme + Rounded corners
- Custom light theme + Square corners
- Mobile viewport (responsive layout)
- With accessibility text scaling at 150%

### Automated Checks
```bash
# Syntax validation
node --check ogario/ogario.v4.js
node --check LMexpress/LMexpress.js
node --check LMexpress/lm_extended_ui.js
node --check LMmobile/LMmobile.js
node --check LMmobile/LMmobile-editor.js

# Practice mode tests (headless)
node developers/tests/run.js --only practice --secs 12
```
