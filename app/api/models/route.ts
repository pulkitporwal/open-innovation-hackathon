import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    if (!file || !name) {
      return NextResponse.json({ error: "File and name are required" }, { status: 400 })
    }

    // Validate file type
    const validExtensions = [".glb", ".gltf"]
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({
        error: "Invalid file type. Only GLB and GLTF files are allowed.",
      }, { status: 400 })
    }

    // Sanitize and construct filename
    const sanitizedName = name.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    const fileName = `${sanitizedName}${fileExtension}`

    // Define path to /public/assets/3d
    const modelsDir = join(process.cwd(), "public", "assets", "3d")
    if (!existsSync(modelsDir)) {
      await mkdir(modelsDir, { recursive: true })
    }

    // Save the file
    const filePath = join(modelsDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Public URL to access the file
    const publicPath = `/assets/3d/${fileName}`

    return NextResponse.json({
      success: true,
      path: publicPath,
      name,
      filename: fileName,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      models: [
        {
          id: "1",
          name: "Sample Duck",
          filename: "duck.glb",
          path: "/assets/3d/duck.glb",
          uploadedAt: "2 days ago",
        },
        {
          id: "2",
          name: "Company Logo",
          filename: "logo3d.glb",
          path: "/assets/3d/logo3d.glb",
          uploadedAt: "1 week ago",
        },
      ],
    })
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
  }
}
