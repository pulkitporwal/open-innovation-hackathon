"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2, Sparkles, FileText } from "lucide-react"

interface AIPrompt {
  title: string
  description: string
  prompt: string
}

interface AIPanelProps {
  onGenerateContent: (content: any) => void
}

export default function AIPanel({ onGenerateContent }: AIPanelProps) {
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
      {
        title: "3D Model Ideas",
        description: "Get ideas for 3D models to include",
        prompt: "Suggest 3D models that would enhance a presentation about [topic]",
      },
    ],
  }

  const handleGenerate = async () => {
    if (!prompt) return

    setIsGenerating(true)

    try {
      // In a real app, this would call an AI service
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response
      const mockContent = {
        title: "AI Generated Content",
        slides: [
          {
            type: "text",
            content: {
              title: "Introduction to the Topic",
              body: "This is an AI-generated slide about the requested topic.",
            },
          },
          {
            type: "text",
            content: {
              title: "Key Points",
              body: "• First important point\n• Second important point\n• Third important point",
            },
          },
        ],
      }

      onGenerateContent(mockContent)
    } catch (error) {
      console.error("Error generating content:", error)
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
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Describe what you want to create or ask for suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Create a presentation about renewable energy sources with 5 slides"
                className="min-h-[200px]"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={!prompt || isGenerating} className="w-full gap-2">
                <Wand2 className="h-4 w-4" />
                Generate
                {isGenerating && (
                  <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                )}
              </Button>
            </CardFooter>
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
