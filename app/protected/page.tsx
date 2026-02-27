"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const PLAYGROUND_KEY_STORAGE = "playground_api_key";

const validateKeyWithSupabase = async (key: string): Promise<boolean> => {
  if (!supabase) return false;
  const { data: rpcData, error: rpcError } = await (supabase as unknown as { rpc: (n: string, p: { p_input_key: string }) => Promise<{ data: boolean | boolean[] | null; error: unknown }> }).rpc("validate_api_key", { p_input_key: key.trim() });
  if (!rpcError && rpcData !== null && rpcData !== undefined) {
    return Array.isArray(rpcData) ? rpcData[0] === true : rpcData === true;
  }
  const { data: row, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key", key.trim())
    .eq("is_active", true)
    .maybeSingle();
  if (error || !row) return false;
  return true;
};

const ProtectedPage = () => {
  const [status, setStatus] = useState<"valid" | "invalid" | null>(null);

  useEffect(() => {
    const key = typeof window !== "undefined" ? sessionStorage.getItem(PLAYGROUND_KEY_STORAGE) : null;
    if (key === null || key === "") {
      setStatus("invalid");
      return;
    }
    let cancelled = false;
    const run = async () => {
      const valid = await validateKeyWithSupabase(key);
      if (!cancelled) setStatus(valid ? "valid" : "invalid");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== null && typeof window !== "undefined") {
      const t = setTimeout(() => sessionStorage.removeItem(PLAYGROUND_KEY_STORAGE), 500);
      return () => clearTimeout(t);
    }
  }, [status]);

  if (status === null) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">Pages / Protected</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Validating…
        </h1>
      </div>
    );
  }

  const isGranted = status === "valid";

  return (
    <div className="p-6 md:p-8">
      <p className="text-sm text-gray-500 dark:text-gray-400" aria-hidden>
        Pages / Protected
      </p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        Access Result
      </h1>

      <div
        role="status"
        aria-live="polite"
        className={`mt-6 max-w-md rounded-lg border-2 p-6 ${
          isGranted
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600"
            : "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
        }`}
      >
        <p
          className={`text-lg font-semibold ${
            isGranted
              ? "text-emerald-800 dark:text-emerald-200"
              : "text-red-800 dark:text-red-200"
          }`}
        >
          {isGranted ? "Valid API key, Access granted" : "Invalid API key, Access denied"}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          href="/Playground"
          className="px-4 py-2 text-violet-600 dark:text-violet-400 hover:underline focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
          tabIndex={0}
          aria-label="Back to API Playground"
        >
          Try again
        </Link>
        <Link
          href="/"
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:underline focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
          tabIndex={0}
          aria-label="Go to Overview"
        >
          Overview
        </Link>
      </div>
    </div>
  );
};

export default ProtectedPage;
