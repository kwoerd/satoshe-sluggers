import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
