"use client"

import { themes, layouts } from "./slide-themes"

interface TextSlideContent {
  title?: string
  body?: string
  theme?: string
  layout?: string
}

interface TextSlidePreviewProps {
  content: TextSlideContent
}

export default function TextSlidePreview({ content }: TextSlidePreviewProps) {
  // Ensure we have valid theme and layout values
  const selectedTheme = themes.find((t) => t.name === (content.theme || 'Default')) || themes[0]
  const selectedLayout = layouts.find((l) => l.name === (content.layout || 'Centered')) || layouts[0]

  return (
    <div className={`h-full w-full rounded-lg p-8 transition-colors duration-200 ${selectedTheme.colors.background}`}>
      <div className={`h-full w-full ${selectedLayout.className}`}>
        {content.title && (
          <h1 className={`text-4xl font-bold transition-colors duration-200 ${selectedTheme.colors.text}`}>
            {content.title}
          </h1>
        )}
        {content.body && (
          <div className={`mt-4 text-lg transition-colors duration-200 ${selectedTheme.colors.text}`}>
            {content.body.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
