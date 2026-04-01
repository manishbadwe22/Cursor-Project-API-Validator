"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboards";
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status ?? "unauthenticated";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in required
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Please sign in to access this page.
        </p>

        {status === "loading" ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Checking your session...
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm"
            >
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() =>
                signIn("credentials", {
                  username: "dev",
                  password: "dev1234",
                  callbackUrl,
                })
              }
              className="px-4 py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold text-sm"
            >
              Sign in (Dev)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
