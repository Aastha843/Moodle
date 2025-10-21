// src/app/api/db-test/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const created = await prisma.snippet.create({
      data: { title: "DB is alive", html: "<h1>hello</h1>" },
    });
    const found = await prisma.snippet.findUnique({ where: { id: created.id } });
    return NextResponse.json({ ok: true, created, found });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
