// 유재진 한달살기 & 골프투어 앱 로직
// v2.0 - 엑셀 100+100 도시 통합, 필터, 편집, Gist 동기화

const STORAGE_KEY = 'yjj_life_v2';
const SYNC_KEY = 'yjj_sync_v2';
const SYNC_PREFIX = 'yjjSync:';

let appData = null;
let editMode = false;
let syncState = null;
let syncTimer = null;

// ─── 필터 상태 ───
let fType = 'all', fSeason = 'all', fContinent = 'all', fPrice = 'all', fGolf = 'all', fGrade = 'all';
let fText = '';
let sortMode = 'rank';
let viewMode = 'card';

// ─── 초기화 ───
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initNav();
  initExploreFilters();
  initSettings();
  initEditModal();
  renderAll();
  loadSync();
  document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'e') { e.preventDefault(); toggleEditMode(); } });
});

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { appData = JSON.parse(raw); } catch(e) { appData = null; }
  }
  if (!appData) appData = deepClone(window.INITIAL_DATA);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  markDirty();
}

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

// ─── NAV ───
function initNav() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });
  document.getElementById('editToggle').addEventListener('click', toggleEditMode);
  document.getElementById('btnEditMode').addEventListener('click', toggleEditMode);
  document.getElementById('detailBack').addEventListener('click', () => showView('featured'));
  document.getElementById('settingsBtn') && document.getElementById('settingsBtn').addEventListener('click', () => showView('settings'));
}

function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === v));
  const el = document.getElementById('view-' + v);
  if (el) el.classList.add('active');
  if (v === 'explore') renderExplore();
  if (v === 'featured') renderFeatured();
  if (v === 'golf') renderGolf();
  if (v === 'dashboard') renderDashboard();
}

// ─── RENDER DASHBOARD ───
function renderDashboard() {
  // stats
  const s = appData.stats || {};
  const statsData = [
    { label: '해외 도시', value: '100', unit: '개', sub: '1위: 태국 치앙마이' },
    { label: '국내 도시', value: '100', unit: '개', sub: '1위: 제주 성산' },
    { label: '해외 평균 체류비', value: '471', unit: '만원', sub: '2인 · 1개월 기준' },
    { label: '국내 평균 체류비', value: '314', unit: '만원', sub: '최저 261~최고 440만' },
    { label: '10개년 플랜', value: '10', unit: '년', sub: '50개국 · 100도시' },
    { label: '대상', value: '5070', unit: '', sub: '액티브 시니어' },
  ];
  document.getElementById('dashStats').innerHTML = statsData.map(d =>
    `<div class="stat-card"><div class="stat-label">${d.label}</div><div class="stat-value">${d.value}<span>${d.unit}</span></div><div class="stat-sub">${d.sub}</div></div>`
  ).join('');

  // top10
  const overseas = (appData.overseasCities || []).slice(0, 10);
  const domestic = (appData.domesticCities || []).slice(0, 10);
  document.getElementById('overseasTop10').innerHTML = overseas.map((c, i) =>
    `<div class="rank-row" onclick="goDetail('${c.key||''}','${c.name}')">
      <div class="rank-num ${i<3?'top3':''}">${c.rank}</div>
      <div><div class="rank-city">${c.name}</div><div class="rank-city-en">${c.nameEn||''}</div></div>
      <div class="rank-cost">${fmt(c.cost)}</div>
    </div>`
  ).join('');
  document.getElementById('domesticTop10').innerHTML = domestic.map((c, i) =>
    `<div class="rank-row" onclick="goDetail('${c.key||''}','${c.name}')">
      <div class="rank-num ${i<3?'top3':''}">${c.rank}</div>
      <div><div class="rank-city">${c.name}</div><div class="rank-city-en">${c.nameEn||''}</div></div>
      <div class="rank-cost">${fmt(c.cost)}</div>
    </div>`
  ).join('');

  // season grid
  const seasons = [
    { name: '봄', icon: '🌸', months: '3~5월' },
    { name: '여름', icon: '☀️', months: '6~8월' },
    { name: '가을', icon: '🍂', months: '9~11월' },
    { name: '겨울', icon: '❄️', months: '12~2월' },
  ];
  const sp = appData.seasonalPicks || {};
  document.getElementById('seasonGrid').innerHTML = seasons.map(s => {
    const picks = sp[s.name] || {};
    const doms = (picks.domestic || []).slice(0, 3).join(', ');
    const overs = (picks.overseas || []).slice(0, 3).join(', ');
    return `<div class="season-card" onclick="filterBySeason('${s.name}')">
      <div class="season-icon">${s.icon}</div>
      <div class="season-name">${s.name} <span style="font-size:11px;color:var(--text-muted);font-weight:400">${s.months}</span></div>
      <div class="season-pick">
        <strong>국내</strong> ${doms||'-'}<br>
        <strong>해외</strong> ${overs||'-'}
      </div>
    </div>`;
  }).join('');

  // golf top cards
  const golfTour = (appData.golfTour || []).slice(0, 3);
  document.getElementById('golfTopCards').innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px">
      ${golfTour.map(g => `
        <div class="golf-card">
          <div class="golf-card-head">
            <div class="golf-card-region">${g.region}</div>
            <div class="golf-card-cost">${fmt(g.monthlyCost)}</div>
            <div class="golf-card-cost-label">월 8회 골프비용</div>
          </div>
          <div class="golf-card-body">
            <div class="golf-card-feature">${g.feature}</div>
            <div class="golf-card-tips">${g.tips}</div>
          </div>
        </div>
      `).join('')}
    </div>`;

  // yearly plan
  const yearly = appData.yearlyPlan || [];
  document.getElementById('yearlyContainer').innerHTML = yearly.map(y =>
    `<div class="year-cell">
      <div class="year-num">${y.year}년차 (${y.years})</div>
      <div class="year-theme">${y.theme}</div>
      <div class="year-cities">${(y.cities||[]).join(' · ')}</div>
    </div>`
  ).join('');
}

// ─── EXPLORE ───
function initExploreFilters() {
  // continent chips 동적 생성
  const allCities = getAllCities();
  const continents = [...new Set(allCities.map(c => c.continent || c.region).filter(Boolean))].sort();
  const cont = document.getElementById('filterContinent');
  continents.forEach(c => {
    const span = document.createElement('span');
    span.className = 'filter-chip';
    span.dataset.val = c;
    span.textContent = c;
    cont.appendChild(span);
  });

  // chip 이벤트
  ['filterType','filterSeason','filterContinent','filterPrice','filterGolf','filterGrade'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      const parent = e.currentTarget;
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.dataset.val;
      if (id === 'filterType') fType = val;
      else if (id === 'filterSeason') fSeason = val;
      else if (id === 'filterContinent') fContinent = val;
      else if (id === 'filterPrice') fPrice = val;
      else if (id === 'filterGolf') fGolf = val;
      else if (id === 'filterGrade') fGrade = val;
      renderExplore();
    });
  });

  document.getElementById('exploreSearch').addEventListener('input', e => {
    fText = e.target.value.trim();
    renderExplore();
  });

  document.getElementById('sortSelect').addEventListener('change', e => {
    sortMode = e.target.value;
    renderExplore();
  });

  document.getElementById('btnCardView').addEventListener('click', () => {
    viewMode = 'card';
    document.getElementById('btnCardView').classList.add('active');
    document.getElementById('btnTableView').classList.remove('active');
    document.getElementById('cityCardGrid').style.display = '';
    document.getElementById('cityTableWrap').style.display = 'none';
  });

  document.getElementById('btnTableView').addEventListener('click', () => {
    viewMode = 'table';
    document.getElementById('btnTableView').classList.add('active');
    document.getElementById('btnCardView').classList.remove('active');
    document.getElementById('cityCardGrid').style.display = 'none';
    document.getElementById('cityTableWrap').style.display = '';
    renderExplore();
  });
}

function filterBySeason(season) {
  fSeason = season;
  document.querySelectorAll('#filterSeason .filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.val === season);
  });
  showView('explore');
}

function getAllCities() {
  return [
    ...(appData.overseasCities || []),
    ...(appData.domesticCities || [])
  ];
}

function applyFilters(cities) {
  return cities.filter(c => {
    if (fType !== 'all' && c.type !== fType) return false;
    if (fSeason !== 'all' && c.season !== fSeason) return false;
    if (fContinent !== 'all') {
      const cArea = c.continent || c.region || '';
      if (cArea !== fContinent) return false;
    }
    if (fPrice !== 'all') {
      const cost = c.cost || 0;
      if (fPrice === '300' && cost >= 3000000) return false;
      if (fPrice === '300-400' && (cost < 3000000 || cost >= 4000000)) return false;
      if (fPrice === '400-500' && (cost < 4000000 || cost >= 5000000)) return false;
      if (fPrice === '500-700' && (cost < 5000000 || cost >= 7000000)) return false;
      if (fPrice === '700+' && cost < 7000000) return false;
    }
    if (fGolf !== 'all') {
      if (fGolf === 'yes' && !c.golf) return false;
      if (fGolf === 'no' && c.golf) return false;
    }
    if (fGrade !== 'all') {
      if (fGrade === '보통이하') {
        const bad = ['보통','주의','하위','최하위'];
        if (!bad.includes(c.grade)) return false;
      } else if (c.grade !== fGrade) return false;
    }
    if (fText) {
      const q = fText.toLowerCase();
      const hay = (c.name + ' ' + (c.nameEn||'') + ' ' + (c.continent||'') + ' ' + (c.region||'')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function sortCities(cities) {
  const arr = [...cities];
  if (sortMode === 'rank') arr.sort((a,b) => a.rank - b.rank);
  else if (sortMode === 'cost-asc') arr.sort((a,b) => a.cost - b.cost);
  else if (sortMode === 'cost-desc') arr.sort((a,b) => b.cost - a.cost);
  else if (sortMode === 'mention') arr.sort((a,b) => b.mentionIdx - a.mentionIdx);
  else if (sortMode === 'safety') arr.sort((a,b) => b.safetyIdx - a.safetyIdx);
  return arr;
}

function renderExplore() {
  const all = getAllCities();
  const filtered = applyFilters(all);
  const sorted = sortCities(filtered);
  document.getElementById('resultCount').textContent = sorted.length;
  if (viewMode === 'card') {
    renderCityCards(sorted);
  } else {
    renderCityTable(sorted);
  }
}

function renderCityCards(cities) {
  const grid = document.getElementById('cityCardGrid');
  if (cities.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-title">조건에 맞는 도시가 없습니다</div><div>필터를 변경해보세요</div></div>`;
    return;
  }
  const typeLabel = { overseas: '해외', domestic: '국내' };
  grid.innerHTML = cities.map(c => {
    const area = c.continent || c.region || '';
    const golfTag = c.golf
      ? `<span class="tag tag-golf-yes">⛳ 골프가능</span>`
      : `<span class="tag tag-golf-no">골프제한</span>`;
    const gradeClass = 'tag-grade-' + (c.grade || '보통');
    return `<div class="city-card" onclick="goDetail('${c.key||''}','${c.name}')">
      <div class="city-card-header">
        <div class="city-rank-badge">${c.type === 'overseas' ? '해외':'국내'} ${c.rank}위</div>
        <div class="city-card-name">${c.name}</div>
        <div class="city-card-en">${c.nameEn||''}</div>
      </div>
      <div class="city-card-body">
        <div class="city-card-row">
          <span class="city-card-row-label">대륙/권역</span>
          <span class="city-card-row-val">${area}</span>
        </div>
        <div class="city-card-row">
          <span class="city-card-row-label">최적 계절</span>
          <span class="city-card-row-val">${c.season||'-'}</span>
        </div>
        <div class="city-card-row">
          <span class="city-card-row-label">언급지수</span>
          <span class="city-card-row-val">${c.mentionIdx||'-'}</span>
        </div>
        <div class="city-card-row">
          <span class="city-card-row-label">안전지수</span>
          <span class="city-card-row-val">${c.safetyIdx||'-'}</span>
        </div>
        <div class="city-card-cost">${fmt(c.cost)}<span> / 월 2인</span></div>
      </div>
      <div class="city-card-footer">
        <span class="tag ${gradeClass}">${c.grade||'-'}</span>
        ${golfTag}
        <span class="tag tag-season">${c.season||''}</span>
      </div>
    </div>`;
  }).join('');
}

function renderCityTable(cities) {
  const tbody = document.getElementById('cityTableBody');
  if (cities.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted)">조건에 맞는 도시가 없습니다</td></tr>`;
    return;
  }
  tbody.innerHTML = cities.map(c => {
    const area = c.continent || c.region || '';
    const gradeClass = 'tag-grade-' + (c.grade || '보통');
    const mentPct = Math.min(100, Math.round((c.mentionIdx||0)/100*100));
    const safePct = Math.min(100, Math.round((c.safetyIdx||0)/100*100));
    return `<tr onclick="goDetail('${c.key||''}','${c.name}')">
      <td><span style="font-size:12px;font-weight:700;color:var(--text-muted)">${c.type==='overseas'?'🌍':'🇰🇷'} ${c.rank}</span></td>
      <td><div class="city-name-main">${c.name}</div><div class="city-name-sub">${c.nameEn||''}</div></td>
      <td><span class="tag tag-season" style="font-size:11px">${c.season||'-'}</span></td>
      <td style="font-size:12.5px;color:var(--text-muted)">${area}</td>
      <td class="cost-cell">${fmt(c.cost)}</td>
      <td><div class="idx-bar"><span class="idx-num">${c.mentionIdx||0}</span><div class="idx-track"><div class="idx-fill" style="width:${mentPct}%"></div></div></div></td>
      <td><div class="idx-bar"><span class="idx-num">${c.safetyIdx||0}</span><div class="idx-track"><div class="idx-fill" style="width:${safePct}%;background:var(--sage)"></div></div></div></td>
      <td>${c.golf ? '<span class="golf-yes">⛳</span>' : '<span class="golf-no">✕</span>'}</td>
      <td><span class="tag ${gradeClass}">${c.grade||'-'}</span></td>
    </tr>`;
  }).join('');
}

// ─── FEATURED ───
function renderFeatured() {
  const cities = appData.featuredCities || [];
  document.getElementById('featuredGrid').innerHTML = cities.map(c =>
    `<div class="feature-card" onclick="showDetail('${c.key}')">
      <div class="feature-cover">
        <div class="feature-flag">${c.country||''}</div>
        <div class="feature-city">${c.name}</div>
        <div class="feature-country">${c.continent||''} · ${c.season||''}이 최적</div>
      </div>
      <div class="feature-body">
        <div class="feature-row"><span class="feature-label">월 체류비 (2인)</span><span class="feature-val cost">${fmt(c.totalCost)}</span></div>
        <div class="feature-row"><span class="feature-label">비자</span><span class="feature-val">${c.visa||'-'}</span></div>
        <div class="feature-row"><span class="feature-label">인터넷</span><span class="feature-val">${c.internet||'-'}</span></div>
        <div class="feature-row"><span class="feature-label">골프</span><span class="feature-val">${c.golf ? '⛳ 가능' : '제한'}</span></div>
        <div class="feature-cta">상세 플랜 보기 →</div>
      </div>
    </div>`
  ).join('');
}

function showDetail(key) {
  const data = (appData.cityDetails || {})[key];
  const city = (appData.featuredCities || []).find(c => c.key === key);
  if (!city) return;
  showView('detail');
  document.getElementById('detailContainer').innerHTML = renderDetailHTML(city, data);
}

function goDetail(key, name) {
  if (key && (appData.cityDetails || {})[key]) {
    showDetail(key);
  } else {
    // 일반 도시: 간략 정보만 표시
    const all = getAllCities();
    const city = all.find(c => c.name === name) || { name };
    showView('detail');
    document.getElementById('detailContainer').innerHTML = renderSimpleDetail(city);
  }
}

function renderSimpleDetail(city) {
  const area = city.continent || city.region || '';
  return `<div class="detail-hero">
    <div class="detail-hero-eyebrow">${city.type === 'overseas' ? '해외 한달살기' : '국내 한달살기'} ${city.rank ? city.rank + '위' : ''}</div>
    <h2>${city.name}${city.nameEn ? ' (' + city.nameEn + ')' : ''}</h2>
    <div class="detail-desc">
      ${area} · ${city.season||''}이 최적<br>
      언급지수 ${city.mentionIdx||'-'} · 안전지수 ${city.safetyIdx||'-'} · 종합평가: ${city.grade||'-'}
    </div>
    <div class="detail-quick-stats">
      <div><div class="dqs">월 체류비 (2인)</div><div class="dqs-v">${fmt(city.cost)}</div></div>
      <div><div class="dqs">골프</div><div class="dqs-v">${city.golf ? '⛳ 가능' : '제한'}</div></div>
      <div><div class="dqs">언급지수</div><div class="dqs-v">${city.mentionIdx||'-'}</div></div>
      <div><div class="dqs">안전지수</div><div class="dqs-v">${city.safetyIdx||'-'}</div></div>
    </div>
  </div>
  <div class="tips-box"><h4>💡 안내</h4><div class="tips-text">이 도시는 상세 플랜이 준비되지 않았습니다. 거점도시(⭐)를 선택하면 비용·골프코스·주간 스케줄 등 상세 정보를 확인할 수 있습니다.</div></div>`;
}

function renderDetailHTML(city, data) {
  const hasCosts = data && data.costs && data.costs.length;
  const hasGolf = data && data.golfCourses && data.golfCourses.length;
  const hasSched = data && data.weeklySchedule && data.weeklySchedule.length;

  return `
  <div class="detail-hero editable" data-edit="city-${city.key}">
    <div class="detail-hero-eyebrow">${city.country||''} · ${city.continent||''}</div>
    <h2>${city.name}${city.nameEn ? ' (' + city.nameEn + ')' : ''}</h2>
    <div class="detail-desc">${city.description || ''}</div>
    <div class="detail-quick-stats">
      <div><div class="dqs">월 총비용 (2인)</div><div class="dqs-v">${fmt(city.totalCost)}</div></div>
      <div><div class="dqs">최적 계절</div><div class="dqs-v">${city.season||'-'}</div></div>
      <div><div class="dqs">비자</div><div class="dqs-v">${city.visa||'-'}</div></div>
      <div><div class="dqs">인터넷</div><div class="dqs-v">${city.internet||'-'}</div></div>
      <div><div class="dqs">언어</div><div class="dqs-v">${city.language||'-'}</div></div>
      <div><div class="dqs">골프</div><div class="dqs-v">${city.golf ? '⛳ 가능' : '제한'}</div></div>
    </div>
  </div>

  <div class="detail-grid">
    ${hasCosts ? `
    <div class="panel">
      <div class="panel-head"><div class="panel-head-title">💰 월 예상 비용 (2인)</div></div>
      ${data.costs.map(r =>
        `<div class="cost-row ${r.item==='합계'?'total':''}">
          <div class="cost-item">${r.item}</div>
          <span class="cost-incl ${r.included?'in':'out'}">${r.included?'포함':'별도'}</span>
          <div class="cost-amt">${typeof r.amount === 'number' ? fmt(r.amount) : r.amount}</div>
        </div>`
      ).join('')}
    </div>
    ` : '<div></div>'}

    ${hasGolf ? `
    <div class="panel">
      <div class="panel-head"><div class="panel-head-title">⛳ 추천 골프장</div></div>
      ${data.golfSummary ? `<div class="golf-summary-box">${data.golfSummary}</div>` : ''}
      ${data.golfCourses.map(g =>
        `<div class="golf-row">
          <div><div class="golf-name">${g.name}</div><div class="golf-feature">${g.feature||''}</div></div>
          <div><div class="golf-fee">${typeof g.greenFee === 'number' ? fmt(g.greenFee) : g.greenFee}</div><div style="font-size:10.5px;color:var(--text-muted);text-align:right">${g.cart||''}</div></div>
        </div>`
      ).join('')}
    </div>
    ` : '<div></div>'}
  </div>

  ${hasSched ? `
  <div class="section-title" style="margin-top:4px">📅 추천 주간 스케줄</div>
  <div class="panel" style="margin-bottom:16px">
    ${data.weeklySchedule.map(s =>
      `<div class="sched-row">
        <div class="sched-day">${s.day}</div>
        <div class="sched-am">${s.am||''}</div>
        <div>${s.pm||''}</div>
      </div>`
    ).join('')}
  </div>
  ` : ''}

  ${data && data.lodging ? `
  <div class="lodging-box"><h4>🏠 숙소 추천</h4><p>${data.lodging}</p></div>
  ` : ''}

  ${data && data.tips ? `
  <div class="tips-box"><h4>💡 현지 핵심 팁</h4><div class="tips-text">${data.tips}</div></div>
  ` : ''}
  `;
}

// ─── GOLF ───
function renderGolf() {
  const tours = appData.golfTour || [];
  const maxCost = Math.max(...tours.map(t => t.monthlyCost));
  document.getElementById('golfCards').innerHTML = tours.map(g => `
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
    </div>
  `).join('');

  // golf cities top 20
  const golfCities = (appData.overseasCities || [])
    .filter(c => c.golf)
    .slice(0, 20);
  document.getElementById('golfCitiesBody').innerHTML = golfCities.map(c =>
    `<tr onclick="showDetail('${c.key||''}')">
      <td style="font-size:12px;font-weight:700;color:var(--text-muted)">해외 ${c.rank}</td>
      <td><div class="city-name-main">${c.name}</div><div class="city-name-sub">${c.nameEn||''}</div></td>
      <td style="font-size:12.5px;color:var(--text-muted)">${c.continent||''}</td>
      <td><span class="tag tag-season">${c.season||''}</span></td>
      <td class="cost-cell">${fmt(c.cost)}</td>
      <td><span class="tag tag-grade-${c.grade||'보통'}">${c.grade||'-'}</span></td>
    </tr>`
  ).join('');
}

// ─── SETTINGS ───
function initSettings() {
  document.getElementById('btnExport').addEventListener('click', exportData);
  document.getElementById('btnImport').addEventListener('click', () => document.getElementById('fileImport').click());
  document.getElementById('fileImport').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        appData = JSON.parse(ev.target.result);
        saveData();
        renderAll();
        toast('데이터를 가져왔습니다 ✓', 'ok');
      } catch { toast('파일 형식 오류', 'err'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  document.getElementById('btnReset').addEventListener('click', () => {
    if (!confirm('모든 수정 사항을 초기화하시겠습니까?')) return;
    localStorage.removeItem(STORAGE_KEY);
    appData = deepClone(window.INITIAL_DATA);
    renderAll();
    toast('초기화 완료', 'ok');
  });
  document.getElementById('btnSyncStart').addEventListener('click', startSync);
  document.getElementById('btnSyncNow') && document.getElementById('btnSyncNow').addEventListener('click', doPush);
  document.getElementById('btnSyncStop') && document.getElementById('btnSyncStop').addEventListener('click', stopSync);
  document.getElementById('btnCopyCode') && document.getElementById('btnCopyCode').addEventListener('click', copySyncCode);
}

function exportData() {
  const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'yjj_life_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
}

// ─── EDIT MODAL ───
function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  document.getElementById('editToggle').classList.toggle('active', editMode);
  toast(editMode ? '편집 모드 ON — 항목 클릭 시 수정' : '편집 모드 OFF');
}

function initEditModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalBg').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.getElementById('modalSave').addEventListener('click', saveModal);

  document.addEventListener('click', e => {
    if (!editMode) return;
    const el = e.target.closest('.editable');
    if (!el) return;
    openEditModal(el);
  });
}

let currentEditEl = null;
function openEditModal(el) {
  currentEditEl = el;
  const key = el.dataset.edit;
  document.getElementById('modalTitle').textContent = '내용 편집';
  document.getElementById('modalSub').textContent = key;
  document.getElementById('modalBody').innerHTML = `
    <div class="field"><label>내용 (HTML 가능)</label>
    <textarea id="editTextarea" style="min-height:120px">${el.innerHTML}</textarea></div>`;
  document.getElementById('modalBg').classList.add('active');
}

function closeModal() { document.getElementById('modalBg').classList.remove('active'); currentEditEl = null; }

function saveModal() {
  if (currentEditEl) {
    currentEditEl.innerHTML = document.getElementById('editTextarea').value;
    saveData();
    toast('저장되었습니다 ✓', 'ok');
  }
  closeModal();
}

// ─── SYNC ───
function loadSync() {
  const raw = localStorage.getItem(SYNC_KEY);
  if (!raw) return;
  try { syncState = JSON.parse(raw); } catch { return; }
  if (syncState && syncState.token && syncState.gistId) {
    showSyncStep(2);
    updateSyncUI();
    schedulePull();
  }
}

async function startSync() {
  const tokenEl = document.getElementById('ghToken');
  const codeEl = document.getElementById('ghSyncCode');
  const token = tokenEl.value.trim();
  const code = codeEl.value.trim();

  if (code && code.startsWith(SYNC_PREFIX)) {
    const parts = code.slice(SYNC_PREFIX.length).split(':');
    if (parts.length >= 2) {
      syncState = { token: parts[0], gistId: parts[1] };
      localStorage.setItem(SYNC_KEY, JSON.stringify(syncState));
      showSyncStep(2);
      updateSyncUI();
      await doPull();
      schedulePull();
      return;
    }
  }

  if (!token) { toast('Token을 입력하세요', 'err'); return; }
  toast('Gist 생성 중…');
  try {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: { Authorization: 'token ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'yjj-life sync', public: false, files: { 'yjj_life.json': { content: JSON.stringify(appData) } } })
    });
    if (!res.ok) throw new Error(res.status);
    const j = await res.json();
    syncState = { token, gistId: j.id };
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncState));
    showSyncStep(2);
    updateSyncUI();
    schedulePull();
    toast('동기화 시작됨 ✓', 'ok');
  } catch(e) { toast('Gist 생성 실패: ' + e.message, 'err'); }
}

async function doPush() {
  if (!syncState) return;
  try {
    await fetch('https://api.github.com/gists/' + syncState.gistId, {
      method: 'PATCH',
      headers: { Authorization: 'token ' + syncState.token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { 'yjj_life.json': { content: JSON.stringify(appData) } } })
    });
    syncState.lastSync = new Date().toISOString();
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncState));
    updateSyncUI();
    document.getElementById('syncDot').classList.remove('dirty');
    document.getElementById('syncText').textContent = '동기화됨';
    setSyncStatus('클라우드 업로드 완료');
  } catch(e) { setSyncStatus('업로드 실패: ' + e.message); }
}

async function doPull() {
  if (!syncState) return;
  try {
    const res = await fetch('https://api.github.com/gists/' + syncState.gistId, {
      headers: { Authorization: 'token ' + syncState.token }
    });
    if (!res.ok) return;
    const j = await res.json();
    const content = j.files['yjj_life.json']?.content;
    if (content) {
      const remote = JSON.parse(content);
      appData = remote;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      renderAll();
      setSyncStatus('클라우드에서 불러옴');
    }
  } catch(e) { setSyncStatus('불러오기 실패: ' + e.message); }
}

function schedulePull() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(doPull, 5 * 60 * 1000);
}

function stopSync() {
  if (syncTimer) clearInterval(syncTimer);
  syncState = null;
  localStorage.removeItem(SYNC_KEY);
  showSyncStep(1);
  toast('동기화 중지됨');
}

function showSyncStep(n) {
  document.getElementById('syncStep1').style.display = n === 1 ? '' : 'none';
  document.getElementById('syncStep2').style.display = n === 2 ? '' : 'none';
}

function updateSyncUI() {
  if (!syncState) return;
  const gistEl = document.getElementById('syncGistId');
  if (gistEl) gistEl.textContent = syncState.gistId || '';
  const lastEl = document.getElementById('syncLastTime');
  if (lastEl) lastEl.textContent = syncState.lastSync ? new Date(syncState.lastSync).toLocaleString('ko') : '-';
  const codeEl = document.getElementById('syncCodeOut');
  if (codeEl) codeEl.value = SYNC_PREFIX + syncState.token + ':' + syncState.gistId;
}

function setSyncStatus(msg) {
  const el = document.getElementById('syncStatusText');
  if (el) el.textContent = msg;
}

function copySyncCode() {
  const el = document.getElementById('syncCodeOut');
  if (!el) return;
  navigator.clipboard.writeText(el.value).then(() => toast('복사 완료 ✓', 'ok'));
}

function markDirty() {
  document.getElementById('syncDot').classList.add('dirty');
  document.getElementById('syncText').textContent = '저장 중';
  if (syncState) {
    clearTimeout(window._pushTimer);
    window._pushTimer = setTimeout(doPush, 3000);
  } else {
    setTimeout(() => {
      document.getElementById('syncDot').classList.remove('dirty');
      document.getElementById('syncText').textContent = '저장됨';
    }, 600);
  }
}

// ─── UTILS ───
function fmt(n) {
  if (!n && n !== 0) return '-';
  if (n >= 10000) return Math.round(n / 10000) + '만원';
  if (n >= 1000) return (n / 10000).toFixed(1) + '만원';
  return n.toLocaleString() + '원';
}

function toast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2800);
}

function renderAll() {
  const active = document.querySelector('.view.active');
  const v = active ? active.id.replace('view-','') : 'dashboard';
  if (v === 'dashboard') renderDashboard();
  else if (v === 'explore') renderExplore();
  else if (v === 'featured') renderFeatured();
  else if (v === 'golf') renderGolf();
  else renderDashboard();
}
