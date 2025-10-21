// app/api/render/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = (searchParams.get("id") || "").trim();
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const item = await prisma.snippet.findUnique({ where: { id } });
  if (!item) return new NextResponse("Not Found", { status: 404 });

  return new NextResponse(item.html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
