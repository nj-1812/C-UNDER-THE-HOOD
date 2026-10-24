/* =========================================================
   SYNTAX SQUAD — ORIGINAL COMIC-BOOK HERO ART (inline SVG)
   Every hero has its own body type and pose.
   ========================================================= */
(function () {
  'use strict';
  const K = '#111';
  const GOLD = '#FACC15';
  let n = 0;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* --- building blocks --- */
  const limb = (pts, w, col) =>
    `<polyline points="${pts}" fill="none" stroke="${K}" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const ball = (x, y, r, col) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="${K}" stroke-width="4"/>`;

  function torso(cx, ys, yw, S, W, c, id) {
    return `<path d="M ${cx - S} ${ys} Q ${cx} ${ys - 12} ${cx + S} ${ys} L ${cx + W} ${yw} L ${cx - W} ${yw} Z" fill="${c}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M ${cx + 4} ${ys - 6} Q ${cx + S * 0.7} ${ys - 5} ${cx + S - 2} ${ys + 2} L ${cx + W - 2} ${yw - 2} L ${cx + 4} ${yw - 2} Z" fill="url(#${id}ht)" opacity=".5"/>
      <path d="M ${cx - S + 6} ${ys + 6} L ${cx - W + 4} ${yw - 18}" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/>
      <path d="M ${cx - S * 0.55} ${ys + 18} Q ${cx} ${ys + 40} ${cx + S * 0.55} ${ys + 18}" fill="none" stroke="${K}" stroke-width="3" opacity=".45"/>
      <rect x="${cx - W - 2}" y="${yw - 15}" width="${2 * W + 4}" height="15" rx="3" fill="${K}"/>
      <rect x="${cx - 9}" y="${yw - 15}" width="18" height="15" rx="2" fill="${GOLD}" stroke="${K}" stroke-width="2.5"/>`;
  }

  function head(cx, cy, s, c, villain, id) {
    const P = (x, y) => `${cx + x * s} ${cy + y * s}`;
    const eye = villain ? '#FF1F3D' : '#fff';
    const horns = villain
      ? `<path d="M ${P(-14, -24)} L ${P(-30, -58)} L ${P(-2, -30)} Z M ${P(14, -24)} L ${P(30, -58)} L ${P(2, -30)} Z" fill="${c}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>` : '';
    return `<rect x="${cx - 9 * s}" y="${cy + 20 * s}" width="${18 * s}" height="${16 * s}" fill="${K}"/>
      ${horns}
      <path d="M ${P(-23, 2)} Q ${P(-26, -31)} ${P(0, -33)} Q ${P(26, -31)} ${P(23, 2)} Q ${P(19, 27)} ${P(0, 31)} Q ${P(-19, 27)} ${P(-23, 2)} Z" fill="${c}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M ${P(2, -31)} Q ${P(24, -29)} ${P(22, 2)} Q ${P(18, 25)} ${P(2, 29)} Z" fill="url(#${id}ht)" opacity=".45"/>
      <path d="M ${P(-14, -22)} Q ${P(-8, -28)} ${P(0, -29)}" stroke="#fff" stroke-opacity=".55" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>
      <path d="M ${P(-18, -7)} L ${P(-3, 0)} L ${P(-5, 8)} L ${P(-18, 4)} Z M ${P(18, -7)} L ${P(3, 0)} L ${P(5, 8)} L ${P(18, 4)} Z" fill="${eye}" stroke="${K}" stroke-width="3" stroke-linejoin="round" class="eyes"/>
      <path d="M ${P(-7, 18)} Q ${P(0, 21)} ${P(7, 18)}" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }

  function emblem(cx, cy, r, h) {
    const fs = h.glyph.length > 1 ? r * 0.85 : r * 1.15;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${h.accent}" stroke="${K}" stroke-width="4"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 6}" fill="none" stroke="${K}" stroke-width="2" opacity=".35"/>
      <text x="${cx}" y="${cy + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="800" font-family="JetBrains Mono, monospace" fill="${K}">${esc(h.glyph)}</text>`;
  }
  const boot = (pts, w, d) => limb(pts, w, d);
  const cape = (d, path) => `<path d="${path}" fill="${d}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`;

  /* --- poses (viewBox 240 x 320) --- */
  const POSES = {
    /* ROOKIE: classic raised fist */
    rookie(h, c, d, id) {
      return cape(d, 'M 88 100 L 152 100 L 198 300 L 120 278 L 42 300 Z') +
        limb('104,196 98,248 97,282', 22, c) + boot('97,278 96,294 82,300', 20, d) +
        limb('136,196 144,248 147,282', 22, c) + boot('147,278 150,294 164,300', 20, d) +
        limb('86,106 68,150 72,184', 18, c) + ball(72, 190, 11, d) +
        torso(120, 100, 200, 36, 24, c, id) + head(120, 60, 1, c, false, id) +
        limb('154,106 182,78 194,44', 18, c) + ball(196, 34, 14, d) +
        `<circle cx="196" cy="34" r="22" fill="none" stroke="${h.accent}" stroke-width="3" class="pulse"/>` +
        emblem(120, 142, 22, h);
    },
    /* HEADER: armoured, energy blast from the palm */
    header(h, c, d, id) {
      return limb('106,196 92,246 84,284', 22, c) + boot('84,280 82,296 66,300', 20, d) +
        limb('134,196 150,246 158,284', 22, c) + boot('158,280 160,296 176,300', 20, d) +
        limb('86,106 62,146 90,178', 18, c) + ball(92, 180, 10, d) +
        torso(120, 100, 200, 36, 24, c, id) +
        ball(84, 102, 15, d) + ball(156, 102, 15, d) +
        head(120, 60, 1, c, false, id) +
        limb('154,106 190,114 210,100', 18, c) +
        `<circle cx="222" cy="94" r="30" fill="${h.accent}" opacity=".35" class="glow"/>` +
        `<g stroke="${K}" stroke-width="4" stroke-linecap="round"><line x1="222" y1="56" x2="222" y2="68"/><line x1="222" y1="120" x2="222" y2="132"/><line x1="196" y1="70" x2="203" y2="77"/><line x1="196" y1="118" x2="203" y2="111"/></g>` +
        ball(218, 96, 15, '#E0FBFF') + emblem(120, 142, 22, h);
    },
    /* FULLSTOP: speedster mid-stride */
    fullstop(h, c, d, id) {
      return `<g stroke="${K}" stroke-width="5" stroke-linecap="round" opacity=".55"><line x1="6" y1="118" x2="44" y2="118"/><line x1="2" y1="150" x2="34" y2="150"/><line x1="12" y1="182" x2="46" y2="182"/></g>` +
        limb('110,198 80,234 52,248', 22, c) + boot('56,248 40,246 32,232', 20, d) +
        limb('132,198 166,232 160,280', 22, c) + boot('160,276 162,294 180,298', 20, d) +
        `<g transform="rotate(10 120 200)">` +
        limb('88,108 60,136 38,122', 18, c) + ball(36, 120, 10, d) +
        torso(120, 100, 200, 34, 22, c, id) + head(120, 60, 1, c, false, id) +
        limb('152,108 178,140 200,114', 18, c) + ball(202, 110, 11, d) +
        emblem(120, 142, 22, h) + `</g>`;
    },
    /* ARCHITECT: guardian with a brace shield */
    architect(h, c, d, id) {
      return limb('106,196 100,248 98,284', 22, c) + boot('98,280 96,296 82,300', 20, d) +
        limb('134,196 142,248 146,284', 22, c) + boot('146,280 148,296 162,300', 20, d) +
        limb('154,106 172,150 166,186', 18, c) + ball(166, 192, 11, d) +
        torso(120, 100, 200, 36, 24, c, id) + head(120, 60, 1, c, false, id) +
        limb('86,106 70,140 84,158', 18, c) +
        `<g class="shield"><circle cx="76" cy="160" r="48" fill="${d}" stroke="${K}" stroke-width="5"/>
          <circle cx="76" cy="160" r="37" fill="${c}" stroke="${K}" stroke-width="3"/>
          <circle cx="76" cy="160" r="25" fill="${h.accent}" stroke="${K}" stroke-width="3"/>
          <path d="M 44 136 Q 56 120 76 118" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/>
          <text x="76" y="169" text-anchor="middle" font-size="24" font-weight="800" font-family="JetBrains Mono, monospace" fill="${K}">{}</text></g>`;
    },
    /* VAULT: the big brute */
    vault(h, c, d, id) {
      return limb('100,202 86,250 84,284', 28, c) + boot('84,280 82,296 64,300', 26, d) +
        limb('140,202 154,250 156,284', 28, c) + boot('156,280 158,296 176,300', 26, d) +
        limb('72,114 44,158 52,194', 28, c) + ball(52, 204, 19, d) +
        limb('168,114 196,158 188,194', 28, c) + ball(188, 204, 19, d) +
        torso(120, 104, 206, 50, 34, c, id) +
        ball(74, 110, 20, c) + ball(166, 110, 20, c) +
        head(120, 70, 0.9, c, false, id) + emblem(120, 150, 26, h);
    },
    /* BLINK: low crouch, ready to teleport */
    blink(h, c, d, id) {
      return `<g stroke="${h.color}" stroke-width="4" stroke-linecap="round" opacity=".7"><line x1="20" y1="150" x2="48" y2="140"/><line x1="16" y1="186" x2="40" y2="182"/><line x1="220" y1="150" x2="192" y2="140"/><line x1="224" y1="186" x2="200" y2="182"/></g>` +
        limb('108,232 70,220 76,288', 22, c) + boot('76,284 74,300 56,302', 20, d) +
        limb('132,232 170,220 164,288', 22, c) + boot('164,284 166,300 184,302', 20, d) +
        torso(120, 140, 238, 32, 24, c, id) + head(120, 102, 1, c, false, id) +
        limb('88,146 92,206 104,286', 17, c) + ball(104, 292, 11, d) +
        limb('152,146 178,194 170,220', 17, c) + ball(170, 224, 11, d) +
        emblem(120, 180, 20, h);
    },
    /* SEER: floating mystic with a wide cape */
    seer(h, c, d, id) {
      return cape(d, 'M 84 100 L 156 100 L 234 268 Q 120 312 6 268 Z') +
        `<ellipse cx="120" cy="312" rx="46" ry="7" fill="${h.color}" opacity=".35" class="glow"/>` +
        limb('110,198 108,250 112,286', 22, c) + boot('112,282 114,302', 20, d) +
        limb('130,198 134,250 130,286', 22, c) + boot('130,282 128,302', 20, d) +
        torso(120, 100, 200, 34, 22, c, id) + head(120, 60, 1, c, false, id) +
        limb('86,106 52,126 24,112', 17, c) + `<circle cx="18" cy="108" r="16" fill="${h.accent}" opacity=".5" class="glow"/>` + ball(20, 110, 10, d) +
        limb('154,106 188,126 216,112', 17, c) + `<circle cx="222" cy="108" r="16" fill="${h.accent}" opacity=".5" class="glow"/>` + ball(220, 110, 10, d) +
        emblem(120, 142, 22, h);
    },
    /* SEGFAULT: the villain, claws out */
    segfault(h, c, d, id) {
      const claws = (x, y, s) => `<g stroke="${K}" stroke-width="4" stroke-linecap="round"><line x1="${x}" y1="${y}" x2="${x - 6 * s}" y2="${y - 16}"/><line x1="${x}" y1="${y}" x2="${x + 2 * s}" y2="${y - 18}"/><line x1="${x}" y1="${y}" x2="${x + 10 * s}" y2="${y - 14}"/></g>`;
      return cape(d, 'M 84 100 L 156 100 L 210 296 L 188 278 L 172 302 L 150 282 L 120 304 L 90 282 L 68 302 L 52 278 L 30 296 Z') +
        limb('106,196 90,246 82,284', 22, c) + boot('82,280 80,296 64,300', 20, '#2A0007') +
        limb('134,196 150,246 158,284', 22, c) + boot('158,280 160,296 176,300', 20, '#2A0007') +
        torso(120, 100, 200, 38, 24, c, id) + head(120, 60, 1, c, true, id) +
        limb('86,108 50,128 30,100', 18, c) + ball(28, 96, 11, '#2A0007') + claws(26, 90, 1) +
        limb('154,108 190,128 210,100', 18, c) + ball(212, 96, 11, '#2A0007') + claws(214, 90, -1) +
        emblem(120, 142, 22, h);
    }
  };

  function hero(id, cls) {
    const h = window.SQ.HEROES[id]; const k = 'c' + (++n);
    const draw = POSES[id] || POSES.rookie;
    return `<svg class="hero-svg comic ${h.villain ? 'villain' : ''} ${cls || ''}" viewBox="0 0 240 320" aria-hidden="true" overflow="visible">
      <defs><pattern id="${k}ht" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="#000"/></pattern></defs>
      ${draw(h, h.color, h.dark, k)}
    </svg>`;
  }

  /* Team poster lineup for the home banner */
  const LINEUP = [
    { id: 'seer', l: 0, t: 0, w: 32, z: 1 },
    { id: 'header', l: 33, t: -3, w: 33, z: 1 },
    { id: 'fullstop', l: 66, t: 1, w: 32, z: 1 },
    { id: 'architect', l: 3, t: 27, w: 36, z: 2 },
    { id: 'vault', l: 56, t: 21, w: 42, z: 2 },
    { id: 'blink', l: 27, t: 31, w: 46, z: 3 }
  ];
  function lineup() {
    return `<div class="lineup-poster">${LINEUP.map((p, i) =>
      `<div class="lp" style="left:${p.l}%;top:${p.t}%;width:${p.w}%;z-index:${p.z};animation-delay:${i * 0.12}s">${hero(p.id)}</div>`).join('')}</div>`;
  }

  /* Comic sound-effect burst */
  const WORDS = ['POW!', 'BAM!', 'ZAP!', 'BOOM!', 'WHAM!', 'KAPOW!', 'ZOOM!'];
  const COLORS = ['#FACC15', '#22D3EE', '#F472B6', '#4ADE80', '#FB923C'];
  function burst(word) {
    const el = document.createElement('div'); el.className = 'burst';
    const w = word || WORDS[Math.floor(Math.random() * WORDS.length)];
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    const pts = []; for (let i = 0; i < 24; i++) { const r = i % 2 ? 58 : 100, a = i / 24 * Math.PI * 2; pts.push((120 + Math.cos(a) * r * 1.1).toFixed(1) + ',' + (100 + Math.sin(a) * r * 0.8).toFixed(1)); }
    el.innerHTML = `<svg viewBox="0 0 240 200"><polygon points="${pts.join(' ')}" fill="${col}" stroke="#111" stroke-width="6" stroke-linejoin="round"/>
      <text x="120" y="118" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="56" fill="#E3262F" stroke="#111" stroke-width="3" paint-order="stroke" letter-spacing="2" transform="rotate(-8 120 100)">${w}</text></svg>`;
    el.style.left = (30 + Math.random() * 40) + 'vw'; el.style.top = (28 + Math.random() * 24) + 'vh';
    document.body.appendChild(el); setTimeout(() => el.remove(), 1100);
  }

  window.SQART = { hero, lineup, burst };
})();
