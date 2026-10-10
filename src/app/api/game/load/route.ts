import { NextResponse } from "next/server";
import { db } from "@/db";
import { gameSaves } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get("slotId") || "default_player";
    const records = await db.select().from(gameSaves).where(eq(gameSaves.id, slotId)).limit(1);
    if (records.length === 0) return NextResponse.json({ exists: false, data: null });
    const r = records[0];
    return NextResponse.json({ exists: true, data: { full: r.full, updatedAt: r.updatedAt } });
  } catch (error) {
    console.error("Load error:", error);
    return NextResponse.json({ exists: false, data: null, error: "Failed to load game save" });
  }
}
