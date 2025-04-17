"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2, Sparkles, FileText, Image as ImageIcon } from "lucide-react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface AIPrompt {
  title: string
  description: string
  prompt: string
}

interface AIPanelProps {
  onGenerateSlide: (prompt: string) => void
  onGenerateImage?: (imageData: { src: string; alt: string; caption: string }) => void
}

export default function AIPanel({ onGenerateSlide, onGenerateImage }: AIPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("slides")

  const promptTemplates: Record<string, AIPrompt[]> = {
    slides: [
      {
        title: "Generate Slide Content",
        description: "Create content for a new slide based on your topic",
        prompt: "Create a slide about [topic]",
      },
      {
        title: "Outline Presentation",
        description: "Generate a complete presentation outline",
        prompt: "Create an outline for a presentation about [topic] with 5-7 slides",
      },
    ],
    visuals: [
      {
        title: "Suggest Images",
        description: "Get image suggestions for your slides",
        prompt: "Suggest images for a presentation about [topic]",
      },
    ],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      if (activeTab === "visuals" && onGenerateImage) {
        const response = await fetch("/api/slides/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate image")
        }

        const imageData = await response.json()
        onGenerateImage(imageData)
        toast.success("Image generated successfully!")
      } else {
        onGenerateSlide(prompt)
      }
      setPrompt("")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const useTemplate = useCallback(
    (template: AIPrompt) => {
      setPrompt(template.prompt)
    },
    [setPrompt],
  )

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AI Presentation Assistant</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Use AI to generate content, get ideas, or enhance your presentation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder={
                    activeTab === "slides"
                      ? "Describe the slide you want to create..."
                      : "Describe the image you want to generate..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {activeTab === "slides" ? (
                        <>
                          <Wand2 className="h-4 w-4" />
                          Generate Slide
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Prompt Templates</CardTitle>
              <CardDescription>Quick prompts to help you get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="slides" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    Slides
                  </TabsTrigger>
                  <TabsTrigger value="visuals" className="flex-1 gap-2">
                    <Sparkles className="h-4 w-4" />
                    Visuals
                  </TabsTrigger>
                </TabsList>

                {Object.entries(promptTemplates).map(([key, templates]) => (
                  <TabsContent key={key} value={key} className="mt-4 space-y-3">
                    {templates.map((template, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-lg border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                        onClick={() => useTemplate(template)}
                      >
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
