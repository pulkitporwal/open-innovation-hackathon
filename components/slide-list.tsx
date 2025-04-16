"use client"

import { Card } from "@/components/ui/card"
import { Type, ImageIcon as Image, CuboidIcon as Cube } from "lucide-react"

type Slide = {
  id: string
  type: "text" | "image" | "3d"
  content: any
}

interface SlideListProps {
  slides: Slide[]
  currentIndex: number
  onSelectSlide: (index: number) => void
}

export default function SlideList({ slides, currentIndex, onSelectSlide }: SlideListProps) {
  return (
    <div className="space-y-2">
      {slides.map((slide, index) => (
        <Card
          key={slide.id}
          className={`cursor-pointer p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
            index === currentIndex ? "ring-2 ring-slate-900 dark:ring-slate-400" : ""
          }`}
          onClick={() => onSelectSlide(index)}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded bg-white dark:bg-slate-800">
            {/* Slide thumbnail preview */}
            <div className="flex h-full w-full items-center justify-center p-2 text-xs">
              {slide.type === "text" && (
                <div className="space-y-1 text-center">
                  <p className="line-clamp-1 font-medium">{slide.content.title}</p>
                  <p className="line-clamp-2 text-[0.6rem] text-slate-500 dark:text-slate-400">{slide.content.body}</p>
                </div>
              )}

              {slide.type === "image" && (
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
              )}

              {slide.type === "3d" && (
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cube className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Slide type indicator */}
            <div className="absolute bottom-1 right-1 rounded-full bg-slate-200 p-1 dark:bg-slate-700">
              {slide.type === "text" && <Type className="h-3 w-3" />}
              {slide.type === "image" && <Image className="h-3 w-3" />}
              {slide.type === "3d" && <Cube className="h-3 w-3" />}
            </div>
          </div>

          <div className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">Slide {index + 1}</div>
        </Card>
      ))}
    </div>
  )
}
