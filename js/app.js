/* =========================================================
   SYNTAX SQUAD — GAME ENGINE (no login, no backend)
   Progress is saved in the browser (localStorage).
   ========================================================= */
(function () {
  'use strict';
  const { HEROES, ROUNDS, CARDS, BREAK, R2, R3, JIG_MSG, R4, TYPE_DESC, R5, R6, R6_SECONDS, SQUAD_ORDER, HOST_PIN } = window.SQ;
  const KEY = 'syntax-squad-v1';
  const app = document.getElementById('app');
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------------- STATE ---------------- */
  const DEF = () => ({ score: 0, done: {}, rs: {}, cards: [], life: { hint: 1, fifty: 1, skip: 1 }, host: false, timers: true });
  let S = load();
  function load() { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (v) return Object.assign(DEF(), v); } catch (e) { } return DEF(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

  /* ---------------- UI HELPERS ---------------- */
  function updateTop() { $('#score').textContent = S.score; $('#cardCount').textContent = S.cards.length; }
  function toast(msg, type) {
    const el = document.createElement('div'); el.className = 'toast ' + (type || ''); el.innerHTML = msg;
    $('#toast-root').appendChild(el); setTimeout(() => el.classList.add('out'), 2600); setTimeout(() => el.remove(), 3100);
  }
  function modal(html, onClose) {
    const root = $('#modal-root');
    root.innerHTML = `<div class="modal-back"><div class="modal">${html}</div></div>`;
    const close = () => { root.innerHTML = ''; if (onClose) onClose(); };
    $$('[data-close]', root).forEach(b => b.onclick = close);
    return root;
  }
  function confetti() {
    const colors = ['#E3262F', '#22D3EE', '#F59E0B', '#8B5CF6', '#10B981', '#fff'];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('div'); p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw'; p.style.background = colors[i % colors.length];
      p.style.animationDuration = (1.8 + Math.random() * 1.8) + 's'; p.style.animationDelay = Math.random() * .4 + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(p); setTimeout(() => p.remove(), 4200);
    }
  }
  function floatPts(n) { const el = document.createElement('div'); el.className = 'float-pts'; el.textContent = '+' + n; document.body.appendChild(el); setTimeout(() => el.remove(), 1300); }
  function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function setProgress(f) { const b = $('#prog'); if (b) b.style.width = Math.round(Math.min(1, f) * 100) + '%'; }
  function hearts(n) { return '<span class="hearts">' + [0, 1, 2].map(i => `<span class="${i < n ? '' : 'lost'}">♥</span>`).join('') + '</span>'; }

  /* ---------------- SCORE ---------------- */
  let curRound = -1;
  function addScore(n) {
    n = Math.round(n); if (n <= 0 || curRound < 0) return;
    const id = ROUNDS[curRound].id; S.score += n; S.rs[id] = (S.rs[id] || 0) + n; save(); updateTop(); floatPts(n);
    const sp = $('.score-pill'); sp.classList.remove('bump'); void sp.offsetWidth; sp.classList.add('bump');
  }

  /* ---------------- WHY CARDS ---------------- */
  function cardHTML(c) {
    return `<div class="why-card">
      <div class="wc-kicker">WHY CARD</div>
      <div class="wc-code">${esc(c.code)}</div>
      <h3>${esc(c.title)}</h3>
      <p>${c.why}</p>
      <div class="wc-analogy"><span>💡</span><div>${c.analogy}</div></div>
      <details class="wc-exam"><summary>📝 Exam definition</summary><p>${c.exam}</p></details>
    </div>`;
  }
  function showCards(ids, cb, onlyNew) {
    const list = (ids || []).filter(id => CARDS[id] && (!onlyNew || !S.cards.includes(id)));
    const next = () => {
      if (!list.length) { if (cb) cb(); return; }
      const id = list.shift(); const isNew = !S.cards.includes(id);
      if (isNew) { S.cards.push(id); save(); updateTop(); }
      modal(`<div class="unlock-label">${isNew ? '🔓 NEW WHY CARD UNLOCKED' : 'WHY CARD'}</div>${cardHTML(CARDS[id])}
             <button class="btn btn-primary wide" data-close>GOT IT →</button>`, next);
    };
    next();
  }

  /* ---------------- SVG ART (all original) ---------------- */
  let svgN = 0;
  function heroSVG(id, cls) {
    const h = HEROES[id]; const n = 'h' + (++svgN);
    const glyphSize = h.glyph.length > 1 ? 19 : 26;
    const horns = h.villain ? `<path d="M101 44 L88 10 L114 36 Z M139 44 L152 10 L126 36 Z" fill="${h.color}"/>` : '';
    const visor = h.villain ? '#FF1F3D' : '#22D3EE';
    return `<svg class="hero-svg ${h.villain ? 'villain' : ''} ${cls || ''}" viewBox="0 0 240 320" aria-hidden="true">
      <defs>
        <radialGradient id="${n}g"><stop offset="0" stop-color="${h.color}" stop-opacity=".55"/><stop offset="1" stop-color="${h.color}" stop-opacity="0"/></radialGradient>
        <linearGradient id="${n}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${h.color}"/><stop offset="1" stop-color="${h.dark}"/></linearGradient>
      </defs>
      <circle cx="120" cy="160" r="125" fill="url(#${n}g)"/>
      <path d="M84 96 L156 96 L200 294 L120 262 L40 294 Z" fill="${h.dark}" opacity=".95"/>
      <path d="M96 198 L119 198 L110 296 L84 296 Z" fill="url(#${n}b)"/>
      <path d="M121 198 L144 198 L160 296 L134 296 Z" fill="url(#${n}b)"/>
      <path d="M80 290 L112 290 L112 306 L76 306 Z M132 290 L162 290 L168 306 L132 306 Z" fill="#0B0B0F"/>
      <path d="M82 92 L158 92 L148 204 L92 204 Z" fill="url(#${n}b)"/>
      <path d="M86 100 L120 150 L154 100" fill="none" stroke="${h.accent}" stroke-opacity=".35" stroke-width="3"/>
      <rect x="92" y="186" width="56" height="12" rx="3" fill="#0B0B0F"/>
      <rect x="113" y="186" width="14" height="12" rx="2" fill="${h.accent}" opacity=".9"/>
      <path d="M82 96 L64 100 L46 172 L62 178 L82 122 Z" fill="url(#${n}b)"/>
      <circle cx="53" cy="181" r="11" fill="#0B0B0F"/>
      <path d="M158 96 L177 99 L203 42 L188 33 L166 80 Z" fill="url(#${n}b)"/>
      <circle cx="197" cy="31" r="12" fill="#0B0B0F"/>
      <circle cx="197" cy="31" r="20" fill="none" stroke="${h.accent}" stroke-opacity=".7" stroke-width="2" class="pulse"/>
      <rect x="111" y="76" width="18" height="18" fill="#0B0B0F"/>
      ${horns}
      <path d="M97 50 Q120 18 143 50 L141 78 Q120 94 99 78 Z" fill="url(#${n}b)"/>
      <path d="M102 56 L138 56 L134 67 L106 67 Z" fill="${visor}" class="visor"/>
      <circle cx="120" cy="140" r="25" fill="#0B0B0F" stroke="${h.accent}" stroke-width="3"/>
      <text x="120" y="${140 + glyphSize * 0.36}" text-anchor="middle" font-size="${glyphSize}" font-weight="700" font-family="JetBrains Mono, monospace" fill="${h.accent}">${esc(h.glyph)}</text>
    </svg>`;
  }
  function robotSVG(mood) {
    const c = mood === 'sad' ? '#EF4444' : '#22D3EE';
    const eyes = mood === 'happy' ? `<path d="M80 98 Q92 84 104 98 M136 98 Q148 84 160 98" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      : mood === 'sad' ? `<path d="M82 86 L102 104 M102 86 L82 104 M138 86 L158 104 M158 86 L138 104" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`
        : mood === 'confused' ? `<circle cx="92" cy="94" r="9" fill="${c}"/><path d="M138 94 L160 94" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`
          : `<circle cx="92" cy="94" r="9" fill="${c}"/><circle cx="148" cy="94" r="9" fill="${c}"/>`;
    const mouth = mood === 'happy' ? `<path d="M100 114 Q120 130 140 114" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : mood === 'sad' ? `<path d="M102 124 Q120 112 138 124" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`
        : `<path d="M104 120 L136 120" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 240 262" class="robot ${mood || 'idle'}" aria-hidden="true">
      <line x1="120" y1="22" x2="120" y2="48" stroke="#6B7280" stroke-width="4"/><circle cx="120" cy="16" r="8" fill="${c}" class="antenna"/>
      <rect x="50" y="48" width="140" height="100" rx="24" fill="#1F2937" stroke="#374151" stroke-width="4"/>
      <rect x="64" y="64" width="112" height="70" rx="16" fill="#07070A"/>
      ${eyes}${mouth}
      <rect x="70" y="156" width="100" height="74" rx="16" fill="#1F2937" stroke="#374151" stroke-width="4"/>
      <circle cx="120" cy="192" r="14" fill="#07070A" stroke="${c}" stroke-width="3"/>
      <rect x="34" y="164" width="28" height="54" rx="12" fill="#374151"/><rect x="178" y="164" width="28" height="54" rx="12" fill="#374151"/>
      <rect x="86" y="230" width="24" height="26" rx="6" fill="#374151"/><rect x="130" y="230" width="24" height="26" rx="6" fill="#374151"/>
    </svg>`;
  }
  const houseSVG = () => `<svg viewBox="0 0 100 90" aria-hidden="true"><path d="M8 42 L50 8 L92 42 Z" fill="#E3262F"/><rect x="18" y="42" width="64" height="44" rx="4" fill="#1F2937" stroke="#374151" stroke-width="3"/><rect x="42" y="56" width="16" height="30" rx="2" fill="#22D3EE" opacity=".85"/></svg>`;

  /* ---------------- TIMER / LIFELINES / CLEANUP ---------------- */
  let tInt = null, cleanups = [];
  const onLeave = fn => cleanups.push(fn);
  function stopTimer() { if (tInt) clearInterval(tInt); tInt = null; }
  function startTimer(min) {
    stopTimer(); const el = $('#timer'); if (!el) return;
    if (!S.timers) { el.textContent = '∞'; return; }
    const end = Date.now() + min * 60000;
    const tick = () => {
      if (!document.body.contains(el)) return stopTimer();
      const ms = end - Date.now();
      if (ms <= 0) { el.textContent = '00:00'; el.classList.add('over'); stopTimer(); toast("⏰ Time's up! Finish this question and wrap up the mission.", 'warn'); return; }
      const s = Math.ceil(ms / 1000); el.textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60);
      el.classList.toggle('low', s <= 60);
    };
    tick(); tInt = setInterval(tick, 500);
  }
  let LL = {};
  function setLL(o) { LL = Object.assign({ hint: null, fifty: null, skip: null }, o || {}); renderLL(); }
  function renderLL() {
    $$('[data-ll]').forEach(b => { const t = b.dataset.ll; b.querySelector('span').textContent = S.life[t]; b.disabled = !(LL[t] && S.life[t] > 0); });
  }
  function useLL(t) {
    if (!LL[t] || S.life[t] <= 0) return;
    if (LL[t]() === false) return;
    S.life[t]--; save(); renderLL();
  }

  /* ---------------- ROUTER ---------------- */
  function isUnlocked(i) { return S.host || i === 0 || !!S.done[ROUNDS[i - 1].id]; }
  function nextRound() { const i = ROUNDS.findIndex(r => !S.done[r.id]); return i < 0 ? null : i; }
  const VIEWS = {};
  function go(view, arg) {
    cleanups.forEach(f => { try { f(); } catch (e) { } }); cleanups = [];
    stopTimer(); setLL({}); curRound = -1; $('#modal-root').innerHTML = '';
    window.scrollTo(0, 0);
    (VIEWS[view] || VIEWS.home)(arg);
  }
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go, g.dataset.arg); return; }
    if (e.target.closest('[data-locked]')) { toast('🔒 Clear the previous mission to unlock this one.'); return; }
    const l = e.target.closest('[data-ll]'); if (l) useLL(l.dataset.ll);
  });

  /* =========================================================
     HOME
     ========================================================= */
  VIEWS.home = function () {
    const nx = nextRound();
    const startBtn = nx === null ? `<button class="btn btn-primary" data-go="victory">🏆 VIEW RESULTS</button>`
      : `<button class="btn btn-primary" data-go="intro" data-arg="${nx}">▶ ${S.score || Object.keys(S.done).length ? 'CONTINUE MISSION' : 'START MISSION'}</button>`;
    app.innerHTML = `
    <section class="banner">
      <div class="banner-bg"><div class="banner-slash"></div><div class="watermark">SQUAD</div></div>
      <div class="banner-text">
        <div class="kicker"><span class="dot"></span> A C PROGRAMMING ORIGIN STORY</div>
        <h1 class="mega">SYNTAX<br><span class="red">SQUAD</span></h1>
        <div class="meta"><span>2026</span><span class="tag">BEGINNER</span><span>7 MISSIONS</span><span>75 MIN</span></div>
        <p class="lead">Every line of C has a reason. Join the squad, earn your powers, and discover <b>why</b> <code>#include</code>, <code>main()</code>, <code>;</code> and <code>&amp;</code> exist — not just how to type them.</p>
        <div class="btn-row">${startBtn}<button class="btn" data-go="notebook">📓 MY NOTEBOOK</button></div>
      </div>
      <div class="banner-hero">${heroSVG('rookie', 'float')}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="h2">MISSIONS</h2>
        <div class="chips">${['All', 'Easy', 'Medium', 'Boss'].map((c, i) => `<button class="chip ${i ? '' : 'on'}" data-f="${c}">${c}</button>`).join('')}</div>
      </div>
      <div class="mission-row" id="mrow"></div>
    </section>

    <section class="section">
      <div class="section-head"><h2 class="h2">MEET THE SQUAD</h2><span class="muted">Each hero is a piece of C</span></div>
      <div id="squad"></div>
    </section>

    <footer class="foot">Syntax Squad · an original C-basics game for first-year CSE · Progress is saved on this device only.</footer>`;

    const drawMissions = f => {
      $('#mrow').innerHTML = ROUNDS.map((r, i) => ({ r, i })).filter(o => f === 'All' || o.r.level === f).map(({ r, i }) => {
        const h = HEROES[r.hero], un = isUnlocked(i), done = S.done[r.id];
        return `<button class="mcard ${un ? '' : 'locked'} ${done ? 'done' : ''}" style="--c:${h.color};--d:${h.dark}" ${un ? `data-go="intro" data-arg="${i}"` : 'data-locked="1"'}>
          <div class="mnum">${r.boss ? 'BOSS' : '0' + (i + 1)}</div>
          <div class="mstatus">${done ? '✔ CLEARED' : un ? r.minutes + ' MIN' : '🔒 LOCKED'}</div>
          ${heroSVG(r.hero)}
          <div class="minfo"><div class="mlevel">${r.level} · ${h.name}</div><div class="mtitle">${r.title}</div><div class="mconcept">${esc(r.concept)}</div></div>
        </button>`;
      }).join('');
    };
    drawMissions('All');
    $$('.chip').forEach(c => c.onclick = () => { $$('.chip').forEach(x => x.classList.remove('on')); c.classList.add('on'); drawMissions(c.dataset.f); });

    let k = 0;
    const drawSquad = () => {
      const id = SQUAD_ORDER[k], h = HEROES[id];
      $('#squad').innerHTML = `
      <div class="squad-card" style="--c:${h.color};--d:${h.dark}">
        <div class="sq-bg"><div class="sq-water">${h.name}</div><div class="sq-panel"></div></div>
        <div class="sq-text">
          <div class="crumb">Squad / <b>${h.villain ? 'Villains' : 'Heroes'}</b></div>
          <h3 class="sq-name">${h.name}</h3>
          <div class="sq-power">POWER: <code>${esc(h.concept)}</code></div>
          <p>${h.bio}</p>
          <div class="sq-nav"><button class="arrow dark" id="sqPrev" aria-label="Previous hero">←</button><span class="sq-count">${pad(k + 1)} / ${pad(SQUAD_ORDER.length)}</span><button class="arrow" id="sqNext" aria-label="Next hero">→</button></div>
        </div>
        <div class="sq-hero">${heroSVG(id, 'float')}</div>
        <div class="sq-dots">${SQUAD_ORDER.map((_, j) => `<span class="${j === k ? 'on' : ''}"></span>`).join('')}</div>
      </div>`;
      $('#sqPrev').onclick = () => { k = (k - 1 + SQUAD_ORDER.length) % SQUAD_ORDER.length; drawSquad(); };
      $('#sqNext').onclick = () => { k = (k + 1) % SQUAD_ORDER.length; drawSquad(); };
    };
    drawSquad();
  };

  /* =========================================================
     HERO INTRO
     ========================================================= */
  VIEWS.intro = function (i) {
    i = +i; if (!(i >= 0 && i < ROUNDS.length)) return VIEWS.home();
    if (!isUnlocked(i)) { toast('🔒 Clear the previous mission first.'); return VIEWS.home(); }
    const r = ROUNDS[i], h = HEROES[r.hero];
    app.innerHTML = `
    <section class="intro" style="--c:${h.color};--d:${h.dark}">
      <div class="intro-card">
        <div class="intro-bg"><div class="watermark">${h.name}</div><div class="intro-panel"></div></div>
        <div class="intro-text">
          <div class="crumb">${r.boss ? 'FINAL MISSION' : 'MISSION ' + (i + 1) + ' / 6'} · ${r.level} · ${r.minutes} MIN</div>
          <div class="kicker"><span class="dot"></span> ${r.boss ? 'VILLAIN' : 'HERO'}: ${h.name}</div>
          <h1 class="mega sm">${r.title}</h1>
          <p class="lead">${r.origin}</p>
          <div class="learn"><span>YOU'LL LEARN</span><code>${esc(r.concept)}</code></div>
          <div class="btn-row"><button class="btn btn-primary" data-go="play" data-arg="${i}">▶ START MISSION</button><button class="btn" data-go="home">← BASE</button></div>
        </div>
        <div class="intro-hero">${heroSVG(r.hero, 'float')}</div>
      </div>
    </section>`;
  };

  /* =========================================================
     PLAY (round frame)
     ========================================================= */
  const PLAYERS = {};
  VIEWS.play = function (i) {
    i = +i; if (!(i >= 0 && i < ROUNDS.length) || !isUnlocked(i)) return VIEWS.home();
    const r = ROUNDS[i], h = HEROES[r.hero];
    if (S.rs[r.id]) { S.score -= S.rs[r.id]; S.rs[r.id] = 0; save(); updateTop(); } // replay replaces old score
    curRound = i;
    app.innerHTML = `
    <div class="round" style="--c:${h.color};--d:${h.dark}">
      <div class="round-head">
        <div class="rh-left"><div class="emblem">${esc(h.glyph)}</div>
          <div><div class="rh-kicker">${r.boss ? 'BOSS BATTLE' : 'MISSION ' + (i + 1)} · ${h.name}</div><div class="rh-title">${r.title}</div></div></div>
        <div class="rh-right">
          <div class="timer" id="timer" title="Mission timer">--:--</div>
          <div class="lifelines">
            <button class="ll" data-ll="hint" title="Hint">💡<span></span></button>
            <button class="ll" data-ll="fifty" title="50-50">½<span></span></button>
            <button class="ll" data-ll="skip" title="Skip">⏭<span></span></button>
          </div>
        </div>
      </div>
      <div class="progress"><div class="prog-bar" id="prog"></div></div>
      <div id="rbody"></div>
    </div>`;
    startTimer(r.minutes); setLL({});
    PLAYERS[r.id]($('#rbody'), i);
  };

  function finishRound(i) {
    const r = ROUNDS[i], h = HEROES[r.hero];
    S.done[r.id] = true; save(); stopTimer(); setLL({}); confetti();
    const pts = S.rs[r.id] || 0; curRound = -1;
    app.innerHTML = `
    <section class="complete" style="--c:${h.color};--d:${h.dark}">
      <div class="kicker center"><span class="dot"></span> ${r.boss ? 'VILLAIN DEFEATED' : 'MISSION COMPLETE'}</div>
      <h1 class="mega sm">${r.title}</h1>
      <div class="badge-big"><span>${esc(h.glyph)}</span></div>
      <p class="lead">Badge unlocked: <b>${h.name}</b> emblem</p>
      <div class="stat-row"><div class="stat"><b>${pts}</b><span>Mission points</span></div><div class="stat"><b>${S.score}</b><span>Total score</span></div><div class="stat"><b>${S.cards.length}</b><span>Why Cards</span></div></div>
      <div class="btn-row center">${i < ROUNDS.length - 1 ? `<button class="btn btn-primary" data-go="intro" data-arg="${i + 1}">NEXT MISSION →</button>` : `<button class="btn btn-primary" data-go="victory">🏆 FINAL RESULTS</button>`}<button class="btn" data-go="home">BASE</button></div>
    </section>`;
  }

  /* ---------------- CODE EDITOR ---------------- */
  const KEYS = [';', '{', '}', '(', ')', '"', "'", '<', '>', '#', '%', '&', ',', '=', '+', '\\n', '⇥'];
  function editorHTML(id, code, rows) {
    return `<div class="editor"><pre class="gutter" id="${id}-g"></pre><textarea id="${id}" rows="${rows || 8}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Code editor">${esc(code)}</textarea></div>
      <div class="keybar" data-for="${id}">${KEYS.map(k => `<button type="button" class="key" data-k="${esc(k)}">${esc(k)}</button>`).join('')}</div>`;
  }
  function insertAt(ta, t) {
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + t + ta.value.slice(e); ta.selectionStart = ta.selectionEnd = s + t.length;
    ta.focus(); ta.dispatchEvent(new Event('input'));
  }
  function wireEditor(id, onInput) {
    const ta = $('#' + id), g = $('#' + id + '-g');
    const upd = () => { const n = ta.value.split('\n').length; g.textContent = Array.from({ length: Math.max(n, +ta.rows) }, (_, i) => i + 1).join('\n'); g.scrollTop = ta.scrollTop; if (onInput) onInput(ta.value); };
    ta.addEventListener('input', upd);
    ta.addEventListener('scroll', () => g.scrollTop = ta.scrollTop);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab') { e.preventDefault(); insertAt(ta, '    '); }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); const run = $('#run'); if (run) run.click(); }
    });
    const bar = $(`.keybar[data-for="${id}"]`);
    bar.addEventListener('mousedown', e => e.preventDefault());
    bar.addEventListener('click', e => { const b = e.target.closest('.key'); if (!b) return; insertAt(ta, b.dataset.k === '⇥' ? '    ' : b.dataset.k); });
    upd(); return ta;
  }
  function setCode(ta, code) { ta.value = code; ta.dispatchEvent(new Event('input')); }

  /* ---------------- C CHECKING HELPERS ---------------- */
  const strip = c => c.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const nonEmpty = c => strip(c).split('\n').map(l => l.trim()).filter(Boolean);

  function commonErrors(code) {
    for (const l of nonEmpty(code)) {
      if (/\bPrintf\b|\bPRINTF\b/.test(l)) return { msg: 'C is case-sensitive! <code>Printf</code> is not <code>printf</code>. Use all lowercase.', card: 'case' };
      if (/\bInt\s+main|\bMain\s*\(|\bReturn\b/.test(l)) return { msg: 'C is case-sensitive! Keywords like <code>int</code>, <code>main</code> and <code>return</code> are all lowercase.', card: 'case' };
      if (/\bprint\s*\(/.test(l)) return { msg: 'Almost! The function is called <code>printf</code> — print + f for formatted. C only knows the exact name.' };
      if (/\bprintf\b/.test(l)) {
        if (!/printf\s*\(/.test(l)) return { msg: 'printf needs round brackets: <code>printf("Hi");</code> — functions take their input inside <code>( )</code>.' };
        if (/printf\s*\(\s*'/.test(l)) return { msg: 'Text needs <b>double</b> quotes like <code>"Hi"</code>. Single quotes are only for one character like <code>\'A\'</code>.' };
        const q = (l.match(/"/g) || []).length;
        if (q === 0) return { msg: 'Text must be inside double quotes: <code>printf("Hi");</code> — otherwise C thinks Hi is the name of a box.' };
        if (q % 2) return { msg: 'A quote is left open! Text needs a pair of double quotes — one to open, one to close.' };
        if (!/\)/.test(l.slice(l.lastIndexOf('"')))) return { msg: 'Close the round bracket <code>)</code> after the text.' };
        if (!/\)\s*;/.test(l)) return { msg: 'Missing semicolon! Every instruction ends with <code>;</code> — the full stop of C.', card: 'semicolon' };
      }
      if (/^return\s+0\s*$/.test(l) || /^return\s+0\s*\}$/.test(l)) return { msg: 'Missing semicolon after <code>return 0</code>. FULLSTOP is upset!', card: 'semicolon' };
    }
    return null;
  }

  /* =========================================================
     ROUND 1 — THE MISSING TOOLBOX
     ========================================================= */
  const ERR = s => `<span class="err">${s}</span>`;
  const CUR = '<span class="cursor">█</span>';
  const R1S = [
    { goal: 'Make the robot say <b>Hi</b>. Type this line and press RUN:', show: 'printf("Hi");',
      check(c) { if (!/printf\s*\(\s*"Hi/i.test(strip(c))) return { msg: 'Type <code>printf("Hi");</code> exactly — it asks the computer to print Hi.' }; return { ok: true }; },
      robot: { mood: 'sad', say: "ERROR! printf? I don't know who that is! 🤔" },
      out: ERR("error: implicit declaration of function 'printf'"),
      after: 'Your line is correct — but the robot has never heard of <code>printf</code>. HEADER explains: <i>printf isn\'t built into C. It lives in a toolbox called stdio.h, and you have to bring that toolbox in first!</i>',
      cards: ['printf', 'include'], answer: 'printf("Hi");' },
    { goal: 'Bring in the toolbox. Add this as the <b>very first line</b>:', show: '#include <stdio.h>',
      check(c) {
        const L = nonEmpty(c); const i = L.findIndex(l => /include|stdio/.test(l));
        if (i < 0) return { msg: 'Add <code>#include &lt;stdio.h&gt;</code> on the first line.' };
        const l = L[i];
        if (!/#\s*include/.test(l)) return { msg: 'Missing <code>#</code>! The # tells the preprocessor: "this instruction is for you — do it before compiling".' };
        if (/studio/.test(l)) return { msg: 'It\'s <b>stdio</b> (STanDard Input Output), not "studio". Easy mistake!' };
        if (!/<\s*stdio\.h\s*>/.test(l)) return { msg: 'Write the toolbox name exactly: <code>&lt;stdio.h&gt;</code> — angle brackets, and <code>.h</code> because it\'s a header file.' };
        if (/;\s*$/.test(l)) return { msg: 'No semicolon after <code>#include</code>! It\'s an instruction for the preprocessor, not a C statement.' };
        if (i !== 0) return { msg: 'The toolbox must come <b>first</b> — before anyone uses printf. Move it to line 1.' };
        return { ok: true };
      },
      robot: { mood: 'confused', say: "I know printf now! But… where do I START? I can't find the front door! 🚪" },
      out: ERR("undefined reference to 'main'"),
      after: 'The toolbox works! But every C program needs one starting point, and the computer always looks for a door called <code>main</code>.',
      cards: ['main'], answer: '#include <stdio.h>\nprintf("Hi");' },
    { goal: 'Add the front door. Put this on a new line <b>after #include and before printf</b>:', show: 'int main()',
      check(c) {
        const L = nonEmpty(c); const im = L.findIndex(l => /main/i.test(l));
        if (im < 0) return { msg: 'Add <code>int main()</code> between the #include line and printf.' };
        const l = L[im];
        if (!/\bint\s+main/.test(l)) return { msg: 'Write <code>int</code> before main — it means main gives back a whole number when it finishes.' };
        if (!/main\s*\(\s*(void)?\s*\)/.test(l)) return { msg: 'main needs empty round brackets: <code>main()</code>.' };
        if (/main\s*\(\s*(void)?\s*\)\s*;/.test(l)) return { msg: 'No semicolon after <code>int main()</code>! A <code>;</code> here closes the door before the room even starts.' };
        const ip = L.findIndex(x => /printf/.test(x)), ii = L.findIndex(x => /#\s*include/.test(x));
        if (!(ii < im && im < ip)) return { msg: 'Order matters: the toolbox first, then the front door <code>int main()</code>, then printf.' };
        return { ok: true };
      },
      robot: { mood: 'confused', say: 'Found the door! But… which instructions belong to main? I see no walls! 🧱' },
      out: ERR("error: expected '{' before 'printf'"),
      after: 'main exists, but its work has no boundary. Curly braces <code>{ }</code> are the walls of main\'s room.',
      cards: ['braces'], answer: '#include <stdio.h>\nint main()\nprintf("Hi");' },
    { goal: 'Build the walls: put <code>{</code> right after <code>int main()</code>, and <code>}</code> on the last line, so printf is <b>inside</b>.', show: 'int main() {\n    printf("Hi");\n}',
      check(c) {
        const s = strip(c); const open = (s.match(/\{/g) || []).length, close = (s.match(/\}/g) || []).length;
        if (!open) return { msg: 'Add the opening wall <code>{</code> right after <code>int main()</code>.' };
        if (!close) return { msg: 'Main\'s room needs a closing wall <code>}</code> at the end.' };
        if (open !== close) return { msg: `Walls come in pairs! You have ${open} <code>{</code> and ${close} <code>}</code>.` };
        const a = s.search(/main\s*\(\s*(void)?\s*\)\s*\{/), p = s.search(/printf/), z = s.lastIndexOf('}');
        if (a < 0) return { msg: 'The <code>{</code> must come right after <code>int main()</code>.' };
        if (!(a < p && p < z)) return { msg: 'printf must be <b>inside</b> the walls — between <code>{</code> and <code>}</code>.' };
        return { ok: true };
      },
      robot: { mood: 'happy', say: 'I said Hi! 😄 But… nobody knows if everything went well. Should I report back?' },
      out: 'Hi' + CUR,
      after: 'It runs! But main should report to the operating system that everything finished fine. That\'s what <code>return 0;</code> does.',
      cards: ['return'], answer: '#include <stdio.h>\nint main() {\n    printf("Hi");\n}' },
    { goal: 'Report back: add this line <b>after printf, before the closing }</b>:', show: 'return 0;',
      check(c) {
        const s = strip(c);
        if (!/return/.test(s)) return { msg: 'Add <code>return 0;</code> just before the closing <code>}</code>.' };
        if (!/return\s+0/.test(s)) return { msg: 'Write <code>return 0;</code> — 0 means "everything went fine".' };
        if (!/return\s+0\s*;/.test(s)) return { msg: 'Missing semicolon after <code>return 0</code>. FULLSTOP is upset!', card: 'semicolon' };
        const r = s.search(/return\s+0/), p = s.search(/printf/), z = s.lastIndexOf('}');
        if (!(p < r && r < z)) return { msg: '<code>return 0;</code> is main\'s final report — put it after printf and before the closing <code>}</code>.' };
        return { ok: true };
      },
      robot: { mood: 'happy', say: 'Reported "all good" to the OS ✅ — but look, the cursor is stuck right after Hi…' },
      out: 'Hi' + CUR,
      after: 'Program complete! One problem: the cursor stays glued after <code>Hi</code>, so anything printed next would stick to the same line.',
      cards: [], answer: '#include <stdio.h>\nint main() {\n    printf("Hi");\n    return 0;\n}' },
    { goal: 'Final polish: add <code>\\n</code> inside the quotes, right after Hi:', show: 'printf("Hi\\n");',
      check(c) {
        const s = strip(c);
        if (/"\s*\\n/.test(s) && !/Hi[^"]*\\n"/.test(s)) return { msg: '<code>\\n</code> must go <b>inside</b> the quotes: <code>"Hi\\n"</code>.' };
        if (/\/n/.test(s)) return { msg: 'It\'s a <b>back</b>slash <code>\\n</code>, not a forward slash <code>/n</code>.' };
        if (!/printf\s*\(\s*"Hi[^"]*\\n"/.test(s)) return { msg: 'Change the printf line to <code>printf("Hi\\n");</code>' };
        return { ok: true };
      },
      robot: { mood: 'happy', say: 'Hi! 👋 I can talk now — thank you, Rookie!' },
      out: 'Hi\n' + CUR,
      after: 'Perfect program! And now you know why every single line is there.',
      cards: ['newline'], answer: '#include <stdio.h>\nint main() {\n    printf("Hi\\n");\n    return 0;\n}' }
  ];
  function keeps(c, k) {
    const s = strip(c);
    if (k >= 1 && !/printf/.test(s)) return 'Keep your printf line — the robot still needs to say Hi!';
    if (k >= 2 && !/#\s*include\s*<\s*stdio\.h\s*>/.test(s)) return 'Keep <code>#include &lt;stdio.h&gt;</code> on the first line — the toolbox is still needed!';
    if (k >= 3 && !/int\s+main\s*\(\s*(void)?\s*\)/.test(s)) return 'Keep <code>int main()</code> — the front door!';
    if (k >= 4 && !/\{[\s\S]*\}/.test(s)) return 'Keep main\'s walls <code>{ }</code>!';
    if (k >= 5 && !/return\s+0\s*;/.test(s)) return 'Keep <code>return 0;</code> — main still has to report back.';
    return null;
  }

  PLAYERS.r1 = function (body, ri) {
    let st = 0, hp = 3, miss = 0, code = '';
    const draw = () => {
      const s = R1S[st]; setProgress(st / R1S.length);
      body.innerHTML = `
      <div class="grid2">
        <div class="panel">
          <div class="step-row"><span class="step">STEP ${st + 1} / ${R1S.length}</span>${hearts(hp)}</div>
          <p class="goal">${s.goal}</p>
          <pre class="code show">${esc(s.show)}</pre>
          ${editorHTML('ed', code, 8)}
          <div id="fb"></div>
          <div class="btn-row"><button class="btn btn-primary" id="run">▶ RUN</button><button class="btn hidden" id="ans">SHOW ANSWER</button></div>
        </div>
        <div class="panel robot-panel">
          <div class="bubble" id="bubble">${st === 0 ? "Beep boop. I'm brand new. Teach me to talk!" : 'Waiting for your code…'}</div>
          <div id="robot">${robotSVG('idle')}</div>
          <div class="console"><div class="console-head"><i></i><i></i><i></i> OUTPUT</div><pre id="out">$ _</pre></div>
        </div>
      </div>`;
      const ta = wireEditor('ed', v => code = v);
      $('#run').onclick = run;
      $('#ans').onclick = () => setCode(ta, s.answer);
      setLL({
        hint: () => { $('#fb').innerHTML = `<div class="fb hint">💡 The full code for this step is:<pre class="code">${esc(s.answer)}</pre></div>`; },
        skip: () => { code = s.answer; setCode(ta, code); success(true); }
      });
    };
    const fail = r => {
      miss++; hp = Math.max(0, hp - 1);
      $('.hearts').outerHTML = hearts(hp);
      $('#fb').innerHTML = `<div class="fb bad">❌ ${r.msg}${hp === 0 ? '<br><small>Out of hearts — tap SHOW ANSWER, read it carefully, then RUN.</small>' : ''}</div>`;
      shake($('.editor')); $('#robot').innerHTML = robotSVG('confused'); $('#bubble').textContent = 'Hmm… something is not right. 🤔';
      if (hp === 0) $('#ans').classList.remove('hidden');
      if (r.card) showCards([r.card], null, true);
    };
    const run = () => {
      const s = R1S[st];
      const k = keeps(code, st); if (k) return fail({ msg: k });
      const ce = commonErrors(code); if (ce) return fail(ce);
      const r = s.check(code); if (!r.ok) return fail(r);
      success(false);
    };
    const success = skipped => {
      const s = R1S[st];
      if (!skipped) addScore(Math.max(40, 100 - 20 * miss));
      $('#robot').innerHTML = robotSVG(s.robot.mood); $('#bubble').textContent = s.robot.say; $('#out').innerHTML = s.out;
      $('#fb').innerHTML = `<div class="fb ${s.robot.mood === 'sad' ? 'info' : 'good'}">${s.robot.mood === 'sad' ? '🔎' : '✅'} ${s.after}</div>`;
      $('#ans').classList.add('hidden'); setLL({});
      const btn = $('#run'); btn.textContent = st < R1S.length - 1 ? 'NEXT STEP →' : 'BONUS LAB →';
      btn.onclick = () => { st++; hp = 3; miss = 0; if (st < R1S.length) draw(); else breakLab(); };
      if (s.cards.length) setTimeout(() => { if (document.body.contains(btn)) showCards(s.cards); }, 900);
    };
    const breakLab = () => {
      setProgress(1); setLL({});
      body.innerHTML = `
      <div class="panel narrow">
        <div class="kicker"><span class="dot"></span> BONUS LAB</div>
        <h2 class="h2">WHAT IF I REMOVE IT?</h2>
        <p class="goal">Here's your finished program. Tap 🗑 on any line to see what would break — breaking things is how real programmers learn.</p>
        <div class="break-list">${BREAK.map((b, i) => `
          <div class="break-item"><div class="break-line"><code>${esc(b.line)}</code><button class="btn sm" data-b="${i}">🗑 Remove</button></div>
          <div class="break-why hidden" id="bw${i}">${b.why}</div></div>`).join('')}</div>
        <div class="btn-row"><button class="btn btn-primary" id="fin">FINISH MISSION ✔</button></div>
      </div>`;
      $$('[data-b]', body).forEach(b => b.onclick = () => { $('#bw' + b.dataset.b).classList.remove('hidden'); b.closest('.break-item').classList.add('broken'); b.textContent = '💥 Broken'; });
      $('#fin').onclick = () => finishRound(ri);
    };
    draw();
  };

  /* =========================================================
     ROUND 2 — SEMICOLON HUNT
     ========================================================= */
  PLAYERS.r2 = function (body, ri) {
    let q = 0, combo = 0, t0 = 0, phase = 'tap';
    const mult = () => combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
    const draw = () => {
      const it = R2[q]; phase = 'tap'; t0 = Date.now(); setProgress(q / R2.length);
      body.innerHTML = `
      <div class="panel narrow">
        <div class="step-row"><span class="step">BUG ${q + 1} / ${R2.length}</span><span class="combo ${combo >= 3 ? 'hot' : ''}">🔥 STREAK ${combo}${mult() > 1 ? ' · x' + mult() : ''}</span></div>
        ${it.note ? `<p class="note">${it.note}</p>` : ''}
        <p class="goal"><b>Tap the line with the bug.</b></p>
        <div class="code-lines">${it.lines.map((l, i) => `<button class="cl" data-i="${i}"><span class="ln">${i + 1}</span><code>${esc(l)}</code></button>`).join('')}</div>
        <div id="fix"></div><div id="fb"></div>
      </div>`;
      $$('.cl', body).forEach(b => b.onclick = () => tap(+b.dataset.i, b));
      setLL({
        hint: () => { if (phase !== 'tap') { toast('You already found the line — pick the fix!'); return false; } $(`.cl[data-i="${it.bug}"]`).classList.add('hinted'); },
        fifty: () => {
          if (phase !== 'fix') { toast('Use 50-50 after you find the buggy line.'); return false; }
          const wrong = $$('#fix .opt').filter(o => !o.disabled && +o.dataset.o !== it.answer);
          if (wrong[0]) { wrong[0].disabled = true; wrong[0].classList.add('gone'); }
        },
        skip: () => { combo = 0; next(); }
      });
    };
    const tap = (i, btn) => {
      if (phase !== 'tap') return;
      const it = R2[q];
      if (i !== it.bug) { combo = 0; btn.classList.add('wrong'); shake(btn); setTimeout(() => btn.classList.remove('wrong'), 600); $('.combo').innerHTML = '🔥 STREAK 0'; toast('Not this one — look again!'); return; }
      phase = 'fix'; btn.classList.add('found'); $$('.cl', body).forEach(b => b.disabled = true);
      const order = shuffle(it.options.map((_, k) => k));
      $('#fix').innerHTML = `<p class="goal">Line ${i + 1} is broken! Pick the correct fix:</p>
        <div class="opts">${order.map(k => `<button class="opt" data-o="${k}"><code>${esc(it.options[k].trim())}</code></button>`).join('')}</div>`;
      $$('#fix .opt').forEach(o => o.onclick = () => choose(+o.dataset.o, o));
    };
    const choose = (k, btn) => {
      if (phase !== 'fix') return; phase = 'done'; setLL({});
      const it = R2[q]; $$('#fix .opt').forEach(o => { o.disabled = true; if (+o.dataset.o === it.answer) o.classList.add('right'); });
      if (k === it.answer) {
        combo++; const secs = (Date.now() - t0) / 1000; const pts = (100 + Math.max(0, 50 - Math.floor(secs) * 5)) * mult();
        addScore(pts); $('#fb').innerHTML = `<div class="fb good">✅ Fixed! +${Math.round(pts)} ${mult() > 1 ? '(streak x' + mult() + ')' : ''}<br>${it.why}</div>`;
      } else {
        combo = 0; btn.classList.add('wrong'); $('#fb').innerHTML = `<div class="fb bad">❌ Not quite. ${it.why}</div>`;
      }
      $('#fb').insertAdjacentHTML('beforeend', `<div class="btn-row"><button class="btn btn-primary" id="nx">${q < R2.length - 1 ? 'NEXT BUG →' : 'FINISH MISSION ✔'}</button></div>`);
      $('#nx').onclick = next;
      if (it.card) showCards([it.card], null, true);
    };
    const next = () => { q++; if (q < R2.length) draw(); else finishRound(ri); };
    showCards(['semicolon'], draw, true);
  };

  /* =========================================================
     ROUND 3 — CODE JIGSAW
     ========================================================= */
  PLAYERS.r3 = function (body, ri) {
    let p = 0, miss = 0, pool = [], ans = [], bad = -1, solved = false;
    const start = () => {
      const P = R3[p]; miss = 0; ans = []; bad = -1; solved = false;
      const idx = P.lines.map((_, i) => i);
      do { pool = shuffle(idx); } while (pool.every((v, i) => v === i));
      render();
    };
    const fits = (pos, k) => { const P = R3[p], want = P.lines[pos], got = P.lines[k]; return k === pos || (want.g && want.g === got.g) || want.t === got.t; };
    const render = () => {
      const P = R3[p]; setProgress(p / R3.length);
      body.innerHTML = `
      <div class="panel narrow">
        <div class="step-row"><span class="step">BLUEPRINT ${p + 1} / ${R3.length}</span><span class="muted">${P.goal}</span></div>
        <div class="console target"><div class="console-head"><i></i><i></i><i></i> TARGET OUTPUT</div><pre>${esc(P.output)}</pre></div>
        <div class="jig-label">YOUR PROGRAM <small>(tap a line to send it back)</small></div>
        <div class="jig-ans">${ans.length ? ans.map((k, i) => `<button class="jl ${i === bad ? 'bad' : ''} ${solved ? 'ok' : ''}" data-a="${i}"><span class="ln">${i + 1}</span><code>${esc(P.lines[k].t)}</code></button>`).join('') : '<div class="empty">Tap the lines below, top to bottom, to build the program.</div>'}</div>
        <div class="jig-label">LINES</div>
        <div class="jig-pool">${pool.map((k, i) => `<button class="chip-line" data-p="${i}"><code>${esc(P.lines[k].t.trim())}</code></button>`).join('') || '<div class="empty">All lines placed. Check your order!</div>'}</div>
        <div id="fb"></div>
        <div class="btn-row"><button class="btn btn-primary" id="chk" ${pool.length || solved ? 'disabled' : ''}>✔ CHECK ORDER</button></div>
      </div>`;
      if (!solved) {
        $$('[data-p]', body).forEach(b => b.onclick = () => { ans.push(pool.splice(+b.dataset.p, 1)[0]); bad = -1; render(); });
        $$('[data-a]', body).forEach(b => b.onclick = () => { pool.push(ans.splice(+b.dataset.a, 1)[0]); bad = -1; render(); });
        $('#chk').onclick = check;
      }
      setLL(solved ? {} : {
        hint: () => {
          let i = 0; while (i < ans.length && fits(i, ans[i])) i++;
          pool.push(...ans.splice(i)); const j = pool.findIndex(k => fits(i, k));
          ans.push(pool.splice(j, 1)[0]); bad = -1; render();
        },
        skip: () => next()
      });
    };
    const check = () => {
      const P = R3[p]; const i = ans.findIndex((k, pos) => !fits(pos, k));
      if (i >= 0) {
        miss++; bad = i; render();
        $('#fb').innerHTML = `<div class="fb bad">❌ Line ${i + 1} is in the wrong place. ${JIG_MSG[P.lines[i].k]}</div>`; shake($('.jig-ans'));
        return;
      }
      solved = true; addScore(Math.max(40, 100 - 20 * miss)); render();
      $('#fb').innerHTML = `<div class="fb good">✅ Blueprint rebuilt! ARCHITECT approves: toolbox → front door → work inside the walls → report → closing wall.</div>
        <div class="btn-row"><button class="btn btn-primary" id="nx">${p < R3.length - 1 ? 'NEXT BLUEPRINT →' : 'FINISH MISSION ✔'}</button></div>`;
      $('#nx').onclick = next;
    };
    const next = () => { p++; if (p < R3.length) start(); else finishRound(ri); };
    start();
  };

  /* =========================================================
     ROUND 4 — MEMORY BOXES
     ========================================================= */
  PLAYERS.r4 = function (body, ri) {
    let q = 0; const ram = []; let answered = false;
    const addr = i => '0x7ffe' + (0x1a40 + i * 4).toString(16);
    const ramHTML = () => `<div class="ram-grid">${Array.from({ length: 8 }, (_, i) => {
      const b = ram[i]; return b ? `<div class="ram-box filled t-${b.t}"><span class="rt">${b.t}</span><b>${esc(b.v)}</b><small>${addr(i)}</small></div>`
        : `<div class="ram-box"><span class="rt">free</span><b>—</b><small>${addr(i)}</small></div>`;
    }).join('')}</div>`;
    const draw = () => {
      const it = R4[q]; answered = false; setProgress(q / R4.length);
      const opts = it.kind === 'classify' ? ['int', 'float', 'char'] : it.options;
      body.innerHTML = `
      <div class="grid2">
        <div class="panel">
          <div class="step-row"><span class="step">${it.kind === 'classify' ? 'STORE' : 'MATCH'} ${q + 1} / ${R4.length}</span></div>
          ${it.kind === 'classify'
          ? `<p class="goal">Which box does this value belong in?</p><div class="falling"><span>${esc(it.v)}</span></div>
             <div class="box-row">${opts.map((t, k) => `<button class="type-box opt" data-o="${k}"><b>${t}</b><small>${TYPE_DESC[t]}</small></button>`).join('')}</div>`
          : `<p class="goal">${it.q}</p>${it.code ? `<pre class="code big">${esc(it.code)}</pre>` : ''}
             <div class="opts">${opts.map((o, k) => `<button class="opt" data-o="${k}"><code>${esc(o)}</code></button>`).join('')}</div>`}
          <div id="fb"></div>
        </div>
        <div class="panel ram-panel">
          <div class="console-head"><i></i><i></i><i></i> RAM WALL · VAULT</div>
          <p class="muted small">Every variable is a labelled box in memory, with its own address.</p>
          ${ramHTML()}
        </div>
      </div>`;
      const correct = it.kind === 'classify' ? opts.indexOf(it.t) : it.answer;
      $$('.opt', body).forEach(o => o.onclick = () => choose(+o.dataset.o, correct));
      setLL({
        hint: () => { $('#fb').innerHTML = `<div class="fb hint">💡 ${it.kind === 'classify' ? 'Look for a decimal point, or single quotes around one character.' : it.hint}</div>`; },
        fifty: () => { const w = $$('.opt', body).filter(o => !o.disabled && +o.dataset.o !== correct); if (w[0]) { w[0].disabled = true; w[0].classList.add('gone'); } },
        skip: () => next()
      });
    };
    const choose = (k, correct) => {
      if (answered) return; answered = true; setLL({});
      const it = R4[q]; $$('.opt', body).forEach(o => { o.disabled = true; if (+o.dataset.o === correct) o.classList.add('right'); else if (+o.dataset.o === k) o.classList.add('wrong'); });
      if (k === correct) {
        addScore(100);
        if (it.kind === 'classify') { ram.push({ v: it.v, t: it.t }); $('.ram-panel .ram-grid').outerHTML = ramHTML(); $$('.ram-box.filled').slice(-1)[0].classList.add('pop'); }
        $('#fb').innerHTML = `<div class="fb good">✅ ${it.why}</div>`;
      } else {
        $('#fb').innerHTML = `<div class="fb bad">❌ ${it.why}</div>`;
        if (it.kind === 'classify') { ram.push({ v: it.v, t: it.t }); $('.ram-panel .ram-grid').outerHTML = ramHTML(); }
      }
      $('#fb').insertAdjacentHTML('beforeend', `<div class="btn-row"><button class="btn btn-primary" id="nx">${q < R4.length - 1 ? 'NEXT →' : 'FINISH MISSION ✔'}</button></div>`);
      $('#nx').onclick = next;
    };
    const next = () => { q++; if (q >= R4.length) return finishRound(ri); const it = R4[q]; if (it.card) showCards([it.card], draw, true); else draw(); };
    showCards(['variable', 'types'], draw, true);
  };

  /* =========================================================
     ROUND 5 — COURIER MISSION (scanf + &)
     ========================================================= */
  const TNAME = { d: 'int', f: 'float', c: 'char' };
  function scanfCheck(code, expect) {
    const s = strip(code).trim();
    if (!s) return { msg: 'Write a scanf line first.' };
    if (/\bScanf\b|\bSCANF\b/.test(s)) return { msg: 'C is case-sensitive: it\'s <code>scanf</code> in lowercase.', card: 'case' };
    if (!/\bscanf\b/.test(s)) return { msg: 'Use <code>scanf</code> — the function that reads what the user types (it lives in the stdio toolbox too).' };
    if (!/scanf\s*\(/.test(s)) return { msg: 'scanf needs round brackets: <code>scanf( ... );</code>' };
    if (!/"/.test(s)) return { msg: 'Format codes go inside double quotes, like <code>"%d"</code>.' };
    const m = s.match(/scanf\s*\(\s*"([^"]*)"\s*(,?)\s*([^)]*)\)\s*(;?)/);
    if (!m) return { msg: 'Check the shape: <code>scanf("%d", &amp;name);</code> — quotes closed and a <code>)</code> at the end.' };
    const specs = m[1].match(/%[a-z]/g) || [];
    if (!m[2]) return { msg: 'Put a comma after the quotes, then the delivery address: <code>"%d", &amp;age</code>' };
    const args = m[3].split(',').map(a => a.trim()).filter(Boolean);
    if (specs.length !== expect.length) return { msg: `You need ${expect.length} format code${expect.length > 1 ? 's' : ''} inside the quotes — one for each value.` };
    for (let i = 0; i < expect.length; i++) {
      if (specs[i] !== '%' + expect[i].t) return { msg: `📦 Package doesn't fit! <code>${expect[i].v}</code> is a <b>${TNAME[expect[i].t]}</b> box, so its format code is <code>%${expect[i].t}</code>.`, card: 'format' };
    }
    if (args.length !== expect.length) return { msg: `You need ${expect.length} address${expect.length > 1 ? 'es' : ''} after the comma — one for each box.` };
    for (let i = 0; i < expect.length; i++) {
      const a = args[i];
      if (!a.startsWith('&')) return { lost: true, msg: `🌀 BLINK is lost! You gave the courier the <b>name</b> <code>${esc(a)}</code>, not the <b>address</b>. Write <code>&amp;${expect[i].v}</code> — & means "address of".`, card: 'ampersand' };
      if (a.replace('&', '').trim() !== expect[i].v) return { lost: true, msg: `🌀 There's no house called <code>${esc(a.replace('&', '').trim())}</code> here. The box is named <code>${expect[i].v}</code>.` };
    }
    if (!m[4]) return { msg: 'Missing semicolon at the end! FULLSTOP says every instruction ends with <code>;</code>', card: 'semicolon' };
    return { ok: true };
  }
  PLAYERS.r5 = function (body, ri) {
    let q = 0, hp = 3, miss = 0, code = '';
    const draw = () => {
      const d = R5[q]; code = ''; hp = 3; miss = 0; setProgress(q / R5.length);
      body.innerHTML = `
      <div class="grid2">
        <div class="panel">
          <div class="step-row"><span class="step">DELIVERY ${q + 1} / ${R5.length}</span>${hearts(hp)}</div>
          <div class="jig-label">THE BOX${d.expect.length > 1 ? 'ES' : ''}</div>
          <pre class="code">${esc(d.decl)}</pre>
          <p class="goal">${d.story}</p>
          ${editorHTML('ed', '', 2)}
          <div id="fb"></div>
          <div class="btn-row"><button class="btn btn-primary" id="run">⚡ SEND BLINK</button><button class="btn hidden" id="ans">SHOW ANSWER</button></div>
        </div>
        <div class="panel scene-panel">
          <div class="console-head"><i></i><i></i><i></i> DELIVERY MAP</div>
          <div class="parcel">⌨ The user typed: <b>${esc(d.typed)}</b></div>
          <div class="track" id="track">
            <div class="courier" id="courier"><div class="parcel-box">📦</div>${heroSVG('blink')}</div>
            <div class="houses">${d.expect.map((e, i) => `<div class="house" id="house-${i}">${houseSVG()}<div class="house-name">${e.v}</div><div class="house-addr">0x7ffe${(0x2b10 + q * 16 + i * 4).toString(16)}</div><div class="house-val" id="hv-${i}">empty</div></div>`).join('')}</div>
          </div>
        </div>
      </div>`;
      const ta = wireEditor('ed', v => code = v);
      $('#run').onclick = send; $('#ans').onclick = () => setCode(ta, d.answer);
      setLL({
        hint: () => { $('#fb').innerHTML = `<div class="fb hint">💡 Shape: <code>scanf("FORMAT", &amp;BOX);</code> — the format code matches the box type (${d.expect.map(e => `${e.v} → %${e.t}`).join(', ')}).</div>`; },
        skip: () => { setCode(ta, d.answer); deliver(true); }
      });
    };
    const send = () => {
      const d = R5[q]; const r = scanfCheck(code, d.expect);
      if (r.ok) return deliver(false);
      miss++; hp = Math.max(0, hp - 1); $('.hearts').outerHTML = hearts(hp);
      const c = $('#courier'); c.classList.remove('lost', 'deliver'); c.style.left = ''; void c.offsetWidth;
      if (r.lost) c.classList.add('lost'); else shake($('.editor'));
      $('#fb').innerHTML = `<div class="fb bad">${r.lost ? '' : '❌ '}${r.msg}${hp === 0 ? '<br><small>Out of hearts — tap SHOW ANSWER, study it, then send BLINK.</small>' : ''}</div>`;
      if (hp === 0) $('#ans').classList.remove('hidden');
      if (r.card) setTimeout(() => showCards([r.card], null, true), r.lost ? 1300 : 300);
    };
    const deliver = skipped => {
      const d = R5[q]; setLL({});
      if (!skipped) addScore(Math.max(40, 100 - 20 * miss));
      const c = $('#courier'), track = $('#track'), house = $('#house-0');
      c.classList.remove('lost');
      c.style.left = Math.max(0, house.getBoundingClientRect().left - track.getBoundingClientRect().left - c.offsetWidth - 4) + 'px';
      c.classList.add('deliver');
      setTimeout(() => d.vals.forEach((v, i) => { const hv = $('#hv-' + i); if (hv) { hv.textContent = v; hv.classList.add('filled'); } }), 1100);
      $('#ans').classList.add('hidden');
      $('#fb').innerHTML = `<div class="fb good">✅ Delivered! scanf read <b>${esc(d.typed)}</b> and BLINK carried it to the address of ${d.expect.map(e => `<code>${e.v}</code>`).join(' and ')}. ${q === 0 ? 'That <code>&amp;</code> is what makes it work.' : ''}</div>`;
      const btn = $('#run'); btn.textContent = q < R5.length - 1 ? 'NEXT DELIVERY →' : 'FINISH MISSION ✔';
      btn.onclick = () => { q++; if (q < R5.length) draw(); else finishRound(ri); };
      if (q === 0) setTimeout(() => { if (document.body.contains(btn)) showCards(['ampersand'], null, true); }, 1500);
    };
    draw();
  };

  /* =========================================================
     ROUND 6 — PREDICT THE OUTPUT
     ========================================================= */
  PLAYERS.r6 = function (body, ri) {
    let q = 0, left = 0, iv = null, locked = false;
    const stop = () => { if (iv) clearInterval(iv); iv = null; };
    onLeave(stop);
    const draw = () => {
      const it = R6[q]; locked = false; left = R6_SECONDS; setProgress(q / R6.length);
      body.innerHTML = `
      <div class="panel narrow">
        <div class="step-row"><span class="step">QUESTION ${q + 1} / ${R6.length}</span><span class="qtimer" id="qt">${R6_SECONDS}</span></div>
        <div class="tbar"><div id="tbar"></div></div>
        <p class="goal">What will this print?</p>
        <pre class="code big">${esc(it.code)}</pre>
        <div class="opts grid4">${it.options.map((o, i) => `<button class="opt" data-o="${i}"><span class="opt-l">${'ABCD'[i]}</span><code>${esc(o)}</code></button>`).join('')}</div>
        <div id="fb"></div>
      </div>`;
      $$('.opt', body).forEach(o => o.onclick = () => answer(+o.dataset.o));
      const t0 = Date.now(); stop();
      iv = setInterval(() => {
        left = Math.max(0, R6_SECONDS - (Date.now() - t0) / 1000);
        const qt = $('#qt'), tb = $('#tbar'); if (!qt) return stop();
        qt.textContent = Math.ceil(left); tb.style.width = (left / R6_SECONDS * 100) + '%'; tb.classList.toggle('low', left < 5);
        if (left <= 0) answer(-1);
      }, 100);
      setLL({
        hint: () => { $('#fb').innerHTML = `<div class="fb hint">💡 ${it.hint}</div>`; },
        fifty: () => { shuffle($$('.opt', body).filter(o => +o.dataset.o !== it.answer)).slice(0, 2).forEach(o => { o.disabled = true; o.classList.add('gone'); }); },
        skip: () => { stop(); next(); }
      });
    };
    const answer = k => {
      if (locked) return; locked = true; stop(); setLL({});
      const it = R6[q];
      $$('.opt', body).forEach(o => { o.disabled = true; if (+o.dataset.o === it.answer) o.classList.add('right'); else if (+o.dataset.o === k) o.classList.add('wrong'); });
      if (k === it.answer) { const pts = 50 + Math.ceil(left) * 10; addScore(pts); $('#fb').innerHTML = `<div class="fb good">✅ SEER is impressed! +${pts}<br>${it.why}</div>`; }
      else $('#fb').innerHTML = `<div class="fb bad">${k < 0 ? '⏰ Time\'s up!' : '❌ Not quite.'} ${it.why}</div>`;
      $('#fb').insertAdjacentHTML('beforeend', `<div class="btn-row"><button class="btn btn-primary" id="nx">${q < R6.length - 1 ? 'NEXT QUESTION →' : 'FINISH MISSION ✔'}</button></div>`);
      $('#nx').onclick = next;
      if (it.card) setTimeout(() => showCards([it.card], null, true), 700);
    };
    const next = () => { q++; if (q < R6.length) draw(); else finishRound(ri); };
    draw();
  };

  /* =========================================================
     BOSS — SEGFAULT
     ========================================================= */
  function semisOK(s) {
    let any = false;
    for (const l of s.split('\n').map(x => x.trim()).filter(Boolean)) {
      if (/^#/.test(l)) continue;
      const re = /\b(printf|scanf)\s*\(/g; let m;
      while ((m = re.exec(l))) {
        any = true; let i = m.index + m[0].length, depth = 1, inQ = false;
        for (; i < l.length && depth > 0; i++) { const ch = l[i]; if (ch === '"' && l[i - 1] !== '\\') inQ = !inQ; else if (!inQ) { if (ch === '(') depth++; else if (ch === ')') depth--; } }
        if (depth > 0 || l.slice(i).trimStart()[0] !== ';') return false;
      }
      if (/^(int|float|char)\s+(?!main\b)/.test(l)) { any = true; if (!/;\s*$/.test(l)) return false; }
      if (/^return\b/.test(l)) { any = true; if (!/;\s*\}?\s*$/.test(l)) return false; }
      if (/^[A-Za-z_]\w*\s*=[^=]/.test(l) && !/;\s*\}?\s*$/.test(l)) return false;
    }
    return any;
  }
  const BOSS = [
    { label: '#include <stdio.h>', hint: 'Start with the toolbox: <code>#include &lt;stdio.h&gt;</code>', test: s => /#\s*include\s*<\s*stdio\.h\s*>/.test(s) },
    { label: 'int main()', hint: 'Add the front door: <code>int main()</code>', test: s => /\bint\s+main\s*\(\s*(void)?\s*\)/.test(s) },
    { label: '{ } walls around the work', hint: 'Put <code>{</code> after <code>int main()</code> and <code>}</code> at the very end.', test: s => /main\s*\(\s*(void)?\s*\)\s*\{[\s\S]*\}\s*$/.test(s.trim()) },
    { label: 'Declare int boxes', hint: 'Create the boxes: <code>int a, b, sum;</code>', test: s => /\bint\s+(?!main\b)[A-Za-z_]\w*/.test(s) },
    { label: 'scanf with %d and &', hint: 'Read the input: <code>scanf("%d %d", &amp;a, &amp;b);</code>', test: s => /scanf\s*\(\s*"[^"]*%d[^"]*"\s*,\s*&\s*[A-Za-z_]/.test(s) },
    { label: 'Add the two numbers', hint: 'Calculate: <code>sum = a + b;</code>', test: s => /[A-Za-z_]\w*\s*=\s*[A-Za-z_]\w*\s*\+\s*[A-Za-z_]\w*/.test(s) || /printf\s*\([^;]*,\s*[A-Za-z_]\w*\s*\+\s*[A-Za-z_]\w*/.test(s) },
    { label: 'printf the sum with %d', hint: 'Print it: <code>printf("Sum = %d\\n", sum);</code>', test: s => /printf\s*\(\s*"[^"]*%d[^"]*"\s*,\s*[^)]+\)/.test(s) },
    { label: 'if (sum > 100)', hint: 'Make a decision: <code>if (sum &gt; 100)</code>', test: s => /\bif\s*\([^)]*>\s*100\s*\)/.test(s) },
    { label: 'Print "Big number!"', hint: 'Under the if: <code>printf("Big number!\\n");</code>', test: s => /printf\s*\(\s*"Big number!?(\\n)?"\s*\)/i.test(s) },
    { label: 'return 0;', hint: 'Report back: <code>return 0;</code> before the closing <code>}</code>', test: s => /\breturn\s+0\s*;/.test(s) },
    { label: 'Every statement ends with ;', hint: 'Check that every printf, scanf, declaration, calculation and return ends with <code>;</code>', test: s => semisOK(s) }
  ];
  function simulate(src, a, b) {
    const s = strip(src), vals = {}; const sum = a + b;
    const scanVars = []; let m; const sre = /scanf\s*\(\s*"[^"]*"\s*,([^)]*)\)/g;
    while ((m = sre.exec(s))) m[1].split(',').forEach(x => { const v = x.replace('&', '').trim(); if (v) scanVars.push(v); });
    if (scanVars[0]) vals[scanVars[0]] = a; if (scanVars[1]) vals[scanVars[1]] = b;
    const valOf = t => { t = t.trim(); if (/^-?\d+$/.test(t)) return +t; if (t in vals) return vals[t]; if (t.includes('+')) return t.split('+').reduce((x, y) => x + valOf(y), 0); return sum; };
    let out = ''; const pre = /printf\s*\(\s*"((?:[^"\\]|\\.)*)"([^;]*)\)\s*;/g;
    while ((m = pre.exec(s))) {
      let f = m[1]; if (/big number/i.test(f) && !(sum > 100)) continue;
      const args = m[2].split(',').map(x => x.trim()).filter(Boolean); let k = 0;
      f = f.replace(/%d/g, () => (k < args.length ? valOf(args[k++]) : '?')).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      out += f;
    }
    return out || '(nothing was printed)';
  }
  PLAYERS.boss = function (body, ri) {
    let code = '// Defeat SEGFAULT! Write your full program below.\n', done = false, lastHit = 0;
    const draw = () => {
      setProgress(0);
      body.innerHTML = `
      <div class="grid2 boss">
        <div class="panel">
          <div class="step-row"><span class="step">FINAL MISSION</span><span class="muted">Write it from scratch</span></div>
          <p class="goal">Write a <b>complete</b> C program that:<br>1) reads <b>two integers</b> from the user,<br>2) prints their <b>sum</b>,<br>3) prints <b>"Big number!"</b> if the sum is greater than 100.</p>
          ${editorHTML('ed', code, 14)}
          <div id="fb"></div>
          <div class="btn-row"><button class="btn btn-primary" id="run">⚔ STRIKE!</button><button class="btn" id="retreat">END BATTLE</button></div>
          <div id="sim"></div>
        </div>
        <div class="panel villain-panel">
          <div class="villain-wrap" id="villain">${heroSVG('segfault')}</div>
          <div class="hp-label"><span>SEGFAULT</span><span id="hpTxt">100%</span></div>
          <div class="hp"><div id="hp"></div></div>
          <div class="checklist" id="cl"></div>
        </div>
      </div>`;
      wireEditor('ed', v => { code = v; update(); });
      $('#run').onclick = strike;
      $('#retreat').onclick = () => {
        if (done) return finishRound(ri);
        modal(`<h3 class="h3">End the battle now?</h3><p>You'll keep points for every part you've completed so far.</p><div class="btn-row"><button class="btn btn-primary" id="yes">END BATTLE</button><button class="btn" data-close>KEEP FIGHTING</button></div>`);
        $('#yes').onclick = () => { $('#modal-root').innerHTML = ''; addScore(results().filter(Boolean).length * 30); finishRound(ri); };
      };
      setLL({ hint: () => { const i = results().findIndex(x => !x); if (i < 0) { toast('Everything is ticked — STRIKE!'); return false; } $('#fb').innerHTML = `<div class="fb hint">💡 ${BOSS[i].hint}</div>`; } });
      update();
    };
    const results = () => { const s = strip(code); return BOSS.map(c => { try { return c.test(s); } catch (e) { return false; } }); };
    const update = () => {
      if (done) return;
      const r = results(), n = r.filter(Boolean).length, hpPct = Math.round(100 * (1 - n / BOSS.length));
      $('#cl').innerHTML = BOSS.map((c, i) => `<div class="ci ${r[i] ? 'ok' : ''}"><span>${r[i] ? '✔' : '○'}</span>${esc(c.label)}</div>`).join('');
      $('#hp').style.width = hpPct + '%'; $('#hpTxt').textContent = hpPct + '%'; setProgress(n / BOSS.length);
      if (n > lastHit) { const v = $('#villain'); v.classList.remove('hit'); void v.offsetWidth; v.classList.add('hit'); }
      lastHit = n;
    };
    const strike = () => {
      if (done) return;
      const r = results(), missing = BOSS.filter((_, i) => !r[i]);
      if (missing.length) {
        shake($('#villain'));
        $('#fb').innerHTML = `<div class="fb bad">⚔ SEGFAULT survives! Still missing: ${missing.map(m => `<b>${esc(m.label)}</b>`).join(', ')}.</div>`;
        return;
      }
      done = true; setLL({});
      addScore(BOSS.length * 30 + 200);
      $('#villain').classList.add('defeated'); $('#hp').style.width = '0%'; $('#hpTxt').textContent = '0%';
      confetti();
      $('#fb').innerHTML = `<div class="fb good">💥 SEGFAULT DEFEATED! Your program is complete and correct. +${BOSS.length * 30 + 200}</div>`;
      $('#sim').innerHTML = `
        <div class="sim">
          <div class="console-head"><i></i><i></i><i></i> RUN YOUR PROGRAM</div>
          <div class="sim-row"><input id="na" type="number" value="45" aria-label="First number"><input id="nb" type="number" value="70" aria-label="Second number"><button class="btn sm btn-primary" id="go">▶ RUN</button></div>
          <pre id="simOut">$ ./a.out</pre>
        </div>
        <div class="btn-row"><button class="btn btn-primary" id="fin">CLAIM VICTORY 🏆</button></div>`;
      const runSim = () => { const a = parseInt($('#na').value, 10) || 0, b = parseInt($('#nb').value, 10) || 0; $('#simOut').textContent = `$ ./a.out\n${a} ${b}\n${simulate(code, a, b)}`; };
      $('#go').onclick = runSim; runSim();
      $('#fin').onclick = () => finishRound(ri);
      $('#retreat').classList.add('hidden'); $('#run').classList.add('hidden');
    };
    showCards(['if'], draw, true);
  };

  /* =========================================================
     VICTORY
     ========================================================= */
  VIEWS.victory = function () {
    const sc = S.score;
    const rank = sc >= 6500 ? 'LEGEND' : sc >= 4500 ? 'HERO' : sc >= 2500 ? 'SIDEKICK' : 'ROOKIE';
    const line = ['rookie', 'header', 'fullstop', 'architect', 'vault', 'blink', 'seer'];
    const doneFor = { rookie: true, header: S.done.r1, fullstop: S.done.r2, architect: S.done.r3, vault: S.done.r4, blink: S.done.r5, seer: S.done.r6 };
    app.innerHTML = `
    <section class="victory">
      <div class="kicker center"><span class="dot"></span> ${S.done.boss ? 'SQUAD ASSEMBLED · SEGFAULT DEFEATED' : 'SQUAD STATUS'}</div>
      <h1 class="mega center">MISSION<br><span class="red">ACCOMPLISHED</span></h1>
      <div class="rank-card"><div><small>YOUR RANK</small><div class="rank">${rank}</div></div><div class="final-score">${sc}<span>POINTS</span></div></div>
      <div class="lineup">${line.map(id => `<div class="lu ${doneFor[id] ? '' : 'dim'}" style="--c:${HEROES[id].color}">${heroSVG(id)}<span>${id === 'rookie' ? 'YOU' : HEROES[id].name}</span></div>`).join('')}</div>
      <div class="round-scores">${ROUNDS.map(r => `<div class="rsc ${S.done[r.id] ? '' : 'dim'}"><span>${r.title}</span><b>${S.rs[r.id] || 0}</b></div>`).join('')}</div>
      <p class="lead center">Take your Why Cards with you — they explain every line you learned today.</p>
      <div class="btn-row center"><button class="btn btn-primary" data-go="notebook">📓 OPEN MY C NOTEBOOK</button><button class="btn" data-go="home">BASE</button></div>
    </section>`;
    if (S.done.boss) confetti();
  };

  /* =========================================================
     NOTEBOOK
     ========================================================= */
  VIEWS.notebook = function () {
    const ids = Object.keys(CARDS);
    app.innerHTML = `
    <section class="notebook">
      <div class="nb-head">
        <div><div class="kicker"><span class="dot"></span> ${S.cards.length} / ${ids.length} WHY CARDS COLLECTED</div>
          <h1 class="mega sm">MY C NOTEBOOK</h1>
          <p class="lead">Every card explains <b>why</b>. Revise these before your lab exam.</p></div>
        <button class="btn btn-primary" id="print">🖨 PRINT / SAVE AS PDF</button>
      </div>
      <h1 class="print-only print-title">My C Notebook — Syntax Squad</h1>
      <div class="nb-grid">${ids.map(id => S.cards.includes(id) ? cardHTML(CARDS[id])
      : `<div class="why-card locked"><div class="wc-kicker">LOCKED</div><div class="wc-code">? ? ?</div><p>Play more missions to unlock this card.</p></div>`).join('')}</div>
    </section>`;
    $('#print').onclick = () => { $$('.wc-exam').forEach(d => d.open = true); window.print(); };
  };

  /* =========================================================
     HOST PANEL
     ========================================================= */
  VIEWS.host = function () {
    if (!S.host) {
      app.innerHTML = `
      <section class="panel narrow host">
        <div class="kicker"><span class="dot"></span> ORGANISERS ONLY</div>
        <h1 class="mega sm">HOST PANEL</h1>
        <p class="lead">Enter the host PIN to unlock all missions and event controls.</p>
        <input id="pin" class="pin" type="password" inputmode="numeric" placeholder="PIN" autocomplete="off">
        <div class="btn-row"><button class="btn btn-primary" id="unl">UNLOCK</button><button class="btn" data-go="home">BACK</button></div>
      </section>`;
      const tryPin = () => { if ($('#pin').value === HOST_PIN) { S.host = true; save(); toast('Host mode on — all missions unlocked', 'good'); VIEWS.host(); } else { toast('Wrong PIN', 'bad'); shake($('#pin')); } };
      $('#unl').onclick = tryPin; $('#pin').onkeydown = e => { if (e.key === 'Enter') tryPin(); };
      return;
    }
    app.innerHTML = `
    <section class="panel narrow host">
      <div class="kicker"><span class="dot"></span> HOST MODE ON</div>
      <h1 class="mega sm">HOST PANEL</h1>
      <p class="muted">These controls only affect <b>this device</b>. Use them on the projector machine, or on a student's phone to help them catch up.</p>
      <h3 class="h3">Jump to a mission</h3>
      <div class="host-grid">${ROUNDS.map((r, i) => `<button class="btn sm" data-go="intro" data-arg="${i}">${r.boss ? 'BOSS' : i + 1} · ${r.title}</button>`).join('')}</div>
      <h3 class="h3">Controls</h3>
      <div class="host-grid">
        <button class="btn sm" id="tmr">⏱ Timers: ${S.timers ? 'ON' : 'OFF'}</button>
        <button class="btn sm" id="refill">💡 Refill lifelines</button>
        <button class="btn sm" data-go="victory">🏆 Results screen</button>
        <button class="btn sm danger" id="reset">🗑 Reset all progress</button>
        <button class="btn sm" id="exit">🔒 Exit host mode</button>
      </div>
    </section>`;
    $('#tmr').onclick = () => { S.timers = !S.timers; save(); VIEWS.host(); };
    $('#refill').onclick = () => { S.life = { hint: 1, fifty: 1, skip: 1 }; save(); toast('Lifelines refilled', 'good'); };
    $('#exit').onclick = () => { S.host = false; save(); go('home'); };
    $('#reset').onclick = () => {
      modal(`<h3 class="h3">Reset everything on this device?</h3><p>Score, cleared missions, Why Cards and lifelines will all be wiped.</p><div class="btn-row"><button class="btn btn-primary danger" id="yes">YES, RESET</button><button class="btn" data-close>CANCEL</button></div>`);
      $('#yes').onclick = () => { S = DEF(); save(); updateTop(); $('#modal-root').innerHTML = ''; toast('Progress reset', 'good'); go('home'); };
    };
  };

  /* ---------------- BOOT ---------------- */
  updateTop();
  go('home');
  window.SQAPP = { go, state: () => S, scanfCheck, commonErrors, R1S, keeps, BOSS, simulate, semisOK, strip };
})();
