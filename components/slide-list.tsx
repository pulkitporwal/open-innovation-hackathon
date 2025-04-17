"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Type, ImageIcon as Image, CuboidIcon as Cube, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Slide {
  id: string
  type: "text" | "image"
  content: {
    title?: string
    body?: string
    src?: string
    alt?: string
    caption?: string
    modelUrl?: string
  }
  order: number
}

interface SlideListProps {
  slides: Slide[]
  currentIndex: number
  onSelectSlide: (index: number) => void
  onRemoveSlide?: (index: number) => void
}

export default function SlideList({ slides, currentIndex, onSelectSlide, onRemoveSlide }: SlideListProps) {
  if (!slides || slides.length === 0) {
    return (
      <Alert variant="default" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No slides available. Use the AI panel to generate your first slide!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-2">
      {slides.map((slide, index) => (
        <Card
          key={slide.id || `slide-${index}`}
          className={`cursor-pointer transition-colors ${
            currentIndex === index
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          onClick={() => onSelectSlide(index)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {slide.content?.title || `Slide ${index + 1}`}
                </h4>
                <p className="text-xs text-slate-500">
                  {slide.type ? slide.type.charAt(0).toUpperCase() + slide.type.slice(1) + " Slide" : "Unknown Slide Type"}
                </p>
              </div>
              {onRemoveSlide && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveSlide(index)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
