export interface ContentBlock {
  type: 'paragraph' | 'image'
  content: string
  alt?: string
}

export interface ImageMapping {
  blockIndex: number
  imageUrl: string
  alt?: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  contentBlocks: ContentBlock[]
  imageMappings?: ImageMapping[]
  source: string
  date: string
  imageUrl: string
  category: string
}

export const articles: Article[] = [
  {
    id: "1",
    title: "45세가 가장 부자? 통계로 밝혀진 '영포티' 소비력의 비밀",
    excerpt: "40대 소비력의 비밀, 통계로 밝혀진 '영포티' 현상",
    contentBlocks: [
      {
        type: 'paragraph',
        content: "'영포티(Young Forty)'라 불리는 40대들이 명품 브랜드와 스트리트 패션에 열광하는 현상이 최근 주목받고 있습니다."
      },
      {
        type: 'paragraph',
        content: "이들은 구찌 같은 고가 브랜드부터 최신 아이폰17까지 과감한 소비를 보여주고 있는데요. 이러한 소비 패턴에는 경제적 배경이 있었습니다."
      },
      {
        type: 'image',
        content: '/1.webp',
        alt: '온라인 커뮤니티'
      },
      {
        type: 'paragraph',
        content: "통계청이 25일 발표한 '2023년 국민이전계정'에 따르면, 한국인은 45세에 인생에서 가장 많은 흑자인 1747만 원을 기록하는 것으로 나타났습니다. 이 시기 1인당 노동소득은 4433만 원으로 정점을 찍게 됩니다. 국민이전계정은 소비와 노동소득 관계를 분석해 연령별 경제적 자원 흐름을 보여주는 통계로, 경제적으로 가장 여유로운 시기가 40대 중반임을 명확히 보여주고 있습니다."
      },
      {
        type: 'paragraph',
        content: "영포티 브랜드의 부상과 변화하는 인식"
      },
      {
        type: 'paragraph',
        content: `불과 10여 년 전만 해도 '영포티'는 구매력을 앞세운 젊은 40대의 상징으로 긍정적인 의미를 가졌습니다. 그러나 최근에는 "꼴불견", "늙은 티"라는 조롱 섞인 멸칭으로 변질되었습니다.`
      },
      {
        type: 'paragraph',
        content: `온라인 커뮤니티에서는 이들이 즐겨 입는 브랜드를 모아 만든 '영포티 브랜드' 목록이 공유되고 있습니다.`
      },
      {
        type: 'paragraph',
        content: `뉴에라 모자, 슈프림·스투시·우영미 티셔츠, 나이키 농구화 등 한때 '힙'했던 아이템들이 지금은 '아저씨 전유물'로 인식되고 있으며, 최근에는 라부부와 오렌지색 아이폰17까지 이 명단에 합류했습니다.`
      },
      {
        type: 'image',
        content: '/2.webp',
        alt: '온라인 커뮤니티'
      },

      {
        type: 'paragraph',
        content: `통계청 자료에 따르면, 한국인은 16세에 1인당 소비가 4418만 원으로 가장 많아 적자 폭이 최대치(-4418만 원)에 이르고, 28세부터 흑자로 전환됩니다.`
      },
      {
        type: 'paragraph',
        content: `이후 45세에 흑자가 최고점에 도달하고 61세부터는 다시 적자로 돌아서게 됩니다. 이러한 경제적 흐름을 고려하면, 주머니가 가장 두둑한 40대 중반이 중고가 브랜드를 소비하는 것은 자연스러운 현상이라고 볼 수 있습니다.`
      },

      {
        type: 'paragraph',
        content: `세대 간 갈등으로 번지는 소비 문화
      `
      },
      {
        type: 'paragraph',
        content: "영포티란 용어가 처음 등장한 2010년대 중반에는 '중년 같지 않은 소비력과 패션 감각'을 자랑하는 세대로 긍정적인 평가를 받았습니다."
      },
      {
        type: 'paragraph',
        content: `기업들도 이들을 '소비 블루칩'으로 평가하며 패션·뷰티 모델로 적극 활용했습니다. 그러나 최근에는 비싼 명품을 걸쳐도 볼품없고, 젊은 척하는 40대를 비꼬는 멸칭으로 변질되었습니다.`
      },
       {
        type: 'image',
        content: '/img_20250926143510_gi27g0i4.webp',
        alt: '온라인 커뮤니티'
      },
      {
        type: 'paragraph',
        content: `이달 21일 빅데이터 분석 플랫폼 썸트렌드에 따르면, 최근 1년간 '영포티' 온라인 언급량은 10만4160건에 달했고, 이 중 부정적 언급 비율이 55.9%로 긍정(37.6%)을 크게 웃돌았습니다.`
      },

      {
        type: 'paragraph',
        content: `'욕하다', '늙다', '역겹다' 같은 부정 키워드가 상위권을 차지했습니다.`
      },
    ],
    imageMappings: [
      {
        blockIndex: 15,  // 6번째 블록 ("'영포티'는 2010년대에..." 문단)
        imageUrl: '/dae12269-8193-479f-bfec-244ad10c9758.jpg',
        alt: '영포티 인식 변화 차트'
      }
    ],
    source: "더바이럴 뉴스",
    date: "2025년 1월 15일",
    imageUrl: "/img_20250926143510_gi27g0i4.webp",
    category: "영포티",
  },
  {
    id: "2",
    title: "글로벌 기후 정상회의, 탄소 중립 목표 앞당기기로 합의",
    excerpt: "세계 각국 정상들이 기후 위기 대응을 위한 구체적인 행동 계획에 합의했습니다.",
    contentBlocks: [
      {
        type: 'paragraph',
        content: "오늘 폐막한 글로벌 기후 정상회의에서 참가국들이 탄소 중립 달성 목표를 기존보다 5년 앞당기기로 합의했습니다."
      },
      {
        type: 'paragraph',
        content: "이번 회의에는 150개국 이상의 정상과 환경 장관들이 참석했으며, 기후 위기 대응을 위한 실질적인 행동 계획을 논의했습니다. 주요 합의 사항으로는 재생에너지 투자 확대, 화석연료 사용 단계적 축소, 그린 테크놀로지 개발 지원 등이 포함되었습니다."
      },
      {
        type: 'paragraph',
        content: "특히 선진국들은 개발도상국의 기후 대응을 지원하기 위한 기금을 대폭 증액하기로 약속했습니다. 이는 전 세계적으로 공평한 기후 행동을 실현하기 위한 중요한 발걸음으로 평가받고 있습니다."
      },
      {
        type: 'paragraph',
        content: "환경 단체들은 이번 합의를 환영하면서도, 실제 이행이 중요하다는 점을 강조했습니다. 앞으로 각국의 구체적인 실행 계획과 진행 상황이 주목받을 것으로 보입니다."
      }
    ],
    source: "GlobalNews",
    date: "2025년 1월 14일",
    imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=800&fit=crop",
    category: "환경",
  },
  {
    id: "3",
    title: "한국 스타트업, 글로벌 시장에서 혁신상 수상",
    excerpt: "국내 핀테크 스타트업이 세계 최대 기술 박람회에서 혁신 기업으로 선정되었습니다.",
    contentBlocks: [
      {
        type: 'paragraph',
        content: "한국의 핀테크 스타트업 '페이노베이션'이 세계 최대 기술 박람회 CES에서 혁신상을 수상하며 글로벌 시장에서의 위상을 높였습니다."
      },
      {
        type: 'paragraph',
        content: "페이노베이션은 블록체인 기술을 활용한 초소액 결제 시스템으로 주목받았습니다. 이 시스템은 기존 결제 방식보다 수수료가 90% 이상 낮으면서도 보안성이 뛰어나다는 평가를 받았습니다."
      },
      {
        type: 'paragraph',
        content: "회사 관계자는 \"개발도상국에서 금융 서비스 접근성이 낮은 사람들에게 실질적인 도움을 줄 수 있는 기술\"이라며 \"올해 아시아와 아프리카 시장 진출을 본격화할 계획\"이라고 밝혔습니다."
      },
      {
        type: 'paragraph',
        content: "업계에서는 이번 수상이 한국 스타트업 생태계의 성장을 보여주는 사례라고 평가하고 있습니다. 정부도 우수 스타트업의 해외 진출을 적극 지원할 방침입니다."
      }
    ],
    source: "BusinessToday",
    date: "2025년 1월 13일",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=800&fit=crop",
    category: "비즈니스",
  },
  {
    id: "4",
    title: "전기차 배터리 기술 혁신, 충전 시간 10분으로 단축",
    excerpt: "새로운 고속 충전 기술이 전기차 보급 확대의 전환점이 될 전망입니다.",
    contentBlocks: [
      {
        type: 'paragraph',
        content: "한 연구팀이 전기차를 단 10분 만에 완전 충전할 수 있는 혁신적인 배터리 기술을 개발했습니다."
      },
      {
        type: 'paragraph',
        content: "이 기술은 새로운 리튬 이온 배터리 구조를 사용하여 충전 속도를 획기적으로 개선했습니다. 기존 고속 충전이 30분 이상 걸렸던 것에 비해 3배 이상 빨라진 것입니다."
      },
      {
        type: 'paragraph',
        content: "연구를 주도한 김 교수는 \"배터리 수명이나 안정성은 유지하면서도 충전 시간만 대폭 단축한 것이 핵심\"이라며 \"2년 내 상용화가 가능할 것\"으로 내다봤습니다."
      },
      {
        type: 'paragraph',
        content: "자동차 업계는 이 기술이 전기차의 가장 큰 단점으로 지적되던 충전 시간 문제를 해결할 수 있을 것으로 기대하고 있습니다. 여러 완성차 업체들이 이미 기술 도입을 검토 중인 것으로 알려졌습니다."
      }
    ],
    source: "TechNews",
    date: "2025년 1월 12일",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=800&fit=crop",
    category: "기술",
  },
  {
    id: "5",
    title: "메타버스 교육 플랫폼, 전국 100개 학교 도입",
    excerpt: "가상현실 기반 교육이 본격적으로 학교 현장에 적용되기 시작했습니다.",
    contentBlocks: [
      {
        type: 'paragraph',
        content: "교육부가 메타버스 기반 교육 플랫폼을 전국 100개 학교에 시범 도입한다고 발표했습니다."
      },
      {
        type: 'paragraph',
        content: "이 플랫폼은 학생들이 가상현실 환경에서 역사적 사건을 체험하거나 과학 실험을 진행할 수 있도록 설계되었습니다. 특히 위험하거나 비용이 많이 드는 실험을 안전하게 체험할 수 있다는 장점이 있습니다."
      },
      {
        type: 'paragraph',
        content: "시범 운영에 참여하는 한 교사는 \"학생들의 몰입도와 이해도가 기존 수업에 비해 크게 향상되었다\"며 \"특히 집중력이 낮은 학생들도 적극적으로 참여하는 모습을 볼 수 있었다\"고 말했습니다."
      },
      {
        type: 'paragraph',
        content: "교육부는 시범 운영 결과를 분석한 후 단계적으로 확대 적용할 계획입니다. 다만 장비 구입 비용과 교사 교육 등 해결해야 할 과제도 있다는 지적입니다."
      }
    ],
    source: "EduNews",
    date: "2025년 1월 11일",
    imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&h=800&fit=crop",
    category: "교육",
  },
]
