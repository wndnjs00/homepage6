/* ═══════════════════════════════════════════════════════════════
   MIRAE I&N TECH — site.js (코어)
   헤더 · 히어로 3D 격자 캔버스 · 기술 캔버스 · 리빌 · 카운터 · 마퀴
   ═══════════════════════════════════════════════════════════════ */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ACC = [80, 214, 130];

window.MR = Object.assign(window.MR || {}, { $, $$, reduce, ACC });

/* ── 헤더 : 스크롤 상태 / 햄버거 / 메가메뉴 / 아코디언 ── */
const hdr = $('#hdr');
let lastY = 0;
const onScroll = () => {
  const y = scrollY;
  hdr.classList.toggle('solid', y > innerHeight * 0.85);
  hdr.classList.toggle('hide', y > lastY && y > innerHeight && !document.body.classList.contains('menu-open'));
  lastY = y;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = $('#burger');
const closeMenu = () => {
  document.body.classList.remove('menu-open');
  if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', '메뉴 열기'); }
};
if (burger) burger.onclick = () => {
  const open = document.body.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
};
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.body.classList.contains('menu-open')) { closeMenu(); burger && burger.focus(); }
    $$('.nav-item.open').forEach(o => { o.classList.remove('open'); const b = $('.nav-btn', o); b && b.setAttribute('aria-expanded', 'false'); });
  }
});
$$('.nav-item').forEach(item => {
  const btn = $('.nav-btn', item);
  if (!btn) return;
  const open = () => { $$('.nav-item').forEach(o => { if (o !== item) { o.classList.remove('open'); const b = $('.nav-btn', o); b && b.setAttribute('aria-expanded', 'false'); } }); item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const close = () => { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  item.addEventListener('mouseenter', open);
  item.addEventListener('mouseleave', close);
  btn.addEventListener('focus', open);
  item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) close(); });
  btn.addEventListener('click', e => { e.preventDefault(); item.classList.contains('open') ? close() : open(); });
  btn.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); btn.focus(); } });
});
$$('.mnav-grp').forEach(g => {
  const t = $('.mnav-t', g);
  if (!t) return;
  t.addEventListener('click', () => { const o = g.classList.toggle('open'); t.setAttribute('aria-expanded', String(o)); });
});

/* ── 서울 시계 ── */
const clk = $('#clock');
if (clk) {
  const tick = () => { clk.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Seoul', hour12: false }); };
  tick(); setInterval(tick, 1000);
}

/* ── 히어로 : 원근 3D 격자 + 빛 패킷 ── */
window.MR.initHero = function () {
  const cv = $('#heroCanvas'); if (!cv || cv.dataset.init) return; cv.dataset.init = '1';
  const cx = cv.getContext('2d');
  let W, H, dpr, nodes = [], edges = [], packets = [], t0 = performance.now();
  let mx = 0.7, my = 0.5, tmx = 0.7, tmy = 0.5;

  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = []; edges = []; packets = [];
    const cols = W < 760 ? 9 : 16, rows = W < 760 ? 14 : 10;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const hot = Math.random() < 0.14;
      nodes.push({ gx: i / (cols - 1) - 0.5, gz: j / (rows - 1) - 0.5, h: hot ? 0.04 + Math.random() * 0.22 : 0, hot, ph: Math.random() * 6.28, i, j });
    }
    const idx = (i, j) => i * rows + j;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      if (i < cols - 1) edges.push([idx(i, j), idx(i + 1, j)]);
      if (j < rows - 1) edges.push([idx(i, j), idx(i, j + 1)]);
    }
    for (let k = 0; k < (W < 760 ? 10 : 22); k++) packets.push(newPacket());
  }
  function newPacket() {
    const e = edges[(Math.random() * edges.length) | 0];
    return { e, p: Math.random(), v: 0.004 + Math.random() * 0.01 };
  }
  function proj(n, t) {
    const rot = -0.62 + (mx - 0.5) * 0.25 + Math.sin(t * 0.00005) * 0.05;
    const tilt = 0.9 + (my - 0.5) * 0.12;
    const S = Math.max(W, H) * 1.35;
    const x = n.gx * Math.cos(rot) - n.gz * Math.sin(rot);
    const z = n.gx * Math.sin(rot) + n.gz * Math.cos(rot);
    const wave = Math.sin(n.gx * 6 + t * 0.0006) * Math.cos(n.gz * 5 + t * 0.0004) * 0.012;
    const y = -(n.h * (0.85 + 0.15 * Math.sin(t * 0.001 + n.ph))) + wave;
    const persp = 1 / (1.6 + z * 0.9);
    return { x: W * (W < 760 ? 0.5 : 0.66) + x * S * persp, y: H * 0.56 + (z * Math.cos(tilt) * 0.55 + y) * S * persp, s: persp, z };
  }
  function draw(t) {
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
    cx.clearRect(0, 0, W, H);
    const P = nodes.map(n => proj(n, t));
    const B = nodes.map(n => n.hot ? proj({ ...n, h: 0 }, t) : null);
    cx.lineWidth = 1;
    for (const [a, b] of edges) {
      const pa = P[a], pb = P[b];
      const al = Math.max(0, Math.min(0.16, 0.2 - (pa.z + 0.5) * 0.12));
      cx.strokeStyle = `rgba(244,244,241,${al})`;
      cx.beginPath(); cx.moveTo(pa.x, pa.y); cx.lineTo(pb.x, pb.y); cx.stroke();
    }
    nodes.forEach((n, k) => {
      if (!n.hot) return;
      const p = P[k], b = B[k];
      const g = cx.createLinearGradient(0, b.y, 0, p.y);
      g.addColorStop(0, `rgba(${ACC},0)`); g.addColorStop(1, `rgba(${ACC},.55)`);
      cx.strokeStyle = g; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(b.x, b.y); cx.lineTo(p.x, p.y); cx.stroke();
      cx.fillStyle = `rgba(${ACC},.95)`;
      const r = 2.2 * p.s * 1.6;
      cx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    });
    nodes.forEach((n, k) => {
      if (n.hot) return;
      const p = P[k];
      cx.fillStyle = `rgba(244,244,241,${0.18 + p.s * 0.2})`;
      cx.fillRect(p.x - 1, p.y - 1, 2, 2);
    });
    for (const pk of packets) {
      pk.p += reduce ? 0 : pk.v;
      if (pk.p >= 1) Object.assign(pk, newPacket(), { p: 0 });
      const a = P[pk.e[0]], b = P[pk.e[1]];
      const x = a.x + (b.x - a.x) * pk.p, y = a.y + (b.y - a.y) * pk.p;
      const tx = a.x + (b.x - a.x) * Math.max(0, pk.p - 0.35), ty = a.y + (b.y - a.y) * Math.max(0, pk.p - 0.35);
      const g = cx.createLinearGradient(tx, ty, x, y);
      g.addColorStop(0, `rgba(${ACC},0)`); g.addColorStop(1, `rgba(${ACC},.9)`);
      cx.strokeStyle = g; cx.lineWidth = 1.5;
      cx.beginPath(); cx.moveTo(tx, ty); cx.lineTo(x, y); cx.stroke();
    }
  }
  let running = true;
  new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) loop(); }).observe(cv);
  function loop(t = performance.now()) { draw(reduce ? 0 : t - t0); if (running && !reduce) requestAnimationFrame(loop); }
  addEventListener('mousemove', e => { tmx = e.clientX / innerWidth; tmy = e.clientY / innerHeight; }, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduce) draw(0); }, 150); });
  build(); loop();
  const hero = $('.hero');
  if (hero) requestAnimationFrame(() => setTimeout(() => hero.classList.add('in'), 120));
};

/* ── 기술 섹션 : 궤도 링 + 구체 ── */
window.MR.initTech = function () {
  const cv = $('#techCanvas'); if (!cv || cv.dataset.init) return; cv.dataset.init = '1';
  const cx = cv.getContext('2d');
  let W, H, dpr, pts = [];
  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    const N = 900;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
  }
  function draw(t) {
    cx.clearRect(0, 0, W, H);
    const R = Math.min(W, H) * 0.34, ox = W / 2, oy = H / 2;
    const a = t * 0.00012, tilt = 0.42;
    const rings = [[1.28, 0.2, 1], [1.46, -0.5, 0.6], [1.12, 1.1, 0.45]];
    rings.forEach(([rr, inc, al], ri) => {
      cx.strokeStyle = `rgba(244,244,241,${0.1 * al + 0.04})`; cx.lineWidth = 1;
      cx.beginPath();
      for (let k = 0; k <= 120; k++) {
        const th = k / 120 * Math.PI * 2;
        let x = Math.cos(th) * rr, y = 0, z = Math.sin(th) * rr;
        const y2 = y * Math.cos(inc) - z * Math.sin(inc), z2 = y * Math.sin(inc) + z * Math.cos(inc);
        const px = ox + x * R, py = oy + (y2 * Math.cos(tilt) - z2 * Math.sin(tilt) * 0.35) * R;
        k ? cx.lineTo(px, py) : cx.moveTo(px, py);
      }
      cx.stroke();
      const th = t * 0.0004 * (ri % 2 ? -1 : 1) + ri * 2;
      let x = Math.cos(th) * rr, z = Math.sin(th) * rr;
      const y2 = -z * Math.sin(inc), z2 = z * Math.cos(inc);
      const px = ox + x * R, py = oy + (y2 * Math.cos(tilt) - z2 * Math.sin(tilt) * 0.35) * R;
      cx.fillStyle = ri === 0 ? `rgb(${ACC})` : 'rgba(244,244,241,.9)';
      cx.fillRect(px - 3, py - 3, 6, 6);
    });
    for (const [x0, y0, z0] of pts) {
      let x = x0 * Math.cos(a) - z0 * Math.sin(a), z = x0 * Math.sin(a) + z0 * Math.cos(a), y = y0;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      const d = (z2 + 1) / 2;
      const band = Math.abs(y0) < 0.05 || Math.abs(Math.atan2(z0, x0) % 0.785) < 0.02;
      if (band && d > 0.3) cx.fillStyle = `rgba(${ACC},${0.3 + d * 0.7})`;
      else cx.fillStyle = `rgba(244,244,241,${0.06 + d * 0.5})`;
      const s = 0.8 + d * 1.4;
      cx.fillRect(ox + x * R - s / 2, oy + y2 * R - s / 2, s, s);
    }
    cx.strokeStyle = 'rgba(244,244,241,.12)';
    cx.beginPath(); cx.moveTo(ox - R * 1.6, oy); cx.lineTo(ox - R * 1.2, oy); cx.moveTo(ox + R * 1.2, oy); cx.lineTo(ox + R * 1.6, oy);
    cx.moveTo(ox, oy - R * 1.45); cx.lineTo(ox, oy - R * 1.15); cx.moveTo(ox, oy + R * 1.15); cx.lineTo(ox, oy + R * 1.45); cx.stroke();
    cx.font = '10px "JetBrains Mono", monospace'; cx.fillStyle = 'rgba(140,151,146,.9)';
    cx.fillText('LAT ' + (Math.sin(a) * 90).toFixed(3), ox + R * 1.2, oy - 8);
    cx.fillText('SYNC 100.000%', ox - R * 1.6, oy + 16);
  }
  let running = false, t0 = performance.now();
  new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) loop(); }).observe(cv);
  function loop(t = performance.now()) { draw(reduce ? 0 : t - t0); if (running && !reduce) requestAnimationFrame(loop); }
  addEventListener('resize', () => { build(); draw(performance.now() - t0); });
  build(); draw(0);
};

/* ── 마퀴 ── */
window.MR.marquee = function (el, arr) {
  if (!el) return;
  const h = arr.map(n => `<span>${n}</span>`).join('');
  el.innerHTML = h + h;
};

/* ── 스크롤 리빌 + 카운터 ── */
let io, cio;
window.MR.observeAll = function () {
  if (io) io.disconnect();
  if (cio) cio.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on'); io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv, .cycle, .viz, .tl li').forEach(el => io.observe(el));

  cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const pad = el.dataset.pad === '1';
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
      el.textContent = pad ? String(v).padStart(2, '0') : String(v);
      if (k < 1) requestAnimationFrame(step);
    };
    reduce ? el.textContent = (pad ? String(to).padStart(2, '0') : String(to)) : requestAnimationFrame(step);
    cio.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));
};

/* ── 산업별 구성 바 ── */
window.MR.renderViz = function () {
  const bar = $('#vizBar'), leg = $('#vizLegend'), note = $('#vizNote');
  if (!bar) return;
  const map = {};
  DATA.PROJECTS.forEach(p => {
    const k = (p.industry === '기타' || p.industry === '서비스') ? '제조·서비스' : p.industry;
    map[k] = (map[k] || 0) + 1;
  });
  const order = ['은행', '보험', '저축은행', '기타 금융', '제조·서비스'];
  const cols = ['#0A110F', '#3C4843', '#7A8680', 'oklch(0.52 0.13 152)', 'oklch(0.74 0.17 152)'];
  bar.innerHTML = order.map((k, i) => `<i style="flex:${map[k] || 0};background:${cols[i]};transition-delay:${i * 0.08}s"></i>`).join('');
  leg.innerHTML = order.map((k, i) => `<div><i style="background:${cols[i]}"></i>${k}<b>${map[k] || 0}</b></div>`).join('');
  note.textContent = `N = ${DATA.PROJECTS.length} · 2024–2026`;
};
})();
