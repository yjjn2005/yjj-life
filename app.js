// 유재진 한달살기 & 골프투어 앱 v2.1
// 거점도시 상세탭 · 10개년 마스터플랜 모달 · 200도시 필터

const STORAGE_KEY = 'yjj_life_v2';
const SYNC_KEY    = 'yjj_sync_v2';
const SYNC_PREFIX = 'yjjSync:';

let appData    = null;
let editMode   = false;
let syncState  = null;
let syncTimer  = null;

let fType = 'all', fSeason = 'all', fContinent = 'all', fPrice = 'all', fGolf = 'all', fGrade = 'all';
let fText = '';
let sortMode = 'rank';
let viewMode = 'card';

// ── 초기화 ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initNav();
  initExploreFilters();
  initSettings();
  initEditModal();
  initMasterPlanModal();
  renderDashboard();
  loadSync();
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'e') { e.preventDefault(); toggleEditMode(); }
  });
});

function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) appData = JSON.parse(r); } catch(e) {}
  if (!appData) appData = deepClone(window.INITIAL_DATA);
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); markDirty(); }
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

// ── NAV ────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  document.getElementById('editToggle').addEventListener('click', toggleEditMode);
  document.getElementById('btnEditMode').addEventListener('click', toggleEditMode);
  document.getElementById('detailBack').addEventListener('click', () => showView('featured'));
}

function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.view === v));
  const el = document.getElementById('view-' + v);
  if (el) el.classList.add('active');
  if (v === 'dashboard') renderDashboard();
  if (v === 'explore')   renderExplore();
  if (v === 'featured')  renderFeatured();
  if (v === 'golf')      renderGolf();
}

// ── DASHBOARD ───────────────────────────────────────
function renderDashboard() {
  const statsData = [
    { label:'해외 도시',        value:'100', unit:'개',  sub:'1위: 태국 치앙마이' },
    { label:'국내 도시',        value:'100', unit:'개',  sub:'1위: 제주 성산' },
    { label:'해외 평균 체류비', value:'471', unit:'만원', sub:'2인 · 1개월 기준' },
    { label:'국내 평균 체류비', value:'314', unit:'만원', sub:'최저 261~최고 440만' },
    { label:'10개년 플랜',      value:'10',  unit:'년',  sub:'50개국 · 100도시' },
    { label:'대상',             value:'5070',unit:'',    sub:'액티브 시니어' },
  ];
  document.getElementById('dashStats').innerHTML = statsData.map(d =>
    `<div class="stat-card"><div class="stat-label">${d.label}</div>
     <div class="stat-value">${d.value}<span>${d.unit}</span></div>
     <div class="stat-sub">${d.sub}</div></div>`
  ).join('');

  renderTop10('overseasTop10', appData.overseasCities || []);
  renderTop10('domesticTop10', appData.domesticCities || []);

  const seasons = [
    {name:'봄',icon:'🌸',months:'3~5월'},{name:'여름',icon:'☀️',months:'6~8월'},
    {name:'가을',icon:'🍂',months:'9~11월'},{name:'겨울',icon:'❄️',months:'12~2월'},
  ];
  const sp = appData.seasonalPicks || {};
  document.getElementById('seasonGrid').innerHTML = seasons.map(s => {
    const picks = sp[s.name] || {};
    const doms  = (picks.domestic||[]).slice(0,3).join(', ');
    const overs = (picks.overseas||[]).slice(0,3).join(', ');
    return `<div class="season-card" onclick="filterBySeason('${s.name}')">
      <div class="season-icon">${s.icon}</div>
      <div class="season-name">${s.name} <span style="font-size:11px;color:var(--text-muted);font-weight:400">${s.months}</span></div>
      <div class="season-pick"><strong>국내</strong> ${doms||'-'}<br><strong>해외</strong> ${overs||'-'}</div>
    </div>`;
  }).join('');

  const tours = (appData.golfTour||[]).filter(g => g.monthlyCost > 0).slice(0,3);
  document.getElementById('golfTopCards').innerHTML =
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">
      ${tours.map(g => `
        <div class="golf-card">
          <div class="golf-card-head">
            <div class="golf-card-region">${g.region}</div>
            <div class="golf-card-cost">${fmt(g.monthlyCost)}</div>
            <div class="golf-card-cost-label">월 8회 골프비용</div>
          </div>
          <div class="golf-card-body">
            <div class="golf-card-feature">${g.feature}</div>
            <div class="golf-card-tips">💡 ${g.tips}</div>
          </div>
        </div>`).join('')}
    </div>`;

  const yearly = appData.yearlyPlan || [];
  document.getElementById('yearlyContainer').innerHTML = yearly.map(y =>
    `<div class="year-cell" onclick="openMasterPlan(${y.year-1})" style="cursor:pointer">
      <div class="year-num">${y.year}년차 (${y.years})</div>
      <div class="year-theme">${y.theme||y.region}</div>
      <div class="year-cities">${(y.cities||[]).slice(0,3).join(' · ')}</div>
    </div>`
  ).join('');

  const btn = document.getElementById('btnMasterPlan');
  if (btn) btn.onclick = () => openMasterPlan(0);
}

function renderTop10(id, arr) {
  document.getElementById(id).innerHTML = arr.slice(0,10).map((c,i) =>
    `<div class="rank-row" onclick="goDetail('${c.key||''}','${encodeURIComponent(c.name)}')">
      <div class="rank-num ${i<3?'top3':''}">${c.rank}</div>
      <div><div class="rank-city">${c.name}</div><div class="rank-city-en">${c.nameEn||''}</div></div>
      <div class="rank-cost">${fmt(c.cost)}</div>
    </div>`
  ).join('');
}

// ── MASTER PLAN MODAL ───────────────────────────────
function initMasterPlanModal() {
  document.getElementById('masterPlanClose').addEventListener('click', closeMasterPlan);
  document.getElementById('masterPlanCloseBtn').addEventListener('click', closeMasterPlan);
  document.getElementById('masterPlanBg').addEventListener('click', e => { if (e.target===e.currentTarget) closeMasterPlan(); });
  document.getElementById('masterPlanExport').addEventListener('click', () => { toast('인쇄 대화상자에서 PDF 저장'); setTimeout(()=>window.print(),300); });
}

function openMasterPlan(openIdx) {
  const yearly = appData.yearlyPlan || [];
  const pClass = { HIGH:'mp-priority-HIGH', MED:'mp-priority-MED', LOW:'mp-priority-LOW' };

  const html = `
    <div style="padding:16px 20px;background:linear-gradient(135deg,var(--navy),#2C5282);color:#fff">
      <div style="font-size:11px;color:rgba(255,255,255,.55);margin-bottom:8px">2026 ~ 2036 · 2인 기준 로드맵</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px">
        <div><div style="font-size:10px;color:rgba(255,255,255,.5)">총 목표 도시</div><div style="font-size:20px;font-weight:800;color:var(--gold-light)">100 <span style="font-size:12px">도시</span></div></div>
        <div><div style="font-size:10px;color:rgba(255,255,255,.5)">목표 국가</div><div style="font-size:20px;font-weight:800;color:var(--gold-light)">50 <span style="font-size:12px">개국</span></div></div>
        <div><div style="font-size:10px;color:rgba(255,255,255,.5)">계획 기간</div><div style="font-size:20px;font-weight:800;color:var(--gold-light)">10 <span style="font-size:12px">년</span></div></div>
        <div><div style="font-size:10px;color:rgba(255,255,255,.5)">예상 총비용</div><div style="font-size:13px;font-weight:700;color:var(--gold-light)">약 3억~5억원</div><div style="font-size:10px;color:rgba(255,255,255,.4)">(10년·2인 총합)</div></div>
      </div>
    </div>
    ${yearly.map((y, idx) => {
      const prKey = (y.priority||'').includes('HIGH') ? 'HIGH' : (y.priority||'').includes('MED') ? 'MED' : 'LOW';
      return `
        <div class="mp-year-block">
          <div class="mp-year-head" onclick="toggleMpYear(${idx})">
            <div class="mp-year-num"><span>${y.year}</span>년차</div>
            <div>
              <div class="mp-year-title">${y.theme||y.region}</div>
              <div class="mp-year-sub">${y.years||''} · ${y.region} · ${y.quarter}</div>
            </div>
            <div class="mp-year-meta">
              <div class="mp-year-cost">${y.cost||'-'}</div>
              <div style="margin-top:3px"><span class="${pClass[prKey]}">${prKey}</span></div>
            </div>
          </div>
          <div class="mp-year-body ${idx===openIdx?'open':''}" id="mpBody${idx}">
            <div class="mp-summary-box">${y.summary||y.region+' 한달살기 탐방'}</div>
            <div class="mp-cities-chips">
              ${(y.cities||[]).map(c=>`<span class="mp-city-chip">${c}</span>`).join('')}
            </div>
            <div class="mp-info-row" style="margin-top:8px">
              <div class="mp-info-item"><strong>권역:</strong> ${y.region}</div>
              <div class="mp-info-item"><strong>시기:</strong> ${y.quarter}</div>
              <div class="mp-info-item"><strong>예산:</strong> ${y.cost||'미정'}</div>
              <div class="mp-info-item"><strong>도시 수:</strong> ${y.cityCount||10}개</div>
            </div>
          </div>
        </div>`;
    }).join('')}`;

  document.getElementById('masterPlanBody').innerHTML = html;
  document.getElementById('masterPlanBg').classList.add('active');
}

function toggleMpYear(idx) {
  const el = document.getElementById('mpBody'+idx);
  if (el) el.classList.toggle('open');
}
function closeMasterPlan() { document.getElementById('masterPlanBg').classList.remove('active'); }

// ── EXPLORE ─────────────────────────────────────────
function initExploreFilters() {
  const conts = [...new Set(getAllCities().map(c => c.continent||c.region).filter(Boolean))].sort();
  const cont = document.getElementById('filterContinent');
  conts.forEach(c => {
    const s = document.createElement('span');
    s.className = 'filter-chip'; s.dataset.val = c; s.textContent = c;
    cont.appendChild(s);
  });

  ['filterType','filterSeason','filterContinent','filterPrice','filterGolf','filterGrade'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      const chip = e.target.closest('.filter-chip'); if (!chip) return;
      e.currentTarget.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const v = chip.dataset.val;
      if (id==='filterType')       fType = v;
      else if (id==='filterSeason')     fSeason = v;
      else if (id==='filterContinent')  fContinent = v;
      else if (id==='filterPrice')      fPrice = v;
      else if (id==='filterGolf')       fGolf = v;
      else if (id==='filterGrade')      fGrade = v;
      renderExplore();
    });
  });

  document.getElementById('exploreSearch').addEventListener('input', e => { fText = e.target.value.trim(); renderExplore(); });
  document.getElementById('sortSelect').addEventListener('change', e => { sortMode = e.target.value; renderExplore(); });
  document.getElementById('btnCardView').addEventListener('click', () => setViewMode('card'));
  document.getElementById('btnTableView').addEventListener('click', () => setViewMode('table'));
}

function setViewMode(m) {
  viewMode = m;
  document.getElementById('btnCardView').classList.toggle('active', m==='card');
  document.getElementById('btnTableView').classList.toggle('active', m==='table');
  document.getElementById('cityCardGrid').style.display  = m==='card'  ? '' : 'none';
  document.getElementById('cityTableWrap').style.display = m==='table' ? '' : 'none';
  renderExplore();
}

function filterBySeason(season) {
  fSeason = season;
  document.querySelectorAll('#filterSeason .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.val===season));
  showView('explore');
}

function getAllCities() {
  return [...(appData.overseasCities||[]), ...(appData.domesticCities||[])];
}

function applyFilters(cities) {
  return cities.filter(c => {
    if (fType!=='all' && c.type!==fType) return false;
    if (fSeason!=='all' && c.season!==fSeason) return false;
    if (fContinent!=='all' && (c.continent||c.region||'')!==fContinent) return false;
    if (fPrice!=='all') {
      const n = c.cost||0;
      if (fPrice==='300'     && n>=3000000) return false;
      if (fPrice==='300-400' && (n<3000000||n>=4000000)) return false;
      if (fPrice==='400-500' && (n<4000000||n>=5000000)) return false;
      if (fPrice==='500-700' && (n<5000000||n>=7000000)) return false;
      if (fPrice==='700+'    && n<7000000) return false;
    }
    if (fGolf!=='all') {
      if (fGolf==='yes' && !c.golf) return false;
      if (fGolf==='no'  &&  c.golf) return false;
    }
    if (fGrade!=='all') {
      const bad=['보통','주의','하위','최하위'];
      if (fGrade==='보통이하' && !bad.includes(c.grade)) return false;
      else if (fGrade!=='보통이하' && c.grade!==fGrade) return false;
    }
    if (fText) {
      const q = fText.toLowerCase();
      if (!(c.name+' '+(c.nameEn||'')+' '+(c.continent||'')+' '+(c.region||'')).toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function sortCities(arr) {
  const a = [...arr];
  if (sortMode==='rank')      a.sort((x,y)=>x.rank-y.rank);
  if (sortMode==='cost-asc')  a.sort((x,y)=>x.cost-y.cost);
  if (sortMode==='cost-desc') a.sort((x,y)=>y.cost-x.cost);
  if (sortMode==='mention')   a.sort((x,y)=>y.mentionIdx-x.mentionIdx);
  if (sortMode==='safety')    a.sort((x,y)=>y.safetyIdx-x.safetyIdx);
  return a;
}

function renderExplore() {
  const filtered = sortCities(applyFilters(getAllCities()));
  document.getElementById('resultCount').textContent = filtered.length;
  if (viewMode==='card') renderCityCards(filtered);
  else renderCityTable(filtered);
}

function renderCityCards(cities) {
  const grid = document.getElementById('cityCardGrid');
  if (!cities.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-title">조건에 맞는 도시가 없습니다</div><div>필터를 변경해보세요</div></div>`;
    return;
  }
  grid.innerHTML = cities.map(c => {
    const area = c.continent||c.region||'';
    const gc   = 'tag-grade-'+(c.grade||'보통');
    return `<div class="city-card" onclick="goDetail('${c.key||''}','${encodeURIComponent(c.name)}')">
      <div class="city-card-header">
        <div class="city-rank-badge">${c.type==='overseas'?'해외':'국내'} ${c.rank}위</div>
        <div class="city-card-name">${c.name}</div>
        <div class="city-card-en">${c.nameEn||''}</div>
      </div>
      <div class="city-card-body">
        <div class="city-card-row"><span class="city-card-row-label">대륙/권역</span><span class="city-card-row-val">${area}</span></div>
        <div class="city-card-row"><span class="city-card-row-label">최적 계절</span><span class="city-card-row-val">${c.season||'-'}</span></div>
        <div class="city-card-row"><span class="city-card-row-label">언급지수</span><span class="city-card-row-val">${c.mentionIdx||'-'}</span></div>
        <div class="city-card-row"><span class="city-card-row-label">안전지수</span><span class="city-card-row-val">${c.safetyIdx||'-'}</span></div>
        <div class="city-card-cost">${fmt(c.cost)}<span> / 월 2인</span></div>
      </div>
      <div class="city-card-footer">
        <span class="tag ${gc}">${c.grade||'-'}</span>
        ${c.golf?'<span class="tag tag-golf-yes">⛳ 골프가능</span>':'<span class="tag tag-golf-no">골프제한</span>'}
        <span class="tag tag-season">${c.season||''}</span>
      </div>
    </div>`;
  }).join('');
}

function renderCityTable(cities) {
  const tbody = document.getElementById('cityTableBody');
  if (!cities.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:36px;color:var(--text-muted)">조건에 맞는 도시가 없습니다</td></tr>`;
    return;
  }
  tbody.innerHTML = cities.map(c => {
    const area = c.continent||c.region||'';
    const mp = Math.min(100, c.mentionIdx||0);
    const sp = Math.min(100, c.safetyIdx||0);
    return `<tr onclick="goDetail('${c.key||''}','${encodeURIComponent(c.name)}')">
      <td style="font-size:12px;font-weight:700;color:var(--text-muted)">${c.type==='overseas'?'🌍':'🇰🇷'} ${c.rank}</td>
      <td><div class="city-name-main">${c.name}</div><div class="city-name-sub">${c.nameEn||''}</div></td>
      <td><span class="tag tag-season">${c.season||'-'}</span></td>
      <td style="font-size:12px;color:var(--text-muted)">${area}</td>
      <td class="cost-cell">${fmt(c.cost)}</td>
      <td><div class="idx-bar"><span class="idx-num">${c.mentionIdx||0}</span><div class="idx-track"><div class="idx-fill" style="width:${mp}%"></div></div></div></td>
      <td><div class="idx-bar"><span class="idx-num">${c.safetyIdx||0}</span><div class="idx-track"><div class="idx-fill" style="width:${sp}%;background:var(--sage)"></div></div></div></td>
      <td>${c.golf?'<span class="golf-yes">⛳</span>':'<span class="golf-no">✕</span>'}</td>
      <td><span class="tag tag-grade-${c.grade||'보통'}">${c.grade||'-'}</span></td>
    </tr>`;
  }).join('');
}

// ── FEATURED ─────────────────────────────────────────
function renderFeatured() {
  const cities = appData.featuredCities || [];
  const container = document.getElementById('featuredGrid');
  if (!container) return;
  container.className = 'fc-grid';
  container.innerHTML = cities.map(c => {
    const costRange = (c.costMin && c.costMax) ? `${c.costMin} ~ ${c.costMax}` : fmt(c.totalCost);
    return `<div class="fc-card" onclick="showDetail('${c.key}')">
      <div class="fc-cover">
        <div class="fc-flag">${c.country||''}</div>
        <div class="fc-name">${c.name}</div>
        <div class="fc-en">${c.nameEn||''}</div>
        <div class="fc-theme-badge">${c.theme||''}</div>
        <div class="fc-cover-meta">
          <span class="fc-meta-chip">${c.continent||''}</span>
          <span class="fc-meta-chip">${c.season||''}이 최적</span>
          <span class="fc-meta-chip">${c.golf?'⛳ 골프':'골프제한'}</span>
        </div>
      </div>
      <div class="fc-body">
        <div class="fc-cost-band">
          <div class="fc-cost-label">월 예상 체류비 (2인)</div>
          <div class="fc-cost-val">${costRange}</div>
        </div>
        <div class="fc-stat-row">
          <div class="fc-stat"><div class="fc-stat-lbl">비자</div><div class="fc-stat-v">${c.visa||'-'}</div></div>
          <div class="fc-stat"><div class="fc-stat-lbl">인터넷</div><div class="fc-stat-v">${(c.internet||'-').split(' ')[0]}</div></div>
          <div class="fc-stat"><div class="fc-stat-lbl">언어</div><div class="fc-stat-v">${(c.language||'-').split(' ')[0]}</div></div>
          <div class="fc-stat"><div class="fc-stat-lbl">방문 시기</div><div class="fc-stat-v">${c.quarter||c.season||'-'}</div></div>
        </div>
        <div class="fc-desc">${c.description||''}</div>
        <div class="fc-cta">비용·골프·스케줄 전체 보기 →</div>
      </div>
    </div>`;
  }).join('');
}

// ── DETAIL ───────────────────────────────────────────
function showDetail(key) {
  const city = (appData.featuredCities||[]).find(c => c.key===key);
  if (!city) return;
  const data = (appData.cityDetails||{})[key];
  showView('detail');
  document.getElementById('detailContainer').innerHTML = buildDetailHTML(city, data);
  switchDetailTab('overview');
}

function goDetail(key, encodedName) {
  if (key && (appData.cityDetails||{})[key]) { showDetail(key); return; }
  const fc = (appData.featuredCities||[]).find(c => c.key===key);
  if (fc) { showDetail(key); return; }
  const name = decodeURIComponent(encodedName);
  const city = getAllCities().find(c => c.name===name) || {name};
  showView('detail');
  document.getElementById('detailContainer').innerHTML = buildSimpleDetail(city);
}

function switchDetailTab(tab) {
  document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.toggle('active', p.id==='dtab-'+tab));
}

function buildDetailHTML(city, data) {
  const costRange = (city.costMin&&city.costMax) ? `${city.costMin} ~ ${city.costMax}` : fmt(city.totalCost);
  const hasCosts  = data && data.costs  && data.costs.length;
  const hasGolf   = data && data.golfCourses && data.golfCourses.length;
  const hasSched  = data && data.weeklySchedule && data.weeklySchedule.length;

  return `
  <button class="detail-back" onclick="showView('featured')">← 거점도시 목록</button>

  <div class="detail-hero editable" data-edit="city-${city.key}">
    <div class="detail-hero-eyebrow">${city.country||''} · ${city.continent||''}</div>
    <h2>${city.name}${city.nameEn?' ('+city.nameEn+')':''}</h2>
    <div class="detail-desc">${city.description||''}</div>
    <div class="detail-quick-stats">
      <div><div class="dqs">월 체류비 (2인)</div><div class="dqs-v">${costRange}</div></div>
      <div><div class="dqs">최적 계절</div><div class="dqs-v">${city.season||'-'}</div></div>
      <div><div class="dqs">비자</div><div class="dqs-v">${city.visa||'-'}</div></div>
      <div><div class="dqs">인터넷</div><div class="dqs-v">${city.internet||'-'}</div></div>
      <div><div class="dqs">언어</div><div class="dqs-v">${city.language||'-'}</div></div>
      <div><div class="dqs">골프</div><div class="dqs-v">${city.golf?'⛳ 가능':'제한'}</div></div>
    </div>
  </div>

  <div class="detail-tabs">
    <button class="detail-tab-btn active" data-tab="overview" onclick="switchDetailTab('overview')">📊 비용 개요</button>
    ${hasGolf ?`<button class="detail-tab-btn" data-tab="golf"  onclick="switchDetailTab('golf')">⛳ 골프코스</button>`:''}
    ${hasSched?`<button class="detail-tab-btn" data-tab="sched" onclick="switchDetailTab('sched')">📅 주간 스케줄</button>`:''}
    <button class="detail-tab-btn" data-tab="tips" onclick="switchDetailTab('tips')">💡 현지 팁</button>
  </div>

  <div class="detail-tab-panel active" id="dtab-overview">
    ${hasCosts ? `
    <div class="panel" style="margin-bottom:16px">
      <div class="panel-head"><div class="panel-head-title">💰 월 예상 비용 명세 (2인 기준)</div></div>
      ${data.costs.map(r => `
        <div class="cost-row ${r.item.includes('합계')?'total':''}">
          <div class="cost-item">${r.item}</div>
          <span class="cost-incl ${r.included?'in':'out'}">${r.included?'포함':'별도'}</span>
          <div class="cost-amt">${typeof r.amount==='number'?fmt(r.amount):r.amount}</div>
        </div>
        ${r.note?`<div style="padding:0 16px 5px;font-size:11px;color:var(--text-muted)">${r.note}</div>`:''}`
      ).join('')}
    </div>` : `<div class="tips-box"><h4>비용 정보</h4><div class="tips-text">월 체류비: ${costRange} (2인 기준)</div></div>`}
    ${data&&data.lodging?`<div class="lodging-box"><h4>🏠 숙소 추천</h4><p>${data.lodging}</p></div>`:''}
  </div>

  ${hasGolf?`
  <div class="detail-tab-panel" id="dtab-golf">
    <div class="panel" style="margin-bottom:16px">
      <div class="panel-head"><div class="panel-head-title">⛳ 추천 골프코스</div></div>
      ${data.golfSummary?`<div class="golf-summary-box">${data.golfSummary}</div>`:''}
      ${data.golfCourses.map(g=>`
        <div class="golf-row">
          <div><div class="golf-name">${g.name}</div><div class="golf-feature">${g.feature||''}</div></div>
          <div style="text-align:right">
            <div class="golf-fee">${g.greenFee||'-'}</div>
            <div style="font-size:10.5px;color:var(--text-muted)">${g.cart||''}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`:''}

  ${hasSched?`
  <div class="detail-tab-panel" id="dtab-sched">
    <div class="panel" style="margin-bottom:16px">
      <div class="panel-head"><div class="panel-head-title">📅 추천 주간 스케줄</div></div>
      ${data.weeklySchedule.map(s=>`
        <div class="sched-row">
          <div class="sched-day">${s.day}</div>
          <div class="sched-am">${s.am||''}</div>
          <div>${s.pm||''}</div>
        </div>`).join('')}
    </div>
  </div>`:''}

  <div class="detail-tab-panel" id="dtab-tips">
    ${data&&data.tips?`<div class="tips-box"><h4>💡 현지 핵심 팁</h4><div class="tips-text">${data.tips.replace(/·\s/g,'<br>· ')}</div></div>`
    :'<div class="tips-box"><h4>💡 팁</h4><div class="tips-text">현지 정보를 수집 중입니다.</div></div>'}
  </div>`;
}

function buildSimpleDetail(city) {
  const area = city.continent||city.region||'';
  return `
  <button class="detail-back" onclick="showView('explore')">← 도시 탐색</button>
  <div class="detail-hero">
    <div class="detail-hero-eyebrow">${city.type==='overseas'?'해외':'국내'} 한달살기 ${city.rank?city.rank+'위':''}</div>
    <h2>${city.name}${city.nameEn?' ('+city.nameEn+')':''}</h2>
    <div class="detail-desc">${area} · ${city.season||''}이 최적 · 종합평가 ${city.grade||'-'}</div>
    <div class="detail-quick-stats">
      <div><div class="dqs">월 체류비 (2인)</div><div class="dqs-v">${fmt(city.cost)}</div></div>
      <div><div class="dqs">종합평가</div><div class="dqs-v">${city.grade||'-'}</div></div>
      <div><div class="dqs">골프</div><div class="dqs-v">${city.golf?'⛳ 가능':'제한'}</div></div>
      <div><div class="dqs">언급지수</div><div class="dqs-v">${city.mentionIdx||'-'}</div></div>
      <div><div class="dqs">안전지수</div><div class="dqs-v">${city.safetyIdx||'-'}</div></div>
    </div>
  </div>
  <div class="tips-box" style="margin-top:4px">
    <h4>💡 안내</h4>
    <div class="tips-text">이 도시는 아직 상세 플랜이 없습니다.<br>⭐ 거점도시 탭에서 8대 거점도시의 비용·골프코스·주간스케줄·현지팁 전체 정보를 확인하세요.</div>
  </div>`;
}

// ── GOLF ─────────────────────────────────────────────
function renderGolf() {
  const tours = (appData.golfTour||[]).filter(g => g.monthlyCost>0);
  const maxCost = Math.max(...tours.map(t=>t.monthlyCost));
  document.getElementById('golfCards').innerHTML = tours.map(g=>`
    <div class="golf-card">
      <div class="golf-card-head">
        <div class="golf-card-region">${g.region}</div>
        <div class="golf-card-cost">${fmt(g.monthlyCost)}</div>
        <div class="golf-card-cost-label">월 8회(주 2회) 골프비용</div>
        <div style="margin-top:8px;height:5px;background:rgba(255,255,255,.15);border-radius:3px">
          <div style="height:5px;background:var(--gold-light);border-radius:3px;width:${Math.round(g.monthlyCost/maxCost*100)}%"></div>
        </div>
      </div>
      <div class="golf-card-body">
        <div class="golf-card-feature">${g.feature}</div>
        <div class="golf-card-tips">💡 ${g.tips}</div>
      </div>
    </div>`).join('');

  document.getElementById('golfCitiesBody').innerHTML =
    (appData.overseasCities||[]).filter(c=>c.golf).slice(0,20).map(c=>
    `<tr onclick="goDetail('${c.key||''}','${encodeURIComponent(c.name)}')">
      <td style="font-size:12px;font-weight:700;color:var(--text-muted)">해외 ${c.rank}</td>
      <td><div class="city-name-main">${c.name}</div><div class="city-name-sub">${c.nameEn||''}</div></td>
      <td style="font-size:12px;color:var(--text-muted)">${c.continent||''}</td>
      <td><span class="tag tag-season">${c.season||''}</span></td>
      <td class="cost-cell">${fmt(c.cost)}</td>
      <td><span class="tag tag-grade-${c.grade||'보통'}">${c.grade||'-'}</span></td>
    </tr>`).join('');
}

// ── SETTINGS ─────────────────────────────────────────
function initSettings() {
  document.getElementById('btnExport').addEventListener('click', exportData);
  document.getElementById('btnImport').addEventListener('click', ()=>document.getElementById('fileImport').click());
  document.getElementById('fileImport').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { appData=JSON.parse(ev.target.result); saveData(); renderDashboard(); toast('가져오기 완료 ✓','ok'); }
      catch { toast('파일 오류','err'); }
    };
    reader.readAsText(file); e.target.value='';
  });
  document.getElementById('btnReset').addEventListener('click', ()=>{
    if (!confirm('초기화하시겠습니까?')) return;
    localStorage.removeItem(STORAGE_KEY);
    appData = deepClone(window.INITIAL_DATA);
    renderDashboard(); toast('초기화 완료','ok');
  });
  document.getElementById('btnSyncStart').addEventListener('click', startSync);
  document.getElementById('btnSyncNow').addEventListener('click', doPush);
  document.getElementById('btnSyncStop').addEventListener('click', stopSync);
  document.getElementById('btnCopyCode').addEventListener('click', copySyncCode);
}

function exportData() {
  const blob = new Blob([JSON.stringify(appData,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'yjj_life_'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
}

// ── EDIT MODE ─────────────────────────────────────────
function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  document.getElementById('editToggle').classList.toggle('active', editMode);
  toast(editMode?'편집 모드 ON — 항목 클릭 시 수정':'편집 모드 OFF');
}

function initEditModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalBg').addEventListener('click', e=>{ if(e.target===e.currentTarget) closeModal(); });
  document.getElementById('modalSave').addEventListener('click', saveModal);
  document.addEventListener('click', e=>{
    if (!editMode) return;
    const el = e.target.closest('.editable');
    if (el) openEditModal(el);
  });
}

let _editEl = null;
function openEditModal(el) {
  _editEl = el;
  document.getElementById('modalTitle').textContent = '내용 편집';
  document.getElementById('modalSub').textContent = el.dataset.edit||'';
  document.getElementById('modalBody').innerHTML =
    `<div class="field"><label>내용</label><textarea id="editTextarea" style="min-height:120px">${el.innerHTML}</textarea></div>`;
  document.getElementById('modalBg').classList.add('active');
}
function closeModal() { document.getElementById('modalBg').classList.remove('active'); _editEl=null; }
function saveModal() {
  if (_editEl) { _editEl.innerHTML=document.getElementById('editTextarea').value; saveData(); toast('저장 ✓','ok'); }
  closeModal();
}

// ── SYNC ─────────────────────────────────────────────
function loadSync() {
  try { const r=localStorage.getItem(SYNC_KEY); if(r) syncState=JSON.parse(r); } catch {}
  if (syncState&&syncState.token&&syncState.gistId) { showSyncStep(2); updateSyncUI(); schedulePull(); }
}

async function startSync() {
  const token = document.getElementById('ghToken').value.trim();
  const code  = document.getElementById('ghSyncCode').value.trim();
  if (code&&code.startsWith(SYNC_PREFIX)) {
    const parts = code.slice(SYNC_PREFIX.length).split(':');
    if (parts.length>=2) {
      syncState={token:parts[0],gistId:parts[1]};
      localStorage.setItem(SYNC_KEY,JSON.stringify(syncState));
      showSyncStep(2); updateSyncUI(); await doPull(); schedulePull(); return;
    }
  }
  if (!token) { toast('Token을 입력하세요','err'); return; }
  toast('Gist 생성 중…');
  try {
    const res = await fetch('https://api.github.com/gists',{
      method:'POST',
      headers:{Authorization:'token '+token,'Content-Type':'application/json'},
      body:JSON.stringify({description:'yjj-life sync',public:false,files:{'yjj_life.json':{content:JSON.stringify(appData)}}})
    });
    if (!res.ok) throw new Error(res.status);
    const j = await res.json();
    syncState={token,gistId:j.id};
    localStorage.setItem(SYNC_KEY,JSON.stringify(syncState));
    showSyncStep(2); updateSyncUI(); schedulePull(); toast('동기화 시작 ✓','ok');
  } catch(e) { toast('Gist 생성 실패: '+e.message,'err'); }
}

async function doPush() {
  if (!syncState) return;
  try {
    await fetch('https://api.github.com/gists/'+syncState.gistId,{
      method:'PATCH',
      headers:{Authorization:'token '+syncState.token,'Content-Type':'application/json'},
      body:JSON.stringify({files:{'yjj_life.json':{content:JSON.stringify(appData)}}})
    });
    syncState.lastSync=new Date().toISOString();
    localStorage.setItem(SYNC_KEY,JSON.stringify(syncState));
    updateSyncUI();
    document.getElementById('syncDot').classList.remove('dirty');
    document.getElementById('syncText').textContent='동기화됨';
    setSyncStatus('클라우드 업로드 완료');
  } catch(e) { setSyncStatus('업로드 실패: '+e.message); }
}

async function doPull() {
  if (!syncState) return;
  try {
    const res=await fetch('https://api.github.com/gists/'+syncState.gistId,{headers:{Authorization:'token '+syncState.token}});
    if (!res.ok) return;
    const j=await res.json();
    const content=j.files['yjj_life.json']?.content;
    if (content) { appData=JSON.parse(content); localStorage.setItem(STORAGE_KEY,JSON.stringify(appData)); renderDashboard(); setSyncStatus('클라우드에서 불러옴'); }
  } catch(e) { setSyncStatus('불러오기 실패: '+e.message); }
}

function schedulePull() { if(syncTimer) clearInterval(syncTimer); syncTimer=setInterval(doPull,5*60*1000); }
function stopSync() { if(syncTimer) clearInterval(syncTimer); syncState=null; localStorage.removeItem(SYNC_KEY); showSyncStep(1); toast('동기화 중지'); }
function showSyncStep(n) { document.getElementById('syncStep1').style.display=n===1?'':'none'; document.getElementById('syncStep2').style.display=n===2?'':'none'; }
function updateSyncUI() {
  if (!syncState) return;
  const g=document.getElementById('syncGistId'); if(g) g.textContent=syncState.gistId||'';
  const l=document.getElementById('syncLastTime'); if(l) l.textContent=syncState.lastSync?new Date(syncState.lastSync).toLocaleString('ko'):'-';
  const c=document.getElementById('syncCodeOut'); if(c) c.value=SYNC_PREFIX+syncState.token+':'+syncState.gistId;
}
function setSyncStatus(msg) { const el=document.getElementById('syncStatusText'); if(el) el.textContent=msg; }
function copySyncCode() { const el=document.getElementById('syncCodeOut'); if(!el) return; navigator.clipboard.writeText(el.value).then(()=>toast('복사 완료 ✓','ok')); }

function markDirty() {
  document.getElementById('syncDot').classList.add('dirty');
  document.getElementById('syncText').textContent='저장 중';
  if (syncState) { clearTimeout(window._pushTimer); window._pushTimer=setTimeout(doPush,3000); }
  else { setTimeout(()=>{ document.getElementById('syncDot').classList.remove('dirty'); document.getElementById('syncText').textContent='저장됨'; },600); }
}

// ── UTILS ─────────────────────────────────────────────
function fmt(n) {
  if (!n && n!==0) return '-';
  const m = n/10000;
  if (m>=100) return Math.round(m/100)+'백만원';
  if (m>=1)   return (Number.isInteger(m)?m:Math.round(m))+'만원';
  return n.toLocaleString()+'원';
}

function toast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show'+(type?' '+type:'');
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove('show'),2800);
}
