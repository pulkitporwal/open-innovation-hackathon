"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { themes, layouts } from "./slide-themes"

interface ModelSlideContent {
  modelUrl?: string
  caption?: string
  theme?: string
  layout?: string
}

interface ModelSlidePreviewProps {
  content: ModelSlideContent
}

const ModelSlidePreview = ({ content }: ModelSlidePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)

  // Ensure we have valid theme and layout values
  const selectedTheme = themes.find((t) => t.name === (content.theme || 'Default')) || themes[0]
  const selectedLayout = layouts.find((l) => l.name === (content.layout || 'Centered')) || layouts[0]

  useEffect(() => {
    if (!containerRef.current || !content.modelUrl) return

    // Initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(selectedTheme.colors.background.split(' ')[0])
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Load model
    const loader = new GLTFLoader()
    loader.load(
      content.modelUrl,
      (gltf) => {
        // Remove previous model if exists
        if (modelRef.current) {
          scene.remove(modelRef.current)
        }

        const model = gltf.scene
        modelRef.current = model

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3 / maxDim

        model.position.sub(center)
        model.scale.setScalar(scale)
        scene.add(model)
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error)
      }
    )

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [content.modelUrl, selectedTheme.colors.background])

  return (
    <div className={`h-full w-full rounded-lg p-8 transition-colors duration-200 ${selectedTheme.colors.background}`}>
      <div className={`h-full w-full ${selectedLayout.className}`}>
        {content.modelUrl ? (
          <div className="relative h-full w-full">
            <div ref={containerRef} className="h-full w-full rounded-lg" />
            {content.caption && (
              <p className={`mt-4 text-center text-sm transition-colors duration-200 ${selectedTheme.colors.text}`}>
                {content.caption}
              </p>
            )}
          </div>
        ) : (
          <div className={`flex h-full w-full items-center justify-center transition-colors duration-200 ${selectedTheme.colors.text}`}>
            <p>No 3D model selected</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelSlidePreview 