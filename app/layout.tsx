import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Cursor Course",
  description: "A Next.js project with TypeScript and TailwindCSS",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
