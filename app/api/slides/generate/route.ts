import { NextResponse } from "next/server";
import { generateWithLlama } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { prompt, topic } = await request.json();

    if (!prompt || !topic) {
      return NextResponse.json(
        { error: "Prompt and topic are required" },
        { status: 400 }
      );
    }

    const contentPrompt = `Create content for a slide about "${prompt}" in a presentation about "${topic}".
    Return the content in JSON format with the following structure:
    {
      "type": "text",
      "content": {
        "title": "Slide Title",
        "body": "Main content points..."
      }
    }`;

    const response = await generateWithLlama(contentPrompt);
    const slideContent = JSON.parse(response.content);

    return NextResponse.json(slideContent);
  } catch (error) {
    console.error("Error generating slide:", error);
    return NextResponse.json(
      { error: "Failed to generate slide" },
      { status: 500 }
    );
  }
} 