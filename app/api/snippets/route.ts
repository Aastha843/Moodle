// app/api/snippets/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Number(searchParams.get("take") ?? 20);
    const skip = Number(searchParams.get("skip") ?? 0);

    console.log("[GET /api/snippets]", { take, skip });

    const [items, total] = await Promise.all([
      prisma.snippet.findMany({ orderBy: { createdAt: "desc" }, take, skip }),
      prisma.snippet.count(),
    ]);

    return NextResponse.json({ items, total, take, skip });
  } catch (err: any) {
    console.error("[GET /api/snippets] error", err);
    return NextResponse.json(
      { error: "Failed to list snippets", details: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = (body?.title ?? "").toString().trim();
    const html = (body?.html ?? "").toString();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!html)  return NextResponse.json({ error: "HTML is required" }, { status: 400 });

    console.log("[POST /api/snippets] saving", { title, len: html.length });

    const created = await prisma.snippet.create({ data: { title, html } });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/snippets] error", err);
    return NextResponse.json(
      { error: "Failed to create snippet", details: err?.message },
      { status: 500 }
    );
  }
}
