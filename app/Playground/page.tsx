"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_KEY_STORAGE_KEY = "playground_api_key";

const PlaygroundPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    }
    router.push("/protected");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <p className="text-sm text-gray-500 dark:text-gray-400" aria-hidden>
        Pages / API Playground
      </p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        API Playground
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Enter your API key to access the protected area.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md space-y-4"
        aria-label="API key submission form"
      >
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            API Key
          </label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder="Enter your API key (e.g. sk-...)"
            required
            tabIndex={0}
            aria-label="API key"
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          tabIndex={0}
          aria-label="Submit API key"
        >
          {isSubmitting ? "Redirecting…" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PlaygroundPage;
