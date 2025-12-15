import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { Article } from "@/lib/articles"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="h-screen w-full snap-start snap-always flex items-center justify-center px-4 pt-42 pb-24 bg-background">
      <Link href={`/article/${article.id}`} className="group max-w-5xl w-full">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-4 bg-background relative z-10">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="uppercase tracking-wider">{article.date}</span>
            <span>•</span>
            <span className="text-secondary font-medium">{article.source}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-balance group-hover:text-secondary transition-colors">
            {article.title}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">{article.excerpt}</p>

          <div className="flex items-center gap-2 text-foreground group-hover:text-secondary transition-colors">
            <span className="font-medium">자세히 보기</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  )
}
