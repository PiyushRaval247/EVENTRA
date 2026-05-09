import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import ScrollProgress from "@/components/scroll-progress";
import DynamicBackground from "@/components/dynamic-background";
import SmoothScroll from "@/components/smooth-scroll";
import CustomCursor from "@/components/cursor";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "EVENTRA - Delightful Events Start Here",
  description: "Discover and create amazing events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} bg-background text-foreground relative`} suppressHydrationWarning={true}>
        <SmoothScroll>
          <ScrollProgress />
          <DynamicBackground />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider>
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
