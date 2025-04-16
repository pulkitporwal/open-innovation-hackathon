interface TextSlideContent {
  title: string
  body: string
}

interface TextSlidePreviewProps {
  content: TextSlideContent
}

export default function TextSlidePreview({ content }: TextSlidePreviewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight">{content.title}</h2>
      <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-300">{content.body}</p>
    </div>
  )
}
