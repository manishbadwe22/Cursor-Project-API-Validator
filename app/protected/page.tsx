"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_KEY_STORAGE_KEY = "playground_api_key";

const isValidApiKey = (key: string): boolean => {
  const trimmed = key.trim();
  return trimmed.length >= 24 && trimmed.startsWith("sk-");
};

const ProtectedPage = () => {
  const [status, setStatus] = useState<"valid" | "invalid" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = sessionStorage.getItem(API_KEY_STORAGE_KEY);
    const valid = key !== null && isValidApiKey(key);
    setStatus(valid ? "valid" : "invalid");
    return () => {
      sessionStorage.removeItem(API_KEY_STORAGE_KEY);
    };
  }, []);

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
