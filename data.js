// 유재진 한달살기 & 골프투어 마스터플랜 데이터
// 엑셀 기반 해외 100대 도시 + 국내 100대 도시 통합
// Updated: 2026-07-11

window.INITIAL_DATA = {
  title: "유재진 한달살기",
  subtitle: "해외 100대·국내 100대 도시 한달살기 & 골프투어 마스터플랜",
  updated: "2026-07-11",
  stats: {
    overseasCities: 100,
    domesticCities: 200,
    totalCities: 200,
    countries: 50,
    years: 10,
    target: "5070 액티브 시니어",
    overseasAvgCost: "4,710,000원",
    domesticAvgCost: "3,140,000원",
    overseas1st: "태국 치앙마이",
    domestic1st: "제주 성산"
  },

  yearlyPlan: [
    {"year":1,"priority":"★★★ HIGH","theme":"동아시아·동남아 베이스캠프","region":"동아시아·동남아","cityCount":10,"quarter":"Q1/Q3/Q4","years":"2026~2027","cities":["일본 가고시마","일본 오키나와","태국 치앙마이","베트남 다낭","말레이시아 조호바루"],"cost":"300~850만","summary":"가장 접근성 좋은 아시아권. 일본 겨울 온천골프, 태국 건기 한달살기, 말레이시아 무제한골프 3코스 순환"},
    {"year":2,"priority":"★★★ HIGH","theme":"유럽 지중해 골프 & 문화","region":"유럽 지중해","cityCount":10,"quarter":"Q2","years":"2027~2028","cities":["스페인 말라가","포르투갈 알가르브","이탈리아 피렌체","포르투갈 리스본","그리스 아테네"],"cost":"500~750만","summary":"4~6월 최적기. 말라가·알가르브는 유럽 3대 골프 메카. 피렌체에서 문화 한달살기 병행"},
    {"year":3,"priority":"★★☆ MED","theme":"오세아니아·북미 프리미엄","region":"오세아니아·북미","cityCount":10,"quarter":"Q3","years":"2028~2029","cities":["호주 골드코스트","뉴질랜드 퀸스타운","미국 하와이","캐나다 밴쿠버","호주 브리즈번"],"cost":"600~1,699만","summary":"호주 7~9월 = 한국 봄날씨. 골드코스트 패키지(14박 골프포함 1,290만) → 퀸스타운 액티브"},
    {"year":4,"priority":"★★☆ MED","theme":"중미·카리브해 은퇴자 낙원","region":"중미·남미","cityCount":10,"quarter":"Q1","years":"2029~2030","cities":["코스타리카 에스카수","파나마 파나마시티","멕시코 플라야 델 카르멘","콜롬비아 메데인","아르헨티나 부에노스아이레스"],"cost":"350~600만","summary":"코스타리카 Pensionado 비자 체험. 메데인 봄기후(연평균24°C). 부에노스아이레스 탱고+골프"},
    {"year":5,"priority":"★★☆ MED","theme":"동남아 심화 & 서유럽 연계","region":"동남아·서유럽","cityCount":10,"quarter":"Q2~Q4","years":"2030~2031","cities":["인도네시아 발리","베트남 호치민","프랑스 니스","스페인 바르셀로나","포르투갈 포르투"],"cost":"250~700만","summary":"발리 짱구 디지털노마드 체험 후 유럽 2개월 연속 한달살기"},
    {"year":6,"priority":"★☆☆ LOW","theme":"북·서유럽 & 스위스 하이킹","region":"북유럽·스위스","cityCount":10,"quarter":"Q2","years":"2031~2032","cities":["아일랜드 골웨이","스위스 루가노","오스트리아 잘츠부르크","체코 프라하","헝가리 부다페스트"],"cost":"500~750만","summary":"유럽 중부 한달씩 이동. 스위스 루가노 호수뷰, 프라하 역사도시 장기체류"},
    {"year":7,"priority":"★☆☆ LOW","theme":"동유럽·중남미 가성비 탐험","region":"동유럽·중남미","cityCount":10,"quarter":"Q1~Q3","years":"2032~2033","cities":["조지아 트빌리시","불가리아 반스코","세르비아 베오그라드","페루 쿠스코","에콰도르 키토"],"cost":"280~500만","summary":"조지아·불가리아는 유럽 최저가 한달살기. 페루 쿠스코 고원 트레킹"},
    {"year":8,"priority":"★☆☆ LOW","theme":"남미 전통 & 북아프리카 문화","region":"남미·북아프리카","cityCount":10,"quarter":"Q1~Q2","years":"2033~2034","cities":["칠레 산티아고","브라질 리우","우루과이 몬테비데오","모로코 마라케시","이집트 후르가다"],"cost":"380~600만","summary":"칠레 와인투어+골프, 마라케시 리아드 한달살기, 후르가다 홍해 다이빙"},
    {"year":9,"priority":"★☆☆ LOW","theme":"중동·아프리카·동유럽","region":"중동·아프리카","cityCount":10,"quarter":"Q3~Q4","years":"2034~2035","cities":["남아공 케이프타운","케냐 나이로비","탄자니아 잔지바르","모리셔스 포트루이스","세이셸 빅토리아"],"cost":"400~900만","summary":"남아공 케이프타운 세계적 골프코스, 잔지바르 인도양 리조트 한달살기"},
    {"year":10,"priority":"★☆☆ LOW","theme":"북유럽·극지방 버킷리스트","region":"북유럽·극지방","cityCount":10,"quarter":"Q3","years":"2035~2036","cities":["노르웨이 베르겐","핀란드 로바니에미","아이슬란드 레이캬비크","스웨덴 스톡홀름","덴마크 코펜하겐"],"cost":"900~1,500만","summary":"10년차 완주 기념 북유럽 피요르드·오로라 한달살기. 최고 버킷리스트 완성"}
  ],

  featuredCities: [
    {
      "key": "kagoshima",
      "name": "가고시마",
      "nameEn": "Kagoshima",
      "country": "🇯🇵 일본",
      "continent": "아시아",
      "season": "겨울",
      "golf": true,
      "totalCost": 4500000,
      "visa": "무비자 90일",
      "internet": "광속 LTE/5G",
      "language": "일본어 (번역앱 충분)",
      "description": "사쿠라지마 활화산을 배경으로 한 규슈 최남단 도시. 겨울에도 온화한 기후(평균15°C)와 세계적 온천, 30개 이상의 골프장을 보유. 서울~가고시마 직항 2시간, 은퇴자 선호도 1위 일본 도시.",
      "theme": "화산온천·골프",
      "quarter": "Q1·1~2월",
      "rating": "★★★★★",
      "costMin": "350만",
      "costMax": "550만"
    },
    {
      "key": "okinawa",
      "name": "오키나와",
      "nameEn": "Okinawa",
      "country": "🇯🇵 일본",
      "continent": "아시아",
      "season": "겨울",
      "golf": true,
      "totalCost": 7500000,
      "visa": "무비자 90일",
      "internet": "광속 LTE/5G",
      "language": "일본어 (영어 통용)",
      "description": "일본 최남단 아열대 섬. 연평균 기온 23°C의 리조트 천국. 오션뷰 골프장에서 에메랄드 바다를 보며 라운드, 류큐 왕국 문화와 미식(아구돼지·오키나와소바) 체험. 렌터카 필수.",
      "theme": "오션뷰리조트·골프",
      "quarter": "Q1·1~3월",
      "rating": "★★★★☆",
      "costMin": "700만",
      "costMax": "850만"
    },
    {
      "key": "chiangmai",
      "name": "치앙마이",
      "nameEn": "Chiang Mai",
      "country": "🇹🇭 태국",
      "continent": "아시아",
      "season": "겨울",
      "golf": true,
      "totalCost": 3500000,
      "visa": "무비자 60일",
      "internet": "LTE (시내 충분)",
      "language": "태국어 (관광지 영어)",
      "description": "해발 310m 북부 고원 도시. 겨울 건기(11~3월) 최고기온 28°C의 쾌적한 기후. 한달 숙박 110만원대, 마사지 1만원, 그린피 7만원으로 은퇴자 최고 가성비 도시. 불교 사원 300개+, 야시장, 쿠킹클래스.",
      "theme": "하이킹·골프·마사지",
      "quarter": "Q4·11~1월",
      "rating": "★★★★★",
      "costMin": "300만",
      "costMax": "450만"
    },
    {
      "key": "johorbahru",
      "name": "조호바루",
      "nameEn": "Johor Bahru",
      "country": "🇲🇾 말레이시아",
      "continent": "아시아",
      "season": "겨울",
      "golf": true,
      "totalCost": 4200000,
      "visa": "무비자 90일",
      "internet": "LTE (양호)",
      "language": "말레이어·영어 병용",
      "description": "싱가포르 코즈웨이 맞은편 말레이시아 도시. 싱가포르 가격의 1/3로 생활하며 30분이면 싱가포르 쇼핑·의료 이용. 무제한 골프 패키지 월 60만원대, 현지 골프 클럽 회원급 혜택. MM2H 비자 적극 추천.",
      "theme": "무제한골프·싱가포르연계",
      "quarter": "Q1·1~3월",
      "rating": "★★★★★",
      "costMin": "350만",
      "costMax": "500만"
    },
    {
      "key": "malaga",
      "name": "말라가 (미하스)",
      "nameEn": "Malaga / Mijas",
      "country": "🇪🇸 스페인",
      "continent": "유럽",
      "season": "봄",
      "golf": true,
      "totalCost": 6500000,
      "visa": "쉥겐 90일",
      "internet": "광속 광케이블",
      "language": "스페인어 (관광지 영어)",
      "description": "코스타 델 솔(태양의 해안) 중심 도시. 연 300일 맑은 날씨, 챔피언십 골프코스 30개+ 밀집. 미하스·마르베야 등 백색 마을 여행, 타파스 바 문화, 알함브라 당일 투어 가능. 유럽 골프 은퇴자 1번지.",
      "theme": "챔피언십골프·지중해",
      "quarter": "Q2·4~6월",
      "rating": "★★★★☆",
      "costMin": "550만",
      "costMax": "750만"
    },
    {
      "key": "algarve",
      "name": "알가르브 (파로)",
      "nameEn": "Algarve / Faro",
      "country": "🇵🇹 포르투갈",
      "continent": "유럽",
      "season": "봄",
      "golf": true,
      "totalCost": 6000000,
      "visa": "쉥겐 90일",
      "internet": "광속 광케이블",
      "language": "포르투갈어 (영어 통용)",
      "description": "포르투갈 남부 황금 해안. 비달 사수아리나·피니스테라 등 세계 100대 코스 보유, 그린피 유럽 최저가. 파로 구시가 탐방, 카약 동굴투어, 신선한 해산물. 포르투갈은 유럽 생활비 최저권 국가.",
      "theme": "명문골프·요트",
      "quarter": "Q2·4~6월",
      "rating": "★★★★☆",
      "costMin": "500만",
      "costMax": "700만"
    },
    {
      "key": "goldcoast",
      "name": "골드코스트",
      "nameEn": "Gold Coast",
      "country": "🇦🇺 호주",
      "continent": "오세아니아",
      "season": "봄",
      "golf": true,
      "totalCost": 14000000,
      "visa": "eVisitor 90일",
      "internet": "광속 NBN",
      "language": "영어",
      "description": "호주 동해안 72km 황금빛 해변. 7~9월 = 한국의 5월 날씨(최고24°C). 2인 28박 비즈니스석+호텔+골프 14회 올인클루시브 패키지 1,290~1,699만원. 서퍼스파라다이스·무비월드·드림월드 관광.",
      "theme": "럭셔리골프·비즈니스석",
      "quarter": "Q3·7~9월",
      "rating": "★★★★★",
      "costMin": "1,290만",
      "costMax": "1,699만"
    },
    {
      "key": "costarica",
      "name": "산호세 (에스카수)",
      "nameEn": "San Jose / Escazu",
      "country": "🇨🇷 코스타리카",
      "continent": "중미",
      "season": "겨울",
      "golf": true,
      "totalCost": 5000000,
      "visa": "무비자 90일 / Pensionado",
      "internet": "LTE (도심 양호)",
      "language": "스페인어 (에스카수 영어 통용)",
      "description": "중미 은퇴자 낙원. Pensionado 비자($1,000/월 연금증명)로 의료·교통·오락 20% 할인. 에스카수는 고급 주거단지, 쇼핑몰·국제병원 도보권. 커피농장 투어, 열대우림 트레킹, 거북이 방류 체험.",
      "theme": "Pensionado비자·웰니스",
      "quarter": "Q1·1~3월",
      "rating": "★★★★☆",
      "costMin": "450만",
      "costMax": "600만"
    }
  ],

  cityDetails: {
    kagoshima: {
      costs: [
        {item:"숙소 (에어비앤비 1베드)", included:true, amount:900000, note:"시내 도보권 추천"},
        {item:"식비 (2인·외식+마트)", included:true, amount:1000000, note:"편의점·라멘·정식 활용"},
        {item:"골프 그린피 (월 8회)", included:true, amount:1200000, note:"¥15,000~32,000/회, 카트포함"},
        {item:"교통 (렌터카·버스)", included:true, amount:200000, note:"렌터카 월 15만엔 내외"},
        {item:"온천·문화·쇼핑", included:true, amount:200000, note:"시라이와·이부스키 온천"},
        {item:"항공 (인천↔가고시마)", included:false, amount:400000, note:"직항 2시간, 왕복 40만원 내외"},
        {item:"합계 (항공 제외)", included:true, amount:3500000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:3900000, note:"2인 기준"}
      ],
      golfSummary: "가고시마는 규슈 내 최다 골프장 밀집 지역. 사쿠라지마 조망 코스, 이부스키 온천 연계 리조트 골프가 핵심 매력.",
      golfCourses: [
        {name:"이부스키 골프클럽", feature:"온천 료칸 연계, 사계절 꽃 코스", greenFee:"¥18,000~28,000", cart:"카트 포함"},
        {name:"가고시마 CC (가와우치)", feature:"사쿠라지마 조망, 구릉형 코스", greenFee:"¥12,000~20,000", cart:"카트 포함"},
        {name:"카이몬 골프링크스", feature:"개방감 넘치는 해안 코스, 일몰 라운드", greenFee:"¥15,000~22,000", cart:"카트 포함"},
        {name:"선에이 CC 지란", feature:"지란 특공대 유적 인근, 역사탐방 연계", greenFee:"¥10,000~16,000", cart:"카트 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"이부스키 골프 오전 라운드", pm:"온천 & 휴식"},
        {day:"화", am:"시내 관광 (이소 정원·유신관)", pm:"가고시마 흑돼지 저녁"},
        {day:"수", am:"가고시마 CC 라운드", pm:"사쿠라지마 페리 탐방"},
        {day:"목", am:"휴식·마트 장보기", pm:"자취 요리 or 이자카야"},
        {day:"금", am:"지란 특공대 평화회관 방문", pm:"카이몬 석양 라운드"},
        {day:"토", am:"야쿠시마·아마미 당일 페리 여행", pm:"현지 시장 탐방"},
        {day:"일", am:"료칸 조식·온천 힐링", pm:"독서·넷플릭스 자유 시간"}
      ],
      lodging: "이부스키 또는 가고시마 시내 에어비앤비(월 60~90만원)를 기준으로 합니다. 넉넉한 부엌이 있는 1베드 추천. 이부스키 온천 료칸 주 1회 숙박(1박 3~5만엔)도 병행 가능.",
      tips: "① 이부스키 '스나무시'(모래찜질) 온천은 반드시 체험 · ② 가고시마 흑돼지 샤부샤부·흑돼지 돈카츠는 현지 필수 음식 · ③ 사쿠라지마 페리(4분)는 무료, 화산재 마스크 필수 · ④ 야쿠시마 세계자연유산 당일·1박 여행 추천 · ⑤ 교통카드 nimoca 발급하면 버스·편의점 모두 편리"
    },

    okinawa: {
      costs: [
        {item:"숙소 (오션뷰 월세)", included:true, amount:1800000, note:"나하·차탄 1베드 기준"},
        {item:"식비 (2인)", included:true, amount:1000000, note:"현지 소바·스테이크 저렴"},
        {item:"골프 그린피 (월 8회)", included:true, amount:1600000, note:"¥15,000~28,000/회"},
        {item:"렌터카", included:true, amount:300000, note:"주 단위 렌트 효율적"},
        {item:"레저·관광", included:true, amount:300000, note:"수족관·다이빙·드라이브"},
        {item:"항공 (인천↔나하)", included:false, amount:500000, note:"왕복 50만원 내외"},
        {item:"합계 (항공 제외)", included:true, amount:5000000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:5500000, note:"2인 기준"}
      ],
      golfSummary: "오키나와는 아열대 기후로 연중 골프 가능. 오션뷰 코스가 특징이며 부기빌레아·ANAインターコンチネンタル 등 리조트 연계 패키지가 가성비 우수.",
      golfCourses: [
        {name:"ANA인터컨티넨탈 만좌비치 GC", feature:"산호초 오션뷰 18홀, 리조트 패키지 가능", greenFee:"¥18,000~28,000", cart:"카트포함"},
        {name:"오키나와 Kariyushi CC", feature:"중부 구릉형, 성수기 예약 필수", greenFee:"¥15,000~22,000", cart:"카트포함"},
        {name:"나고 파인힐스 GC", feature:"북부 파인애플 밭 인근, 조용한 플레이", greenFee:"¥12,000~18,000", cart:"카트포함"},
        {name:"오키나와 부기빌레아 CC", feature:"미군 기지 인근, 넓은 페어웨이", greenFee:"¥14,000~20,000", cart:"카트포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"카리유시 CC 오전 라운드", pm:"온나손 해변 산책"},
        {day:"화", am:"오키나와 세계유산 류큐 성터 투어", pm:"나하 국제거리 쇼핑"},
        {day:"수", am:"ANA 리조트 GC 라운드", pm:"만좌비치 석양 감상"},
        {day:"목", am:"슈리성 & 首里 탐방", pm:"오키나와 소바·아구돼지 저녁"},
        {day:"금", am:"북부 나고파인힐스 라운드", pm:"나고 파인애플파크 투어"},
        {day:"토", am:"스노클링·글래스보텀 보트", pm:"미국마을(차탄) 쇼핑·맥주"},
        {day:"일", am:"자유 휴식·독서", pm:"류큐 유리공예 체험 or 쿠킹클래스"}
      ],
      lodging: "차탄(미국마을) 근처 콘도형 월세(150~180만원)가 가성비 최고. 나하 시내 1베드는 200만원 이상. 부엌 필수. 렌터카 없이는 생활 불편하므로 주차 포함 확인.",
      tips: "① 오키나와 美ら海水族館은 최소 1회 필수 · ② 지역 버스(모노레일+버스 1일권) 2,000엔 활용 · ③ 이온몰(이온モール) 나하에서 대부분의 생활용품 해결 · ④ 라운드 전날 골프장 직접 전화 예약하면 그린피 할인 · ⑤ 태풍 시즌(7~9월) 피해 1~3월 방문 추천"
    },

    chiangmai: {
      costs: [
        {item:"숙소 (님만해민 콘도)", included:true, amount:600000, note:"월 45,000~70,000바트 1베드"},
        {item:"식비 (2인·현지+카페)", included:true, amount:700000, note:"쌀국수 2천원, 카페 2만원"},
        {item:"골프 그린피 (월 8회)", included:true, amount:600000, note:"7만원/회·캐디포함"},
        {item:"마사지·스파 (주 2회)", included:true, amount:200000, note:"발마사지 시간당 7천원"},
        {item:"교통 (그랩·선류)", included:true, amount:150000, note:"그랩 기본 2천원"},
        {item:"관광·쿠킹클래스", included:true, amount:250000, note:"쿠킹클래스 4만원/인"},
        {item:"항공 (인천↔치앙마이)", included:false, amount:600000, note:"직항 5시간, 왕복 60만원"},
        {item:"합계 (항공 제외)", included:true, amount:2500000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:3100000, note:"2인 기준"}
      ],
      golfSummary: "치앙마이 근교 10개 이상 골프장. 그린피 50~100달러, 캐디팁 포함 7~12만원/회. 건기(11~4월) 오전 라운드 후 오후 문화탐방 패턴이 최적.",
      golfCourses: [
        {name:"치앙마이 그린밸리 CC", feature:"산 조망 18홀, 치앙마이 최고 명문 코스", greenFee:"2,800~3,500바트", cart:"카트+캐디 포함"},
        {name:"알파인 골프 리조트", feature:"고급 리조트 연계, 유럽 설계 코스", greenFee:"3,000~4,000바트", cart:"카트+캐디 포함"},
        {name:"라나 스파 & 골프 클럽", feature:"저렴하고 컨디션 좋은 공립형 코스", greenFee:"1,500~2,000바트", cart:"카트+캐디 포함"},
        {name:"빈타나 골프 클럽", feature:"야간 라운드 가능, 시내 접근 편리", greenFee:"1,200~1,800바트", cart:"카트+캐디 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"그린밸리 CC 오전 라운드", pm:"님만해민 카페 힐링"},
        {day:"화", am:"도이수텝 사원 하이킹", pm:"나이트바자 & 현지 저녁"},
        {day:"수", am:"알파인 GC 라운드", pm:"마사지 2시간 (올드시티)"},
        {day:"목", am:"쿠킹클래스 오전", pm:"마카카이 야시장 탐방"},
        {day:"금", am:"빈타나 GC 오전 라운드", pm:"코끼리 보호소 오후 방문"},
        {day:"토", am:"도이인타논 국립공원 트레킹", pm:"산트리부 마을 탐방"},
        {day:"일", am:"올드시티 사원 산책", pm:"마사지+독서 자유 시간"}
      ],
      lodging: "님만해민(Nimman) 또는 올드시티 근처 콘도형 월세(월 45,000~70,000바트 = 약 175만~270만원). 에어컨·세탁기·풀장 포함 여부 확인. 에어비앤비보다 현지 Facebook 그룹 '치앙마이 월세'가 훨씬 저렴.",
      tips: "① 건기(11~4월) 최적, 우기(5~10월)는 비가 많지만 가격 50% 저렴 · ② 치앙마이 도착 후 TRUE/DTAC SIM 구입(월 300바트 무제한) · ③ 쌍태우(붉은 픽업트럭) 20바트로 어디든 이동 · ④ 쿠킹클래스는 숙소 주변 학원(Thai Farm Cooking School) 추천 · ⑤ 비자 연장: 말레이시아 페낭 콘술레이트 1박 비자런으로 60일 추가"
    },

    johorbahru: {
      costs: [
        {item:"숙소 (선테크/다운타운 콘도)", included:true, amount:800000, note:"月 RM2,500~3,500 1베드"},
        {item:"식비 (2인·호커센터)", included:true, amount:600000, note:"호커 한끼 2,000~4,000원"},
        {item:"골프 무제한 패키지", included:true, amount:600000, note:"月 RM1,500~2,500 멤버십"},
        {item:"싱가포르 원정 (주 1~2회)", included:true, amount:400000, note:"지하철 통근·쇼핑"),
        {item:"교통 (그랩·버스)", included:true, amount:200000, note:"싱가포르↔JB 버스 3,000원"},
        {item:"의료 (국제병원)", included:true, amount:200000, note:"싱가포르 대비 1/3"},
        {item:"항공 (인천↔싱가포르/JB)", included:false, amount:600000, note:"싱가포르 경유 또는 JB 직항"},
        {item:"합계 (항공 제외)", included:true, amount:2800000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:3400000, note:"2인 기준"}
      ],
      golfSummary: "조호바루는 싱가포르 골프 치는 사람들의 '비밀 아지트'. 싱가포르 그린피의 1/3 가격에 월 무제한 패키지 이용 가능. 코스 30개 이상 밀집.",
      golfCourses: [
        {name:"팜 리조트 GC (Palm Resort)", feature:"싱가포르 국경 10분, 36홀 리조트", greenFee:"RM180~250/회", cart:"카트+캐디 포함"},
        {name:"누사 다루타마 GC", feature:"대한인 이용 많음, 연습장 우수", greenFee:"RM150~200/회", cart:"카트+캐디 포함"},
        {name:"해피밸리 GC", feature:"월 멤버십 RM2,500/2인, 무제한", greenFee:"멤버십 가입", cart:"포함"},
        {name:"레자트 레이크 GC", feature:"호수 조망, 도심 접근 10분", greenFee:"RM130~180/회", cart:"카트+캐디 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"팜 리조트 오전 라운드", pm:"JB 시내 현지 맛집"},
        {day:"화", am:"싱가포르 원정 쇼핑(오차드)", pm:"싱가포르 호커센터 저녁"},
        {day:"수", am:"해피밸리 GC 라운드", pm:"JB 마사지·스파"},
        {day:"목", am:"JB 아침 재래시장", pm:"레자트 레이크 오후 라운드"},
        {day:"금", am:"싱가포르 의료 체크업", pm:"MBS 마리나베이샌즈 저녁"},
        {day:"토", am:"누사 다루타마 라운드", pm:"JB 로컬 푸드코트"},
        {day:"일", am:"자유 휴식", pm:"콘도 수영장·독서"}
      ],
      lodging: "선테크 시티 인근 또는 JB 시티 스퀘어 옆 콘도 추천 (월 RM2,500~3,500 = 약 75~105만원). 싱가포르까지 도보+버스 30분 거리. 부엌·풀장·헬스장 포함 단지 선택.",
      tips: "① 싱가포르 이민국 통과 시 온라인 SG Arrival Card 미리 작성 · ② JB 그랩(Grab) 앱 설치 필수, 택시보다 40% 저렴 · ③ 말레이시아 MM2H 비자: 월 $1,500 예금 증명으로 10년 거주 비자 · ④ 현지 수퍼마켓 Giant/Aeon은 싱가포르의 절반 가격 · ⑤ 국제병원 Columbia Asia/Pantai는 싱가포르 품질·1/3 가격"
    },

    malaga: {
      costs: [
        {item:"숙소 (미하스/벤알마데나 아파트)", included:true, amount:1500000, note:"€800~1,100/월 1베드"},
        {item:"식비 (2인·타파스+마트)", included:true, amount:1200000, note:"타파스 맥주 2,000원·와인 3,000원"},
        {item:"골프 그린피 (월 8회)", included:true, amount:1600000, note:"€65~120/회, 성수기 전 예약"},
        {item:"렌터카", included:true, amount:400000, note:"€200/월, 코스타 델 솔 이동 필수"},
        {item:"문화·관광", included:true, amount:400000, note:"그라나다·세비야 당일 여행"},
        {item:"항공 (인천↔말라가)", included:false, amount:1200000, note:"파리/마드리드 경유, 왕복 120만"},
        {item:"합계 (항공 제외)", included:true, amount:5100000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:6300000, note:"2인 기준"}
      ],
      golfSummary: "말라가는 '유럽의 골프 메카'. 코스타 델 솔에 70개+ 챔피언십 코스 밀집. 세계랭킹 코스 발레 로마노·라킨타 등 접근. 유럽 골프 투어 베이스캠프.",
      golfCourses: [
        {name:"발데라마 GC (헤레스)", feature:"라이더컵 개최, 스페인 최고 명문", greenFee:"€250~400", cart:"카트 포함"},
        {name:"라킨타 GC (말라가)", feature:"올레아도스 CC 인근, 자연 코스", greenFee:"€80~140", cart:"카트 포함"},
        {name:"알라우린 골프 (미하스)", feature:"미하스 백색 마을 인근, 파노라마 뷰", greenFee:"€65~100", cart:"카트 포함"},
        {name:"몬테마요르 GC", feature:"산악형 18홀, 조용한 플레이 환경", greenFee:"€70~110", cart:"카트 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"라킨타 GC 오전 라운드", pm:"말라가 시내 피카소 미술관"},
        {day:"화", am:"그라나다 알함브라 당일 투어", pm:"그라나다 타파스 거리 저녁"},
        {day:"수", am:"알라우린 GC 라운드", pm:"미하스 백색 마을 산책"},
        {day:"목", am:"마르베야 해변 산책", pm:"뿌에르또 바누스 요트 항구 탐방"},
        {day:"금", am:"몬테마요르 GC 라운드", pm:"넬하 동굴 투어"},
        {day:"토", am:"세비야 당일 투어 (기차 2시간)", pm:"세비야 플라멩코 공연"},
        {day:"일", am:"말라가 중앙시장 장보기", pm:"아파트 요리·와인 시간"}
      ],
      lodging: "미하스 코스타 또는 벤알마데나 골프 리조트 인근 아파트(€800~1,100/월). 골프장 도보·카트 접근 가능 단지 최적. 토레몰리노스 해변타운도 교통 편리.",
      tips: "① 스페인 쉥겐 비자 90일 → 포르투갈로 이동해 180일 연장 가능 · ② 골프장 왕복 그린피는 'GolfHolidays24' 등 온라인 예약이 20~30% 저렴 · ③ 세마나 산타(부활절) 시즌은 호텔·항공 급등 주의 · ④ 현지 메르카도나(Mercadona) 슈퍼마켓 식재료 저렴하고 품질 우수 · ⑤ 말라가 자전거 대여(EMT) 월 15유로"
    },

    algarve: {
      costs: [
        {item:"숙소 (빌라모우라 아파트)", included:true, amount:1500000, note:"€850~1,200/월 1베드"},
        {item:"식비 (2인)", included:true, amount:1100000, note:"신선 해산물 저렴, 와인 5유로"),
        {item:"골프 그린피 (월 8회)", included:true, amount:1800000, note:"€70~150/회, 겨울 할인"},
        {item:"렌터카", included:true, amount:350000, note:"€180/월, 코스 이동 필수"},
        {item:"요트·레저", included:true, amount:300000, note:"카약·동굴 투어 €30~80"},
        {item:"항공 (인천↔파루)", included:false, amount:1200000, note:"리스본 경유, 왕복 120만"},
        {item:"합계 (항공 제외)", included:true, amount:5050000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:6250000, note:"2인 기준"}
      ],
      golfSummary: "알가르브는 포르투갈 '황금 해안'. 세계 100대 코스 빌라 솔(Victoria), 오세아니코 빅토리아 등 보유. 유럽 최대 골프 은퇴자 집결지, 영국·독일 골퍼 겨울 성지.",
      golfCourses: [
        {name:"오세아니코 빅토리아 GC", feature:"유럽투어 포르투갈 마스터스 개최 코스", greenFee:"€130~200", cart:"카트 포함"},
        {name:"빌라 솔 GC (비담라)", feature:"세계 100대 코스, 소나무·파노라마", greenFee:"€90~150", cart:"카트 포함"},
        {name:"파이네이로스 알토 GC", feature:"나무 사이 협소 코스, 전략적 플레이", greenFee:"€80~120", cart:"카트 포함"},
        {name:"라 킨타 알가르브", feature:"저렴한 지역 코스, 조용한 환경", greenFee:"€55~90", cart:"카트 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"오세아니코 빅토리아 라운드", pm:"빌라모우라 마리나 저녁"},
        {day:"화", am:"라고스 황금 해변 탐방", pm:"조개·문어 해산물 저녁"},
        {day:"수", am:"빌라 솔 GC 라운드", pm:"해안 동굴 카약 투어"},
        {day:"목", am:"파루 구시가 & 뼈 성당", pm:"골프장 연습 + 어프로치"},
        {day:"금", am:"파이네이로스 알토 라운드", pm:"타비라 소금 마을 탐방"},
        {day:"토", am:"세비야/포르투 기차 당일 여행", pm:"리스본 파두 공연 관람"},
        {day:"일", am:"해변 산책·조깅", pm:"와인 + 독서 자유 시간"}
      ],
      lodging: "빌라모우라(Vilamoura) 마리나 인근 아파트(€850~1,200/월)가 골프·쇼핑·식당 접근 최적. 퀴타 두 라고(Quinta do Lago) 인근은 명문 코스 도보 이동 가능하나 고가.",
      tips: "① 알가르브 골프 패스(7일/14일)로 10~15% 절감 가능 · ② 영국인 은퇴자 커뮤니티가 많아 영어 생활 편리 · ③ 슈퍼메르카도 피아알(Pingo Doce) 신선 해산물 저렴 · ④ 렌터카 없이 알가르브 내 이동은 버스(EVA Bus) 이용 · ⑤ 포르투갈 NHR(비상거주자 세제) 혜택으로 외국 소득 세금 절감 가능"
    },

    goldcoast: {
      costs: [
        {item:"비즈니스석 항공 (인천↔브리즈번)", included:true, amount:5000000, note:"왕복 2인, 퍼스트/비즈니스"},
        {item:"호텔 (4~5성 28박)", included:true, amount:5000000, note:"서퍼스파라다이스 리조트형"},
        {item:"골프 패키지 (14회·카트·캐디)", included:true, amount:2000000, note:"스프링브룩·힌터랜드 코스 포함"},
        {item:"식비·관광·쇼핑 (2인 28일)", included:true, amount:2000000, note:"맥도널드 빅맥 1만원 수준"},
        {item:"합계 (올인클루시브)", included:true, amount:14000000, note:"2인·28박 패키지 기준"},
        {item:"알파 패키지 (최저)", included:true, amount:12900000, note:"항공+호텔+골프14회"},
        {item:"프리미엄 패키지", included:true, amount:16990000, note:"퍼스트석+최고급 리조트"}
      ],
      golfSummary: "골드코스트 인근 퀸즐랜드 주에 130개+ 골프장. Royal Pines는 호주 PGA 투어 코스. 7~9월 = 한국 봄날씨(최고24°C), 오전 라운드 후 해변 오후 황금 패턴.",
      golfCourses: [
        {name:"로열 파인스 리조트 GC", feature:"호주 PGA 투어 개최, 챔피언십 코스", greenFee:"AU$150~220", cart:"카트 포함"},
        {name:"스프링브룩 GC", feature:"힌터랜드 산악 코스, 쿨한 기후", greenFee:"AU$80~120", cart:"카트 포함"},
        {name:"콜람빈 GC", feature:"도심 접근 최고, 18홀 퍼블릭 코스", greenFee:"AU$60~90", cart:"카트 포함"},
        {name:"주피터스 카지노 GC", feature:"카지노 리조트 연계, 브로드워터 조망", greenFee:"AU$120~180", cart:"카트 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"로열 파인스 챔피언십 라운드", pm:"서퍼스파라다이스 비치 산책"},
        {day:"화", am:"드림월드 테마파크", pm:"스카이포인트 전망대 석양"},
        {day:"수", am:"스프링브룩 힌터랜드 라운드", pm:"쿨링라바 폭포 트레킹"},
        {day:"목", am:"무비월드 반나절", pm:"사우스뱅크 파르크(브리즈번 당일)"},
        {day:"금", am:"로열 파인스 두 번째 라운드", pm:"파시피르 페어 쇼핑"},
        {day:"토", am:"쿨랑가타 서핑 체험", pm:"BDO(Bay Drive-Out) 럼 디스틸러리"},
        {day:"일", am:"골드코스트 마켓(사운즈 파라다이스)", pm:"수영장 휴식·독서"}
      ],
      lodging: "패키지 포함 4~5성 리조트(서퍼스파라다이스 힐튼·마리오트). 자체 예약 시 아베이뉴 리조트·베로 비치 등 골드코스트 장기 숙박 전문 아파트호텔 추천.",
      tips: "① 7~9월 성수기 전 최소 3개월 전 예약 · ② 골드코스트 트램(G:link) 월정액 $100, 해변 이동 편리 · ③ 울워스(Woolworths)/콜스(Coles) 슈퍼마켓 자취 식재료 저렴 · ④ 호주 eVisitor 비자(무료) 사전 발급 필수 · ⑤ 팁 문화 없음, 가격표 = 최종 가격"
    },

    costarica: {
      costs: [
        {item:"숙소 (에스카수 콘도)", included:true, amount:1200000, note:"$700~1,000/월, 경비 포함 단지"},
        {item:"식비 (2인·현지+슈퍼마켓)", included:true, amount:900000, note:"카사도(정식) 6달러, 카페 3달러"},
        {item:"골프 그린피 (월 6회)", included:true, amount:900000, note:"$70~130/회, 카트 포함"},
        {item:"교통 (버스+우버)", included:true, amount:200000, note:"산호세 시내 우버 3,000원"},
        {item:"투어·레저", included:true, amount:400000, note:"화산·커피농장·거북이 투어"},
        {item:"의료 (CAJA 국민의료)", included:true, amount:100000, note:"Pensionado 의료보험 가입 가능"},
        {item:"항공 (인천↔산호세)", included:false, amount:1500000, note:"LA/마이애미 경유, 왕복 150만"},
        {item:"합계 (항공 제외)", included:true, amount:3700000, note:"2인 기준"},
        {item:"합계 (항공 포함)", included:true, amount:5200000, note:"2인 기준"}
      ],
      golfSummary: "코스타리카는 중미 은퇴자 골프 허브. 산호세 근교 10개 코스, 포르케사다·과나카스테 해안 코스도 당일 이용 가능. Pensionado 비자 시 시설 이용 20% 할인.",
      golfCourses: [
        {name:"라 구아카마야 GC", feature:"산호세 30분, 화산 조망 18홀", greenFee:"$80~120", cart:"카트 포함"},
        {name:"카라이그레스 GC", feature:"에스카수 인근 10분, 퍼블릭 코스", greenFee:"$65~90", cart:"카트 포함"},
        {name:"마리옷 로스 수에뇨스 GC", feature:"해안 리조트 코스, 특급 시설", greenFee:"$120~180", cart:"카트 포함"},
        {name:"포르케사다 CC", feature:"안개 산악형, 카트 필수 급경사", greenFee:"$55~80", cart:"카트 포함"}
      ],
      weeklySchedule: [
        {day:"월", am:"라 구아카마야 오전 라운드", pm:"에스카수 쇼핑몰(멀티프라자)"},
        {day:"화", am:"아레날 화산 당일 투어", pm:"온천 & 화산 수영"},
        {day:"수", am:"카라이그레스 GC 라운드", pm:"산호세 메르카도 센트랄 탐방"},
        {day:"목", am:"커피농장 투어 (포아스 화산)", pm:"카페 브리트 커피 시음"},
        {day:"금", am:"마리옷 로스수에뇨스 골프", pm:"해안 리조트 레스토랑"},
        {day:"토", am:"토르투게로 거북이 방류 투어", pm:"카리브해 해변 1박"},
        {day:"일", am:"자유 시간", pm:"에스카수 카페·독서 힐링"}
      ],
      lodging: "에스카수(Escazu) 또는 산타아나(Santa Ana) 게이티드 콤플렉스 콘도(월 $700~1,000). 경비원·수영장·헬스장 24시간 포함이 필수. 치안을 위해 반드시 경비 단지 선택.",
      tips: "① Pensionado 비자: 월 $1,000 연금 증명 → 10년 거주권 + 의료·교통 20% 할인 · ② 코스타리카 전기차 보급률 중미 1위, 우버 전기차 이용 가능 · ③ 스페인어 기초 앱(듀오링고) 3개월 준비 추천 · ④ 치안: 에스카수는 안전, 산호세 시내 혼잡 지역 야간 주의 · ⑤ 항공: LA↔산호세 아메리칸항공 직항 4시간, 인천→LA→산호세 환승 추천"
    }
  },

  golfTour: [
    {"region":"제주도 (국내)","feature":"약 30개 코스 밀집, 산악·해안 코스 혼재, 클럽하우스 식사 포함 문화","monthlyCost":1450000,"tips":"명문 코스 다수이나 고비용(카트비+캐디피 필수). 비성수기(1~2월) 50% 할인권 활용"},
    {"region":"태국 치앙마이","feature":"고지대(해발350m) 서늘한 기후, 7박9일 무제한 패키지 109만원대, 캐디 포함","monthlyCost":550000,"tips":"장박 시 회당 5~6만원까지 절감 가능. 겨울(11~4월) 건기가 최적 시즌"},
    {"region":"베트남 다낭","feature":"야간 라운드 정착 문화, 캐디팁 약 2.7만원, BRG·바나힐스 등 세계적 코스","monthlyCost":700000,"tips":"오전 휴양 + 오후 야간 라운드로 혹서기 대응. 한국인 커뮤니티 거대"},
    {"region":"일본 미야자키","feature":"노캐디 2인 셀프 플레이, 아오시마GC·피닉스CC 해안 코스, 연중 온화 기후","monthlyCost":1600000,"tips":"렌터카 이동형 시내 휴양골프. 미야자키 소고기(와규)와 현지 음식 수준 높음"},
    {"region":"말레이시아 조호바루","feature":"싱가포르 코즈웨이 코앞, 무제한 월 멤버십 RM2,500, 30개+ 코스","monthlyCost":600000,"tips":"싱가포르 그린피의 1/3. 골프 후 싱가포르 가서 쇼핑·맛집 황금 조합"},
    {"region":"미국 하와이·골드코스트","feature":"대중제 평균 그린피 46만원, PGA급 코스, 비즈니스석 패키지 연계","monthlyCost":4500000,"tips":"가성비보다 경험 가치 중심. 크루즈 골프 패키지 또는 올인클루시브 선택"}
  ],

  seasonalPicks: {
    "봄": {"domestic": ["제주 성산","전북 전주","전남 강진","경남 남해"], "overseas": ["베트남 다낭","체코 프라하","포르투갈 리스본","멕시코 멕시코시티"]},
    "여름": {"domestic": ["강원 강릉","부산 해운대","전북 부안","경북 포항"], "overseas": ["인도네시아 발리","조지아 바투미","호주 브리즈번","캐나다 밴쿠버"]},
    "가을": {"domestic": ["제주 서귀포","경북 안동","전남 목포","충남 태안"], "overseas": ["일본 후쿠오카","조지아 트빌리시","헝가리 부다페스트","대만 타이베이"]},
    "겨울": {"domestic": ["제주 대정","제주 남원","강원 화천"], "overseas": ["태국 치앙마이","말레이시아 쿠알라룸푸르","스페인 카나리아 테네리페"]}
  }
};
