"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Play, ArrowLeft, LayoutGrid, Type, ImageIcon, CuboidIcon as Cube, Wand2 } from "lucide-react"
import Link from "next/link"
import SlideEditor from "@/components/slide-editor"
import SlideList from "@/components/slide-list"
import AIPanel from "@/components/ai-panel"
import Header from "@/components/header"

type Slide = {
  id: string
  type: "text" | "image"
  content: any
}

export default function EditPresentationPage() {
  const params = useParams()
  const router = useRouter()
  const presentationId = params.id as string

  const [title, setTitle] = useState("Untitled Presentation")
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("editor")

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    if (presentationId === "new-presentation") {
      setTitle("New Presentation")
      setSlides([
        {
          id: "slide-1",
          type: "text",
          content: {
            title: "Welcome to Your Presentation",
            body: "Click to edit this text and start creating your presentation.",
          },
        },
      ])
    } else {
      // Fetch existing presentation data
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
      ])
    }
  }, [presentationId])

  const addNewSlide = (type: "text" | "image") => {
    const newSlide: Slide = {
      id: `slide-${slides.length + 1}`,
      type,
      content:
        type === "text"
          ? { title: "New Slide", body: "Add your content here" }
          : { src: "/placeholder.svg?height=400&width=600", alt: "Image", caption: "Image caption" },
    }

    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  const updateSlide = (index: number, updatedSlide: Slide) => {
    const newSlides = [...slides]
    newSlides[index] = updatedSlide
    setSlides(newSlides)
  }

  const handleSave = async () => {
    // In a real app, this would save to a database
    console.log("Saving presentation:", { title, slides })
    // Show success message or redirect
  }

  const handlePresent = () => {
    router.push(`/present/${presentationId}`)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <Header />
      <div className="container flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none bg-transparent text-xl font-semibold focus:outline-none focus:ring-0"
            placeholder="Untitled Presentation"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/models">
            <Button variant="outline" size="sm" className="gap-1">
              <Cube className="h-4 w-4" />
              3D Models
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-1">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={handlePresent} className="gap-1">
            <Play className="h-4 w-4" />
            Present
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide Thumbnails Sidebar */}
        <div className="w-64 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Slides</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => addNewSlide("text")} title="Add Text Slide">
                <Type className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => addNewSlide("image")} title="Add Image Slide">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <SlideList slides={slides} currentIndex={currentSlideIndex} onSelectSlide={setCurrentSlideIndex} />
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
              <div className="container flex items-center px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="editor" className="gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="gap-2">
                    <Wand2 className="h-4 w-4" />
                    AI Assistant
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="editor" className="h-[calc(100%-48px)] overflow-auto p-6">
              {slides.length > 0 && (
                <SlideEditor
                  slide={slides[currentSlideIndex]}
                  onUpdate={(updatedSlide) => updateSlide(currentSlideIndex, updatedSlide)}
                />
              )}
            </TabsContent>

            <TabsContent value="ai" className="h-[calc(100%-48px)] overflow-auto">
              <AIPanel
                onGenerateContent={(content) => {
                  // In a real app, this would generate content based on AI suggestions
                  console.log("Generated content:", content)
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
