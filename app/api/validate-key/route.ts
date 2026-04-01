import { NextResponse } from "next/server";
import {
  validateApiKeyInDatabase,
  nextResponseForValidateOutcome,
} from "@/lib/validate-api-key-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = typeof body?.key === "string" ? body.key.trim() : null;

    if (!key) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const outcome = await validateApiKeyInDatabase(key, "[validate-key]");
    return nextResponseForValidateOutcome(outcome);
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
