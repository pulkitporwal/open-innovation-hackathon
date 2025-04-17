"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Edit, Trash2, ExternalLink, Clock } from "lucide-react"

type PresentationItem = {
  id: string
  title: string
  slides: number
  lastEdited: string
}

export default function PresentationList() {
  const [presentations, setPresentations] = useState<PresentationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const res = await fetch("/api/presentations")
        if (!res.ok) throw new Error("Failed to fetch presentations")
        const data: any[] = await res.json()

        // Map the raw DB documents into our UI shape
        const mapped = data.map((p) => ({
          id: p._id as string,
          title: p.title as string,
          slides: Array.isArray(p.slides) ? p.slides.length : 0,
          lastEdited: new Date(p.updatedAt).toLocaleString(),
        }))

        setPresentations(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPresentations()
  }, [])

  if (loading) {
    return <p>Loading your presentations…</p>
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-200">
        Your Presentations
      </h2>

      {presentations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            You don't have any presentations yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {presentations.map((presentation) => (
            <Card key={presentation.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {presentation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <span>{presentation.slides} slides</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{presentation.lastEdited}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/edit/${presentation.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Link href={`/present/${presentation.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Present
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() =>
                      setPresentations((prev) =>
                        prev.filter((p) => p.id !== presentation.id)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
