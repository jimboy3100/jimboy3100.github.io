// Unit check of the video skins scheduler (lmVideoSkinRegistry in ogario.v4.js): one play()
// in flight per URL with backoff, URL keys that cannot collide, eviction that leaves nothing
// behind and stops the tick, and one volume owner per shared video element.
// Usage: node developers/tests/videoskins.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '../../ogario/ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const start = src.indexOf('function lmVideoSkinRegistry(');
const end = src.indexOf('\n}\n', start);
if (start < 0 || end < 0) throw new Error('lmVideoSkinRegistry not found in ogario.v4.js');
const code = src.slice(start, end + 3);

let failed = 0;
function check(name, ok) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name);
    if (!ok) failed++;
}
const flush = () => new Promise((r) => setImmediate(r));

function fakeVideo(url) {
    const v = {
        url, paused: true, ended: false, readyState: 0, volume: 0, currentTime: 0, plays: 0, freed: false,
        next: null,
        play() {
            v.plays++;
            return new Promise((res, rej) => { v.next = { res: () => { v.paused = false; res(); }, rej }; });
        },
        pause() { v.paused = true; },
        removeAttribute() { v.freed = true; },
        load() { }
    };
    return v;
}

function setup(o) {
    o = o || {};
    const t = { now: 1000, videos: [], freed: [], cellsCalls: 0, timers: 0, cleared: 0, ready: {} };
    t.top5 = o.top5 || [];
    t.cells = o.cells || [];
    t.own = o.own || { nick: 'me', skinURL: '' };
    t.settings = Object.assign({ music2: true, proportional: false, level: 1 }, o.settings);
    const ctx = vm.createContext({ Map, Set, Math, String });
    vm.runInContext(code, ctx);
    t.reg = vm.runInContext('lmVideoSkinRegistry', ctx)({
        now: () => t.now,
        createVideo: (url, onReady) => { const v = fakeVideo(url); t.videos.push(v); t.ready[url] = onReady; return v; },
        onFree: (url) => t.freed.push(url),
        startTimer: () => { t.timers++; return t.timers; },
        clearTimer: () => { t.cleared++; },
        top5: () => t.top5,
        cells: () => { t.cellsCalls++; return t.cells; },
        own: () => t.own,
        settings: () => t.settings,
        mixVol: (v) => v
    });
    return t;
}
const near = (a, b) => Math.abs(a - b) < 1e-6;

(async function () {
    /* 1. play(): never before the media can play, once while in flight, not again once playing */
    {
        const t = setup();
        for (let i = 0; i < 50; i++) { t.reg.draw('u.mp4', 'p'); t.now += 16; }
        const v = t.videos[0];
        check('one element per URL for 50 frames', t.videos.length === 1);
        check('no play() before readyState 3', v.plays === 0);
        v.readyState = 3;
        for (let i = 0; i < 50; i++) { t.reg.draw('u.mp4', 'p'); t.now += 16; }
        check('readyState 3 (not only 4) starts playback, one play() in flight for 50 frames', v.plays === 1);
        v.next.res(); await flush();
        for (let i = 0; i < 50; i++) { t.reg.draw('u.mp4', 'p'); t.now += 16; }
        check('no play() per frame once playing (currentTime still 0)', v.plays === 1);
        check('isPlaying: !paused and readyState >= 3 even at currentTime 0', t.reg.isPlaying(v) === true);
        v.readyState = 2;
        check('isPlaying false while buffering', t.reg.isPlaying(v) === false);
        v.readyState = 3;
        v.pause();
        t.reg.draw('u.mp4', 'p');
        check('a paused video resumes on the next draw', v.plays === 2);
    }
    /* 2. a refused play() waits with backoff; media readiness or a user gesture cut it short */
    {
        const t = setup();
        t.reg.draw('u.mp4', 'p');
        const v = t.videos[0];
        v.readyState = 4;
        t.reg.draw('u.mp4', 'p');
        v.next.rej(new Error('NotAllowedError')); await flush();
        for (let i = 0; i < 10; i++) { t.now += 16; t.reg.draw('u.mp4', 'p'); }
        check('no retry within the 250 ms backoff', v.plays === 1);
        t.now += 100; t.reg.draw('u.mp4', 'p');
        check('one retry after the backoff', v.plays === 2);
        v.next.rej(new Error('NotAllowedError')); await flush();
        t.now += 300; t.reg.draw('u.mp4', 'p');
        check('second backoff is longer (500 ms)', v.plays === 2);
        t.reg.kick(); t.reg.draw('u.mp4', 'p');
        check('a click/key/touch allows an immediate retry', v.plays === 3);
        v.next.rej(new Error('AbortError')); await flush();
        t.reg.draw('u.mp4', 'p');
        check('still backing off after the gesture retry failed', v.plays === 3);
        t.ready['u.mp4'](); t.reg.draw('u.mp4', 'p');
        check('canplay allows an immediate retry', v.plays === 4);
        check('backoff is capped at 8 s', t.reg.backoff(1) === 250 && t.reg.backoff(30) === 8000);
    }
    /* 3. keys: a "|" in a URL or nick cannot make two players share state */
    {
        const t = setup();
        t.reg.draw('a|b', 'c');
        t.reg.draw('a', 'b|c');
        check('URL "a|b" + nick "c" and URL "a" + nick "b|c" are separate', t.videos.length === 2 &&
            t.reg.state('a|b').nicks.has('c') && !t.reg.state('a|b').nicks.has('b|c') &&
            t.reg.state('a').nicks.has('b|c') && !t.reg.state('a').nicks.has('c'));
    }
    /* 4. eviction: pause after 3 s, free after 60 s with all state, the tick stops when empty */
    {
        const t = setup({ top5: [{ nick: 'p', mass: 5000 }] });
        t.reg.draw('u.mp4', 'p');
        t.reg.draw('w.mp4', 'q');
        const v = t.videos[0];
        v.paused = false; v.readyState = 4;
        check('one tick timer for all videos', t.timers === 1 && t.reg.running());
        t.now += 3500; t.reg.draw('w.mp4', 'q'); t.reg.tick();
        check('a video not drawn for 3 s is paused', v.paused === true);
        t.now += 58000; t.reg.draw('w.mp4', 'q'); t.reg.tick();
        check('a video not drawn for 60 s is freed with its state', v.freed && t.freed.indexOf('u.mp4') >= 0 &&
            t.reg.state('u.mp4') === undefined && t.reg.size() === 1);
        check('nick still in the top 5 does not keep a timer alive for a freed video', t.timers === 1 && t.cleared === 0);
        t.now += 61000; t.reg.tick();
        check('the tick stops when nothing is left', t.reg.size() === 0 && t.cleared === 1 && !t.reg.running());
        t.reg.draw('u.mp4', 'p');
        check('drawing again recreates the element and restarts the tick', t.videos.length === 3 && t.timers === 2 && t.reg.running());
    }
    /* 5. one volume owner: nicks sharing a URL do not fight over element.volume */
    {
        const t = setup({ top5: [{ nick: 'p', mass: 30000 }, { nick: 'q', mass: 30000 }], cells: [{ nick: 'p' }] });
        t.reg.draw('u.mp4', 'p');
        t.reg.draw('u.mp4', 'q');
        const v = t.videos[0];
        for (let i = 0; i < 6; i++) t.reg.tick();
        check('visible top-5 nick keeps full volume although another nick of the URL is out of view', near(v.volume, 1));
        t.top5 = [{ nick: 'q', mass: 30000 }];
        t.cells = [{ nick: 'q' }];
        t.reg.tick();
        check('a nick that left the top 5 does not mute the current one', near(v.volume, 1));
        check('the nick that left the top 5 is dropped', !t.reg.state('u.mp4').nicks.has('p'));
        t.cells = [];
        t.reg.tick();
        check('alone and out of view: fades like before (1 -> 0.88)', near(v.volume, 0.88));
        for (let i = 0; i < 60; i++) t.reg.tick();
        check('fades to 0', v.volume === 0);
        t.top5 = [];
        t.reg.tick();
        check('nobody left in the top 5: silent', v.volume === 0 && t.reg.state('u.mp4').nicks.size === 0);
    }
    /* 6. own nick: own skin URL plays at the level; another nick of the URL cannot lower it */
    {
        const t = setup({ own: { nick: 'me', skinURL: 'u.mp4' }, top5: [{ nick: 'q', mass: 500 }],
            settings: { level: 0.6 } });
        t.reg.draw('u.mp4', 'me');
        t.reg.draw('u.mp4', 'q');
        for (let i = 0; i < 5; i++) t.reg.tick();
        check('own video skin at the sound level', near(t.videos[0].volume, 0.6));
        t.own.skinURL = 'other.mp4';
        t.reg.tick();
        check('own nick with another skin: silent (q is out of view and fades)', t.videos[0].volume < 0.6);
    }
    /* 7. mass-proportional sound, sound of others off */
    {
        const t = setup({ top5: [{ nick: 'p', mass: 240 }], cells: [{ nick: 'p' }], settings: { proportional: true } });
        t.reg.draw('u.mp4', 'p');
        t.reg.tick();
        check('mass 240 -> level * sqrt(100) * 0.01 = 0.1', near(t.videos[0].volume, 0.1));
        t.settings.music2 = false;
        t.reg.tick();
        check('"sound from other\'s video skins" off: silent', t.videos[0].volume === 0);
    }
    /* 8. the visible nicks are collected once per tick, not per URL or per top-5 entry */
    {
        const t = setup({ top5: [{ nick: 'a', mass: 1 }, { nick: 'b', mass: 1 }, { nick: 'c', mass: 1 }],
            cells: [{ nick: 'x' }, { nick: 'y' }] });
        t.reg.draw('1.mp4', 'a'); t.reg.draw('2.mp4', 'b'); t.reg.draw('3.mp4', 'c');
        t.reg.tick();
        check('one cells scan per tick for 3 URLs', t.cellsCalls === 1);
        for (let i = 0; i < 100; i++) t.reg.draw('1.mp4', 'a');
        check('no cells scan in the draw path', t.cellsCalls === 1);
        const t2 = setup({ own: { nick: 'me', skinURL: 'u.mp4' } });
        t2.reg.draw('u.mp4', 'me'); t2.reg.tick();
        check('no cells scan when only the own skin plays', t2.cellsCalls === 0);
    }
    /* 9. own cells (isPlayerCell) do not count as "in view" for the other nick of the same name */
    {
        const t = setup({ top5: [{ nick: 'p', mass: 1 }], cells: [{ nick: 'p', isPlayerCell: true }] });
        t.reg.draw('u.mp4', 'p');
        t.videos[0].volume = 0.5;
        t.reg.tick();
        check('player cells are not counted as visible others', near(t.videos[0].volume, 0.38));
    }
    console.log(failed ? failed + ' FAILED' : 'all video skins checks passed');
    process.exit(failed ? 1 : 0);
})();
