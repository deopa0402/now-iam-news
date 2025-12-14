import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { articles } from "@/lib/articles"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="h-screen pt-16 overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </main>
    </div>
  )
}
