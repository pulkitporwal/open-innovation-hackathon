"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus } from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { themes, layouts } from "./slides/slide-themes"
import ModelSlidePreview from "./slides/3d-model-preview"

interface Slide {
  id: string
  type: "text" | "image" | "3d"
  content: {
    title?: string
    body?: string
    src?: string
    alt?: string
    caption?: string
    theme?: string
    layout?: string
    modelUrl?: string
  }
  order: number
}

interface SlideEditorProps {
  slide: Slide
  onUpdate: (slide: Slide) => void
  onAddSlide: (type: "text" | "image" | "3d") => void
}

export default function SlideEditor({ slide, onUpdate, onAddSlide }: SlideEditorProps) {
  const handleChange = (field: keyof Slide["content"], value: string) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    })
  }

  const renderSlideEditor = () => {
    switch (slide.type) {
      case "text":
        return (
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <Input
                value={slide.content?.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Slide Title"
                className="text-2xl font-bold"
              />
              <Textarea
                value={slide.content?.body || ""}
                onChange={(e) => handleChange("body", e.target.value)}
                placeholder="Slide Content"
                className="min-h-[300px] text-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select
                    value={slide.content?.theme || "Default"}
                    onValueChange={(value) => handleChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.name} value={theme.name}>
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${theme.colors.background.split(' ')[0]}`} />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Layout</label>
                  <Select
                    value={slide.content?.layout || "Centered"}
                    onValueChange={(value) => handleChange("layout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem key={layout.name} value={layout.name}>
                          {layout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "image":
        return (
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <Input
                value={slide.content?.src || ""}
                onChange={(e) => handleChange("src", e.target.value)}
                placeholder="Image URL"
                className="text-lg"
              />
              <Input
                value={slide.content?.alt || ""}
                onChange={(e) => handleChange("alt", e.target.value)}
                placeholder="Image Alt Text"
                className="text-lg"
              />
              <Textarea
                value={slide.content?.caption || ""}
                onChange={(e) => handleChange("caption", e.target.value)}
                placeholder="Image Caption"
                className="text-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select
                    value={slide.content?.theme || "Default"}
                    onValueChange={(value) => handleChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.name} value={theme.name}>
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${theme.colors.background.split(' ')[0]}`} />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Layout</label>
                  <Select
                    value={slide.content?.layout || "Centered"}
                    onValueChange={(value) => handleChange("layout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem key={layout.name} value={layout.name}>
                          {layout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {slide.content?.src ? (
                <img
                  src={slide.content.src}
                  alt={slide.content.alt}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <Alert variant="default" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No image URL provided. Please add an image URL to display the image.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case "3d":
        return (
          <Card className="w-full">
            <CardContent className="p-6 space-y-4">
              <Input
                value={slide.content?.modelUrl || ""}
                onChange={(e) => handleChange("modelUrl", e.target.value)}
                placeholder="3D Model URL (GLTF/GLB)"
                className="text-lg"
              />
              <Textarea
                value={slide.content?.caption || ""}
                onChange={(e) => handleChange("caption", e.target.value)}
                placeholder="Model Caption"
                className="text-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select
                    value={slide.content?.theme || "Default"}
                    onValueChange={(value) => handleChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.name} value={theme.name}>
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${theme.colors.background.split(' ')[0]}`} />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Layout</label>
                  <Select
                    value={slide.content?.layout || "Centered"}
                    onValueChange={(value) => handleChange("layout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem key={layout.name} value={layout.name}>
                          {layout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {slide.content?.modelUrl ? (
                <div className="h-[400px] w-full rounded-lg border border-slate-200 dark:border-slate-800">
                  <ModelSlidePreview content={slide.content} />
                </div>
              ) : (
                <Alert variant="default" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No 3D model URL provided. Please add a GLTF/GLB model URL to display the 3D model.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className="w-full">
            <CardContent className="p-6">
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unknown slide type. Please select a valid slide type.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderSlideEditor()}
    </div>
  )
}