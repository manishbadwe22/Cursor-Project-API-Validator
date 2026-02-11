"use client";

const Home = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400" aria-hidden>
            Pages / Overview
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Overview
            </h1>
            <button
              type="button"
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              tabIndex={0}
              aria-label="Refresh"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome. Use the sidebar to open Research Assistant, Research Reports, API Playground, Invoices, or Documentation.
      </p>
    </div>
  );
};

export default Home;
