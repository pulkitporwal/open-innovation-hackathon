"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import TextSlidePreview from "@/components/slides/text-slide-preview"
import ImageSlidePreview from "@/components/slides/image-slide-preview"
import ModelSlidePreview from "@/components/slides/model-slide-preview"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Slide = {
  id: string
  type: "text" | "image" | "3d"
  content: any
}

interface SlideEditorProps {
  slide: Slide
  onUpdate: (updatedSlide: Slide) => void
}

export default function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const [activeTab, setActiveTab] = useState("preview")

  const handleContentChange = (key: string, value: any) => {
    const updatedSlide = {
      ...slide,
      content: {
        ...slide.content,
        [key]: value,
      },
    }
    onUpdate(updatedSlide)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>

        <TabsContent
          value="preview"
          className="min-h-[400px] rounded-lg border border-slate-200 p-6 dark:border-slate-800"
        >
          {slide.type === "text" && <TextSlidePreview content={slide.content} />}
          {slide.type === "image" && <ImageSlidePreview content={slide.content} />}
          {slide.type === "3d" && <ModelSlidePreview content={slide.content} />}
        </TabsContent>

        <TabsContent value="edit" className="space-y-4">
          {slide.type === "text" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Slide Title</Label>
                <Input
                  id="title"
                  value={slide.content.title}
                  onChange={(e) => handleContentChange("title", e.target.value)}
                  placeholder="Enter slide title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Slide Content</Label>
                <Textarea
                  id="body"
                  value={slide.content.body}
                  onChange={(e) => handleContentChange("body", e.target.value)}
                  placeholder="Enter slide content"
                  rows={5}
                />
              </div>
            </>
          )}

          {slide.type === "image" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="src">Image URL</Label>
                <Input
                  id="src"
                  value={slide.content.src}
                  onChange={(e) => handleContentChange("src", e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={slide.content.alt}
                  onChange={(e) => handleContentChange("alt", e.target.value)}
                  placeholder="Enter alt text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={slide.content.caption}
                  onChange={(e) => handleContentChange("caption", e.target.value)}
                  placeholder="Enter caption"
                />
              </div>
            </>
          )}

          {slide.type === "3d" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="modelUrl">3D Model URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="modelUrl"
                    value={slide.content.modelUrl}
                    onChange={(e) => handleContentChange("modelUrl", e.target.value)}
                    placeholder="Enter 3D model URL (.glb or .gltf)"
                  />
                  <Link href="/models" target="_blank">
                    <Button variant="outline" type="button">
                      Browse
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-500">Upload models in the 3D Model Library and copy their path</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={slide.content.caption}
                  onChange={(e) => handleContentChange("caption", e.target.value)}
                  placeholder="Enter caption"
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
