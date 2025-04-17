"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import TextSlidePreview from "@/components/slides/text-slide-preview"
import ImageSlidePreview from "@/components/slides/image-slide-preview"
import ModelSlidePreview from "@/components/slides/3d-model-preview"
import Link from "next/link"
import { toast } from "sonner"

type Slide = {
  id: string
  type: "text" | "image" | "3d"
  content: any
}

export default function PresentationPage() {
  const params = useParams()
  const router = useRouter()
  const presentationId = params.id as string

  const [title, setTitle] = useState("")
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/presentations/${presentationId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch presentation")
        }

        const data = await response.json()
        setTitle(data.title)
        setSlides(data.slides)
      } catch (error) {
        console.error("Error fetching presentation:", error)
        toast.error("Failed to load presentation")
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    if (presentationId) {
      fetchPresentation()
    }
  }, [presentationId, router])

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goToNextSlide()
      } else if (e.key === "ArrowLeft") {
        goToPreviousSlide()
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false)
        }
      } else if (e.key === "f") {
        toggleFullscreen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlideIndex, slides.length, isFullscreen])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">No slides found</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            This presentation doesn't have any slides yet.
          </p>
          <Link
            href={`/edit/${presentationId}`}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to editor
          </Link>
        </div>
      </div>
    )
  }

  const currentSlide = slides[currentSlideIndex]

  const renderSlide = (slide: Slide) => {
    switch (slide.type) {
      case "text":
        return <TextSlidePreview content={slide.content} />
      case "image":
        return <ImageSlidePreview content={slide.content} />
      case "3d":
        return <ModelSlidePreview content={slide.content} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-950">
      {/* Controls */}
      <div
        className={`flex items-center justify-between p-4 transition-opacity ${isFullscreen ? "opacity-0 hover:opacity-100" : ""}`}
      >
        <Link
          href={`/edit/${presentationId}`}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
          <span>Exit</span>
        </Link>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          {title} - Slide {currentSlideIndex + 1} of {slides.length}
        </div>

        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>

      {/* Slide Content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {renderSlide(currentSlide)}
        </div>
      </div>

      {/* Navigation */}
      <div
        className={`flex items-center justify-between p-4 transition-opacity ${isFullscreen ? "opacity-0 hover:opacity-100" : ""}`}
      >
        <Button variant="outline" onClick={goToPreviousSlide} disabled={currentSlideIndex === 0} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button onClick={goToNextSlide} disabled={currentSlideIndex === slides.length - 1} className="gap-2">
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
