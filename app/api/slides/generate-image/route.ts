import { NextResponse } from "next/server";

// Free image generation using Unsplash API
// You'll need to sign up for a free Unsplash API key at https://unsplash.com/developers
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Search for relevant images on Unsplash
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        prompt
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image from Unsplash");
    }

    const data = await response.json();
    const image = data.results[0];

    if (!image) {
      return NextResponse.json(
        { error: "No images found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      src: image.urls.regular,
      alt: image.alt_description || prompt,
      caption: image.description || prompt,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
} 