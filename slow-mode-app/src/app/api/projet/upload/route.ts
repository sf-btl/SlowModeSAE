import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "Aucun fichier." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "projets");
    await mkdir(uploadDir, { recursive: true });

    const paths: string[] = [];

    for (const item of files) {
      if (!(item instanceof File)) continue;
      const arrayBuffer = await item.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname(item.name) || ".png";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      paths.push(`/uploads/projets/${filename}`);
    }

    return NextResponse.json({ success: true, paths });
  } catch (error) {
    console.error("Upload projet erreur:", error);
    return NextResponse.json({ success: false, message: "Erreur upload." }, { status: 500 });
  }
}
