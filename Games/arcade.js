/* =========================================================================
   ARCADE — coin economy, game registry, lobby & navigation
   -------------------------------------------------------------------------
   Games register themselves with Arcade.register({...}). Each game module is
   self-contained (its own file/folder) and receives a small `api`:

     api.coins()      -> current coin balance
     api.spend(n)     -> boolean; deduct n coins if affordable
     api.add(n)       -> grant n coins
     api.cost         -> this game's play cost (for retries)
     api.exit()       -> return to the lobby
     api.onCoins(cb)  -> subscribe to balance changes

   A game's mount(rootEl, api) builds its UI into rootEl and returns an
   optional controller { destroy() } used to tear it down on exit/close.
   ========================================================================= */
(function () {
    'use strict';

    // ---- Coin economy -----------------------------------------------------
    const COIN_KEY = 'arcadeCoins';
    const WELCOME_COINS = 3; // first-visit credits so the arcade is playable

    if (localStorage.getItem(COIN_KEY) === null) {
        localStorage.setItem(COIN_KEY, String(WELCOME_COINS));
    }

    const coinListeners = [];
    const Coins = {
        get() { return parseInt(localStorage.getItem(COIN_KEY) || '0', 10) || 0; },
        set(n) {
            const v = Math.max(0, Math.floor(n));
            localStorage.setItem(COIN_KEY, String(v));
            coinListeners.forEach(cb => cb(v));
        },
        add(n) { this.set(this.get() + n); },
        spend(n) {
            if (this.get() < n) return false;
            this.set(this.get() - n);
            return true;
        }
    };
    function onCoins(cb) { coinListeners.push(cb); cb(Coins.get()); }

    // Live coin readouts anywhere in the DOM ([data-coin-count]).
    onCoins(function (v) {
        document.querySelectorAll('[data-coin-count]').forEach(function (el) {
            el.textContent = v;
            el.classList.remove('coin-bump');
            void el.offsetWidth; // restart the pop animation
            el.classList.add('coin-bump');
        });
    });

    // Spawn a coin at (clientX, clientY) that arcs to the HUD, then banks it.
    // One press = one coin: each press flings its own coin and banks +1 on arrival.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function flyCoin(x, y) {
        const hud = document.querySelector('.coin-hud');
        if (reduceMotion || !hud || typeof Element.prototype.animate !== 'function') {
            Coins.add(1);
            return;
        }
        const t = hud.getBoundingClientRect();
        const tx = t.left + t.width / 2;
        const ty = t.top + t.height / 2;
        const dx = tx - x;
        const dy = ty - y;

        const coin = document.createElement('i');
        coin.className = 'coin-ic coin-fly';
        coin.style.left = x + 'px';
        coin.style.top = y + 'px';
        document.body.appendChild(coin);

        const anim = coin.animate([
            { transform: 'translate(-50%,-50%) scale(1.5) rotate(0deg)', opacity: 1, offset: 0 },
            { transform: 'translate(-50%,-50%) translate(' + (dx * 0.5) + 'px,' + (dy * 0.5 - 46) + 'px) scale(1.15) rotate(200deg)', opacity: 1, offset: 0.6 },
            { transform: 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) scale(0.35) rotate(360deg)', opacity: 0.5, offset: 1 }
        ], { duration: 640, easing: 'cubic-bezier(0.45, 0, 0.7, 0.35)' });

        let banked = false;
        const bank = function () {
            if (banked) return;
            banked = true;
            coin.remove();
            Coins.add(1);
        };
        anim.onfinish = bank;
        anim.oncancel = bank;
    }

    // ---- Game registry ----------------------------------------------------
    const games = [];
    function register(def) { games.push(def); }

    // Dim placeholder slots — replaced as real games are added.
    const LOCKED_SLOTS = [
        { name: '???', tag: 'Coming soon' },
        { name: '???', tag: 'Coming soon' }
    ];

    // ---- DOM references ---------------------------------------------------
    const modal = document.getElementById('arcade-modal');
    if (!modal) return;
    const lobby = document.getElementById('arcade-lobby');
    const gameView = document.getElementById('arcade-game');
    const stage = document.getElementById('arcade-stage');
    const grid = document.getElementById('lobby-grid');
    const noteEl = document.getElementById('lobby-note');
    const backBtn = gameView ? gameView.querySelector('.arcade-back') : null;
    const DEFAULT_NOTE = noteEl ? noteEl.textContent : '';

    let active = null; // { def, controller }
    let noteTimer = null;

    const api = {
        coins: function () { return Coins.get(); },
        spend: function (n) { return Coins.spend(n); },
        add: function (n) { Coins.add(n); },
        onCoins: onCoins,
        exit: function () { showLobby(); }
    };

    // ---- Lobby ------------------------------------------------------------
    function hiScore(key) {
        return key ? (parseInt(localStorage.getItem(key) || '0', 10) || 0) : 0;
    }

    function buildLobby() {
        if (!grid) return;
        grid.innerHTML = '';

        let idx = 0;

        games.forEach(function (def) {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'game-card';
            card.style.setProperty('--accent', def.accent || '#29f2ff');
            card.style.animationDelay = (idx++ * 0.07) + 's';
            card.innerHTML =
                '<span class="gc-screen">' +
                    '<span class="gc-scan"></span>' +
                    '<span class="gc-glow"></span>' +
                    '<span class="gc-badge">HI ' + hiScore(def.hiKey) + '</span>' +
                    '<span class="gc-icon">' + (def.icon || '🎮') + '</span>' +
                '</span>' +
                '<span class="gc-info">' +
                    '<span class="gc-name">' + def.name + '</span>' +
                    '<span class="gc-tag">' + (def.tag || '') + '</span>' +
                '</span>' +
                '<span class="gc-cta">' +
                    '<span class="gc-cost">' + def.cost + ' <span class="coin-ic"></span></span>' +
                    '<span class="gc-play">PLAY ▸</span>' +
                '</span>';
            card.addEventListener('click', function () { tryLaunch(def, card); });
            grid.appendChild(card);
        });

        LOCKED_SLOTS.forEach(function (slot) {
            const el = document.createElement('div');
            el.className = 'game-card locked';
            el.style.animationDelay = (idx++ * 0.07) + 's';
            el.innerHTML =
                '<span class="gc-screen gc-screen-locked">' +
                    '<span class="gc-static"></span>' +
                    '<span class="gc-icon">?</span>' +
                '</span>' +
                '<span class="gc-info">' +
                    '<span class="gc-name">' + slot.name + '</span>' +
                    '<span class="gc-tag">' + slot.tag + '</span>' +
                '</span>' +
                '<span class="gc-cta gc-cta-locked">LOCKED</span>';
            grid.appendChild(el);
        });
    }

    function flashNote(text) {
        if (!noteEl) return;
        noteEl.textContent = text;
        noteEl.classList.add('lobby-note-alert');
        clearTimeout(noteTimer);
        noteTimer = setTimeout(function () {
            noteEl.textContent = DEFAULT_NOTE;
            noteEl.classList.remove('lobby-note-alert');
        }, 2600);
    }

    function tryLaunch(def, card) {
        if (Coins.get() < def.cost) {
            card.classList.remove('shake');
            void card.offsetWidth;
            card.classList.add('shake');
            flashNote('NOT ENOUGH COINS — insert coins on the home screen ▲');
            return;
        }
        if (!Coins.spend(def.cost)) return;
        openGame(def);
    }

    // ---- Navigation -------------------------------------------------------
    function openGame(def) {
        if (!stage || !gameView || !lobby) return;
        stage.innerHTML = '';
        stage.style.setProperty('--accent', def.accent || '#29f2ff');
        lobby.hidden = true;
        gameView.hidden = false;
        const gameApi = Object.assign({}, api, { cost: def.cost, def: def });
        active = { def: def, controller: def.mount(stage, gameApi) || {} };
    }

    function destroyActive() {
        if (active && active.controller && typeof active.controller.destroy === 'function') {
            active.controller.destroy();
        }
        active = null;
        if (stage) stage.innerHTML = '';
    }

    function showLobby() {
        destroyActive();
        if (gameView) gameView.hidden = true;
        if (lobby) lobby.hidden = false;
        buildLobby();
    }

    // ---- Public open/close (called from the gamepad button) ---------------
    window.openArcade = function () {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        showLobby();
    };

    window.closeArcade = function () {
        destroyActive();
        if (gameView) gameView.hidden = true;
        if (lobby) lobby.hidden = false;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    };

    // ---- Wiring -----------------------------------------------------------
    if (backBtn) backBtn.addEventListener('click', showLobby);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) window.closeArcade();
    });
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') {
            if (active) showLobby();
            else window.closeArcade();
        }
    });

    // ---- Floating collectible coins on the home screen --------------------
    // Coins drift in from off-screen; click one to send it to the counter (+1).
    // Uncollected coins drift off and vanish. Earning happens ONLY here.
    (function floatingCoins() {
        const home = document.getElementById('home');
        if (!home) return;
        if (getComputedStyle(home).position === 'static') home.style.position = 'relative';

        const field = document.createElement('div');
        field.className = 'coin-field';
        field.setAttribute('aria-hidden', 'true');
        home.appendChild(field);

        const coins = [];
        const MAX_COINS = 2; // most coins allowed on screen at once
        const BOB = 14; // vertical bob amplitude (px)
        let lastT = 0;
        let spawnAt = 900;

        const rand = (a, b) => a + Math.random() * (b - a);

        function canSpawn() {
            if (document.hidden) return false;
            if (modal.classList.contains('open')) return false;
            // only while the home screen is still substantially in view
            return home.getBoundingClientRect().bottom > window.innerHeight * 0.45;
        }

        function spawn() {
            const w = field.clientWidth, h = field.clientHeight;
            if (!w || !h) return;
            const size = rand(30, 40);
            const fromLeft = Math.random() < 0.5;
            const cross = rand(18000, 28000); // ms to cross the field (slow drift)
            const vx = (fromLeft ? 1 : -1) * (w + size * 2) / cross;
            const x = fromLeft ? -size : w;
            const baseY = rand(h * 0.12, h * 0.78);

            const HIT_PAD = 16; // transparent tap area around the visual coin
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'coin-float';
            el.setAttribute('aria-label', 'Collect coin');
            el.style.width = el.style.height = (size + HIT_PAD * 2) + 'px';
            el.style.padding = HIT_PAD + 'px';
            el.innerHTML = '<span class="coin-ic"></span>';
            field.appendChild(el);

            const coin = { el: el, x: x, baseY: baseY, vx: vx, size: size, phase: rand(0, Math.PI * 2) };
            el.style.transform = 'translate3d(' + x + 'px,' + baseY + 'px,0)';
            // Collect on click; swallow press so it never triggers the starfield blast.
            el.addEventListener('click', function (e) { e.stopPropagation(); collect(coin); });
            el.addEventListener('mousedown', function (e) { e.stopPropagation(); });
            el.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
            coins.push(coin);
        }

        function collect(coin) {
            const i = coins.indexOf(coin);
            if (i === -1) return;
            coins.splice(i, 1);
            const r = coin.el.getBoundingClientRect();
            coin.el.remove();
            flyCoin(r.left + r.width / 2, r.top + r.height / 2);
        }

        function tick(t) {
            const dt = lastT ? Math.min(50, t - lastT) : 16;
            lastT = t;

            if (coins.length < MAX_COINS && t > spawnAt && canSpawn()) {
                spawn();
                spawnAt = t + rand(1600, 3400);
            }

            const w = field.clientWidth;
            for (let i = coins.length - 1; i >= 0; i--) {
                const c = coins[i];
                c.x += c.vx * dt;
                c.phase += dt * 0.003;
                if (c.x < -c.size - 40 || c.x > w + c.size + 40) {
                    c.el.remove();
                    coins.splice(i, 1);
                    continue;
                }
                const y = c.baseY + Math.sin(c.phase) * BOB;
                c.el.style.transform = 'translate3d(' + c.x + 'px,' + y + 'px,0)';
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    })();

    // ---- Expose framework -------------------------------------------------
    Coins.fly = flyCoin;
    window.Arcade = { register: register, Coins: Coins, onCoins: onCoins, flyCoin: flyCoin };
    window.Coins = Coins;
})();
