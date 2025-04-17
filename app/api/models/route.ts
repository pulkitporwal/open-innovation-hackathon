// app/api/models/route.ts
import { NextResponse } from "next/server";
import { readdirSync } from "fs";
import { join } from "path";

export async function GET() {
  const dir = join(process.cwd(), "public", "models");
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter(f => f.endsWith(".glb") || f.endsWith(".gltf"));
  } catch {
    // empty or folder missing
  }
  const models = files.map(f => ({ url: `/models/${f}`, name: f }));
  return NextResponse.json(models);
}
