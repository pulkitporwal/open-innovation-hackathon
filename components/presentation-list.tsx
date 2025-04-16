"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, ExternalLink, Clock } from "lucide-react"

type Presentation = {
  id: string
  title: string
  slides: number
  lastEdited: string
}

export default function PresentationList() {
  const [presentations, setPresentations] = useState<Presentation[]>([])

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    setPresentations([
      {
        id: "1",
        title: "Q2 Business Review",
        slides: 12,
        lastEdited: "2 hours ago",
      },
      {
        id: "2",
        title: "Product Launch Strategy",
        slides: 8,
        lastEdited: "Yesterday",
      },
      {
        id: "3",
        title: "3D Model Showcase",
        slides: 5,
        lastEdited: "3 days ago",
      },
    ])
  }, [])

  const handleDelete = (id: string) => {
    setPresentations(presentations.filter((p) => p.id !== id))
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-200">Your Presentations</h2>

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
                <CardTitle className="line-clamp-1">{presentation.title}</CardTitle>
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
                    onClick={() => handleDelete(presentation.id)}
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
