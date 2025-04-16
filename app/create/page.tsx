"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";
import { generateWithLlama } from "@/lib/groq";

export default function CreatePresentationPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !topic) return;

    setIsGenerating(true);

    try {
      // In a real app, this would generate content and create a presentation
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to the editor with a new presentation ID
      router.push("/edit/new-presentation");
    } catch (error) {
      console.error("Error creating presentation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!topic) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "Your presentation description here",
        }),
      });

      const data = await response.json();
      const generatedTitle = data.title;
      console.log(generatedTitle)
      setTitle(generatedTitle);
    } catch (error) {
      console.error("Error generating with AI:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Presentation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Presentation Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your presentation"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                Topic or Description
              </label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe what your presentation is about..."
                rows={4}
                required
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleGenerateWithAI}
              disabled={!topic || isGenerating}
            >
              <Wand2 className="h-4 w-4" />
              Generate Title with AI
              {isGenerating && (
                <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!title || !topic || isGenerating}
          >
            Create Presentation
            {isGenerating && (
              <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
