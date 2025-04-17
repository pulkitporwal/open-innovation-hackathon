"use client"

import { themes, layouts } from "./slide-themes"

interface ImageSlideContent {
  src?: string
  alt?: string
  caption?: string
  theme?: string
  layout?: string
}

interface ImageSlidePreviewProps {
  content: ImageSlideContent
}

export default function ImageSlidePreview({ content }: ImageSlidePreviewProps) {
  // Ensure we have valid theme and layout values
  const selectedTheme = themes.find((t) => t.name === (content.theme || 'Default')) || themes[0]
  const selectedLayout = layouts.find((l) => l.name === (content.layout || 'Centered')) || layouts[0]

  return (
    <div className={`h-full w-full rounded-lg p-8 transition-colors duration-200 ${selectedTheme.colors.background}`}>
      <div className={`h-full w-full ${selectedLayout.className}`}>
        {content.src ? (
          <div className="relative">
            <img
              src={content.src}
              alt={content.alt || "Slide image"}
              className="w-full rounded-lg object-cover shadow-lg"
            />
            {content.caption && (
              <p className={`mt-4 text-center text-sm transition-colors duration-200 ${selectedTheme.colors.text}`}>
                {content.caption}
              </p>
            )}
          </div>
        ) : (
          <div className={`flex h-full w-full items-center justify-center transition-colors duration-200 ${selectedTheme.colors.text}`}>
            <p>No image selected</p>
          </div>
        )}
      </div>
    </div>
  )
}
