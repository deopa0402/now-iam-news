import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-full" />
          <span className="text-lg font-semibold tracking-tight">나지금</span>
        </Link>

        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
          <span className="sr-only">메뉴</span>
        </Button>
      </div>
    </header>
  )
}
