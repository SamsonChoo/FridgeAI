import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Fridge",
  description: "Manage your ingredients and get AI-powered recipe suggestions",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Fridge",
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">Fridge AI</h1>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <script
          id="sw-register"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async function() {
                  try {
                    // Fetch the service worker version
                    const versionResponse = await fetch('/sw-version.json');
                    const { version } = await versionResponse.json();
                    
                    // Register the service worker with the version as a query parameter
                    navigator.serviceWorker.register(\`/sw.js?v=\${version}\`).then(
                      function(registration) {
                        console.log('ServiceWorker registration successful with version:', version);
                      },
                      function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                      }
                    );
                  } catch (error) {
                    console.error('Failed to fetch service worker version:', error);
                    // Fallback to registering without version if fetching fails
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) {
                        console.log('ServiceWorker registration successful (fallback)');
                      },
                      function(err) {
                        console.log('ServiceWorker registration failed (fallback): ', err);
                      }
                    );
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
