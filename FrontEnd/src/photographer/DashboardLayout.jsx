import { Header } from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} SnapShoot. All rights reserved.
            </p>
            <div className="mt-3 sm:mt-0 flex flex-wrap gap-4">
              <a
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
