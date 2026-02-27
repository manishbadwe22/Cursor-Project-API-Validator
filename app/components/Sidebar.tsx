"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: ({ className }: { className?: string }) => JSX.Element;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboards", label: "Overview", icon: HouseIcon },
  { href: "/research-assistant", label: "Research Assistant", icon: ResearchIcon },
  { href: "/research-reports", label: "Research Reports", icon: DocumentArrowIcon },
  { href: "/Playground", label: "API Playground", icon: CodeIcon },
  { href: "/invoices", label: "Invoices", icon: InvoicesIcon },
  { href: "#", label: "Documentation", icon: DocIcon, external: true },
];

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ResearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l4 4 4-4" />
    </svg>
  );
}

function DocumentArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5v6m0 0l3-3m-3 3L11 8" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function InvoicesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-56 flex-col border-r border-l-4 border-l-emerald-500 bg-gray-100 dark:bg-gray-800/80 min-h-screen"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex shrink-0 items-center justify-center py-6 px-4">
        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Manish</span>
        <span className="ml-1 text-base font-normal text-gray-500 dark:text-gray-400">AI</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : !item.external && pathname.startsWith(item.href);
          const Icon = item.icon;

          const linkClass = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 ${
            isActive
              ? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              : "text-gray-700 hover:bg-gray-200/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
          }`;

          const iconClass = `h-5 w-5 shrink-0 ${isActive ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`;

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                tabIndex={0}
                aria-label={`${item.label} (opens in new tab)`}
              >
                <Icon className={iconClass} />
                <span className="flex-1">{item.label}</span>
                <ExternalLinkIcon className="h-4 w-4 shrink-0 text-gray-400" />
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={linkClass}
              tabIndex={0}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={iconClass} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Settings */}
      <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium"
            aria-hidden
          >
            EM
          </div>
          <span className="min-w-0 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
            Eden Marco
          </span>
          <button
            type="button"
            className="ml-auto rounded p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            tabIndex={0}
            aria-label="Open settings"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
