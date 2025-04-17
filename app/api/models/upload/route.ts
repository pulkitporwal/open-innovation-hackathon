// app/api/models/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export const config = { api: { bodyParser: false } };

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (![".glb", ".gltf"].includes(ext)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // ensure folder
  const modelsDir = join(process.cwd(), "public", "models");
  if (!existsSync(modelsDir)) {
    await mkdir(modelsDir, { recursive: true });
  }

  const filename = `${Date.now()}${ext}`;
  const data = Buffer.from(await file.arrayBuffer());
  await writeFile(join(modelsDir, filename), data);

  return NextResponse.json({ path: `/models/${filename}` });
}
