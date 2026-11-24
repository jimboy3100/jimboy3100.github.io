/* Practice arena for Legend Mod: offline drills against bots, with personal bests and a ghost
 * of your best run. No server is involved: ogario/modules/practice-sim.js (window.LMPracticeSim)
 * runs the world in this page.
 *
 * How it plugs into the client: starting a session leaves the current server the way a replay
 * does (closeConnection + flushCellsData), then puts a stand-in socket on window.legendmod. The
 * simulation's world is encoded as MultiOgar private-server packets and fed to
 * legendmod.handleMessage, so the normal parser, renderer and HUD show it. Everything the
 * client sends goes to the stand-in socket's send(): mouse (16), split (17, macros 26-28),
 * feed (21) and spawn (0) are decoded into input, so keyboard, mouse, touch controls and
 * gamepad all work unchanged. Nothing is sent to any server; recording replays, team
 * positions, personal bests and match history are skipped while a session runs (see the
 * LMPractice.on checks in ogario.v4.js and analytics.js).
 *
 * Loaded the first time it is opened (window.lmPractice in ogario.v4.js). Settings and personal
 * bests stay in this browser (localStorage 'lmPracticeCfg' / 'lmPracticeStore', validated). */
(function () {
    'use strict';
    if (window._lmPracticeLoaded) return;
    window._lmPracticeLoaded = true;
    var S = window.LMPracticeSim;
    if (!S) return;

    var PRACTICE_WS = 'lm-practice://local';
    var KEY_CFG = 'lmPracticeCfg', KEY_STORE = 'lmPracticeStore';

    /* ------------------------------------------------------------------ */
    /* Text                                                                */
    /* ------------------------------------------------------------------ */
    var GR = false;
    try { GR = localStorage.getItem('languagemod') === '2'; } catch (e) { }
    var TXT = {
        title: ['Practice arena', 'Αρένα εξάσκησης'],
        close: ['Close', 'Κλείσιμο'],
        exercise: ['Exercise', 'Άσκηση'],
        start: ['Start', 'Έναρξη'],
        restart: ['Restart', 'Από την αρχή'],
        stop: ['Stop', 'Διακοπή'],
        backGame: ['Back to game', 'Πίσω στο παιχνίδι'],
        settings: ['Settings', 'Ρυθμίσεις'],
        defaults: ['Defaults', 'Προεπιλογές'],
        randomSeed: ['New seed', 'Νέος σπόρος'],
        results: ['Results', 'Αποτελέσματα'],
        best: ['Personal best', 'Προσωπικό ρεκόρ'],
        newBest: ['New personal best!', 'Νέο προσωπικό ρεκόρ!'],
        score: ['Score', 'Σκορ'],
        noBest: ['No run yet with these settings.', 'Καμία προσπάθεια ακόμα με αυτές τις ρυθμίσεις.'],
        recent: ['Recent runs', 'Πρόσφατες προσπάθειες'],
        ghost: ['Ghost of the personal best', 'Φάντασμα του ρεκόρ'],
        paused: ['Paused', 'Παύση'],
        finished: ['Finished', 'Τέλος'],
        running: ['Running', 'Σε εξέλιξη'],
        leave: ['Starting leaves the server you are playing on. Press Start again to practise.', 'Η έναρξη σε βγάζει από τον διακομιστή όπου παίζεις. Πάτησε ξανά Έναρξη.'],
        offline: ['Runs only in this browser: nothing is sent to a server. Keyboard, mouse, touch controls and gamepad work as in a game. The arena pauses while this window is open.', 'Τρέχει μόνο σε αυτόν τον browser: τίποτα δεν στέλνεται σε διακομιστή. Πληκτρολόγιο, ποντίκι, κουμπιά αφής και gamepad δουλεύουν όπως στο παιχνίδι. Η αρένα σταματά όσο είναι ανοιχτό αυτό το παράθυρο.'],
        failed: ['Practice stopped: the game could not read the practice world.', 'Η εξάσκηση σταμάτησε: το παιχνίδι δεν μπόρεσε να διαβάσει τον κόσμο της εξάσκησης.'],
        ok: ['Passed', 'Επιτυχία'],
        notOk: ['Not passed', 'Αποτυχία'],
        eaten: ['You were eaten', 'Σε έφαγαν'],
        later: ['later', 'αργότερα'],
        seed: ['Seed', 'Σπόρος'],
        startMass: ['Your mass', 'Η μάζα σου'],
        oppMass: ['Opponent mass', 'Μάζα αντιπάλων'],
        bots: ['Bots', 'Bots'],
        difficulty: ['Difficulty', 'Δυσκολία'],
        viruses: ['Viruses', 'Ιοί'],
        mapSize: ['Map size', 'Μέγεθος χάρτη'],
        latency: ['Latency (ms)', 'Καθυστέρηση (ms)'],
        duration: ['Time (s)', 'Χρόνος (s)'],
        mergeSecs: ['Merge time (s)', 'Χρόνος ένωσης (s)'],
        rounds: ['Rounds', 'Γύροι'],
        splitMode: ['Split', 'Διαίρεση'],
        lv1: ['Easy', 'Εύκολο'], lv2: ['Normal', 'Κανονικό'], lv3: ['Hard', 'Δύσκολο'], lv4: ['Expert', 'Ειδικός'],
        vd0: ['None', 'Κανένας'], vd1: ['Few', 'Λίγοι'], vd2: ['Normal', 'Κανονικά'], vd3: ['Many', 'Πολλοί'], vd4: ['Dense', 'Πυκνά'],
        sm_single: ['Single split', 'Μονή διαίρεση'], sm_double: ['Double split', 'Διπλή διαίρεση'], sm_pop: ['Popsplit', 'Popsplit'], sm_trick: ['Tricksplit (16)', 'Tricksplit (16)'],
        ex_free: ['Free play', 'Ελεύθερο παιχνίδι'],
        ex_split: ['Split drill', 'Άσκηση διαίρεσης'],
        ex_virus: ['Virus shooting', 'Ρίψη ιών'],
        ex_dodge: ['Virus avoidance', 'Αποφυγή ιών'],
        ex_path: ['Precise movement', 'Ακριβής κίνηση'],
        ex_escape: ['Escape', 'Διαφυγή'],
        ex_feed: ['Feeding', 'Τάισμα'],
        ex_merge: ['Merging', 'Ένωση'],
        ex_multibox: ['Multibox coordination', 'Συντονισμός multibox'],
        d_free: ['Bots, food and viruses. Grow as big as you can until the time runs out; kills count too.', 'Bots, τροφή και ιοί. Μεγάλωσε όσο μπορείς μέχρι να τελειώσει ο χρόνος· μετράνε και τα φαγωμένα.'],
        d_split: ['A target appears at the range of the chosen split. Split onto it: scored on hits, speed and using the right number of splits (popsplit: second split 80-240 ms after the first). From Normal on, the target runs when you walk at it.', 'Ένας στόχος εμφανίζεται στην απόσταση της διαίρεσης που διάλεξες. Χτύπησέ τον με διαίρεση: μετράνε οι επιτυχίες, η ταχύτητα και ο σωστός αριθμός διαιρέσεων (popsplit: δεύτερη διαίρεση 80-240 ms μετά την πρώτη). Από το Κανονικό, ο στόχος φεύγει αν πας προς αυτόν.'],
        d_virus: ['Feed the virus 7 times so the new virus flies into the target behind it and pops it. Do not touch the virus yourself. Harder levels put the target off the line.', 'Τάισε τον ιό 7 φορές ώστε ο νέος ιός να χτυπήσει τον στόχο πίσω του. Μην αγγίξεις τον ιό. Στα δυσκολότερα επίπεδα ο στόχος δεν είναι στην ευθεία.'],
        d_dodge: ['Reach the 6 goals in order through a virus field. Every pop costs points.', 'Φτάσε τους 6 στόχους με τη σειρά μέσα από ιούς. Κάθε σκάσιμο κοστίζει πόντους.'],
        d_path: ['Eat the line of gold pellets: faster and closer to the line is better.', 'Φάε τη γραμμή με τα χρυσά σφαιρίδια: όσο πιο γρήγορα και πιο κοντά στη γραμμή, τόσο καλύτερα.'],
        d_escape: ['Bigger hunters chase you. Survive until the time runs out.', 'Μεγαλύτεροι κυνηγοί σε κυνηγούν. Επίζησε μέχρι να τελειώσει ο χρόνος.'],
        d_feed: ['Feed your teammate (green, it cannot be eaten): mass delivered and accuracy count. From Normal on it moves.', 'Τάισε τον συμπαίκτη σου (πράσινος, δεν τρώγεται): μετράνε η μάζα που έφτασε και η ευστοχία. Από το Κανονικό και πάνω μετακινείται.'],
        d_merge: ['You start in 8 pieces. Become one cell as soon as the merge timer allows.', 'Ξεκινάς σε 8 κομμάτια. Γίνε ένα κύτταρο μόλις το επιτρέψει ο χρόνος ένωσης.'],
        d_multibox: ['Two local players need a second simulated connection: planned for later.', 'Δύο τοπικοί παίκτες χρειάζονται δεύτερη προσομοιωμένη σύνδεση: θα έρθει αργότερα.'],
        r_peak: ['Peak mass', 'Μέγιστη μάζα'], r_kills: ['Kills', 'Φαγωμένοι'], r_mass: ['Mass', 'Μάζα'], r_time: ['Time', 'Χρόνος'],
        r_survived: ['Survived', 'Επιβίωση'], r_hits: ['Hits', 'Επιτυχίες'], r_avgTime: ['Average time to hit', 'Μέσος χρόνος'],
        r_technique: ['Right technique', 'Σωστή τεχνική'], r_feedsPerShot: ['Feeds per hit', 'Ταΐσματα ανά επιτυχία'], r_selfPops: ['Popped yourself', 'Έσκασες εσύ'],
        r_goals: ['Goals', 'Στόχοι'], r_pops: ['Pops', 'Σκασίματα'], r_pellets: ['Pellets', 'Σφαιρίδια'], r_deviation: ['Distance from the line', 'Απόσταση από τη γραμμή'],
        r_fed: ['Mass fed', 'Μάζα που δόθηκε'], r_accuracy: ['Accuracy', 'Ευστοχία'], r_shots: ['Feeds', 'Ταΐσματα'], r_mergeTime: ['Merge time', 'Χρόνος ένωσης'], r_cells: ['Cells', 'Κύτταρα'],
        h_round: ['Round', 'Γύρος'], h_goal: ['Goal', 'Στόχος'], h_mergeIn: ['Merge in', 'Ένωση σε'], h_mergeNow: ['Merge now!', 'Ένωσε τώρα!']
    };
    function T(k) { var v = TXT[k]; return v ? v[GR ? 1 : 0] : k; }
    function toast(kind, text) { if (window.toastr) toastr[kind](String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')); }
    function LM() { return window.legendmod || null; }
    function accent() { var c = window.defaultSettings && defaultSettings.menuMainColor; return typeof c === 'string' && /^#[0-9a-f]{3,8}$/i.test(c) ? c : '#01d9cc'; }

    /* ------------------------------------------------------------------ */
    /* Storage                                                             */
    /* ------------------------------------------------------------------ */
    function loadCfg() {
        try { return S.sanitizeConfig(JSON.parse(localStorage.getItem(KEY_CFG) || 'null')); } catch (e) { return S.sanitizeConfig(null); }
    }
    function saveCfg(c) {
        var o = {};
        Object.keys(c).forEach(function (k) { if (k !== 'name' && k !== 'color') o[k] = c[k]; });
        try { localStorage.setItem(KEY_CFG, JSON.stringify(o)); } catch (e) { }
    }
    var storeMem = null;
    function loadStore() {
        if (storeMem) return storeMem;
        try { storeMem = S.validateStore(JSON.parse(localStorage.getItem(KEY_STORE) || 'null')); } catch (e) { storeMem = S.emptyStore(); }
        return storeMem;
    }
    function saveStore(st) {
        storeMem = st;
        try { localStorage.setItem(KEY_STORE, JSON.stringify(st)); } catch (e) { }
    }

    /* ------------------------------------------------------------------ */
    /* Session                                                             */
    /* ------------------------------------------------------------------ */
    var P = window.LMPractice = { on: false, sim: S };
    var cfg = loadCfg();
    var ses = null;          /* { w, view, cfg, key, best, prev, sock, timer, last, acc, done, errors, rec } */
    var leaveArmed = 0;

    function playerName() {
        var l = LM(), n = l && l.playerNick;
        if (!n) { try { n = document.getElementById('nick').value; } catch (e) { } }
        return String(n || '').slice(0, 30) || 'You';
    }
    function isRealWs(ws) {
        return typeof ws === 'string' && /^wss?:\/\//.test(ws) && ws.indexOf('replay') === -1 && ws.indexOf('/el-room/') === -1;
    }
    function feed(buf) {
        var l = LM();
        if (!l || !ses) return;
        try { l.handleMessage(new DataView(buf)); } catch (e) {
            ses.errors++;
            if (ses.errors === 1) console.warn('[Practice] packet failed:', e);
            if (ses.errors > 20) { toast('error', T('failed')); stop(false); }
        }
    }
    /* the stand-in socket: legendmod's send paths reach it as on a real connection */
    function makeSocket() {
        return {
            readyState: 1, OPEN: 1, CONNECTING: 0, CLOSING: 2, CLOSED: 3, binaryType: 'arraybuffer', bufferedAmount: 0,
            url: PRACTICE_WS, _lmPractice: true, onopen: null, onmessage: null, onclose: null, onerror: null,
            send: function (data) { if (this.readyState === 1) onClientPacket(data); },
            /* closeConnection() of a new connection (server list, region change...) ends the session */
            close: function () {
                if (this.readyState === 3) return;
                this.readyState = 3;
                if (ses && ses.sock === this) teardown(true);
            }
        };
    }
    function onClientPacket(data) {
        if (!ses) return;
        var cmd = S.decodeClient(data);
        if (!cmd) return;
        if (cmd.t === 'spawn') {
            /* Play / respawn while a run is over starts it again (not while its results are open) */
            if ((ses.w.over || !S.human(ses.w).cells.length) && !isOpen()) restart();
            return;
        }
        if (cmd.t === 'spectate') return;
        if (cmd.t === 'move' && ses.paused) return;
        S.input(ses.w, cmd);
    }
    function loop() {
        if (!ses) return;
        var now = performance.now();
        ses.acc += now - ses.last;
        ses.last = now;
        if (ses.paused || ses.w.over) {
            ses.acc = 0;
            /* an empty update twice a second keeps the client's world "alive" */
            if (now - ses.idleAt > 500) { ses.idleAt = now; S.encodeFrame(ses.w, ses.view).forEach(feed); }
            return;
        }
        var n = 0;
        while (ses && ses.acc >= S.TICK_MS && n < 4) { S.step(ses.w); ses.acc -= S.TICK_MS; n++; }
        if (!ses) return;
        if (ses.acc > 200) ses.acc = 0;
        if (n) {
            ses.idleAt = now;
            var pk = S.encodeFrame(ses.w, ses.view);
            for (var i = 0; i < pk.length && ses; i++) feed(pk[i]);
        }
        if (ses && ses.w.over && !ses.done) finished();
    }
    function setRecording(off) {
        if (off) {
            ses.rec = { slot: window.temporaryRecordedProtocol, live: window._lmRecLive };
            window.temporaryRecordedProtocol = null;
            window._lmRecLive = false;
        } else if (ses && ses.rec) {
            if (window.temporaryRecordedProtocol == null) window.temporaryRecordedProtocol = ses.rec.slot;
            window._lmRecLive = ses.rec.live;
        }
    }
    /* starts a session (or restarts it: the original server stays the one to go back to) */
    function start(c, opts) {
        opts = opts || {};
        var l = LM();
        if (!l || typeof l.handleMessage !== 'function') return false;
        c = S.sanitizeConfig(c || cfg);
        c.name = playerName();
        /* the window shows (and keeps) the settings of the run */
        cfg = c;
        saveCfg(cfg);
        if (!ses && l.play && l.socket && !opts.confirm && Date.now() - leaveArmed > 6000) {
            leaveArmed = Date.now();
            toast('info', T('leave'));
            ui();
            return false;
        }
        leaveArmed = 0;
        var prev = ses ? ses.prev : null;
        if (ses) teardown(false, true);
        if (!prev) {
            var tok = document.getElementById('server-token');
            prev = {
                ws: l.ws, token: tok ? tok.value : '', serverType: l.serverType, integrity: l.integrity,
                connectionIntegrity: l.connectionIntegrity, gameMode: l.gameMode,
                gm: (function () { try { return String($('#gamemode').val() || ''); } catch (e) { return ''; } })()
            };
            /* leave the live server (or a replay) like a replay start does */
            if (window.replayTimeOuts) { clearTimeout(window.replayTimeOuts); window.replayTimeOuts = null; }
            try { l.closeConnection(); } catch (e) { }
            if (tok) tok.value = '';
        }
        ses = { cfg: c, prev: prev, errors: 0, acc: 0, last: performance.now(), idleAt: 0, done: false, paused: false };
        setRecording(true);
        try { l.flushCellsData(); } catch (e) { }
        window.multiboxPlayerEnabled = null;
        window.mainPlayerDeadMbActive = false;
        l.play = false;
        l._spawnTransitGate = false;
        l.socket = ses.sock = makeSocket();
        l.ws = PRACTICE_WS;
        l.serverType = 'private';
        l.integrity = false;
        l.connectionIntegrity = false;
        l.connectionOpened = true;
        l.protocolKey = 0;
        l.clientKey = null;
        l.isLegendWorld = false;
        l.vnr = 0;
        if (l.gameMode === ':teams' || l.gameMode === ':party') l.gameMode = ':ffa';
        if (!l.playerNick) l.playerNick = c.name;
        ses.w = S.createWorld(c);
        ses.view = S.createView();
        ses.key = S.bestKey(c);
        var b = loadStore().best[ses.key];
        ses.best = b ? { s: b.s, g: b.g } : null;
        P.on = true;
        ses.timer = setInterval(loop, 15);
        loop();
        hud(true);
        overlayOn();
        if (isOpen() && !opts.keepOpen) close();
        ui();
        return true;
    }
    function restart() { if (ses) start(ses.cfg, { confirm: true }); else start(cfg); }
    /* ends the session; byClose: a new connection is already replacing the stand-in socket;
     * again: a restart follows at once */
    function teardown(byClose, again) {
        if (!ses) return;
        var l = LM(), s = ses;
        clearInterval(s.timer);
        s.sock.readyState = 3;
        setRecording(false);
        ses = null;
        P.on = false;
        if (l) {
            if (l.socket === s.sock) { l.socket = null; l.ws = null; l.connectionOpened = false; }
            if (!byClose) {
                try { l.flushCellsData(); } catch (e) { }
            }
            l.play = false;
            if (!again) {
                if (!byClose || l.serverType === 'private') {
                    l.serverType = s.prev.serverType;
                    l.integrity = s.prev.integrity;
                    l.connectionIntegrity = s.prev.connectionIntegrity;
                }
                if (s.prev.gameMode && l.gameMode === ':ffa') l.gameMode = s.prev.gameMode;
                var tok = document.getElementById('server-token');
                if (tok && tok.value === '') tok.value = s.prev.token || '';
            }
        }
        if (!again) { hud(false); overlayClear(); }
        ui();
    }
    /* stop the session; rejoin: go back to the server played before */
    function stop(rejoin) {
        if (!ses) { if (rejoin) rejoinPrev(null); return; }
        var prev = ses.prev;
        teardown(false);
        if (rejoin) rejoinPrev(prev);
        else showMenu();
    }
    function showMenu() { try { if (window.application && application.showMenu) application.showMenu(); } catch (e) { } }
    function rejoinPrev(prev) {
        var app = window.application;
        if (prev && isRealWs(prev.ws) && app && app.gameServerJoin) {
            try { if (prev.gm && $('#gamemode option').filter(function () { return this.value === prev.gm; }).length) $('#gamemode').val(prev.gm); } catch (e) { }
            app.gameServerJoin(prev.ws);
            return;
        }
        if (typeof window._lmJoinPrevServer === 'function' && window._lmJoinPrevServer()) return;
        showMenu();
    }
    function finished() {
        var w = ses.w, r = w.result;
        ses.done = true;
        var res = S.recordRun(loadStore(), ses.key, r, w.samples, Date.now());
        saveStore(res.store);
        ses.lastRun = { r: r, best: res.best, prev: res.prev };
        if (res.best) toast('success', T('newBest') + ' ' + T('score') + ': ' + r.score);
        open();
    }
    function state() {
        if (!ses) return { on: false };
        var w = ses.w, h = S.human(w);
        return {
            on: true, exercise: ses.cfg.exercise, tick: w.tick, over: w.over, paused: ses.paused, done: ses.done,
            humanCells: h.cells.length, splits: h.splits, ejects: h.ejects, cells: w.cells.length, errors: ses.errors, key: ses.key, result: w.result
        };
    }

    /* ------------------------------------------------------------------ */
    /* Overlay: ghost, goals, path, aim line                               */
    /* ------------------------------------------------------------------ */
    var ov = null, ovRaf = 0;
    function overlayOn() { if (!ovRaf) ovRaf = requestAnimationFrame(drawOverlay); }
    function overlayClear() { if (ov) ov.getContext('2d').clearRect(0, 0, ov.width, ov.height); }
    function drawOverlay() {
        ovRaf = 0;
        if (!ses) { overlayClear(); return; }
        var game = document.getElementById('canvas'), dr = window.drawRender;
        if (!game || !dr) { ovRaf = requestAnimationFrame(drawOverlay); return; }
        if (!ov) {
            ov = document.createElement('canvas');
            ov.id = 'lm-pr-overlay';
            ov.style.cssText = 'position:fixed;pointer-events:none;';
            game.insertAdjacentElement('afterend', ov);
            var z = getComputedStyle(game).zIndex;
            ov.style.zIndex = z && z !== 'auto' ? z : '1';
        }
        var r = game.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
        var wpx = Math.round(r.width * dpr), hpx = Math.round(r.height * dpr);
        if (ov.width !== wpx || ov.height !== hpx) { ov.width = wpx; ov.height = hpx; }
        ov.style.left = r.left + 'px'; ov.style.top = r.top + 'px'; ov.style.width = r.width + 'px'; ov.style.height = r.height + 'px';
        var ctx = ov.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, wpx, hpx);
        var k = (r.width / (dr.canvasWidth || r.width || 1)) * dpr, sc = (dr.scale || 1) * k;
        var sx = function (x) { return ((x - dr.camX) * dr.scale + (dr.canvasWidth || r.width) / 2) * k; };
        var sy = function (y) { return ((y - dr.camY) * dr.scale + (dr.canvasHeight || r.height) / 2) * k; };
        var w = ses.w, ex = w.ex, A = accent();
        ctx.lineWidth = 2 * dpr;
        if (ex.path) {
            ctx.strokeStyle = 'rgba(255,215,0,0.35)';
            ctx.setLineDash([10 * dpr, 8 * dpr]);
            ctx.beginPath();
            ex.path.forEach(function (p, i) { if (i) ctx.lineTo(sx(p.x), sy(p.y)); else ctx.moveTo(sx(p.x), sy(p.y)); });
            ctx.stroke();
            ctx.setLineDash([]);
        }
        if (ex.goals) {
            ex.goals.forEach(function (g, i) {
                if (i < ex.next) return;
                var cur = i === ex.next;
                ctx.strokeStyle = cur ? A : 'rgba(255,255,255,0.35)';
                ctx.lineWidth = (cur ? 4 : 2) * dpr;
                ctx.beginPath(); ctx.arc(sx(g.x), sy(g.y), Math.max(8 * dpr, g.r * sc), 0, Math.PI * 2); ctx.stroke();
                ctx.fillStyle = ctx.strokeStyle;
                ctx.font = 'bold ' + Math.round(16 * dpr) + 'px sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(String(i + 1), sx(g.x), sy(g.y));
            });
        }
        /* virus drill: the line the shot has to fly */
        if (ex.targetP && w.cfg.exercise === 'virus' && ex.phase === 'play') {
            var t = ex.targetP.cells[0], v = null;
            for (var i = 0; i < w.cells.length; i++) if (w.cells[i].k === S.K_VIRUS && !w.cells[i].shot) { v = w.cells[i]; break; }
            if (t && v) {
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.setLineDash([6 * dpr, 6 * dpr]);
                ctx.beginPath(); ctx.moveTo(sx(v.x), sy(v.y)); ctx.lineTo(sx(t.x), sy(t.y)); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.font = 'bold ' + Math.round(14 * dpr) + 'px sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(v.fed + ' / ' + S.VIRUS_FEED, sx(v.x), sy(v.y));
            }
        }
        /* the ghost: where the personal best run was at this moment, as large as it was */
        if (ses.best && ses.best.g && ses.best.g.length) {
            var tick = w.tick + Math.min(1, ses.acc / S.TICK_MS);
            var g = S.ghostAt(ses.best.g, tick);
            if (g) {
                var gr = Math.max(6 * dpr, S.radius(g.m) * sc);
                ctx.fillStyle = 'rgba(255,255,255,0.10)';
                ctx.strokeStyle = 'rgba(255,255,255,0.55)';
                ctx.setLineDash([8 * dpr, 6 * dpr]);
                ctx.beginPath(); ctx.arc(sx(g.x), sy(g.y), gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = 'rgba(255,255,255,0.75)';
                ctx.font = 'bold ' + Math.round(12 * dpr) + 'px sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('PB ' + Math.round(g.m), sx(g.x), sy(g.y));
            }
        }
        ovRaf = requestAnimationFrame(drawOverlay);
    }

    /* ------------------------------------------------------------------ */
    /* HUD: exercise, progress, current vs best mass graph, quick buttons  */
    /* ------------------------------------------------------------------ */
    var H = null, hudTimer = 0;
    function el(tag, css, text, attrs) {
        var e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text != null) e.textContent = text;
        if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
        return e;
    }
    function btn(label, title, fn, css) {
        var b = el('button', css || '', label, { type: 'button', title: title || label, 'class': 'lm-pr-b' });
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(e); });
        return b;
    }
    function shield(node) {
        /* clicks and taps on practice windows are not game input */
        ['mousedown', 'mouseup', 'pointerdown', 'touchstart', 'touchend', 'wheel', 'contextmenu', 'dblclick'].forEach(function (t) {
            node.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
        });
        ['keydown', 'keyup', 'keypress'].forEach(function (t) {
            node.addEventListener(t, function (e) { if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) e.stopPropagation(); });
        });
    }
    var styled = false;
    function css() {
        if (styled) return;
        styled = true;
        var st = el('style');
        st.textContent =
            '#lm-pr,#lm-pr-hud{color:#e8e8e8;font:12px/1.35 Ubuntu,Arial,sans-serif;touch-action:manipulation;user-select:none;-webkit-user-select:none;}' +
            '#lm-pr *,#lm-pr-hud *{box-sizing:border-box;}' +
            /* above the phone controls (LMmobile z-index 100000-100004) so its buttons take the taps */
            '#lm-pr{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(660px,calc(100vw - 12px));max-height:calc(100vh - 12px);z-index:100005;display:flex;flex-direction:column;' +
            'background:rgba(14,17,23,.96);border:1px solid rgba(255,255,255,.15);border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.5);}' +
            '#lm-pr .lm-pr-body{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 10px 8px;display:flex;flex-wrap:wrap;gap:8px 14px;}' +
            '#lm-pr .lm-pr-col{flex:1 1 280px;min-width:0;}' +
            '.lm-pr-b{min-height:30px;min-width:30px;padding:2px 9px;margin:0 4px 4px 0;border:1px solid rgba(255,255,255,.18);border-radius:5px;background:rgba(255,255,255,.07);color:#eee;font:inherit;cursor:pointer;white-space:nowrap;}' +
            '.lm-pr-b:hover{background:rgba(255,255,255,.16);}' +
            '.lm-pr-b:disabled{opacity:.4;cursor:default;}' +
            '.lm-pr-b.main{border-color:var(--lm-pr-a);color:var(--lm-pr-a);font-weight:bold;}' +
            '#lm-pr select,#lm-pr input{min-height:28px;width:100%;background:#1d222b;color:#eee;border:1px solid rgba(255,255,255,.2);border-radius:5px;font:inherit;padding:2px 6px;}' +
            '#lm-pr .lm-pr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(122px,1fr));gap:4px 8px;margin:6px 0;}' +
            '#lm-pr .lm-pr-grid label{display:flex;flex-direction:column;gap:1px;font-size:11px;opacity:.9;}' +
            '#lm-pr .lm-pr-dim{opacity:.7;font-size:11px;}' +
            '#lm-pr .lm-pr-res div{display:flex;justify-content:space-between;gap:8px;padding:1px 0;border-bottom:1px solid rgba(255,255,255,.06);}' +
            '#lm-pr h4{margin:6px 0 3px;font-size:12px;color:var(--lm-pr-a);}' +
            '#lm-pr-hud{position:fixed;top:4px;left:50%;transform:translateX(-50%);z-index:100003;display:flex;align-items:center;gap:6px;padding:3px 4px 3px 8px;' +
            'background:rgba(14,17,23,.72);border:1px solid rgba(255,255,255,.12);border-radius:7px;pointer-events:none;max-width:calc(100vw - 8px);}' +
            '#lm-pr-hud .lm-pr-b{pointer-events:auto;margin:0;min-height:28px;}' +
            '#lm-pr-hud .lm-pr-t{display:flex;flex-direction:column;min-width:0;white-space:nowrap;overflow:hidden;}' +
            '@media (max-height:460px){#lm-pr{font-size:11px;}#lm-pr .lm-pr-b{min-height:28px;}#lm-pr-hud canvas{display:none;}}';
        document.head.appendChild(st);
    }
    function hud(on) {
        if (!on) {
            if (H) H.style.display = 'none';
            if (hudTimer) { clearInterval(hudTimer); hudTimer = 0; }
            return;
        }
        css();
        if (!H) {
            H = el('div', '', null, { id: 'lm-pr-hud' });
            H.style.setProperty('--lm-pr-a', accent());
            shield(H);
            var t = H.txt = el('div', '', null, { 'class': 'lm-pr-t' });
            H.l1 = el('b', 'color:' + accent() + ';overflow:hidden;text-overflow:ellipsis;');
            H.l2 = el('span', 'font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;');
            t.appendChild(H.l1); t.appendChild(H.l2);
            H.appendChild(t);
            H.graph = el('canvas', 'width:120px;height:34px;flex:0 0 auto;', null, { width: '240', height: '68', title: T('ghost') });
            H.appendChild(H.graph);
            H.appendChild(btn('⚙', T('settings'), function () { toggle(); }));
            H.appendChild(btn('↻', T('restart'), function () { restart(); }));
            H.appendChild(btn('⏏', T('backGame'), function () { stop(true); }));
            H.appendChild(btn('✕', T('stop'), function () { stop(false); }, 'min-width:34px;'));
            document.body.appendChild(H);
        }
        H.style.display = 'flex';
        if (!hudTimer) hudTimer = setInterval(hudTick, 250);
        hudTick();
    }
    function fmtS(t) { return (Math.round(t * 10) / 10).toFixed(1) + ' s'; }
    function hudLine(w) {
        var ex = w.ex, c = w.cfg, h = S.human(w), m = S.centre(h), t = S.secs(w);
        switch (c.exercise) {
            case 'split': case 'virus':
                var hits = (ex.log || []).filter(function (r) { return r.ok; }).length;
                return T('h_round') + ' ' + (ex.round || 0) + '/' + c.rounds + ' · ' + T('r_hits') + ' ' + hits + (c.exercise === 'virus' && ex.cur ? ' · ' + T('r_shots') + ' ' + ex.cur.ejects : '');
            case 'dodge': return T('h_goal') + ' ' + Math.min(ex.next + 1, ex.goals.length) + '/' + ex.goals.length + ' · ' + T('r_pops') + ' ' + ex.pops + ' · ' + fmtS(t);
            case 'path': return T('r_pellets') + ' ' + ex.eaten + '/' + ex.total + ' · ' + fmtS(t);
            case 'escape': return T('r_survived') + ' ' + Math.floor(t) + '/' + c.duration + ' s · ' + T('r_mass') + ' ' + (m ? Math.round(m.m) : 0);
            case 'feed': return T('r_fed') + ' ' + Math.round(ex.got) + ' · ' + T('r_accuracy') + ' ' + (ex.shots ? Math.round(ex.got / (ex.shots * 14) * 100) : 0) + '%';
            case 'merge':
                var left = (ex.ready - w.tick) * S.TICK_MS / 1000;
                return left > 0 ? T('h_mergeIn') + ' ' + fmtS(left) : T('h_mergeNow') + ' ' + T('r_cells') + ' ' + h.cells.length;
            default: return T('r_mass') + ' ' + (m ? Math.round(m.m) : 0) + ' · ' + T('r_kills') + ' ' + h.kills + ' · ' + Math.floor(t) + '/' + c.duration + ' s';
        }
    }
    function hudTick() {
        if (!ses || !H) return;
        var w = ses.w;
        H.l1.textContent = T('ex_' + ses.cfg.exercise) + ' · ' + (ses.done ? T('finished') + (w.result ? ' ' + w.result.score : '') : ses.paused ? T('paused') : T('running'));
        H.l2.textContent = hudLine(w);
        drawGraph(H.graph, w.samples, ses.best && ses.best.g);
    }
    /* mass over time: this run (accent) against the personal best (white, dashed) */
    function drawGraph(cv, cur, best) {
        if (!cv || !cv.offsetWidth) return;
        var ctx = cv.getContext('2d'), W = cv.width, Hh = cv.height;
        ctx.clearRect(0, 0, W, Hh);
        var tMax = 1, mMax = 1, i;
        for (i = 0; i + 3 < cur.length; i += 4) { tMax = Math.max(tMax, cur[i]); mMax = Math.max(mMax, cur[i + 3]); }
        if (best) for (i = 0; i + 3 < best.length; i += 4) { tMax = Math.max(tMax, best[i]); mMax = Math.max(mMax, best[i + 3]); }
        var line = function (a, color, dash) {
            if (!a || a.length < 8) return;
            ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash(dash || []);
            ctx.beginPath();
            for (var j = 0; j + 3 < a.length; j += 4) {
                var x = a[j] / tMax * (W - 2) + 1, y = Hh - 2 - a[j + 3] / mMax * (Hh - 4);
                if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        };
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, 0, W, Hh);
        line(best, 'rgba(255,255,255,0.6)', [6, 5]);
        line(cur, accent());
    }

    /* ------------------------------------------------------------------ */
    /* Window                                                              */
    /* ------------------------------------------------------------------ */
    var Wn = null;
    function isOpen() { return !!(Wn && Wn.style.display !== 'none'); }
    function field(key, node) {
        var lab = el('label', '', null);
        lab.appendChild(el('span', '', T(key)));
        lab.appendChild(node);
        lab.dataset.k = key;
        return lab;
    }
    function numInput(key) {
        var f = S.FIELDS[key];
        var inp = el('input', '', null, { type: 'number', min: String(f.min), max: String(f.max), step: '1', inputmode: 'numeric' });
        inp.addEventListener('change', function () {
            var o = {}; o[key] = +inp.value;
            setCfg(o);
        });
        return inp;
    }
    function selInput(key, opts) {
        var s = el('select');
        opts.forEach(function (o) { var op = el('option', '', o[1]); op.value = String(o[0]); s.appendChild(op); });
        s.addEventListener('change', function () { var o = {}; o[key] = key === 'splitMode' ? s.value : +s.value; setCfg(o); });
        return s;
    }
    function setCfg(o) {
        var n = {};
        Object.keys(cfg).forEach(function (k) { n[k] = cfg[k]; });
        Object.keys(o).forEach(function (k) { n[k] = o[k]; });
        cfg = o.exercise && o.exercise !== cfg.exercise ? S.withDefaults(n, o.exercise) : S.sanitizeConfig(n);
        saveCfg(cfg);
        ui();
    }
    function build() {
        if (Wn) return Wn;
        css();
        Wn = el('div', '', null, { id: 'lm-pr', role: 'dialog', 'aria-label': T('title') });
        Wn.style.setProperty('--lm-pr-a', accent());
        shield(Wn);
        var head = el('div', 'display:flex;align-items:center;padding:4px 4px 2px 10px;gap:6px;flex:0 0 auto;');
        head.appendChild(el('b', 'color:' + accent() + ';white-space:nowrap;flex:1 1 auto;', T('title')));
        Wn.status = el('span', '', '', { 'class': 'lm-pr-dim' });
        head.appendChild(Wn.status);
        head.appendChild(btn('✕', T('close'), close, 'min-width:38px;font-size:15px;margin:0;'));
        Wn.appendChild(head);
        var body = el('div', '', null, { 'class': 'lm-pr-body' });
        var left = el('div', '', null, { 'class': 'lm-pr-col' }), right = el('div', '', null, { 'class': 'lm-pr-col' });
        body.appendChild(left); body.appendChild(right);
        Wn.appendChild(body);
        /* exercise */
        var ex = Wn.ex = el('select');
        S.EX_IDS.forEach(function (id) { var o = el('option', '', T('ex_' + id)); o.value = id; ex.appendChild(o); });
        var mb = el('option', '', T('ex_multibox') + ' (' + T('later') + ')'); mb.value = 'multibox'; mb.disabled = true; ex.appendChild(mb);
        ex.addEventListener('change', function () { if (S.EXERCISES[ex.value]) setCfg({ exercise: ex.value }); });
        left.appendChild(field('exercise', ex));
        Wn.desc = el('div', 'margin:4px 0;', '', { 'class': 'lm-pr-dim' });
        left.appendChild(Wn.desc);
        /* settings */
        var grid = Wn.grid = el('div', '', null, { 'class': 'lm-pr-grid' });
        Wn.inputs = {};
        var lv = [1, 2, 3, 4].map(function (v) { return [v, T('lv' + v)]; });
        var vd = [0, 1, 2, 3, 4].map(function (v) { return [v, T('vd' + v)]; });
        var add = function (key, node) { Wn.inputs[key] = node; grid.appendChild(field(key, node)); };
        add('splitMode', selInput('splitMode', S.SPLIT_MODES.map(function (m) { return [m, T('sm_' + m)]; })));
        add('difficulty', selInput('difficulty', lv));
        ['startMass', 'oppMass', 'bots'].forEach(function (k) { add(k, numInput(k)); });
        add('viruses', selInput('viruses', vd));
        ['mapSize', 'duration', 'rounds', 'mergeSecs', 'latency', 'seed'].forEach(function (k) { add(k, numInput(k)); });
        left.appendChild(grid);
        var row = el('div', 'display:flex;flex-wrap:wrap;');
        row.appendChild(btn(T('randomSeed'), '', function () { setCfg({ seed: 1 + Math.floor(Math.random() * 999998) }); }));
        row.appendChild(btn(T('defaults'), '', function () { cfg = S.withDefaults(cfg, cfg.exercise); saveCfg(cfg); ui(); }));
        left.appendChild(row);
        /* actions */
        var act = el('div', 'display:flex;flex-wrap:wrap;margin-top:4px;');
        Wn.startB = btn(T('start'), '', function () { if (ses) start(cfg, { confirm: true }); else start(cfg); }, '');
        Wn.startB.classList.add('main');
        Wn.stopB = btn(T('stop'), '', function () { stop(false); });
        Wn.backB = btn(T('backGame'), '', function () { stop(true); });
        act.appendChild(Wn.startB); act.appendChild(Wn.stopB); act.appendChild(Wn.backB);
        right.appendChild(act);
        Wn.warn = el('div', 'color:#ffb020;margin:2px 0 4px;display:none;', T('leave'));
        right.appendChild(Wn.warn);
        right.appendChild(el('h4', '', T('results')));
        Wn.res = el('div', '', null, { 'class': 'lm-pr-res' });
        right.appendChild(Wn.res);
        right.appendChild(el('h4', '', T('best')));
        Wn.best = el('div', '', null, { 'class': 'lm-pr-res' });
        right.appendChild(Wn.best);
        right.appendChild(el('h4', '', T('recent')));
        Wn.hist = el('div', '', null, { 'class': 'lm-pr-res' });
        right.appendChild(Wn.hist);
        right.appendChild(el('div', 'margin-top:8px;', T('offline'), { 'class': 'lm-pr-dim' }));
        document.body.appendChild(Wn);
        return Wn;
    }
    function resLines(box, r) {
        while (box.firstChild) box.removeChild(box.firstChild);
        if (!r) return;
        var row = function (a, b) { var d = el('div'); d.appendChild(el('span', '', a)); d.appendChild(el('b', '', String(b))); box.appendChild(d); };
        row(T('score'), r.score + (ses && ses.lastRun && ses.lastRun.r === r && ses.lastRun.best ? ' ★' : ''));
        row(r.ok ? T('ok') : T('notOk'), r.reason === 'eaten' ? T('eaten') : '');
        (r.lines || []).forEach(function (l) { row(T('r_' + l[0]), l[1]); });
    }
    function fmtDate(t) { try { return new Date(t).toLocaleString(); } catch (e) { return ''; } }
    function ui() {
        if (!Wn) return;
        var c = cfg;
        Wn.ex.value = c.exercise;
        Wn.desc.textContent = T('d_' + c.exercise);
        var uses = S.EXERCISES[c.exercise].uses.concat(['latency', 'seed']);
        Object.keys(Wn.inputs).forEach(function (k) {
            var inp = Wn.inputs[k];
            inp.parentNode.style.display = uses.indexOf(k) !== -1 ? '' : 'none';
            if (document.activeElement !== inp) inp.value = String(c[k]);
        });
        Wn.startB.textContent = ses ? T('restart') : T('start');
        Wn.stopB.disabled = !ses;
        Wn.warn.style.display = !ses && leaveArmed && Date.now() - leaveArmed < 6000 ? '' : 'none';
        Wn.status.textContent = ses ? (ses.done ? T('finished') : T('paused')) + ' · ' + T('ex_' + ses.cfg.exercise) : '';
        var key = S.bestKey(c), st = loadStore(), b = st.best[key];
        resLines(Wn.res, ses && ses.done ? ses.w.result : (ses && ses.lastRun ? ses.lastRun.r : null));
        while (Wn.best.firstChild) Wn.best.removeChild(Wn.best.firstChild);
        if (b) {
            var d = el('div'); d.appendChild(el('span', '', fmtDate(b.t))); d.appendChild(el('b', '', b.s + (b.ok ? ' ✓' : ''))); Wn.best.appendChild(d);
        } else Wn.best.appendChild(el('div', '', T('noBest'), { 'class': 'lm-pr-dim' }));
        while (Wn.hist.firstChild) Wn.hist.removeChild(Wn.hist.firstChild);
        st.hist.filter(function (h) { return h.k === key; }).slice(-5).reverse().forEach(function (h) {
            var d = el('div'); d.appendChild(el('span', '', fmtDate(h.t))); d.appendChild(el('b', '', h.s + (h.ok ? ' ✓' : ''))); Wn.hist.appendChild(d);
        });
    }
    function open() {
        build();
        /* the arena waits while its settings are open (phones: the window covers the game) */
        if (ses) ses.paused = true;
        Wn.style.display = 'flex';
        ui();
        hudTick();
    }
    function close() {
        if (Wn) Wn.style.display = 'none';
        if (ses) { ses.paused = false; ses.last = performance.now(); ses.acc = 0; }
        hudTick();
    }
    function toggle() { if (isOpen()) close(); else open(); }

    P.open = open; P.close = close; P.toggle = toggle; P.isOpen = isOpen;
    P.start = start; P.stop = stop; P.restart = restart; P.state = state;
    P.config = function () { return S.sanitizeConfig(cfg); };
    P.run = function (action, arg) {
        if (action === 'open') open();
        else if (action === 'close') close();
        else if (action === 'start') start(arg || cfg, { confirm: true });
        else if (action === 'stop') stop(!!arg);
        else toggle();
    };
})();
