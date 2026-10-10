import { NextResponse } from "next/server";
import { db } from "@/db";
import { gameSaves } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slotId: string = String(body.slotId || "default_player").slice(0, 64);
    const values = {
      balance: Number(body.balance) || 0,
      channel: body.channel ?? null,
      stats: body.stats ?? {},
      upgrades: body.upgrades ?? {},
      team: body.team ?? [],
      videos: [],
      salesHistory: body.salesHistory ?? [],
      adOffers: body.adOffers ?? [],
      activeBuyoutOffer: body.activeBuyoutOffer ?? null,
      onboardingStep: Number(body.onboardingStep) || 1,
      onboardingCompleted: Boolean(body.onboardingCompleted),
      settings: body.settings ?? {},
      full: body.full ?? null,
      updatedAt: new Date(),
    };

    await db
      .insert(gameSaves)
      .values({ id: slotId, ...values })
      .onConflictDoUpdate({ target: gameSaves.id, set: values });

    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ success: false, error: "Failed to save game state" }, { status: 500 });
  }
}
