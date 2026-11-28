# LMEvents: hooks for user scripts

Legend Mod can run up to 5 user scripts (User Scripts panel: a URL or pasted code per slot); a user
script with a plugin header (see Plugins below) is also a plugin.
`window.LMEvents` lets those scripts react to the game without patching Legend Mod itself.
It exists before any user script runs.

```js
LMEvents.on('death', function (e) {
    LMEvents.api.toast('You reached ' + e.mass + ' mass in ' + Math.round(e.msAlive / 1000) + ' s');
});
```

## Listeners

| Call | What it does |
| --- | --- |
| `LMEvents.on(name, fn)` | call `fn(data)` on every `name` event |
| `LMEvents.off(name, fn)` | remove `fn` (also one added with `once`) |
| `LMEvents.once(name, fn)` | call `fn` on the next `name` event only |

All three return `LMEvents`, so calls can be chained.

- `data` is a plain, frozen object: changing it has no effect on the game or on other listeners.
- A listener that throws is skipped for that event; the error is logged once (`[LMEvents]` in the console)
  and the game and the other listeners carry on.
- Events cost nothing while nobody listens to them. Remove listeners you no longer need with `off`.

## Events

| Event | Data | When |
| --- | --- | --- |
| `spawn` | `{ time }` | you spawn (once per life) |
| `death` | `{ time, mass, msAlive }` | you die; `mass` is the best mass of that life, `msAlive` its length in ms |
| `chat` | `{ nick, text, type, own }` | a chat line is shown; `type` is `'chat'` or `'command'`, `own` is true for your own lines. `text` is the raw text (not HTML): escape it before putting it into the page. Lines hidden by the chat word filter are not sent |
| `serverChange` | `{ host }` | you join another server; `host` is the host name only (no tokens) |
| `massUpdate` | `{ mass, cells }` | while playing, at most 4 times per second |
| `leaderboard` | `{ position, entries: [{ nick, pos }] }` | the leaderboard updates; `position` is your place (0 = not listed) |
| `split` | `{ time, count, before }` | you split while alive (keys, mouse, phone button, macros). `count` is the number of splits sent at once; macros that send single splits give one event per split, a few ms apart. `before` is your cell count when the split was sent (the server adds the new cells a moment later; a split at 16 cells adds none) |
| `kill` | `{ time, nick, mass }` | one of your cells ate a cell of another player (not food, ejected mass, viruses or your multibox units); `nick` and `mass` are the eaten cell's. A player with several cells can count more than once |
| `personalBest` | `{ time, mass, msAlive, massRecord, timeRecord }` | a life ended with a new all-time best mass and / or time alive (always kept, there is no option for it); sent just before `death` |
| `gameStats` | `{ time, playersEaten, topPosition, highestMass, finalMass, secondsAlive }` | the server's Game Over numbers arrived (servers that send them) |
| `merge` | `{ merged, cells }` | your own cells merged: `merged` is how many of your cells were eaten by another of yours since the last report (usually 1), `cells` your cell count after it. Servers that use the agar.io cell update (agar.io, Expanding Land, most private servers) |
| `gameModeChange` | `{ mode, previous }` | the game mode changes, e.g. `'ffa'`, `'teams'`, `'party'`, `'experimental'`, `'battleroyale'` (no leading `:`). Not sent for the mode that is set when you start listening |
| `multiboxSwap` | `{ unit, previous }` | the multibox unit you control changes, whatever changed it: the swap / back hotkeys, adding a unit, a unit taking the focus when it spawns, the unit you control dying (the focus goes back to the main player or to the next living unit), the switch after your main player died, a unit's connection closing, a reconnect or a server change. One event per change, none when the unit stays the same; `0` is the main player, other numbers are the unit numbers |
| `replayStart` | `{ packets, start }` | a recorded replay starts playing: its packet count and the start packet. Seeking, stepping, pausing, playing backwards and reaching the end send no new event |
| `replayStop` | `{ reason }` | the replay is left: `'left'` (you joined a live server, also with Back to game) or `'stopped'` (another recording is played, or the replay connection ended some other way). Closing Replay Studio keeps the stopped replay on screen, so it ends only when you join a server. Between `replayStart` and `replayStop` every event has `context` `'replay'` |
| `settingsChange` | `{ key, value }` | a gameplay setting changed and is in effect (also when the browser storage is full and it could not be saved: Legend Mod tells the player), whatever changed it: a switch, a slider, a text box or list in the settings menu, `application.setSettings`, a hotkey that toggles an option, a preset, a settings profile or the gamepad window; `key` is the setting name (e.g. `'showGrid'`), `value` the new boolean, number or text (text longer than 500 characters comes as its first 500). One event per changed setting; when a listener changes a setting again, the last event of that setting carries its current value. None when the value stays the same; a slider is reported once it rests or is released, not for every step. Theme settings are not reported |

`time` values are `Date.now()` milliseconds.

Every event's data also has `context`: `'live'` (a real game), `'practice'` (the practice arena) or
`'replay'` (a recorded replay playing). Scripts that keep stats of your games should skip the
events whose `context` is not `'live'`.

## Helpers: `LMEvents.api`

| Call | Returns |
| --- | --- |
| `getMass()` | your current mass (number) |
| `getPosition()` | `{ x, y }` of your cells' centre |
| `isPlaying()` | true while you are alive in a game |
| `getContext()` | `'live'`, `'practice'` or `'replay'`, as the events' `context` |
| `getServerType()` | e.g. `'agario'`, `'expandingland'`, `'private'` (empty before the first connection) |
| `sendChat(text)` | sends a chat line the same way the chat box does, with the same rate limits (and at most one per second from scripts). Returns false when it was not sent (not connected, too soon, empty text) |
| `toast(text)` | shows a small notification; `text` is shown as plain text |

## Examples

Show a notice when you reach the top of the leaderboard:

```js
var wasFirst = false;
LMEvents.on('leaderboard', function (e) {
    if (e.position === 1 && !wasFirst) LMEvents.api.toast('You are number 1!');
    wasFirst = e.position === 1;
});
```

Log the chat to the console:

```js
LMEvents.on('chat', function (e) {
    console.log((e.type === 'command' ? '[cmd] ' : '') + e.nick + ': ' + e.text);
});
```

Warn once when your mass passes 10000:

```js
function bigMass(e) {
    if (e.mass < 10000) return;
    LMEvents.api.toast('10k mass!');
    LMEvents.off('massUpdate', bigMass);
}
LMEvents.on('massUpdate', bigMass);
LMEvents.on('spawn', function () { LMEvents.off('massUpdate', bigMass); LMEvents.on('massUpdate', bigMass); });
```

Count your splits in each life:

```js
var splits = 0;
LMEvents.on('split', function (e) { if (e.before < 16) splits += e.count; });
LMEvents.on('death', function () { LMEvents.api.toast(splits + ' splits'); splits = 0; });
```

## Plugins

Plugins live in the User Scripts panel (its "User Scripts" button). Its "Plugins" view lists the 5 slots with their header, whether each runs at start,
compatibility and settings; its "Catalogue" view installs example plugins into a free slot.
A plugin is an ordinary user script that starts with a header:

```js
// ==LMPlugin==
// @id          my-plugin
// @name        My plugin
// @version     1.0.0
// @description What it does, in one sentence
// @author      Your name
// @minVersion  3.568
// @maxVersion  4
// @permissions reads chat, shows messages
// ==/LMPlugin==
```

- `@name` is required; `@id` (a-z, 0-9, `.`, `_`, `-`) defaults to the name in lower case; it names the
  plugin's saved settings.
- `@minVersion` / `@maxVersion` are Legend Mod versions (`window.OgVer`, e.g. `3.568`); outside them
  the plugin does not start and the panel says why.
- `@permissions` (comma separated) is shown to the player before the plugin runs for the first time
  (Load button, a URL typed in, the switch in the Plugins view, Install):
  `reads game state` (`game.read`), `reads chat` (`chat.read`), `sends chat` (`chat.send`),
  `changes settings` (`settings`), `network` (`network`), `shows messages` (`ui`),
  `stores data` (`storage`), `presses keys` (`controls`). Other words are shown as unknown permissions.
- Fields can also be written `name: value`. Unknown fields are ignored; every value is shown as plain text.
- A script without a header runs as before. A URL from another site than Legend Mod is confirmed
  before it runs the first time, with or without a header.

Permissions are a declaration for the player, not a sandbox: a plugin runs with full access to the page,
like a user script. Declare what your plugin really does.

At its top level a plugin can call `LMPlugins.ready(options)`:

| Option | What it does |
| --- | --- |
| `settings: [{ key, type, label, default, min, max }]` | settings the panel shows for it (`type`: `'text'`, `'number'` or `'checkbox'`, at most 20) |
| `onSettingsChange(values)` | called after the player saved them |
| `onDisable()` / `onEnable()` | called when the player turns it off / on again without a reload: remove / add your listeners there |

`ready()` returns `{ id, get(key), values() }` to read the saved settings (the defaults when it runs
outside a slot). Without `onDisable` a plugin that is turned off keeps running until the page
is reloaded.

User scripts and plugins run inside Legend Mod with full access to the page. Only load scripts from people you trust.
