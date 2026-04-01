import { NextResponse } from "next/server";
import { supabase } from "./supabase";

export type ValidateApiKeyOutcome =
  | { kind: "success"; valid: boolean }
  | { kind: "no_database" }
  | { kind: "query_error" };

/**
 * Validates an API key against Supabase (RPC + table fallback).
 * Caller should reject empty keys with 400 before calling.
 */
export async function validateApiKeyInDatabase(
  key: string,
  logPrefix = "[validate-api-key]"
): Promise<ValidateApiKeyOutcome> {
  const trimmed = key.trim();
  if (!trimmed) {
    return { kind: "success", valid: false };
  }

  if (!supabase) {
    return { kind: "no_database" };
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      `${logPrefix} key length:`,
      trimmed.length,
      "first 8 chars:",
      trimmed.slice(0, 8) + "..."
    );
  }

  const rpcResult = await (
    supabase as unknown as {
      rpc: (
        n: string,
        p: { p_input_key: string }
      ) => Promise<{
        data: boolean | boolean[] | null;
        error: Error | null;
      }>;
    }
  ).rpc("validate_api_key", { p_input_key: trimmed });

  if (process.env.NODE_ENV === "development") {
    console.log(`${logPrefix} RPC result:`, {
      data: rpcResult.data,
      error: rpcResult.error?.message ?? rpcResult.error,
    });
  }

  if (
    !rpcResult.error &&
    rpcResult.data !== null &&
    rpcResult.data !== undefined
  ) {
    const valid = Array.isArray(rpcResult.data)
      ? rpcResult.data[0] === true
      : rpcResult.data === true;
    return { kind: "success", valid };
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, expires_at")
    .eq("key", trimmed)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(`${logPrefix} fallback query error:`, error);
    return { kind: "query_error" };
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`${logPrefix} fallback query:`, {
      found: !!data,
      error: error ? String(error) : null,
    });
  }

  if (!data) {
    return { kind: "success", valid: false };
  }

  const row = data as { id: string; expires_at: string | null };
  const expiresAt = row.expires_at ? new Date(row.expires_at) : null;
  const isExpired = expiresAt !== null && expiresAt < new Date();

  if (isExpired) {
    return { kind: "success", valid: false };
  }

  return { kind: "success", valid: true };
}

export function nextResponseForValidateOutcome(
  outcome: ValidateApiKeyOutcome
): NextResponse {
  switch (outcome.kind) {
    case "no_database":
      return NextResponse.json(
        { valid: false, error: "Database not configured" },
        { status: 503 }
      );
    case "query_error":
      return NextResponse.json({ valid: false }, { status: 500 });
    default:
      return NextResponse.json({ valid: outcome.valid });
  }
}
