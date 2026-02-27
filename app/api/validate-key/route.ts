import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = typeof body?.key === "string" ? body.key.trim() : null;

    if (!key) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[validate-key] key length:", key.length, "first 8 chars:", key.slice(0, 8) + "...");
    }

    if (!supabase) {
      return NextResponse.json(
        { valid: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    // RPC defined in supabase-schema.sql; cast needed until types are regenerated
    const rpcResult = await (supabase as unknown as { rpc: (n: string, p: { p_input_key: string }) => Promise<{ data: boolean | boolean[] | null; error: Error | null }> }).rpc("validate_api_key", { p_input_key: key });
    if (process.env.NODE_ENV === "development") {
      console.log("[validate-key] RPC result:", { data: rpcResult.data, error: rpcResult.error?.message ?? rpcResult.error });
    }
    if (!rpcResult.error && rpcResult.data !== null && rpcResult.data !== undefined) {
      const valid = Array.isArray(rpcResult.data) ? rpcResult.data[0] === true : rpcResult.data === true;
      return NextResponse.json({ valid });
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, expires_at")
      .eq("key", key)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Validate key error:", error);
      return NextResponse.json({ valid: false }, { status: 500 });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[validate-key] fallback query:", { found: !!data, error: error ? String(error) : null });
    }
    if (!data) {
      return NextResponse.json({ valid: false });
    }

    const row = data as { id: string; expires_at: string | null };
    const expiresAt = row.expires_at ? new Date(row.expires_at) : null;
    const isExpired = expiresAt !== null && expiresAt < new Date();

    if (isExpired) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
