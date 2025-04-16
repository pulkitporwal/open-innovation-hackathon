"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PresentationControls } from "@react-three/drei"

interface ModelPreviewProps {
  modelUrl: string
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={2} />
}

export default function ModelPreview({ modelUrl }: ModelPreviewProps) {
  return (
    <div className="h-full w-full">
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
            <Model url={modelUrl} />
          </PresentationControls>
          <Environment preset="studio" />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
