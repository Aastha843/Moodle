// app/api/snippets/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Params = { params: { id: string } };

//READ
export async function GET(_req: Request, { params }: Params) {
  try {
    console.log("[GET /api/snippets/:id]", { id: params.id });
    const item = await prisma.snippet.findUnique({ where: { id: params.id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    console.error("[GET /api/snippets/:id] error", err);
    return NextResponse.json({ error: "Failed to fetch snippet", details: err?.message }, { status: 500 });
  }
}

// UPDATE
export async function PATCH(req: Request, { params }: Params) {
  try {
    console.log("[PATCH /api/snippets/:id]", { id: params.id });
    const exists = await prisma.snippet.findUnique({ where: { id: params.id } });
    if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const data: { title?: string; html?: string } = {};

    if (typeof body?.title === "string") {
      const t = body.title.trim();
      if (!t) return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      data.title = t;
    }
    if (typeof body?.html === "string") {
      const h = body.html;
      if (!h) return NextResponse.json({ error: "HTML cannot be empty" }, { status: 400 });
      data.html = h;
    }

    const updated = await prisma.snippet.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[PATCH /api/snippets/:id] error", err);
    return NextResponse.json({ error: "Failed to update snippet", details: err?.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: Request, { params }: Params) {
  try {
    console.log("[DELETE /api/snippets/:id]", { id: params.id });
    await prisma.snippet.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[DELETE /api/snippets/:id] error", err);
    return NextResponse.json({ error: "Failed to delete snippet", details: err?.message }, { status: 500 });
  }
}
