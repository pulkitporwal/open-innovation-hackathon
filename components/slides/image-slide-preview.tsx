interface ImageSlideContent {
  src: string
  alt: string
  caption: string
}

interface ImageSlidePreviewProps {
  content: ImageSlideContent
}

export default function ImageSlidePreview({ content }: ImageSlidePreviewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative max-h-[300px] max-w-full overflow-hidden rounded-lg">
        <img
          src={content.src || "/placeholder.svg"}
          alt={content.alt}
          className="h-auto max-h-[300px] w-auto object-contain"
        />
      </div>
      {content.caption && (
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">{content.caption}</p>
      )}
    </div>
  )
}
