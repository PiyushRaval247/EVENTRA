import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import "./globals.css";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import ScrollProgress from "@/components/scroll-progress";
import DynamicBackground from "@/components/dynamic-background";
import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/components/cursor";

export const metadata = {
  title: "EVENTRA - Delightful Events Start Here",
  description: "Discover and create amazing events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900 text-white relative" suppressHydrationWarning={true}>
        <SmoothScroll>
          <ScrollProgress />
          <DynamicBackground />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider appearance={{ baseTheme: dark }}>
              <ConvexClientProvider>
                <Header />

                <main className="relative min-h-screen pt-32">
                  {/* Page content */}
                  <div className="relative z-10">{children}</div>
                  <Footer />
                </main>
                <Toaster position="top-center" richColors />
              </ConvexClientProvider>
            </ClerkProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

