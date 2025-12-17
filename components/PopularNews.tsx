import Image from "next/image"

interface NewsItem {
  id: number
  title: string
  image: string
}

const popularNewsData: NewsItem[] = [
  {
    id: 1,
    title: "【클릭' 증시】美 금리인하 가능성 높아져..국장",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/99822_234831_150_v150.jpg"
  },
  {
    id: 2,
    title: "【클릭' 증시】4100선 회복한 코스피..외국인·기",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/99858_234863_356_v150.jpg"
  },
  {
    id: 3,
    title: "[SK그룹 임원인사] 최태원 회장은 '강소화·젊은'",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/99826_234833_5737_v150.jpg"
  },
  {
    id: 4,
    title: "'희장남' 정기선의 HD현대 미래성장 로드맵",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/99824_234832_226_v150.jpg"
  },
  {
    id: 5,
    title: "[현장 포토] 비상계엄 1주년 '내란정산 시민대행'",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/99810_234804_1612_v150.jpg"
  },
  {
    id: 6,
    title: "【클릭' 증시】기대감 꽃피는 한·미 증시..테마주",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/100081_235120_289_v150.jpg"
  },
  {
    id: 7,
    title: "젊은 희장님 시대..대기업 오너家 승진 가속",
    image: "https://cdn.00news.co.kr/news/thumbnail/202512/99930_234945_5420_v150.jpg"
  }
]

export function PopularNews() {
  return (
    <aside className="w-full">
      <div className="fixed top-24 w-80 space-y-4">
        {/* 타이틀 */}
        <h2 className="text-xl font-bold text-orange-500">인기뉴스</h2>

        {/* 뉴스 리스트 */}
        <div className="space-y-3">
          {popularNewsData.map((news) => (
            <div
              key={news.id}
              className="flex items-center gap-3 pb-3 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors rounded-sm px-2 py-1 cursor-pointer"
            >
              {/* 번호 + 제목 */}
              <div className="flex-1 flex gap-3 items-start">
                <span className="text-lg font-semibold text-orange-500 min-w-[24px]">
                  {news.id}
                </span>
                <p className="text-sm leading-relaxed line-clamp-2">
                  {news.title}
                </p>
              </div>

              {/* 썸네일 */}
              <div className="relative w-20 h-14 flex-shrink-0 rounded overflow-hidden bg-muted">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
