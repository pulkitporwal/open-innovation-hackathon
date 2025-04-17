import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Presentation } from "@/models/Presentation";
import { generateWithLlama } from "@/lib/groq";

interface Slide {
  id: string;
  type: "text" | "image";
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

// Generate a unique ID using crypto
function generateId(): string {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { title, topic } = await request.json();

    if (!title || !topic) {
      return NextResponse.json(
        { error: "Title and topic are required" },
        { status: 400 }
      );
    }

    // Generate presentation outline
    const outlinePrompt = `Create a presentation outline for "${title}" about "${topic}". 
    Return ONLY a JSON array of slide titles. Each title should be descriptive and engaging.
    Example format: ["Introduction", "Key Concepts", "Implementation", "Results", "Conclusion"]
    Do not include any additional text or explanation.`;

    const outlineResponse = await generateWithLlama(outlinePrompt);
    let outline: string[] = [];

    try {
      // Try to parse the response directly
      outline = JSON.parse(outlineResponse.content);
    } catch (e) {
      // If direct parsing fails, try to extract array from the response
      const match = outlineResponse.content.match(/\[([\s\S]*?)\]/);
      if (match) {
        outline = match[1]
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    }

    if (!outline.length) {
      // Fallback to a default outline if parsing fails
      outline = [
        "Introduction",
        "Key Concepts",
        "Implementation",
        "Results",
        "Conclusion"
      ];
    }

    // Generate content for each slide
    const slides: Slide[] = [];
    for (let i = 0; i < outline.length; i++) {
      const slideTitle = outline[i];
      
      // Generate slide content
      const contentPrompt = `Create content for a slide titled "${slideTitle}" in a presentation about "${topic}". And also give me the unsplash relevant images url for the topic.
      Return ONLY a JSON object with the following structure:
      {
        "type": "text",
        "content": {
          "title": "${slideTitle}",
          "body": "Main content points...",
          src:"url"
        }
      }
      Do not include any additional text or explanation.`;

      const contentResponse = await generateWithLlama(contentPrompt);
      let slideContent: any;

      try {
        // Try to parse the response directly
        slideContent = JSON.parse(contentResponse.content);
      } catch (e) {
        // If parsing fails, create a default slide
        slideContent = {
          type: "text",
          content: {
            title: slideTitle,
            body: "Content will be added here..."
          }
        };
      }

      // Ensure the content structure matches the expected format
      const formattedContent = {
        title: slideContent.content?.title || slideTitle,
        body: slideContent.content?.body || "Content will be added here...",
        src: slideContent.content?.src || "",
        alt: slideContent.content?.alt || "",
        caption: slideContent.content?.caption || "",
        theme: "Default",
        layout: "Centered"
      };

      slides.push({
        id: generateId(),
        type: slideContent.type || "text",
        content: formattedContent,
        order: i,
      });
    }

    // Create presentation with generated slides
    const presentation = await Presentation.create({
      title,
      topic,
      slides,
    });

    return NextResponse.json(presentation);
  } catch (error) {
    console.error("Error creating presentation:", error);
    return NextResponse.json(
      { error: "Failed to create presentation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const presentations = await Presentation.find().sort({ createdAt: -1 });
    console.log(presentations)
    return NextResponse.json(presentations);
  } catch (error) {
    console.error("Error fetching presentations:", error);
    return NextResponse.json(
      { error: "Failed to fetch presentations" },
      { status: 500 }
    );
  }
}
