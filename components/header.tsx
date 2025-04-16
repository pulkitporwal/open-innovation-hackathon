import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, CuboidIcon as Cube } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          AI Presentation Maker
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/models">
            <Button variant="ghost" className="gap-2">
              <Cube className="h-5 w-5" />
              3D Models
            </Button>
          </Link>
          <Link href="/create">
            <Button className="gap-2">
              <PlusCircle className="h-5 w-5" />
              New Presentation
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
