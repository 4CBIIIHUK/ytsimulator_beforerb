import { NextResponse } from "next/server";
import { INITIAL_LEADERBOARD } from "@/lib/game-engine/constants";

export async function GET() {
  return NextResponse.json({
    leaderboard: INITIAL_LEADERBOARD,
  });
}
