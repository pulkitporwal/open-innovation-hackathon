"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import TextSlidePreview from "@/components/slides/text-slide-preview"
import ImageSlidePreview from "@/components/slides/image-slide-preview"
import ModelSlidePreview from "@/components/slides/model-slide-preview"
import Link from "next/link"

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

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    setTitle("Product Launch Strategy")
    setSlides([
      {
        id: "slide-1",
        type: "text",
        content: {
          title: "Product Launch Strategy",
          body: "Q3 2023 - Marketing Team",
        },
      },
      {
        id: "slide-2",
        type: "image",
        content: {
          src: "/placeholder.svg?height=400&width=600",
          alt: "Product image",
          caption: "Our new flagship product",
        },
      },
      {
        id: "slide-3",
        type: "3d",
        content: {
          modelUrl: "/assets/3d/duck.glb",
          caption: "3D Product Visualization",
        },
      },
    ])
  }, [presentationId])

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

  if (slides.length === 0) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const currentSlide = slides[currentSlideIndex]

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
          Slide {currentSlideIndex + 1} of {slides.length}
        </div>

        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>

      {/* Slide Content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {currentSlide.type === "text" && <TextSlidePreview content={currentSlide.content} />}
          {currentSlide.type === "image" && <ImageSlidePreview content={currentSlide.content} />}
          {currentSlide.type === "3d" && <ModelSlidePreview content={currentSlide.content} />}
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
