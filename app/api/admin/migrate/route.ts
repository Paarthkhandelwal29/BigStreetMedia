import { NextResponse } from "next/server";
import { migrateLegacyCmsToSupabase } from "@/lib/cms/migration";

export async function POST() {
  try {
    const result = await migrateLegacyCmsToSupabase();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
