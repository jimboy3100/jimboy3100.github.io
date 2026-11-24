# LMEvents: hooks for user scripts

Legend Mod can run up to 5 user scripts (Settings, user scripts: a URL or pasted code per slot).
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
| `split` | `{ time, count }` | you split while alive (keys, mouse, phone button, macros). `count` is the number of splits sent at once; macros that send single splits give one event per split, a few ms apart |
| `kill` | `{ time, nick, mass }` | one of your cells ate a cell of another player (not food, ejected mass, viruses or your multibox units); `nick` and `mass` are the eaten cell's. A player with several cells can count more than once |
| `personalBest` | `{ time, mass, msAlive, massRecord, timeRecord }` | a life ended with a new all-time best mass and / or time alive (only while the option "All-time personal bests" is on); sent just before `death` |
| `gameStats` | `{ time, playersEaten, topPosition, highestMass, finalMass, secondsAlive }` | the server's Game Over numbers arrived (servers that send them) |

`time` values are `Date.now()` milliseconds.

## Helpers: `LMEvents.api`

| Call | Returns |
| --- | --- |
| `getMass()` | your current mass (number) |
| `getPosition()` | `{ x, y }` of your cells' centre |
| `isPlaying()` | true while you are alive in a game |
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

## Stream overlay channel

With the option "Stream overlay / second screen" on, ogario/modules/companion.js posts on
`new BroadcastChannel('legendmod-live')` (same origin, same browser only), which companion.html reads:

- `{ v: 1, kind: 'state', t, state }` at most 4 times per second (an unchanged state every 2 s):
  `state` is `{ playing, mass, best, cells, rank, bestRank, alive, kills, nick, skin, country, server, serverType, mode,
  lb: [{ nick, me }], map: { own: { x, y }, team: [{ x, y, nick, color }], ghosts: [{ x, y, r }], trail: [{ x, y }] }, chat? }`.
  Map coordinates are 0..1 across the map. Stream mode, "hide skin URL" and "hide my country" empty the fields they hide;
  `chat` is there only with "Stream overlay: include chat lines".
- `{ v: 1, kind: 'event', t, event }`: `event.type` is `spawn`, `death`, `best`, `kill` or `stats`.
- `{ v: 1, kind: 'bye' }` when the option is turned off or the tab closes.
- A page can post `{ v: 1, kind: 'hello' }` to get a state at once.

Treat everything received as text: nicks and chat come from other players.

User scripts run inside Legend Mod with full access to the page. Only load scripts from people you trust.
