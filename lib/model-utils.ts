/**
 * Uploads a 3D model file to the server
 * @param file The file to upload
 * @param name The name to give the model
 * @returns The path to the uploaded model
 */
export async function uploadModel(file: File, name: string): Promise<string> {
  // In a real application, this would upload the file to your server
  // For this example, we'll simulate the upload and return a path

  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, this would be the path returned from your server
      // after uploading the file to the public directory
      const sanitizedName = name.replace(/[^a-z0-9]/gi, "-").toLowerCase()
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
      const path = `/models/${sanitizedName}${fileExtension}`

      resolve(path)
    }, 2000)
  })
}

/**
 * Fetches all available 3D models
 * @returns Array of model objects
 */
export async function getModels() {
  // In a real application, this would fetch from your API
  // For this example, we'll return mock data

  return [
    {
      id: "1",
      name: "Product Prototype",
      filename: "prototype.glb",
      path: "/assets/3d/duck.glb",
      uploadedAt: "2 days ago",
    },
    {
      id: "2",
      name: "Company Logo 3D",
      filename: "logo3d.glb",
      path: "/assets/3d/duck.glb",
      uploadedAt: "1 week ago",
    },
  ]
}

/**
 * Deletes a 3D model
 * @param id The ID of the model to delete
 * @returns Success status
 */
export async function deleteModel(id: string): Promise<boolean> {
  // In a real application, this would delete from your server
  // For this example, we'll simulate success

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}
