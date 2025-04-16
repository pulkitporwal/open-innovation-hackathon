"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Trash2, CuboidIcon as Cube } from "lucide-react"
import ModelPreview from "@/components/model-preview"
import { uploadModel } from "@/lib/model-utils"

type Model = {
  id: string
  name: string
  filename: string
  path: string
  uploadedAt: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [modelName, setModelName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    setModels([
      {
        id: "1",
        name: "Product Prototype",
        filename: "prototype.glb",
        path: "/assets/video_phone.glb",
        uploadedAt: "2 days ago",
      },
      {
        id: "2",
        name: "Company Logo 3D", 
        filename: "logo3d.glb",
        path: "/assets/video_phone.glb",
        uploadedAt: "1 week ago",
      },
    ])
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    // Check if file is a valid 3D model format
    const validTypes = ["model/gltf-binary", "model/gltf+json", "application/octet-stream"]
    const validExtensions = [".glb", ".gltf"]

    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.some((ext) => fileExtension.includes(ext))) {
      alert("Please upload a valid 3D model file (GLB or GLTF format)")
      return
    }

    setSelectedFile(file)
    setModelName(file.name.split(".")[0])

    // Create a temporary URL for the file for preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !modelName) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 300)

      // In a real app, this would upload to your server
      const modelPath = await uploadModel(selectedFile, modelName)

      // Add the new model to the list
      const newModel: Model = {
        id: Date.now().toString(),
        name: modelName,
        filename: selectedFile.name,
        path: modelPath,
        uploadedAt: "Just now",
      }

      setModels([newModel, ...models])

      // Reset form
      setSelectedFile(null)
      setModelName("")
      setPreviewUrl(null)

      // Clean up
      clearInterval(progressInterval)
      setUploadProgress(0)
    } catch (error) {
      console.error("Error uploading model:", error)
      alert("Failed to upload model. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = (id: string) => {
    // In a real app, this would delete from your server
    setModels(models.filter((model) => model.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">3D Model Library</h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Upload Section */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modelName">Model Name</Label>
                  <Input
                    id="modelName"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Enter a name for your model"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Model File</Label>
                  <div
                    className={`relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 ${
                      dragActive ? "border-slate-500 bg-slate-100 dark:border-slate-500 dark:bg-slate-800" : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".glb,.gltf"
                      onChange={handleFileChange}
                    />
                    <Upload className="mb-2 h-6 w-6 text-slate-500 dark:text-slate-400" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedFile ? selectedFile.name : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Supports GLB and GLTF formats</p>
                  </div>
                </div>

                {previewUrl && (
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Preview:</p>
                    <div className="h-40 w-full">
                      <ModelPreview modelUrl={previewUrl} />
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Uploading: {uploadProgress}%</div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full bg-slate-900 dark:bg-slate-400"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                onClick={handleUpload}
                disabled={!selectedFile || !modelName || isUploading}
              >
                <Upload className="h-4 w-4" />
                Upload Model
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Model Library */}
        <div className="md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Your 3D Models</h2>

          {models.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
              <Cube className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-600" />
              <p className="text-slate-600 dark:text-slate-400">
                You don't have any 3D models yet. Upload your first one!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <div className="h-40 w-full bg-slate-100 dark:bg-slate-800">
                    <ModelPreview modelUrl={model.path} />
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{model.name}</CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {model.filename} • {model.uploadedAt}
                    </p>
                  </CardHeader>
                  <CardFooter className="flex justify-between p-3 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would copy the path to clipboard
                        navigator.clipboard.writeText(model.path)
                        alert(`Path copied: ${model.path}`)
                      }}
                    >
                      Use in Slide
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                      onClick={() => handleDelete(model.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
