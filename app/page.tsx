import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import PresentationList from "@/components/presentation-list"
import Header from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl">
            AI Presentation Maker
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Create stunning presentations with AI-generated content and 3D models
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/create">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                New Presentation
              </Button>
            </Link>
          </div>
        </div>

        <PresentationList />
      </div>
    </div>
  )
}
