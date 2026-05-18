/* 똑비 글로벌 한달살기 마스터플랜 앱 로직
   - localStorage 자동 저장
   - 편집 모드 (편집 가능 영역 클릭 → 모달)
   - JSON 내보내기/가져오기 (Google Drive 백업·복원)
   - 도시 상세 페이지 동적 렌더
*/

const STORAGE_KEY = 'ddokbi_global_aging_v1';
const SYNC_KEY = 'ddokbi_sync_v1';
const FILE_NAME = '똑비_한달살기_데이터.json';
const GIST_FILENAME = 'ddokbi_data.json';
const PULL_INTERVAL_MS = 30000;
const PUSH_DEBOUNCE_MS = 2000;

// ---- 데이터 로드 (localStorage → 없으면 초기 데이터) ----
function deepClone(o){return JSON.parse(JSON.stringify(o))}
let DATA = (()=>{
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){const parsed = JSON.parse(raw); if(parsed && parsed.allCities) return parsed;}
  }catch(e){}
  return deepClone(window.INITIAL_DATA);
})();

function saveData(silent, opts){
  opts = opts || {};
  // 로컬 수정 시 timestamp 업데이트 (서버에서 받은 데이터를 적용할 때는 skip)
  if(!opts.fromRemote){
    DATA.updatedAt = new Date().toISOString();
  }
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
    if(!silent) flashSync('saved');
  }catch(e){
    toast('저장 실패: 저장 공간이 부족합니다', 'err');
  }
  // 자동 동기화 푸시 트리거 (로컬 수정일 때만)
  if(!opts.fromRemote){
    const cfg = getSyncConfig();
    if(cfg.enabled && cfg.token && cfg.gistId){
      schedulePush();
    }
  }
}
function flashSync(state){
  const dot = document.getElementById('syncDot');
  const txt = document.getElementById('syncText');
  if(state==='dirty'){dot.classList.add('dirty'); txt.textContent='저장 중…'}
  else if(state==='syncing'){dot.classList.add('dirty'); txt.textContent='동기화 중…'}
  else if(state==='cloud'){dot.classList.remove('dirty'); txt.textContent='☁ 클라우드 동기화'}
  else{dot.classList.remove('dirty'); txt.textContent='자동 저장됨'}
}

// ---- TOAST ----
let toastTimer;
function toast(msg, kind){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + (kind||'');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2400);
}

// ---- 뷰 라우팅 ----
function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t=>{
    t.classList.toggle('active', t.dataset.view===v);
  });
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('.nav-tab').forEach(t=>{
  t.addEventListener('click', ()=>showView(t.dataset.view));
});
document.getElementById('settingsBtn').addEventListener('click', ()=>showView('settings'));

// ---- 편집 모드 ----
let editMode = false;
function setEditMode(on){
  editMode = on;
  document.body.classList.toggle('edit-mode', on);
  document.getElementById('editToggle').classList.toggle('active', on);
  const btn = document.getElementById('btnEditMode');
  if(btn) btn.textContent = on ? '✎ 편집 모드 끄기' : '✎ 편집 모드 켜기';
  toast(on ? '편집 모드 켜짐 — 항목을 클릭해 수정하세요' : '편집 모드 꺼짐');
}
document.getElementById('editToggle').addEventListener('click', ()=>setEditMode(!editMode));
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ closeModal(); }
  if(e.key==='e' && (e.metaKey||e.ctrlKey)){ e.preventDefault(); setEditMode(!editMode); }
});

// ============ 렌더링 ============
function escape(s){ if(s==null) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function nl2br(s){ return escape(s).replace(/\n/g,'<br>'); }

// ----- DASHBOARD -----
function renderDashboard(){
  document.getElementById('updatedDate').textContent = DATA.updated || '';
  document.getElementById('targetText').textContent = DATA.stats.target || '';
  document.getElementById('statCities').textContent = DATA.stats.cities;
  document.getElementById('statCountries').textContent = DATA.stats.countries;
  document.getElementById('statYears').textContent = DATA.stats.years;

  // Yearly plan
  const yc = document.getElementById('yearlyContainer');
  yc.innerHTML = DATA.yearlyPlan.map((y, i)=>{
    const pri = (y.priority||'').includes('HIGH') ? 'HIGH' : (y.priority||'').includes('MED') ? 'MED' : 'LOW';
    return `<div class="year-card editable" data-edit-type="yearlyPlan" data-edit-idx="${i}">
      <div class="year-card-top">
        <div class="year-num">${escape(y.year)}<span>년차</span></div>
        <div class="priority ${pri}">${escape(y.priority||'')}</div>
      </div>
      <div class="year-region">${escape(y.region||'')}</div>
      <div class="year-cities">${escape(y.cities||'')}</div>
      <div class="year-bottom">
        <span class="year-cost">${escape(y.cost||'N/A')}</span>
        <span class="year-q">${escape(y.quarter||'')} · ${escape(y.cityCount||0)}개 도시</span>
      </div>
    </div>`;
  }).join('');

  // Featured
  const fc = document.getElementById('featuredContainer');
  fc.innerHTML = renderFeaturedCards();
  const fcf = document.getElementById('featuredFullContainer');
  fcf.innerHTML = renderFeaturedCards();
}

function renderFeaturedCards(){
  return DATA.featuredCities.map((c, i)=>{
    const detailKey = findDetailKey(c.city);
    const flag = (c.country||'').match(/[🇦-🇿]{2,}|[\u{1F1E6}-\u{1F1FF}]{2,}/u);
    const flagEmoji = (c.country||'').match(/[\u{1F1E6}-\u{1F1FF}]{2}/u)?.[0] || '';
    const countryName = (c.country||'').replace(/[\u{1F1E6}-\u{1F1FF}]/gu,'').trim();
    return `<div class="feature-card editable" data-edit-type="featuredCities" data-edit-idx="${i}" data-detail-key="${detailKey||''}">
      <div class="feature-cover">
        ${flagEmoji ? `<div class="feature-flag">${flagEmoji} ${escape(countryName)}</div>` : ''}
        <div>
          <div class="feature-city">${escape(c.city||'')}</div>
          <div class="feature-country">${escape(c.country||'')} · ${escape(c.quarter||'')}</div>
        </div>
      </div>
      <div class="feature-body">
        <div class="feature-rating">${escape(c.rating||'')}</div>
        <div class="feature-row"><span class="feature-label">숙소비 (월)</span><span class="feature-val">${escape(c.lodging||'')}</span></div>
        <div class="feature-row"><span class="feature-label">골프 그린피</span><span class="feature-val">${escape(c.golfFee||'')}</span></div>
        <div class="feature-row"><span class="feature-label">주중 골프</span><span class="feature-val">${escape(c.golfWeek||'')}</span></div>
        <div class="feature-row"><span class="feature-label">한달 총비용</span><span class="feature-val cost">${escape(c.costMin||'')} ~ ${escape(c.costMax||'')}</span></div>
        ${detailKey ? `<div class="feature-cta">상세 플랜 보기</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// Map featured city name → detail key
function findDetailKey(cityName){
  if(!cityName) return null;
  const map = {
    '가고시마':'kagoshima','오키나와':'okinawa','치앙마이':'chiangmai',
    '조호바루':'johorbahru','말라가(미하스)':'malaga','말라가':'malaga',
    '알가르브(파로)':'algarve','파로':'algarve','골드코스트':'goldcoast',
    '산호세(에스카수)':'costarica','에스카수':'costarica','산호세':'costarica'
  };
  return map[cityName] || null;
}

// ----- 100 CITIES -----
let filterYear = 'all';
let filterText = '';
function renderCities(){
  const tbody = document.getElementById('citiesTbody');
  const filtered = DATA.allCities.filter(c=>{
    if(filterYear!=='all'){
      const y = parseInt(c.year);
      if(filterYear==='5'){ if(y<5) return false; }
      else if(y !== parseInt(filterYear)) return false;
    }
    if(filterText){
      const q = filterText.toLowerCase();
      const blob = `${c.city||''} ${c.country||''} ${c.theme||''} ${c.region||''}`.toLowerCase();
      if(!blob.includes(q)) return false;
    }
    return true;
  });
  if(!filtered.length){
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">조건에 맞는 도시가 없습니다.</td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((c)=>{
    const origIdx = DATA.allCities.indexOf(c);
    const golfOk = (c.golf||'').includes('✅');
    const detailKey = findDetailKey(c.city);
    return `<tr class="editable" data-edit-type="allCities" data-edit-idx="${origIdx}" data-detail-key="${detailKey||''}">
      <td><span class="year-tag">${escape(c.year)}</span></td>
      <td><div class="city-name">${escape(c.city||'')}</div><div class="city-country">${escape(c.country||'')}</div></td>
      <td><div class="theme-text">${escape(c.theme||'')}</div></td>
      <td><div style="font-size:12.5px"><b style="color:var(--navy)">${escape(c.quarter||'')}</b><br><span style="color:var(--text-muted)">${escape(c.region||'')}</span></div></td>
      <td><div style="font-size:12.5px"><b style="color:var(--gold-deep)">${escape(c.cost||'')}</b><br><span style="color:var(--text-muted)">${escape(c.lodging||'')}</span></div></td>
      <td><span class="golf-tag ${golfOk?'':'limit'}">${escape(c.golf||'')}</span></td>
    </tr>`;
  }).join('');
}

document.getElementById('citySearch').addEventListener('input', e=>{
  filterText = e.target.value.trim();
  renderCities();
});
document.querySelectorAll('[data-fyear]').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('[data-fyear]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    filterYear = b.dataset.fyear;
    renderCities();
  });
});

// ----- DETAIL VIEW -----
function showDetail(key){
  const d = DATA.cityDetails[key];
  if(!d) return;
  const cont = document.getElementById('detailContainer');

  // Try to find matching featuredCities entry for quick stats
  const feat = DATA.featuredCities.find(f => findDetailKey(f.city) === key) || {};

  cont.innerHTML = `
    <div class="detail-hero">
      <div class="detail-hero-eyebrow">상세 한달살기 플랜</div>
      <h2 class="editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-field="title">${escape(d.title||'')}</h2>
      <div class="detail-meta-line editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-field="meta">${escape(d.meta||'')}</div>
      <div class="detail-desc editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-field="description">${nl2br(d.description||'')}</div>
      ${feat.rating ? `<div class="detail-quick-stats">
        <div><div class="dqs">추천도</div><div class="dqs-v" style="color:var(--gold)">${escape(feat.rating)}</div></div>
        <div><div class="dqs">한달 총비용 (2인)</div><div class="dqs-v">${escape(feat.costMin)} ~ ${escape(feat.costMax)}</div></div>
        <div><div class="dqs">숙소비 (월)</div><div class="dqs-v">${escape(feat.lodging)}</div></div>
        <div><div class="dqs">주중 골프</div><div class="dqs-v">${escape(feat.golfWeek)}</div></div>
      </div>` : ''}
    </div>

    <div class="detail-grid">
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title"><span class="ic">₩</span>비용 구조</div>
          <span style="font-size:11.5px;color:var(--text-muted)">2인 · 항공 제외</span>
        </div>
        <div>${(d.costs||[]).map((c,i)=>{
          const isTotal = (c.item||'').includes('총비용');
          const incl = (c.included||'').includes('포함') ? 'in' : ((c.included||'').includes('별도') ? 'out' : '');
          return `<div class="cost-row ${isTotal?'total':''} editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-section="costs" data-edit-idx="${i}">
            <div><div class="cost-item">${escape(c.item||'')}</div>${c.note?`<div class="cost-note">${escape(c.note)}</div>`:''}</div>
            ${isTotal?'':`<div>${c.included?`<span class="cost-incl ${incl}">${escape(c.included)}</span>`:''}</div>`}
            <div class="cost-amt" style="text-align:right;${isTotal?'font-weight:700':''}">${escape(c.amount||'')}</div>
          </div>`;
        }).join('')}</div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <div class="panel-title"><span class="ic">⛳</span>골프 코스</div>
          <span style="font-size:11.5px;color:var(--text-muted)">주중 2회+ 가능</span>
        </div>
        <div>${(d.golfCourses||[]).map((g,i)=>`
          <div class="golf-row editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-section="golfCourses" data-edit-idx="${i}">
            <div><div class="golf-name">${escape(g.name||'')}</div><div class="golf-feature">${escape(g.feature||'')}</div></div>
            <div><div class="golf-fee">${escape(g.fee||'')}</div><div class="golf-cart">${escape(g.cart||'')}</div></div>
            <div class="golf-booking">${escape(g.booking||'')}</div>
          </div>`).join('')}
        </div>
        ${d.golfSummary?`<div class="golf-summary editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-field="golfSummary">${escape(d.golfSummary)}</div>`:''}
      </div>
    </div>

    <div class="panel" style="margin-top:22px">
      <div class="panel-head">
        <div class="panel-title"><span class="ic">📅</span>권장 주간 일정 (한달 기준)</div>
      </div>
      <div>${(d.weeklySchedule||[]).map((s,i)=>`
        <div class="sched-row editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-section="weeklySchedule" data-edit-idx="${i}">
          <div class="sched-day">${escape(s.day||'')}</div>
          <div class="sched-am">${escape(s.morning||'')}</div>
          <div class="sched-pm">${escape(s.evening||'')}</div>
        </div>`).join('')}
      </div>
    </div>

    ${d.lodging?`<div class="lodging-box editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-field="lodging">
      <div class="lodging-icon">🏠</div>
      <div class="lodging-content"><h4>숙소 정보</h4><p>${nl2br(d.lodging)}</p></div>
    </div>`:''}

    ${d.tips?`<div class="tips-box editable" data-edit-type="cityDetails" data-edit-key="${key}" data-edit-field="tips">
      <h4>📋 특이사항 및 TIP</h4>
      <div class="tips-text">${nl2br(d.tips)}</div>
    </div>`:''}
  `;
  showView('detail');
}

document.getElementById('detailBack').addEventListener('click', ()=>{
  showView('featured');
});

// ---- 클릭 위임: 카드/행 클릭 ----
document.addEventListener('click', (e)=>{
  // editable 우선 (편집 모드일 때만)
  const ed = e.target.closest('.editable');
  if(editMode && ed){
    e.preventDefault();
    e.stopPropagation();
    openEditModal(ed);
    return;
  }
  // detail 진입
  const detailEl = e.target.closest('[data-detail-key]');
  if(detailEl){
    const k = detailEl.getAttribute('data-detail-key');
    if(k){ showDetail(k); return; }
  }
});

// ============ 편집 모달 ============
let modalContext = null;

function openEditModal(el){
  const type = el.dataset.editType;
  const idx = el.dataset.editIdx;
  const key = el.dataset.editKey;
  const section = el.dataset.editSection;
  const field = el.dataset.editField;

  let title='편집', sub='', fields=[], ctx={type};

  if(type==='title' || el.getAttribute('data-edit')==='title'){
    title='헤더 편집'; sub='상단 타이틀과 부제';
    fields = [
      {key:'title', label:'타이틀', value:DATA.title, type:'text'},
      {key:'subtitle', label:'부제', value:DATA.subtitle, type:'textarea'},
      {key:'updated', label:'업데이트 일자', value:DATA.updated, type:'text'}
    ];
    ctx.target = 'root';
  } else if(el.getAttribute('data-edit')==='subtitle'){
    title='헤더 편집'; sub='상단 타이틀과 부제';
    fields = [
      {key:'title', label:'타이틀', value:DATA.title, type:'text'},
      {key:'subtitle', label:'부제', value:DATA.subtitle, type:'textarea'},
      {key:'updated', label:'업데이트 일자', value:DATA.updated, type:'text'}
    ];
    ctx.target = 'root';
  } else if(type==='yearlyPlan'){
    const item = DATA.yearlyPlan[idx];
    title=`${item.year}년차 편집`; sub='연차별 확장 계획';
    fields = [
      {key:'year', label:'연차', value:item.year, type:'number'},
      {key:'priority', label:'우선순위', value:item.priority, type:'text'},
      {key:'region', label:'주요 권역', value:item.region, type:'text'},
      {key:'cityCount', label:'거점 도시 수', value:item.cityCount, type:'number'},
      {key:'quarter', label:'운영 분기', value:item.quarter, type:'text'},
      {key:'cities', label:'대표 도시', value:item.cities, type:'textarea'},
      {key:'cost', label:'2인 예상 비용', value:item.cost, type:'text'},
      {key:'golf', label:'골프 주중 2회 가능', value:item.golf, type:'text'}
    ];
    ctx.target = ['yearlyPlan', idx];
  } else if(type==='featuredCities'){
    const item = DATA.featuredCities[idx];
    title=`${item.city} 편집`; sub='7대 거점 도시 비교';
    fields = [
      {key:'city', label:'도시명', value:item.city, type:'text'},
      {key:'country', label:'국가 (이모지 포함 가능)', value:item.country, type:'text'},
      {key:'quarter', label:'운영 분기', value:item.quarter, type:'text'},
      {key:'lodging', label:'숙소비 (월)', value:item.lodging, type:'text'},
      {key:'golfFee', label:'골프 그린피', value:item.golfFee, type:'text'},
      {key:'golfWeek', label:'주중 골프', value:item.golfWeek, type:'text'},
      {key:'costMin', label:'한달 총비용 (최저)', value:item.costMin, type:'text'},
      {key:'costMax', label:'한달 총비용 (최고)', value:item.costMax, type:'text'},
      {key:'rating', label:'추천도', value:item.rating, type:'text'}
    ];
    ctx.target = ['featuredCities', idx];
  } else if(type==='allCities'){
    const item = DATA.allCities[idx];
    title=`${item.city} 편집`; sub=`${item.country} · ${item.region}`;
    fields = [
      {key:'year', label:'연차', value:item.year, type:'number'},
      {key:'priority', label:'우선순위 (HIGH/MED/LOW)', value:item.priority, type:'text'},
      {key:'country', label:'국가', value:item.country, type:'text'},
      {key:'city', label:'도시', value:item.city, type:'text'},
      {key:'quarter', label:'운영 분기', value:item.quarter, type:'text'},
      {key:'region', label:'권역', value:item.region, type:'text'},
      {key:'theme', label:'핵심 테마', value:item.theme, type:'textarea'},
      {key:'golf', label:'골프 주중 2회', value:item.golf, type:'text'},
      {key:'lodging', label:'숙소비 (월)', value:item.lodging, type:'text'},
      {key:'cost', label:'한달 총비용 (2인)', value:item.cost, type:'text'},
      {key:'note', label:'비고', value:item.note, type:'text'}
    ];
    ctx.target = ['allCities', idx];
  } else if(type==='cityDetails'){
    const detail = DATA.cityDetails[key];
    if(section==='costs'){
      const item = detail.costs[idx];
      title='비용 항목 편집'; sub=item.item;
      fields = [
        {key:'item', label:'비용 항목', value:item.item, type:'text'},
        {key:'included', label:'포함 여부 (포함/별도)', value:item.included, type:'text'},
        {key:'amount', label:'금액 (2인 기준)', value:item.amount, type:'text'},
        {key:'note', label:'비고', value:item.note, type:'text'}
      ];
      ctx.target = ['cityDetails', key, 'costs', idx];
    } else if(section==='golfCourses'){
      const item = detail.golfCourses[idx];
      title='골프 코스 편집'; sub=item.name;
      fields = [
        {key:'name', label:'코스명', value:item.name, type:'text'},
        {key:'feature', label:'특징', value:item.feature, type:'text'},
        {key:'fee', label:'그린피 (1인)', value:item.fee, type:'text'},
        {key:'cart', label:'카트/캐디', value:item.cart, type:'text'},
        {key:'booking', label:'주중 예약 난이도', value:item.booking, type:'text'}
      ];
      ctx.target = ['cityDetails', key, 'golfCourses', idx];
    } else if(section==='weeklySchedule'){
      const item = detail.weeklySchedule[idx];
      title=`${item.day}요일 일정 편집`; sub='주간 일정표';
      fields = [
        {key:'day', label:'요일', value:item.day, type:'text'},
        {key:'morning', label:'오전 활동', value:item.morning, type:'textarea'},
        {key:'evening', label:'오후/저녁 활동', value:item.evening, type:'textarea'}
      ];
      ctx.target = ['cityDetails', key, 'weeklySchedule', idx];
    } else if(field){
      title = '상세 편집'; sub = detail.title || '';
      const labels = {title:'제목', meta:'운영 분기 / 출처', description:'설명',
                     golfSummary:'골프 비용 요약', lodging:'숙소 정보', tips:'특이사항 및 TIP'};
      fields = [{key:field, label:labels[field]||field, value:detail[field], type:'textarea'}];
      ctx.target = ['cityDetails', key, '__field', field];
    }
  }

  if(!fields.length){ return; }
  modalContext = ctx;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalSub').textContent = sub;
  document.getElementById('modalBody').innerHTML = fields.map(f=>{
    const v = f.value==null?'':f.value;
    if(f.type==='textarea'){
      return `<div class="field"><label>${escape(f.label)}</label><textarea data-fk="${f.key}">${escape(v)}</textarea></div>`;
    }
    return `<div class="field"><label>${escape(f.label)}</label><input type="${f.type}" data-fk="${f.key}" value="${escape(v)}"></div>`;
  }).join('');
  document.getElementById('modalBg').classList.add('active');
  setTimeout(()=>document.querySelector('#modalBody input,#modalBody textarea')?.focus(), 100);
}

function closeModal(){
  document.getElementById('modalBg').classList.remove('active');
  modalContext = null;
}
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalBg').addEventListener('click', e=>{
  if(e.target.id==='modalBg') closeModal();
});

document.getElementById('modalSave').addEventListener('click', ()=>{
  if(!modalContext) return;
  const inputs = document.querySelectorAll('#modalBody [data-fk]');
  const updates = {};
  inputs.forEach(i=>{
    let v = i.value;
    if(i.type==='number') v = v===''?'':Number(v);
    updates[i.dataset.fk] = v;
  });

  flashSync('dirty');
  const t = modalContext.target;
  if(t==='root'){
    Object.assign(DATA, updates);
  } else if(Array.isArray(t)){
    if(t[0]==='cityDetails' && t[2]==='__field'){
      DATA.cityDetails[t[1]][t[3]] = updates[t[3]];
    } else if(t[0]==='cityDetails' && t[2]){
      Object.assign(DATA.cityDetails[t[1]][t[2]][t[3]], updates);
    } else if(t.length===2){
      Object.assign(DATA[t[0]][t[1]], updates);
    }
  }
  saveData();
  rerenderAll();
  closeModal();
  toast('저장됨', 'ok');
});

// ---- 전체 리렌더 ----
function rerenderAll(){
  renderDashboard();
  renderCities();
  // detail view: 다시 그리기
  const active = document.querySelector('.view.active');
  if(active && active.id==='view-detail'){
    const titleEl = document.querySelector('#detailContainer [data-edit-key]');
    if(titleEl){
      const k = titleEl.getAttribute('data-edit-key');
      showDetail(k);
    }
  }
}

// ============ 내보내기 / 가져오기 ============
document.getElementById('btnExport').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = FILE_NAME;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('JSON 파일이 다운로드되었습니다 — Google Drive에 업로드하세요', 'ok');
});

document.getElementById('btnImport').addEventListener('click', ()=>{
  document.getElementById('fileImport').click();
});
document.getElementById('fileImport').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    try{
      const parsed = JSON.parse(ev.target.result);
      if(!parsed.allCities || !parsed.cityDetails){
        throw new Error('형식이 올바르지 않습니다');
      }
      if(!confirm('현재 데이터를 가져온 파일로 덮어쓰시겠습니까? (현재 데이터는 사라집니다)')) return;
      DATA = parsed;
      saveData(true);
      rerenderAll();
      toast('데이터를 가져왔습니다', 'ok');
      flashSync('saved');
    }catch(err){
      toast('가져오기 실패: ' + err.message, 'err');
    }
  };
  reader.readAsText(file, 'utf-8');
  e.target.value = '';
});

document.getElementById('btnReset').addEventListener('click', ()=>{
  if(!confirm('모든 수정 내용을 잃고 초기 데이터로 되돌립니다. 계속할까요?')) return;
  DATA = deepClone(window.INITIAL_DATA);
  saveData(true);
  rerenderAll();
  flashSync('saved');
  toast('초기 데이터로 복원되었습니다', 'ok');
});

document.getElementById('btnEditMode').addEventListener('click', ()=>setEditMode(!editMode));

// ============ GitHub Gist 자동 동기화 ============
function getSyncConfig(){
  try{ return JSON.parse(localStorage.getItem(SYNC_KEY) || '{}'); }catch{ return {}; }
}
function setSyncConfig(c){ localStorage.setItem(SYNC_KEY, JSON.stringify(c)); }

// 동기화 코드 인코딩: dkbiSync:<base64(token + ":" + gistId)>
function encodeSyncCode(token, gistId){
  const raw = token + ':' + gistId;
  return 'dkbiSync:' + btoa(unescape(encodeURIComponent(raw)));
}
function decodeSyncCode(code){
  if(!code) return null;
  const m = String(code).trim().match(/^dkbiSync:(.+)$/);
  if(!m) return null;
  try{
    const raw = decodeURIComponent(escape(atob(m[1])));
    const i = raw.indexOf(':');
    if(i<0) return null;
    return {token: raw.slice(0,i), gistId: raw.slice(i+1)};
  }catch{ return null; }
}

async function ghFetch(url, opts, token){
  opts = opts || {};
  opts.headers = Object.assign({
    'Accept':'application/vnd.github+json',
    'Authorization':'token ' + token
  }, opts.headers||{});
  const res = await fetch(url, opts);
  if(!res.ok){
    let msg = res.status + ' ' + res.statusText;
    try{ const j = await res.json(); if(j.message) msg += ' — ' + j.message; }catch{}
    throw new Error(msg);
  }
  return res.json();
}

async function createGist(token, data){
  return ghFetch('https://api.github.com/gists', {
    method:'POST',
    body: JSON.stringify({
      description:'똑비 글로벌 한달살기 자동 동기화 (private)',
      public:false,
      files:{ [GIST_FILENAME]:{ content: JSON.stringify(data, null, 2) } }
    })
  }, token);
}
async function readGist(token, gistId){
  const j = await ghFetch('https://api.github.com/gists/' + encodeURIComponent(gistId), {}, token);
  const file = j.files && j.files[GIST_FILENAME];
  if(!file) throw new Error('Gist에서 데이터 파일을 찾을 수 없습니다');
  // truncated 처리
  let content = file.content;
  if(file.truncated && file.raw_url){
    const r = await fetch(file.raw_url);
    content = await r.text();
  }
  return JSON.parse(content);
}
async function updateGist(token, gistId, data){
  return ghFetch('https://api.github.com/gists/' + encodeURIComponent(gistId), {
    method:'PATCH',
    body: JSON.stringify({
      files:{ [GIST_FILENAME]:{ content: JSON.stringify(data, null, 2) } }
    })
  }, token);
}

// 상태 UI 업데이트
function setSyncBadge(state){
  const badge = document.getElementById('syncStateBadge');
  if(!badge) return;
  badge.classList.remove('off','on','syncing');
  if(state==='on'){badge.classList.add('on'); badge.textContent='ON'}
  else if(state==='syncing'){badge.classList.add('syncing'); badge.textContent='SYNCING'}
  else{badge.classList.add('off'); badge.textContent='OFF'}
}
function setSyncStatusText(s){ const el=document.getElementById('syncStatusText'); if(el) el.textContent=s; }
function setSyncLastTime(d){
  const el=document.getElementById('syncLastTime'); if(!el) return;
  if(!d){ el.textContent='-'; return; }
  const diff = Date.now() - new Date(d).getTime();
  if(diff<10000) el.textContent='방금 전';
  else if(diff<60000) el.textContent=Math.floor(diff/1000)+'초 전';
  else if(diff<3600000) el.textContent=Math.floor(diff/60000)+'분 전';
  else el.textContent=new Date(d).toLocaleString('ko-KR');
}
function refreshSyncUI(){
  const cfg = getSyncConfig();
  const step1 = document.getElementById('syncStep1');
  const step2 = document.getElementById('syncStep2');
  if(cfg.enabled && cfg.token && cfg.gistId){
    step1.style.display='none';
    step2.style.display='block';
    document.getElementById('syncGistId').textContent = cfg.gistId.slice(0,8) + '...' + cfg.gistId.slice(-4);
    document.getElementById('syncCodeOut').value = encodeSyncCode(cfg.token, cfg.gistId);
    setSyncBadge('on');
    setSyncLastTime(cfg.lastSync);
    flashSync('cloud');
  } else {
    step1.style.display='block';
    step2.style.display='none';
    setSyncBadge('off');
  }
}

// 푸시 (debounced)
let pushTimer = null;
let pushInflight = false;
function schedulePush(){
  setSyncBadge('syncing');
  setSyncStatusText('업로드 대기 중…');
  clearTimeout(pushTimer);
  pushTimer = setTimeout(doPush, PUSH_DEBOUNCE_MS);
}
async function doPush(){
  const cfg = getSyncConfig();
  if(!cfg.enabled || !cfg.token || !cfg.gistId) return;
  if(pushInflight){ schedulePush(); return; }
  pushInflight = true;
  try{
    setSyncBadge('syncing');
    setSyncStatusText('클라우드에 업로드 중…');
    flashSync('syncing');
    await updateGist(cfg.token, cfg.gistId, DATA);
    cfg.lastSync = new Date().toISOString();
    setSyncConfig(cfg);
    setSyncBadge('on');
    setSyncStatusText('연결됨');
    setSyncLastTime(cfg.lastSync);
    flashSync('cloud');
  }catch(e){
    setSyncBadge('on');
    setSyncStatusText('업로드 실패: ' + e.message);
    toast('동기화 업로드 실패: ' + e.message, 'err');
  }finally{
    pushInflight = false;
  }
}

// 풀 (정기 + 포커스)
let pullTimer = null;
let pullInflight = false;
async function doPull(silent){
  const cfg = getSyncConfig();
  if(!cfg.enabled || !cfg.token || !cfg.gistId) return;
  if(pullInflight) return;
  pullInflight = true;
  try{
    if(!silent){ setSyncBadge('syncing'); setSyncStatusText('서버에서 확인 중…'); flashSync('syncing'); }
    const remote = await readGist(cfg.token, cfg.gistId);
    if(remote && remote.updatedAt && remote.updatedAt > (DATA.updatedAt||'')){
      // 원격이 더 최신 → 로컬 갱신
      DATA = remote;
      saveData(true, {fromRemote:true});
      rerenderAll();
      if(!silent) toast('다른 기기 변경사항을 가져왔습니다', 'ok');
    }
    cfg.lastSync = new Date().toISOString();
    setSyncConfig(cfg);
    setSyncBadge('on');
    setSyncStatusText('연결됨');
    setSyncLastTime(cfg.lastSync);
    flashSync('cloud');
  }catch(e){
    setSyncBadge('on');
    setSyncStatusText('확인 실패: ' + e.message);
    if(!silent) toast('동기화 확인 실패: ' + e.message, 'err');
  }finally{
    pullInflight = false;
  }
}
function startPullLoop(){
  clearInterval(pullTimer);
  pullTimer = setInterval(()=>doPull(true), PULL_INTERVAL_MS);
}
function stopPullLoop(){ clearInterval(pullTimer); pullTimer = null; }

// 페이지 포커스 시 즉시 pull
window.addEventListener('focus', ()=>{
  const cfg = getSyncConfig();
  if(cfg.enabled) doPull(true);
});
// 페이지 종료 시 push (대기 중인 변경분이 있을 때)
window.addEventListener('beforeunload', ()=>{
  if(pushTimer){
    const cfg = getSyncConfig();
    if(cfg.enabled && cfg.token && cfg.gistId){
      try{
        // sync XHR (beforeunload는 fetch가 안정적이지 않음)
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', 'https://api.github.com/gists/' + encodeURIComponent(cfg.gistId), false);
        xhr.setRequestHeader('Authorization','token ' + cfg.token);
        xhr.setRequestHeader('Accept','application/vnd.github+json');
        xhr.send(JSON.stringify({files:{[GIST_FILENAME]:{content: JSON.stringify(DATA)}}}));
      }catch{}
    }
  }
});

// ---- 동기화 시작 버튼 ----
document.getElementById('btnSyncStart').addEventListener('click', async ()=>{
  const tokenInput = document.getElementById('ghToken').value.trim();
  const codeInput = document.getElementById('ghSyncCode').value.trim();
  const btn = document.getElementById('btnSyncStart');
  btn.disabled = true; btn.textContent = '연결 중…';
  try{
    let token, gistId;
    if(codeInput){
      const dec = decodeSyncCode(codeInput);
      if(!dec) throw new Error('동기화 코드 형식이 올바르지 않습니다');
      token = dec.token; gistId = dec.gistId;
      // 검증 + 데이터 가져오기
      const remote = await readGist(token, gistId);
      if(!remote) throw new Error('Gist에서 데이터를 읽을 수 없습니다');
      // 로컬 데이터와 비교, 최신 것 사용
      if(remote.updatedAt && remote.updatedAt > (DATA.updatedAt||'')){
        DATA = remote;
        saveData(true, {fromRemote:true});
        rerenderAll();
      }
    } else if(tokenInput){
      if(!/^gh[ps]_/.test(tokenInput) && !/^github_pat_/.test(tokenInput)){
        if(!confirm('토큰 형식이 일반적이지 않습니다. 계속할까요?')) { btn.disabled=false; btn.textContent='☁️ 동기화 시작'; return; }
      }
      token = tokenInput;
      // 새 Gist 생성
      const g = await createGist(token, DATA);
      gistId = g.id;
    } else {
      throw new Error('토큰 또는 동기화 코드를 입력하세요');
    }
    setSyncConfig({enabled:true, token, gistId, lastSync: new Date().toISOString()});
    refreshSyncUI();
    startPullLoop();
    toast('자동 동기화 시작됨', 'ok');
    document.getElementById('ghToken').value = '';
    document.getElementById('ghSyncCode').value = '';
  }catch(e){
    toast('동기화 시작 실패: ' + e.message, 'err');
  }finally{
    btn.disabled = false; btn.textContent = '☁️ 동기화 시작';
  }
});

document.getElementById('btnSyncStop').addEventListener('click', ()=>{
  if(!confirm('자동 동기화를 끄시겠습니까? (로컬 데이터는 유지됩니다)')) return;
  setSyncConfig({});
  stopPullLoop();
  clearTimeout(pushTimer);
  refreshSyncUI();
  flashSync('saved');
  toast('동기화가 꺼졌습니다');
});

document.getElementById('btnSyncNow').addEventListener('click', async ()=>{
  await doPush();
  await doPull();
});

document.getElementById('btnCopyCode').addEventListener('click', async ()=>{
  const code = document.getElementById('syncCodeOut').value;
  try{
    await navigator.clipboard.writeText(code);
    toast('동기화 코드가 복사되었습니다 — 다른 기기에 붙여넣으세요', 'ok');
  }catch{
    document.getElementById('syncCodeOut').select();
    document.execCommand('copy');
    toast('동기화 코드가 복사되었습니다', 'ok');
  }
});

// 페이지 로드 시 동기화 시작
(function bootSync(){
  const cfg = getSyncConfig();
  refreshSyncUI();
  if(cfg.enabled && cfg.token && cfg.gistId){
    // 즉시 한번 pull
    doPull(true);
    startPullLoop();
  }
  // 1초마다 lastSync 시간 표시 갱신
  setInterval(()=>{
    const c = getSyncConfig();
    if(c.enabled && c.lastSync) setSyncLastTime(c.lastSync);
  }, 5000);
})();

// ============ 초기 렌더 ============
renderDashboard();
renderCities();
if(!getSyncConfig().enabled) flashSync('saved');
