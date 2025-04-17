"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SlideList from "@/components/slide-list";
import AIPanel from "@/components/ai-panel";
import Header from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Wand2, Save, Play, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AlertCircle, Plus } from "lucide-react"
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";

const SlideEditor = dynamic(() => import("@/components/slide-editor"), {
  ssr: false,
});

interface Slide {
  id: string;
  type: "text" | "image" | "3d";
  content: {
    title?: string;
    body?: string;
    src?: string;
    alt?: string;
    caption?: string;
    modelUrl?: string;
    theme: string;
    layout: string;
  };
  order: number;
}

interface Presentation {
  _id: string;
  title: string;
  topic: string;
  slides: Slide[];
}

export default function EditPresentation({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [newSlideType, setNewSlideType] = useState<"text" | "image" | "3d">(
    "text"
  );

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await fetch(`/api/presentations/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch presentation");
        }
        const data = await response.json();
        setPresentation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load presentation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresentation();
  }, [params.id]);

  const handleUpdateSlide = async (updatedSlide: Slide) => {
    if (!presentation) return;

    try {
      const updatedSlides = [...presentation.slides];
      updatedSlides[currentSlideIndex] = updatedSlide;

      const response = await fetch(`/api/presentations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: updatedSlides,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update slide");
      }

      setPresentation({
        ...presentation,
        slides: updatedSlides,
      });

      toast.success("Slide updated successfully");
    } catch (err) {
      toast.error("Failed to update slide");
    }
  };

  const onAddSlide = async (slideType: "text" | "image" | "3d") => {
    if (!presentation) return;

    try {
      // Create the new slide with sample content based on type
      const newSlide: Slide = {
        id: uuidv4(),
        type: slideType,
        content: {},
        order: 0 // temporary order, will be updated below
      };

      // Add sample content based on slide type
      switch (slideType) {
        case "text":
          newSlide.content = {
            title: "New Slide Title",
            body: "Add your content here. This is a sample text slide. You can edit this content in the slide editor.",
            theme: "Default",
            layout: "Centered"
          };
          break;
        case "image":
          newSlide.content = {
            src: "",
            alt: "Image description",
            caption: "Add a caption for your image here",
            theme: "Default",
            layout: "Centered"
          };
          break;
        case "3d":
          newSlide.content = {
            modelUrl: "",
            caption: "Add a caption for your 3D model here"
          };
          break;
      }

      // Insert the new slide after the current slide
      const insertPosition = currentSlideIndex + 1;
      const updatedSlides = [...presentation.slides];
      updatedSlides.splice(insertPosition, 0, newSlide);

      // Update order for all slides
      const reorderedSlides = updatedSlides.map((slide, index) => ({
        ...slide,
        order: index
      }));

      // Save to the backend
      const response = await fetch(`/api/presentations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: reorderedSlides,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new slide");
      }

      // Update local state
      setPresentation({
        ...presentation,
        slides: reorderedSlides,
      });

      // Select the newly added slide
      setCurrentSlideIndex(insertPosition);
      toast.success("New slide added successfully");
    } catch (err) {
      toast.error("Failed to add new slide");
    }
  };

  const handleGenerateSlide = async (prompt: string) => {
    if (!presentation) return;

    try {
      const response = await fetch("/api/slides/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          topic: presentation.topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate slide");
      }

      const newSlide = await response.json();
      const updatedSlides = [
        ...presentation.slides,
        { ...newSlide, order: presentation.slides.length },
      ];

      const updateResponse = await fetch(`/api/presentations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: updatedSlides,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to add new slide");
      }

      setPresentation({
        ...presentation,
        slides: updatedSlides,
      });

      setCurrentSlideIndex(updatedSlides.length - 1);
      toast.success("New slide generated successfully");
    } catch (err) {
      toast.error("Failed to generate slide");
    }
  };

  const handleGenerateImage = async (imageData: {
    src: string;
    alt: string;
    caption: string;
  }) => {
    if (!presentation) return;

    const currentSlide = presentation.slides[currentSlideIndex];
    if (!currentSlide) return;

    const updatedSlide = {
      ...currentSlide,
      type: "image" as const,
      content: {
        ...currentSlide.content,
        src: imageData.src,
        alt: imageData.alt,
        caption: imageData.caption,
      },
    };

    await handleUpdateSlide(updatedSlide);
  };

  const handleRemoveSlide = async (index: number) => {
    if (!presentation) return;

    try {
      const updatedSlides = presentation.slides.filter((_, i) => i !== index);
      const reorderedSlides = updatedSlides.map((slide, i) => ({
        ...slide,
        order: i,
      }));

      const response = await fetch(`/api/presentations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slides: reorderedSlides,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove slide");
      }

      setPresentation({
        ...presentation,
        slides: reorderedSlides,
      });

      if (currentSlideIndex >= reorderedSlides.length) {
        setCurrentSlideIndex(reorderedSlides.length - 1);
      }

      toast.success("Slide removed successfully");
    } catch (err) {
      toast.error("Failed to remove slide");
    }
  };

  const handleSave = async () => {
    if (!presentation) return;

    try {
      const response = await fetch(`/api/presentations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: presentation.title,
          slides: presentation.slides,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save presentation");
      }

      toast.success("Presentation saved successfully");
    } catch (err) {
      toast.error("Failed to save presentation");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Presentation not found</div>
      </div>
    );
  }

  const handleAddSlide = () => {
    onAddSlide(newSlideType);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="container flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Input
            type="text"
            value={presentation.title}
            onChange={(e) =>
              setPresentation({ ...presentation, title: e.target.value })
            }
            className="border-none bg-transparent text-xl font-semibold focus:outline-none focus:ring-0"
            placeholder="Untitled Presentation"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(`/present/${params.id}`)}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Slides</h3>
          </div>

          <div className="flex items-center gap-1 my-3">
            <Select
              value={newSlideType}
              onValueChange={(value) =>
                setNewSlideType(value as "text" | "image" | "3d")
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Slide Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="3d">3D Model</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddSlide}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Slide
            </Button>
          </div>
          <SlideList
            slides={presentation.slides}
            currentIndex={currentSlideIndex}
            onSelectSlide={setCurrentSlideIndex}
            onRemoveSlide={handleRemoveSlide}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
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

            <TabsContent
              value="editor"
              className="h-[calc(100%-48px)] overflow-auto p-6"
            >
              {presentation.slides.length > 0 ? (
                <SlideEditor
                  slide={presentation.slides[currentSlideIndex]}
                  onUpdate={handleUpdateSlide}
                />
              ) : (
                <div className="text-center text-gray-500">
                  No slides yet. Generate your first slide using the AI panel!
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="ai"
              className="h-[calc(100%-48px)] overflow-auto"
            >
              <AIPanel
                onGenerateSlide={handleGenerateSlide}
                onGenerateImage={handleGenerateImage}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}