import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { articles } from "@/lib/articles"
import { Button } from "@/components/ui/button"

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  const article = articles.find((a) => a.id === id)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">뒤로 가기</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="pt-16">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-8">
            {/* Article Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-secondary font-medium">{article.category}</span>
                </div>
                <span className="text-secondary font-medium">{article.source}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">{article.title}</h1>

              <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Article Footer */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{article.source}</span> 에서 보도
                </div>
                <Button variant="outline" asChild>
                  <Link href="/">목록으로 돌아가기</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
