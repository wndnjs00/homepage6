/* ═══════════════════════════════════════════════════════════════
   MIRAE I&N TECH — app.js
   해시 라우터 + 페이지 렌더러 (index.html 한 파일에서 동작)
   ═══════════════════════════════════════════════════════════════ */
(() => {
const { $, $$, reduce } = window.MR;
const D = window.DATA;
const C = D.COMPANY;

const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const arrow = '<span class="arr" aria-hidden="true"></span>';
const PH = txt => `<span class="ph">${esc(txt)}</span>`;
const phBlock = (label, sub = '') => `<div class="ph-block" role="img" aria-label="${esc(label)} 자리표시자"><b>${esc(label)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>`;

/* ── 프로젝트 필터 상태 ── */
const PF = { type: '전체', industry: '전체', status: '전체' };
const LIMIT = 8;
let expanded = false;

/* ── 뉴스 페이지네이션 ── */
let newsPage = 1;
const PER_PAGE = 6;

/* ══════════════════════════ 공통 조각 ══════════════════════════ */

const head = (no, label, h2, lead) => `
  <div class="sec-head">
    <div class="eyebrow rv">${esc(no)} — ${esc(label)}</div>
    <h2 class="rv d1">${h2}</h2>
    ${lead ? `<p class="rv d2">${lead}</p>` : ''}
  </div>`;

const pgHero = (crumb, eyebrow, h1, lead, dark) => `
  <section class="pg-hero${dark ? ' dark-hero' : ''}">
    <div class="wrap">
      <nav class="crumb" aria-label="현재 위치"><a href="#/">Home</a><span>/</span>${crumb}</nav>
      <div class="eyebrow">${esc(eyebrow)}</div>
      <h1>${h1}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
    </div>
  </section>`;

const marqueeRow = (id, cls = '') => `<div class="marq marq-row ${cls}"><div class="marq-track" id="${id}"></div></div>`;

/* ══════════════════════════ 01 HOME ══════════════════════════ */

const homeHero = () => `
<section class="hero" id="top" data-screen-label="01 Hero">
  <canvas id="heroCanvas" aria-hidden="true"></canvas>
  <div class="hero-veil"></div>
  <div class="wrap hero-body">
    <div class="eyebrow">Mirae I&amp;N Tech — Financial IT &amp; AI Platform Partner since 2003</div>
    <h1>
      <span class="ln"><span>금융 IT의 경험으로,</span></span>
      <span class="ln"><span><em>AI 업무 플랫폼</em>을 만듭니다</span></span>
    </h1>
    <p class="hero-sub">20년 넘게 금융권 시스템을 구축·운영해 온 기술력으로, 운영·고객·자산·인사 업무를 하나로 잇는 AI 기반 ITSM 플랫폼을 직접 개발했습니다.</p>
    <div class="hero-actions">
      <a href="#/solutions" class="btn btn-accent">솔루션 살펴보기 ${arrow}</a>
      <a href="#/solutions?sec=demo" class="btn btn-ghost">데모 보기 ${arrow}</a>
    </div>
  </div>
  <div class="hero-foot">
    <div class="wrap">
      <div class="cell"><span class="live" aria-hidden="true"></span><b>System Status</b>&nbsp;Operational</div>
      <div class="cell">Est.&nbsp;<b>2003</b></div>
      <div class="cell">SI · ITO · Infra · AI Solution</div>
      <div class="cell">Seoul, KR&nbsp;<b id="clock">--:--:--</b></div>
    </div>
  </div>
</section>`;

const homeAbout = () => `
<section class="about sec" id="about" data-screen-label="02 About">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-l">
        <div class="eyebrow rv">01 — About Mirae I&amp;N Tech</div>
        <h2 class="rv d1">기술을 넘어,<br><span>신뢰를</span> 설계합니다.</h2>
      </div>
      <div class="about-r">
        <p class="lead rv d2">2003년 설립 이후 은행·보험·카드·저축은행·캐피탈 등 금융권 고객과 함께 시스템 구축부터 운영까지 수행해 왔습니다.</p>
        <p class="rv d2">20년이 넘는 시간 동안 축적한 것은 기술 그 자체보다, 장애 없이 돌아가는 시스템에 대한 신뢰였습니다. 이제 그 현장 경험을 AI 플랫폼으로 확장합니다.</p>
        <p class="rv d3">SI · ITO · 인프라 · 엔터프라이즈 솔루션의 네 개 사업라인 위에, 자체 개발한 AI ITSM 플랫폼 <b>Flame</b>을 얹어 운영·고객·자산·인사 업무를 하나의 흐름으로 연결합니다.</p>
      </div>
    </div>
    <div class="facts">
      ${D.STATS.map((s, i) => `
        <div class="fact rv d${i + 1}">
          <div class="k">${esc(s.k)}</div>
          <div class="v"><span data-count="${esc(s.v)}" data-pad="${s.v.length > 1 ? '0' : '0'}">0</span>${esc(s.suffix)}<small>${esc(s.d)}</small></div>
        </div>`).join('')}
    </div>
    <div class="teams">
      <div>
        <div class="eyebrow rv">Organization</div>
        <p class="note rv d1" style="margin-top:16px;color:var(--muted);font-size:14px">대표이사 직속 5개 조직이 컨설팅부터 구축·운영·고도화까지 전 주기를 담당합니다.</p>
      </div>
      <ul class="teams-list rv d1">
        ${D.TEAMS.map(t => `<li><b>${esc(t.name)}</b><span>${esc(t.en)}</span></li>`).join('')}
      </ul>
    </div>
  </div>
</section>`;

const homePlatform = () => `
<section class="platform sec dark" id="platform" data-screen-label="03 Platform">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow rv">02 — Our Platform</div>
      <h2 class="rv d1">현장에서 찾은 문제,<br><em style="font-style:normal;color:var(--accent)">AI로 직접 풀었습니다.</em></h2>
      <p class="rv d2">20년 넘게 금융권 시스템을 운영하며 매일 마주한 반복되는 요청, 흩어진 처리 이력, 놓치기 쉬운 SLA. 그 불편함을 가장 가까이에서 겪어 온 우리가, AI를 더한 ITSM 플랫폼을 직접 설계하고 만들었습니다.</p>
    </div>
    <p class="rv d2 ph-note" style="margin-top:-56px">가져다 쓴 솔루션이 아닌, 금융 현장에서 직접 쓰며 다듬어 온 플랫폼.</p>

    <div class="sol-cards">
      ${D.SOLUTIONS.map((s, i) => `
        <article class="solcard rv d${i + 1}${s.rep ? ' lead-card' : ''}">
          <div class="sc-logo"><i aria-hidden="true"></i>${esc(s.en)}</div>
          <div class="sc-name">${esc(s.name)}${s.rep ? '<span class="badge-rep">대표 솔루션</span>' : ''}</div>
          <p class="sc-def">${esc(s.def)}</p>
          <ul class="sc-feats">${s.feats.slice(0, 3).map(f => `<li>${esc(f.t)} — ${esc(f.d)}</li>`).join('')}</ul>
          <a class="sc-more" href="#/solutions?sec=${esc(s.id)}">자세히 보기 ${arrow}</a>
        </article>`).join('')}
    </div>

    <div class="feat">
      ${D.TECH.map((t, i) => `<div class="rv d${i + 1}"><span class="mono">${esc(t.k)}</span><h4>${esc(t.t)}</h4><p>${esc(t.d)}</p></div>`).join('')}
    </div>
  </div>
</section>`;

const homeAreas = () => `
<section class="areas sec" id="areas" data-screen-label="04 Workflow Areas">
  <div class="wrap">
    ${head('03', 'Workflow Areas', '흩어진 업무를<br>하나의 AI 워크플로우로', '장애와 요청이 오가는 운영, 고객 응대, 자산, 인사. 각각 다른 도구에서 처리하던 일을 Flame 하나로 연결합니다.')}
    <div class="biz-grid grid-4">
      ${D.AREAS.map(a => `
        <article class="biz-cell">
          <div class="biz-top"><span class="biz-no">${esc(a.no)}</span><span class="biz-tag">${esc(a.tag)}</span></div>
          <div class="glyph ${esc(a.glyph)}" aria-hidden="true"><i class="${a.glyph.slice(2)}1"></i><i class="${a.glyph.slice(2)}2"></i>${a.glyph === 'g-b' || a.glyph === 'g-d' ? `<i class="${a.glyph.slice(2)}3"></i>` : ''}</div>
          <h3><small>${esc(a.en)}</small>${esc(a.kr)}</h3>
          <p>${esc(a.d)}</p>
          <ul class="wf-list">${a.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
          <div class="wf-tags">${a.sols.map(s => `<span>${esc(s)}</span>`).join('')}</div>
        </article>`).join('')}
    </div>
  </div>
</section>`;

const homeImpact = () => `
<section class="impact-sec sec" id="impact" data-screen-label="05 Impact">
  <div class="wrap">
    ${head('04', 'Impact', '현장에서 측정한 변화', '아래 수치는 도입 고객 기준으로 측정·확정 중입니다. 확정되는 대로 업데이트됩니다.')}
    <div class="impact">
      ${D.IMPACT.map((m, i) => `
        <div class="rv d${i + 1}">
          <div class="k">${esc(m.k)}</div>
          <div class="v">${PH(m.v)}</div>
          <div class="d">${esc(m.d)}</div>
        </div>`).join('')}
    </div>
  </div>
</section>`;

const homeUsers = () => `
<section class="users sec" id="users" data-screen-label="06 Who uses it">
  <div class="wrap">
    ${head('05', 'Who uses it', 'IT 담당자부터<br>모든 직원까지', '같은 플랫폼을 쓰지만, 보는 화면과 필요한 정보는 역할마다 다릅니다.')}
    <div class="tabs" role="tablist" aria-label="사용자 유형">
      ${D.USERS.map((u, i) => `<button role="tab" id="tab-${u.id}" aria-controls="panel-${u.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(u.tab)}</button>`).join('')}
    </div>
    ${D.USERS.map((u, i) => `
      <div class="tabpanel" role="tabpanel" id="panel-${u.id}" aria-labelledby="tab-${u.id}" ${i === 0 ? '' : 'hidden'}>
        <div class="tab-grid">
          <div><h3>${esc(u.h)}</h3><p>${esc(u.d)}</p></div>
          <ul>${u.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
        </div>
      </div>`).join('')}
    <div class="ind-row">
      <span class="mono">대상 업종</span>
      ${D.INDUSTRIES_SERVED.map(x => `<span>${esc(x)}</span>`).join('')}
    </div>
  </div>
</section>`;

const homeClients = () => `
<section class="clients-dark sec dark" id="clients" data-screen-label="07 Clients">
  <div class="wrap">
    ${head('06', 'Clients', '금융권 중심의<br>검증된 고객사', '사업실적 및 서비스 소개에 게재된 고객사입니다. 로고 이미지로 교체할 수 있도록 텍스트 워드마크로 구성했습니다.')}
  </div>
  <div style="display:grid;gap:18px;margin-top:8px">
    ${marqueeRow('mq1')}
    ${marqueeRow('mq2')}
  </div>
</section>`;

const homeNews = () => `
<section class="news sec" id="news" data-screen-label="08 Newsroom">
  <div class="wrap">
    ${head('07', 'Newsroom', '미래아이엔텍 소식', '제품·사업·회사 소식을 전합니다. 아래 6건은 구조 확인용 샘플 콘텐츠입니다.')}
    <div class="ncards">
      ${D.NEWS.slice(0, 3).map(n => `
        <a class="ncard rv" href="#/newsroom/${esc(n.slug)}">
          ${phBlock('썸네일 이미지', '16:10 · 대체 예정')}
          <div class="body">
            <div class="meta"><span>${esc(n.date)}</span><span class="tag${n.sample ? ' sample' : ''}">${esc(n.cat)}</span></div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.sum)}</p>
            <span class="more">읽기 ${arrow}</span>
          </div>
        </a>`).join('')}
    </div>
    <div class="more" style="margin-top:40px;display:flex;justify-content:center">
      <a class="btn" href="#/newsroom" style="border-color:var(--ink)">뉴스룸 전체 보기 ${arrow}</a>
    </div>
  </div>
</section>`;

const homeCta = () => `
<section class="cta" id="demo-cta" data-screen-label="09 Demo CTA">
  <div class="wrap">
    <div class="eyebrow rv" style="color:var(--muted-d)">08 — Get Started</div>
    <h2 class="rv d1" style="margin-top:32px"><em>Flame</em>을 직접<br>경험해 보세요.</h2>
    <div class="cta-row rv d2">
      <a href="#/solutions?sec=demo" class="btn btn-big">데모 보기 ${arrow}</a>
      <a href="mailto:${esc(C.email)}" class="btn btn-ghost" style="height:76px;padding:0 34px">도입 문의 ${arrow}</a>
    </div>
  </div>
</section>`;

const renderHome = () => `
${homeHero()}
${homeAbout()}
${homePlatform()}
${homeAreas()}
${homeImpact()}
${homeUsers()}
${homeClients()}
${homeNews()}
${homeCta()}`;

/* ══════════════════════════ COMPANY ══════════════════════════ */

const companyIntro = () => `
${pgHero('<a href="#/company">Company</a><span>/</span>기업소개', 'Company 01 — About Us', '기술을 넘어,<br>신뢰를 설계합니다.', '2003년 설립. 은행·보험·카드·저축은행·캐피탈 등 금융권 고객과 시스템 구축부터 운영까지 함께해 온 IT 서비스 전문 기업입니다.')}

<section class="sec" style="background:var(--white)">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-l">
        <div class="eyebrow rv">Vision</div>
        <h2 class="rv d1" style="font-size:clamp(28px,3.4vw,52px)">${esc(C.vision)}</h2>
      </div>
      <div class="about-r">
        <p class="rv d2" style="color:var(--muted)">미래아이엔텍은 금융권 시스템을 안정적으로 운영해 온 경험을 바탕으로, 고객의 업무 환경에 최적화된 IT 서비스를 제공합니다. 컨설팅부터 설계·구축·운영·고도화까지 전 주기를 하나의 파트너가 책임집니다.</p>
        <p class="rv d2" style="color:var(--muted)">최근에는 그 운영 경험을 AI 플랫폼으로 확장해, 반복 업무를 줄이고 처리 이력을 남기는 <b>AI ITSM 플랫폼 Flame</b>을 직접 개발했습니다.</p>
      </div>
    </div>

    <div class="ov-grid">
      <div class="rv"><div class="k">Founded</div><div class="v">${esc(C.founded)}년</div></div>
      <div class="rv d1"><div class="k">CEO</div><div class="v">${esc(C.ceo)}</div></div>
      <div class="rv d2"><div class="k">Business</div><div class="v">${esc(C.fields)}</div></div>
      <div class="rv d3"><div class="k">Headquarters</div><div class="v">${esc(C.address)}</div></div>
    </div>
  </div>
</section>

<section class="comp sec" style="background:var(--white)">
  <div class="wrap comp-grid">
    <div class="comp-side">
      <div class="eyebrow rv">Core Values</div>
      <h2 class="rv d1">다섯 가지<br>원칙</h2>
      <p class="rv d2">20년 이상 금융권 현장에서 축적한 경험과 방법론, 그리고 사람. 미래아이엔텍이 고객의 시스템을 맡을 수 있는 이유입니다.</p>
    </div>
    <ol class="comp-list">
      ${D.VALUES.map(v => `
        <li class="comp-item rv">
          <span class="n">${esc(v.n)}</span>
          <div>
            <h3>${esc(v.t)}<small>${esc(v.s)}</small></h3>
            <p>${esc(v.d)}</p>
            <ul>${v.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
            ${v.n === '04' ? `
              <div class="viz rv" id="viz">
                <div class="viz-h"><b>공개 사업실적 업권별 구성</b><span id="vizNote">— projects</span></div>
                <div class="bar" id="vizBar"></div>
                <div class="legend" id="vizLegend"></div>
              </div>` : ''}
            ${v.n === '05' ? `
              <div class="cycle" id="cycle">
                <div><span>STEP 01</span>컨설팅</div><div><span>STEP 02</span>설계</div>
                <div><span>STEP 03</span>구축</div><div><span>STEP 04</span>운영</div>
                <div><span>STEP 05</span>고도화</div>
              </div>` : ''}
          </div>
        </li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec" style="background:var(--paper)">
  <div class="wrap">
    ${head('History', 'Milestones', '연혁', '설립 이후의 주요 이정표입니다. 확정되지 않은 연도는 자리표시자로 표시했습니다.')}
    <ol class="tl">
      ${D.TIMELINE.map(t => `
        <li class="rv">
          <span class="yr${t.ph ? ' ph' : ''}">${esc(t.yr)}</span>
          <div>
            <h3>${esc(t.t)}</h3>
            <p>${esc(t.d)}</p>
            <div class="tags">${t.tags.map(x => `<span>${esc(x)}</span>`).join('')}</div>
          </div>
        </li>`).join('')}
    </ol>
  </div>
</section>`;

const companyLocation = () => `
${pgHero('<a href="#/company">Company</a><span>/</span>오시는 길', 'Company 02 — Location', '오시는 길', '서울 중구 수표로에 위치한 미래아이엔텍 본사입니다. 방문 전 연락 주시면 안내해 드립니다.')}

<section class="sec" style="background:var(--white)">
  <div class="wrap">
    <div class="map-wrap">
      <div class="ph-block map-box" role="img" aria-label="지도 자리표시자">
        <b>[지도 임베드 영역]</b>
        <span>Google Maps · 네이버 지도 · 카카오맵 iframe을 이 자리에 삽입하세요</span>
        <span>${esc(C.address)}</span>
      </div>
      <div class="cinfo-list">
        <div><div class="k">Address</div><div class="v">${esc(C.address)}<small>${esc(C.addressEn)}</small></div></div>
        <div><div class="k">Tel</div><a class="v" href="tel:025575267">${esc(C.tel)}</a></div>
        <div><div class="k">Fax</div><div class="v">${esc(C.fax)}</div></div>
        <div><div class="k">Email</div><a class="v" href="mailto:${esc(C.email)}">${esc(C.email)}</a></div>
      </div>
    </div>

    <div class="transit">
      <div class="t-card rv">
        <div class="k">Subway</div>
        <h3>지하철</h3>
        <p>[가까운 역과 출구, 도보 시간을 입력하세요. 예: 2호선 을지로3가역 3번 출구 도보 5분]</p>
      </div>
      <div class="t-card rv d1">
        <div class="k">Bus</div>
        <h3>버스</h3>
        <p>[정류장 이름과 이용 가능한 버스 노선을 입력하세요.]</p>
      </div>
      <div class="t-card rv d2">
        <div class="k">Parking</div>
        <h3>주차</h3>
        <p>[건물 주차 가능 여부와 요금, 방문객 안내 사항을 입력하세요.]</p>
      </div>
    </div>
  </div>
</section>`;

const companyOrg = () => `
${pgHero('<a href="#/company">Company</a><span>/</span>조직구성', 'Company 03 — Organization', '조직구성', '대표이사 직속 5개 조직이 금융 IT 아웃소싱, 시스템 통합, 인프라, 솔루션, 그리고 미래 기술 연구를 담당합니다.')}

<section class="sec" style="background:var(--white)">
  <div class="wrap">
    <div class="org-top">
      <div class="org-node rv"><div class="k">CEO</div><b>대표이사 ${esc(C.ceo)}</b></div>
    </div>
    <div class="org-stem" aria-hidden="true"></div>
    <div class="org-grid">
      ${D.TEAMS.map((t, i) => `
        <article class="org-card rv d${Math.min(i + 1, 5)}">
          <span class="n">${esc(t.n)}</span>
          <h3>${esc(t.name)}</h3>
          <p class="role">${esc(t.role)}</p>
          <ul>${t.tasks.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </article>`).join('')}
    </div>
  </div>
</section>`;

/* ══════════════════════════ SOLUTIONS ══════════════════════════ */

const SOL_NAV = [
  { id: 'overview', t: '개요' }, { id: 'flame', t: 'Flame' },
  { id: 'solution2', t: '솔루션 2' }, { id: 'solution3', t: '솔루션 3' },
  { id: 'areas', t: '업무영역별 활용' }, { id: 'cases', t: '도입 사례' },
  { id: 'start', t: '시작 가이드' }, { id: 'demo', t: '데모' },
];

const solOverview = () => `
<section class="sec" id="overview" style="background:var(--white)">
  <div class="wrap">
    ${head('01', 'Overview', 'AI + 워크플로우,<br>하나의 플랫폼', '장애·요청·변경·자산·고객 문의·인사 요청이 서로 다른 도구에 흩어져 있으면, 결국 사람이 다시 연결해야 합니다. Flame은 그 연결을 AI가 담당하도록 만든 플랫폼입니다.')}
    <div class="about-grid">
      <div class="about-l">
        <div class="eyebrow rv">Why we built it</div>
        <h2 class="rv d1" style="font-size:clamp(26px,3vw,44px);margin-top:32px">왜 직접 만들었나</h2>
      </div>
      <div class="about-r">
        <p class="rv d2" style="color:var(--muted)">우리는 20년 넘게 금융권 시스템을 운영해 왔습니다. 그 시간 동안 매일 반복되는 요청, 개인에게 남는 처리 이력, 월말에야 집계되는 SLA를 지켜봤습니다.</p>
        <p class="rv d2" style="color:var(--muted)">불편함을 가장 가까이에서 겪은 사람이 만든 도구는 다릅니다. 현장에서 직접 쓰며 다듬었기 때문에, 실제 업무 흐름을 기준으로 화면과 우선순위가 정해졌습니다.</p>
        <p class="rv d3" style="color:var(--muted)">가져다 쓴 솔루션이 아닌, <b>금융 현장에서 직접 쓰며 다듬어 온 플랫폼</b>입니다.</p>
      </div>
    </div>
    <div class="lines">
      <div class="rv"><div class="k">01 / Connect</div><h4>업무를 연결</h4><p>운영·고객·자산·인사 요청을 하나의 워크플로우로 묶습니다.</p></div>
      <div class="rv d1"><div class="k">02 / Automate</div><h4>AI가 처리</h4><p>분류·배정·답변 추천을 AI가 담당해 사람은 판단에 집중합니다.</p></div>
      <div class="rv d2"><div class="k">03 / Measure</div><h4>숫자로 확인</h4><p>업무량·처리 시간·SLA 준수율을 실시간 지표로 남깁니다.</p></div>
      <div class="rv d3"><div class="k">04 / Improve</div><h4>계속 개선</h4><p>이력이 쌓일수록 분류 정확도와 처리 속도가 함께 올라갑니다.</p></div>
    </div>
  </div>
</section>`;

const solDetail = (s, idx) => `
<section class="sec" id="${esc(s.id)}" style="background:${idx % 2 ? 'var(--white)' : 'var(--paper)'}">
  <div class="wrap">
    <div class="sol-block" style="margin-top:0;border-top:1px solid var(--ink);padding-top:0">
      <div class="sol-head" style="padding-top:clamp(24px,3vw,40px)">
        <div class="sol-title">
          <div class="mono">${String(idx + 1).padStart(2, '0')} — ${esc(s.en)}${s.rep ? ' · 대표 솔루션' : ''}</div>
          <h2>${esc(s.name)}</h2>
          <p>${esc(s.def)}</p>
        </div>
        <div class="sol-link">
          <a class="btn" href="${esc(s.url)}" ${s.id === 'flame' ? '' : 'aria-disabled="false"'}>솔루션 사이트 바로가기 <span aria-hidden="true">↗</span></a>
          <span class="ph-note">${s.id === 'flame' ? '별도 사이트 주소를 확정해 주세요.' : '[외부 사이트 주소를 입력하세요]'}</span>
        </div>
      </div>

      <p class="rv" style="margin-top:28px;max-width:80ch;color:var(--muted);line-height:1.9">${esc(s.long)}</p>

      <div class="feat-grid">
        ${s.feats.map(f => `<div class="rv"><span class="mono">${esc(f.k)}</span><h4>${esc(f.t)}</h4><p>${esc(f.d)}</p></div>`).join('')}
      </div>

      <div class="mock rv">
        <div class="mock-bar"><i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i><span>${esc(s.name)} — [화면 경로]</span></div>
        ${phBlock(`${esc(s.name)} 화면 스크린샷`, '16:9 · 브라우저 프레임 목업 · 이미지로 교체하세요')}
      </div>

      <div class="ba rv">
        <div class="before">
          <div class="k">Before</div>
          <ul class="before">${s.before.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        </div>
        <div class="after">
          <div class="k after">After</div>
          <ul class="after">${s.after.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </div>
</section>`;

const solAreas = () => `
<section class="sec" id="areas" style="background:var(--paper)">
  <div class="wrap">
    ${head('05', 'By Workflow Area', '업무영역별 활용', '같은 플랫폼, 다른 화면. 업무영역을 선택하면 어떤 기능을 쓰는지 확인할 수 있습니다.')}
    <div class="tabs" role="tablist" aria-label="업무영역">
      ${D.AREAS.map((a, i) => `<button role="tab" id="atab-${i}" aria-controls="apanel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(a.kr)}</button>`).join('')}
    </div>
    ${D.AREAS.map((a, i) => `
      <div class="tabpanel" role="tabpanel" id="apanel-${i}" aria-labelledby="atab-${i}" ${i === 0 ? '' : 'hidden'}>
        <div class="tab-grid">
          <div>
            <div class="eyebrow">${esc(a.tag)}</div>
            <h3 style="margin-top:20px">${esc(a.kr)}</h3>
            <p>${esc(a.d)}</p>
          </div>
          <div>
            <ul style="margin-top:0">${a.list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
            <div class="wf-tags" style="margin-top:24px">${a.sols.map(s => `<span>${esc(s)}</span>`).join('')}</div>
          </div>
        </div>
      </div>`).join('')}
  </div>
</section>`;

const solCases = () => `
<section class="sec" id="cases" style="background:var(--white)">
  <div class="wrap">
    ${head('06', 'Case Studies', '도입 사례', '아래 3건은 구조 확인용 자리표시자입니다. 고객 동의를 받은 실제 사례로 교체해 주세요.')}
    <div class="cases">
      ${D.CASES.map((c, i) => `
        <article class="case rv d${i + 1}">
          <div class="ind">${esc(c.ind)}</div>
          <h3>${esc(c.t)}</h3>
          <dl>
            <div><dt>과제</dt><dd>${esc(c.task)}</dd></div>
            <div><dt>해결</dt><dd>${esc(c.solve)}</dd></div>
          </dl>
          <div class="metric">${PH(c.metric)}</div>
          <div class="ph-note" style="margin-top:8px">${esc(c.metricD)}</div>
        </article>`).join('')}
    </div>
  </div>
</section>`;

const solStart = () => `
<section class="sec" id="start" style="background:var(--paper)">
  <div class="wrap">
    ${head('07', 'Getting Started', '시작 가이드', '처음 사용하는 분을 위한 4단계. 계정을 만들고 첫 요청을 등록하면, 이후 흐름은 플랫폼이 안내합니다.')}
    <div class="steps">
      ${D.STEPS.map((s, i) => `
        <div class="step rv d${i + 1}"><span class="n">${esc(s.n)}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}
    </div>

    <div style="margin-top:clamp(48px,6vw,80px)">
      <div class="eyebrow rv">FAQ</div>
      <div class="acc" id="faq">
        ${D.FAQ.map((f, i) => `
          <div class="acc-item">
            <button aria-expanded="false" aria-controls="faq-${i}" id="faqbtn-${i}">${esc(f.q)}<i aria-hidden="true"></i></button>
            <div class="acc-body" id="faq-${i}" role="region" aria-labelledby="faqbtn-${i}"><div>${esc(f.a)}</div></div>
          </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

const solDemo = () => `
<section class="sec dark" id="demo" style="background:var(--ink)">
  <div class="wrap">
    <div class="sec-head">
      <div class="eyebrow rv" style="color:var(--muted-d)">08 — Demo</div>
      <h2 class="rv d1">Flame을 직접<br>경험해 보세요.</h2>
      <p class="rv d2">아래 영역에 데모 영상을 넣고, 버튼으로 데모 환경으로 이동하도록 연결하세요.</p>
    </div>
    <div class="demo-box rv" style="border-color:var(--line-d)">
      ${phBlock('데모 영상', '16:9 · YouTube 또는 MP4 임베드')}
      <div>
        <div class="mono" style="color:var(--accent)">Live Demo</div>
        <h3 style="margin-top:18px;font-size:clamp(22px,2vw,30px);font-weight:700;letter-spacing:-.035em;line-height:1.3">신청 없이 바로 확인하세요</h3>
        <p style="margin-top:16px;color:var(--muted-d);font-size:15px;line-height:1.85">데모 영상과 체험 환경 링크를 확정해 주세요. 별도 신청 폼 없이 버튼 하나로 이동하도록 구성했습니다.</p>
        <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn btn-accent" href="#/solutions?sec=demo">데모 보기 ${arrow}</a>
          <a class="btn btn-ghost" href="mailto:${esc(C.email)}">도입 문의 ${arrow}</a>
        </div>
        <div class="ph-note" style="margin-top:16px">[데모 환경 URL을 입력하세요]</div>
      </div>
    </div>
  </div>
</section>`;

const renderSolutions = (params) => `
${pgHero('<a href="#/solutions">Solutions</a>', 'Solutions — AI ITSM Platform', 'AI와 워크플로우로<br>업무를 하나로', '운영·고객·자산·인사 업무를 하나의 플랫폼에서 연결합니다. 금융 현장에서 직접 쓰며 다듬어 온 자체 개발 AI ITSM 플랫폼입니다.')}
<nav class="subnav" aria-label="솔루션 내 이동"><div class="wrap subnav-in">
  ${SOL_NAV.map(n => `<a href="#/solutions?sec=${n.id}" data-sec="${n.id}">${esc(n.t)}</a>`).join('')}
</div></nav>
${solOverview()}
${solDetail(D.SOLUTIONS[0], 0)}
${solDetail(D.SOLUTIONS[1], 1)}
${solDetail(D.SOLUTIONS[2], 2)}
${solAreas()}
${solCases()}
${solStart()}
${solDemo()}`;

/* ══════════════════════════ BUSINESS ══════════════════════════ */

const bizAreas = () => `
<section class="sec" id="areas" style="background:var(--white)">
  <div class="wrap">
    ${head('01', 'Business Areas', '사업영역', '금융 IT를 중심으로 SI·ITO·컨설팅·솔루션·디지털 전환까지, 기업 IT의 전 영역을 다룹니다.')}
    <div class="biz-grid">
      ${D.BIZ.map(b => `
        <article class="biz-cell">
          <div class="biz-top"><span class="biz-no">${esc(b.no)}</span><span class="biz-tag">${esc(b.tag)}</span></div>
          <div class="glyph ${esc(b.glyph)}" aria-hidden="true">
            <i class="${b.glyph.slice(2)}1"></i><i class="${b.glyph.slice(2)}2"></i><i class="${b.glyph.slice(2)}3"></i>
          </div>
          <h3><small>${esc(b.en)}</small>${esc(b.kr)}</h3>
          <p>${esc(b.d)}</p>
        </article>`).join('')}
    </div>

    <div class="lines">
      ${D.BIZ_LINES.map((l, i) => `
        <div class="rv d${i + 1}"><div class="k">${esc(l.k)}</div><h4>${esc(l.t)}</h4><p>${esc(l.d)}</p></div>`).join('')}
    </div>
  </div>
</section>`;

const bizProjects = () => `
<section class="sec" id="projects" style="background:var(--paper)">
  <div class="wrap">
    ${head('02', 'Projects', '프로젝트', '은행·보험·저축은행·카드·캐피탈, 그리고 제조·서비스 산업까지. 미래아이엔텍이 수행한 주요 사업입니다.')}
    <div class="fgroups" id="fgroups" role="group" aria-label="프로젝트 필터"></div>
    <div class="proj-bar">
      <div class="proj-count" id="projCount" aria-live="polite"></div>
      <div class="proj-count" id="projHint">그룹 간 조건은 함께 적용됩니다 (AND)</div>
    </div>
    <ul class="plist" id="plist"></ul>
    <div class="more" id="moreWrap" style="margin-top:40px;display:none;justify-content:center">
      <button class="btn" id="moreBtn" style="border-color:var(--ink)">전체 실적 보기 ${arrow}</button>
    </div>
  </div>
</section>`;

const renderBusiness = (params) => `
${pgHero('<a href="#/business">Business</a>', 'Business — What we do', '금융 IT의 전 영역을<br>하나의 파트너가', 'SI · ITO · 인프라 · 솔루션의 네 개 사업라인과 AI 플랫폼으로, 계획부터 운영까지 전 주기를 책임집니다.')}
${bizAreas()}
${bizProjects()}`;

/* ══════════════════════════ NEWSROOM ══════════════════════════ */

const newsCard = n => `
<a class="ncard rv" href="#/newsroom/${esc(n.slug)}">
  ${phBlock('썸네일 이미지', '16:10 · 대체 예정')}
  <div class="body">
    <div class="meta"><span>${esc(n.date)}</span><span class="tag${n.sample ? ' sample' : ''}">${esc(n.cat)}</span></div>
    <h3>${esc(n.title)}</h3>
    <p>${esc(n.sum)}</p>
    <span class="more">읽기 ${arrow}</span>
  </div>
</a>`;

const renderNewsroom = () => {
  const total = D.NEWS.length, pages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (newsPage > pages) newsPage = pages;
  const start = (newsPage - 1) * PER_PAGE;
  const slice = D.NEWS.slice(start, start + PER_PAGE);
  return `
${pgHero('<a href="#/newsroom">Newsroom</a>', 'Newsroom — Latest', '미래아이엔텍 소식', '제품·사업·회사 소식을 최신순으로 전합니다. 아래 콘텐츠는 구조 확인용 샘플입니다.')}
<section class="sec" style="background:var(--white)">
  <div class="wrap">
    <div class="proj-bar" style="border-top:1px solid var(--ink);border-bottom:0">
      <div class="proj-count">전체 ${String(total).padStart(2, '0')}건 · 최신순</div>
      <div class="proj-count">PAGE ${newsPage} / ${pages}</div>
    </div>
    <div class="ncards" style="margin-top:32px">${slice.map(newsCard).join('')}</div>
    <nav class="pager" aria-label="뉴스 페이지">
      <button id="pgPrev" ${newsPage === 1 ? 'disabled' : ''} aria-label="이전 페이지">←</button>
      ${Array.from({ length: pages }, (_, i) => `<button data-pg="${i + 1}" class="${newsPage === i + 1 ? 'on' : ''}" aria-current="${newsPage === i + 1}">${String(i + 1).padStart(2, '0')}</button>`).join('')}
      <button id="pgNext" ${newsPage === pages ? 'disabled' : ''} aria-label="다음 페이지">→</button>
    </nav>
  </div>
</section>`;
};

const renderArticle = slug => {
  const n = D.NEWS.find(x => x.slug === slug);
  if (!n) return `
    ${pgHero('<a href="#/newsroom">Newsroom</a><span>/</span>404', '404 — Not found', '기사를 찾을 수 없습니다', '요청한 주소의 기사를 찾지 못했습니다. 목록에서 다시 선택해 주세요.')}
    <section class="sec" style="background:var(--white)"><div class="wrap"><a class="btn" href="#/newsroom" style="border-color:var(--ink)">뉴스룸으로 ${arrow}</a></div></section>`;
  const idx = D.NEWS.indexOf(n);
  const next = D.NEWS[idx + 1] || D.NEWS[0];
  const prev = D.NEWS[idx - 1] || D.NEWS[D.NEWS.length - 1];
  return `
<section class="sec" style="background:var(--white);padding-top:calc(76px + clamp(48px,6vw,80px))">
  <div class="wrap">
    <article class="article">
      <nav class="crumb" aria-label="현재 위치"><a href="#/">Home</a><span>/</span><a href="#/newsroom">Newsroom</a><span>/</span>상세</nav>
      <div class="meta"><span>${esc(n.date)}</span><span class="tag">${esc(n.cat)}</span>${n.sample ? '<span class="tag sample">샘플 콘텐츠</span>' : ''}</div>
      <h1>${esc(n.title)}</h1>
      ${phBlock('대표 이미지', '16:9 · 대체 예정')}
      <div class="article-body">
        ${n.body.map(p => `<p>${esc(p)}</p>`).join('')}
        <h2>문의</h2>
        <p>이 내용에 대한 자세한 안내는 <a href="mailto:${esc(C.email)}" style="color:var(--accent-deep)">${esc(C.email)}</a> 또는 ${esc(C.tel)}로 문의해 주세요.</p>
        <ul>
          <li>보도자료·취재 문의: ${esc(C.email)}</li>
          <li>제품·도입 문의: ${esc(C.tel)}</li>
        </ul>
      </div>
      <div class="article-foot">
        <a class="btn" href="#/newsroom/${esc(prev.slug)}" style="border-color:var(--ink)">← 이전 기사 ${arrow}</a>
        <a class="btn" href="#/newsroom/${esc(next.slug)}" style="border-color:var(--ink)">다음 기사 ${arrow}</a>
      </div>
      <div style="margin-top:32px"><a href="#/newsroom" class="mono" style="color:var(--muted)">← 뉴스룸 전체 목록</a></div>
    </article>
  </div>
</section>`;
};

/* ══════════════════════════ FOOTER ══════════════════════════ */

const footer = () => `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-top">
      <a href="#/" class="logo" aria-label="미래아이엔텍 홈"><span class="logo-mark">mr<i aria-hidden="true"></i>nt</span><span class="logo-kr">㈜미래아이엔텍</span></a>
      <nav class="ftr-nav" aria-label="푸터 메뉴">
        <div class="ftr-col"><span class="k">Company</span><a href="#/company">기업소개</a><a href="#/company/location">오시는 길</a><a href="#/company/org">조직구성</a></div>
        <div class="ftr-col"><span class="k">Solutions</span><a href="#/solutions">개요</a><a href="#/solutions?sec=flame">Flame</a><a href="#/solutions?sec=demo">데모</a></div>
        <div class="ftr-col"><span class="k">Business</span><a href="#/business">사업영역</a><a href="#/business/projects">프로젝트</a></div>
        <div class="ftr-col"><span class="k">Newsroom</span><a href="#/newsroom">전체 보기</a></div>
      </nav>
    </div>
  </div>
  <div class="ftr-marq"><div class="marq"><div class="marq-track" id="ftrMq"></div></div></div>
  <div class="wrap">
    <div class="ftr-big" aria-hidden="true">mr<i></i>nt</div>
    <div class="ftr-info">
      <div><div class="k">Address</div>${esc(C.address)}<br>${esc(C.addressEn)}</div>
      <div><div class="k">Contact</div><a href="tel:025575267">T. ${esc(C.tel)}</a><br>F. ${esc(C.fax)}<br><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></div>
      <div><div class="k">Business</div>SI · ITO · Infra<br>Enterprise Solution<br>AI ITSM Platform</div>
      <div><div class="k">Legal</div>대표이사 ${esc(C.ceo)}<br>설립 ${esc(C.founded)}년</div>
    </div>
    <div class="ftr-bot">
      <span>${esc(C.copyright)}</span>
      <span>대표이사 ${esc(C.ceo)} · ${esc(C.address)}</span>
    </div>
  </div>
</footer>`;

/* ══════════════════════════ 라우터 ══════════════════════════ */

const app = $('#app');

const parseHash = () => {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const seg = path.split('/').filter(Boolean);
  const params = new URLSearchParams(qs || '');
  return { seg, params, raw: path };
};

const route = () => {
  const { seg, params } = parseHash();
  const a = seg[0] || '';
  const b = seg[1] || '';
  let html, title;

  if (!a) { html = renderHome(); title = '미래아이엔텍 | Financial IT & AI Platform'; }
  else if (a === 'company') {
    if (b === 'location') { html = companyLocation(); title = '오시는 길 | 미래아이엔텍'; }
    else if (b === 'org') { html = companyOrg(); title = '조직구성 | 미래아이엔텍'; }
    else { html = companyIntro(); title = '기업소개 | 미래아이엔텍'; }
  }
  else if (a === 'solutions') { html = renderSolutions(params); title = 'Solutions — AI ITSM 플랫폼 | 미래아이엔텍'; }
  else if (a === 'business') {
    if (b === 'projects') { html = renderBusiness(); title = '프로젝트 | 미래아이엔텍'; }
    else { html = renderBusiness(); title = '사업영역 | 미래아이엔텍'; }
  }
  else if (a === 'newsroom') { html = b ? renderArticle(b) : renderNewsroom(); title = (b ? '뉴스' : '뉴스룸') + ' | 미래아이엔텍'; }
  else { html = renderHome(); title = '미래아이엔텍'; }

  document.title = title;
  app.innerHTML = html;

  /* 라우트별 후처리 */
  window.MR.initHero();
  window.MR.initTech();
  window.MR.marquee($('#mq1'), D.CLIENTS.row1);
  window.MR.marquee($('#mq2'), D.CLIENTS.row2);
  window.MR.marquee($('#ftrMq'), ['MIRAE I&N TECH', 'FINANCIAL IT', 'AI ITSM PLATFORM', 'SINCE 2003', 'SEOUL, KR']);
  window.MR.renderViz();

  if (a === 'business' || !a) { if ($('#fgroups')) initProjects(); }
  bindTabs();
  bindAccordion();
  bindPager();
  window.MR.observeAll();

  /* 스크롤 위치 */
  const sec = params.get('sec');
  if (sec) {
    requestAnimationFrame(() => {
      const el = document.getElementById(sec);
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      else scrollTo({ top: 0 });
    });
  } else if (!location.hash.includes('#')) scrollTo({ top: 0 });
  else if (a && !b) scrollTo({ top: 0 });
  else if (!a) scrollTo({ top: 0 });
  else scrollTo({ top: 0 });

  /* 서브내비 active */
  if (sec) $$('.subnav a').forEach(x => x.classList.toggle('active', x.dataset.sec === sec));
};

/* ── 프로젝트 필터 ── */
function initProjects() {
  const fw = $('#fgroups');
  fw.innerHTML = D.PROJECT_FILTERS.map(g => `
    <div class="fgroup">
      <span class="fgroup-lbl">${esc(g.label)}</span>
      <div class="filters" data-key="${esc(g.key)}">
        ${g.options.map(o => `<button data-val="${esc(o)}" class="${PF[g.key] === o ? 'on' : ''}">${esc(o)}<sup>${g.key === 'type' ? String(o === '전체' ? D.PROJECTS.length : D.PROJECTS.filter(p => p.type === o).length).padStart(2, '0') : o === '전체' ? '' : String(D.PROJECTS.filter(p => p[g.key] === o).length).padStart(2, '0')}</sup></button>`).join('')}
      </div>
    </div>`).join('');

  $$('#fgroups .filters').forEach(group => {
    const key = group.dataset.key;
    group.addEventListener('click', e => {
      const btn = e.target.closest('button'); if (!btn) return;
      PF[key] = btn.dataset.val; expanded = false;
      $$('button', group).forEach(b => b.classList.toggle('on', b === btn));
      renderProjects();
    });
  });

  const moreBtn = $('#moreBtn');
  if (moreBtn) moreBtn.addEventListener('click', () => { expanded = !expanded; renderProjects(); });

  renderProjects();
}

function renderProjects() {
  const list = D.PROJECTS.filter(p =>
    (PF.type === '전체' || p.type === PF.type) &&
    (PF.industry === '전체' || p.industry === PF.industry) &&
    (PF.status === '전체' || p.status === PF.status));

  const plist = $('#plist');
  if (!list.length) {
    plist.innerHTML = `<li class="empty">
      <b>해당 조건의 프로젝트가 없습니다</b>
      <p>필터 조건을 바꾸거나 초기화해 보세요.</p>
      <button class="btn" id="resetBtn" style="border-color:var(--ink)">필터 초기화 ${arrow}</button>
    </li>`;
    const rb = $('#resetBtn');
    if (rb) rb.onclick = () => {
      PF.type = PF.industry = PF.status = '전체'; expanded = false;
      $$('#fgroups .filters').forEach(g => $$('button', g).forEach(b => b.classList.toggle('on', b.dataset.val === '전체')));
      renderProjects();
    };
  } else {
    const shown = expanded ? list : list.slice(0, LIMIT);
    plist.innerHTML = shown.map(p => `
      <li class="prow">
        <span class="yr">${esc(p.year)}</span>
        <span class="tt">${esc(p.name)}</span>
        <span class="ind">${esc(p.industry)}</span>
        <span class="cat" data-c="${esc(p.type)}">${esc(p.type)}</span>
        <span class="go" aria-hidden="true"></span>
      </li>`).join('');
  }

  const cnt = $('#projCount');
  if (cnt) cnt.textContent = `${String(list.length).padStart(2, '0')} / ${String(D.PROJECTS.length).padStart(2, '0')} PROJECTS`;
  const wrap = $('#moreWrap');
  if (wrap) {
    wrap.style.display = list.length > LIMIT ? 'flex' : 'none';
    const mb = $('#moreBtn');
    if (mb) mb.innerHTML = (expanded ? '접기 ' : '전체 실적 보기 ') + arrow;
  }
}

/* ── 탭 ── */
function bindTabs() {
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    const activate = i => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activate(i));
      t.addEventListener('keydown', e => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); activate(n); }
      });
    });
  });
}

/* ── 아코디언 ── */
function bindAccordion() {
  $$('.acc-item > button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const body = document.getElementById(btn.getAttribute('aria-controls'));
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });
  });
}

/* ── 뉴스 페이지네이션 ── */
function bindPager() {
  $$('.pager button[data-pg]').forEach(b => b.addEventListener('click', () => {
    newsPage = +b.dataset.pg; route();
  }));
  const p = $('#pgPrev'), n = $('#pgNext');
  if (p) p.addEventListener('click', () => { if (newsPage > 1) { newsPage--; route(); } });
  if (n) n.addEventListener('click', () => { if (newsPage < Math.ceil(D.NEWS.length / PER_PAGE)) { newsPage++; route(); } });
}

/* ── 시작 ── */
addEventListener('hashchange', route);
route();

/* 내부 앵커(#/ 없이) 처리 */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#/"]');
  if (!a) return;
  document.body.classList.remove('menu-open');
  const burger = $('#burger');
  if (burger) burger.setAttribute('aria-expanded', 'false');
});
})();
