"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PresentationControls } from "@react-three/drei"

interface ModelSlideContent {
  modelUrl: string
  caption: string
}

interface ModelSlidePreviewProps {
  content: ModelSlideContent
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={2} />
}

export default function ModelSlidePreview({ content }: ModelSlidePreviewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-[300px] w-full rounded-lg bg-slate-100 dark:bg-slate-800">
        <Canvas>
          <Suspense fallback={null}>
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
              config={{ mass: 2, tension: 400 }}
              snap={{ mass: 4, tension: 400 }}
            >
              <Model url={content.modelUrl} />
            </PresentationControls>
            <Environment preset="studio" />
            <OrbitControls enableZoom={false} />
          </Suspense>
        </Canvas>
      </div>
      {content.caption && (
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">{content.caption}</p>
      )}
    </div>
  )
}
