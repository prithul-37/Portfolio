/* =========================================================================
   NEON SNAKE — arcade game module
   Registers itself with the Arcade framework (Games/arcade.js).
   Entry cost is charged by the lobby; retries are charged here.
   ========================================================================= */
(function () {
    'use strict';
    if (!window.Arcade) return;

    const HI_KEY = 'neonSnakeHi';

    function mount(root, api) {
        root.innerHTML =
            '<div class="arcade-marquee snk-marquee">NEON&nbsp;SNAKE</div>' +
            '<div class="arcade-hud">' +
                '<span>SCORE&nbsp;<b class="snk-score">0</b></span>' +
                '<span>HI&nbsp;<b class="snk-hi">0</b></span>' +
            '</div>' +
            '<div class="arcade-screen">' +
                '<canvas class="snk-canvas" width="380" height="380"></canvas>' +
                '<div class="arcade-overlay snk-overlay">' +
                    '<p class="arcade-msg snk-msg">READY?</p>' +
                    '<button class="arcade-start snk-start" type="button">START</button>' +
                    '<p class="arcade-hint">Arrow keys / WASD &middot; Swipe on mobile</p>' +
                '</div>' +
            '</div>' +
            '<div class="arcade-dpad" aria-hidden="true">' +
                '<button class="dpad-btn" type="button" data-dir="up">▲</button>' +
                '<div class="dpad-row">' +
                    '<button class="dpad-btn" type="button" data-dir="left">◀</button>' +
                    '<button class="dpad-btn" type="button" data-dir="right">▶</button>' +
                '</div>' +
                '<button class="dpad-btn" type="button" data-dir="down">▼</button>' +
            '</div>';

        const canvas = root.querySelector('.snk-canvas');
        const ctx = canvas.getContext('2d');
        const overlay = root.querySelector('.snk-overlay');
        const msgEl = root.querySelector('.snk-msg');
        const startBtn = root.querySelector('.snk-start');
        const scoreEl = root.querySelector('.snk-score');
        const hiEl = root.querySelector('.snk-hi');

        const GRID = 19;
        const CELL = canvas.width / GRID; // 20px cells

        let snake, dir, nextDir, food, score, stepMs, acc, last, alive, playing, rafId;
        let state = 'ready'; // 'ready' | 'over'
        let hi = parseInt(localStorage.getItem(HI_KEY) || '0', 10) || 0;
        hiEl.textContent = hi;

        function reset() {
            const mid = Math.floor(GRID / 2);
            snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
            dir = { x: 1, y: 0 };
            nextDir = { x: 1, y: 0 };
            score = 0;
            stepMs = 130;
            alive = true;
            scoreEl.textContent = 0;
            placeFood();
        }

        function placeFood() {
            let p;
            do {
                p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
            } while (snake.some(s => s.x === p.x && s.y === p.y));
            food = p;
        }

        // Ignore reversals relative to the committed heading.
        function setDir(nx, ny) {
            if (nx === -dir.x && ny === -dir.y) return;
            nextDir = { x: nx, y: ny };
        }

        function step() {
            dir = nextDir;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
            if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) return gameOver();
            if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();

            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreEl.textContent = score;
                if (score > hi) {
                    hi = score;
                    hiEl.textContent = hi;
                    localStorage.setItem(HI_KEY, String(hi));
                }
                stepMs = Math.max(70, 130 - score * 2);
                placeFood();
            } else {
                snake.pop();
            }
        }

        function gameOver() {
            alive = false;
            playing = false;
            cancelAnimationFrame(rafId);
            state = 'over';
            msgEl.textContent = 'GAME OVER';
            overlay.classList.remove('hidden');
            updateStartBtn();
        }

        function updateStartBtn() {
            if (state === 'ready') {
                startBtn.textContent = 'START';
                startBtn.disabled = false;
            } else if (api.coins() >= api.cost) {
                startBtn.innerHTML = 'RETRY · ' + api.cost + ' <span class="coin-ic"></span>';
                startBtn.disabled = false;
            } else {
                startBtn.textContent = 'NO COINS';
                startBtn.disabled = true;
            }
        }

        function roundRect(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.fill();
        }

        function cell(gx, gy, margin, r) {
            roundRect(gx * CELL + margin, gy * CELL + margin, CELL - margin * 2, CELL - margin * 2, r);
        }

        function draw() {
            ctx.fillStyle = '#05030d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(41,242,255,0.05)';
            ctx.lineWidth = 1;
            for (let i = 1; i < GRID; i++) {
                ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
            }

            ctx.save();
            ctx.shadowColor = '#ff2e88';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#ff2e88';
            cell(food.x, food.y, 5, 4);
            ctx.restore();

            snake.forEach((s, i) => {
                const head = i === 0;
                ctx.save();
                ctx.shadowColor = head ? '#8ff8ff' : 'rgba(41,242,255,0.6)';
                ctx.shadowBlur = head ? 16 : 8;
                ctx.fillStyle = head ? '#8ff8ff' : '#29f2ff';
                cell(s.x, s.y, head ? 2 : 3, head ? 5 : 3);
                ctx.restore();
            });
        }

        function loop(t) {
            if (!playing) return;
            if (!last) last = t;
            acc += t - last;
            last = t;
            while (acc >= stepMs) {
                step();
                acc -= stepMs;
                if (!alive) break;
            }
            draw();
            if (playing) rafId = requestAnimationFrame(loop);
        }

        function beginRound() {
            reset();
            overlay.classList.add('hidden');
            playing = true;
            acc = 0;
            last = 0;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(loop);
        }

        function onStart() {
            if (state === 'ready') { beginRound(); return; }
            // Retry costs a coin.
            if (api.spend(api.cost)) beginRound();
            else updateStartBtn();
        }

        // ---- Input --------------------------------------------------------
        function onKey(e) {
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': setDir(0, -1); e.preventDefault(); break;
                case 'ArrowDown': case 's': case 'S': setDir(0, 1); e.preventDefault(); break;
                case 'ArrowLeft': case 'a': case 'A': setDir(-1, 0); e.preventDefault(); break;
                case 'ArrowRight': case 'd': case 'D': setDir(1, 0); e.preventDefault(); break;
                case ' ': case 'Enter':
                    if (!playing) { onStart(); e.preventDefault(); }
                    break;
            }
        }
        document.addEventListener('keydown', onKey);

        startBtn.addEventListener('click', onStart);

        root.querySelectorAll('.arcade-dpad .dpad-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const d = btn.dataset.dir;
                if (d === 'up') setDir(0, -1);
                else if (d === 'down') setDir(0, 1);
                else if (d === 'left') setDir(-1, 0);
                else setDir(1, 0);
            });
        });

        let tsx = 0, tsy = 0;
        canvas.addEventListener('touchstart', function (e) {
            const t = e.touches[0];
            tsx = t.clientX;
            tsy = t.clientY;
        }, { passive: true });
        canvas.addEventListener('touchend', function (e) {
            const t = e.changedTouches[0];
            const dx = t.clientX - tsx;
            const dy = t.clientY - tsy;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
            if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
            else setDir(0, dy > 0 ? 1 : -1);
            if (!playing && state === 'ready') beginRound();
        });

        // ---- Boot ---------------------------------------------------------
        state = 'ready';
        reset();
        draw();
        playing = false;
        msgEl.textContent = 'READY?';
        overlay.classList.remove('hidden');
        updateStartBtn();

        return {
            destroy: function () {
                playing = false;
                cancelAnimationFrame(rafId);
                document.removeEventListener('keydown', onKey);
            }
        };
    }

    window.Arcade.register({
        id: 'snake',
        name: 'NEON SNAKE',
        tag: 'Eat · grow · survive',
        icon: '🐍',
        cost: 1,
        accent: '#29f2ff',
        hiKey: HI_KEY,
        mount: mount
    });
})();
