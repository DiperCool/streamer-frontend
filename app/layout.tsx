import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { App } from "@/components/App"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardProvider } from "@/src/contexts/DashboardContext";
import { Toaster } from "sonner"; // Import Toaster
import { TooltipProvider } from "@/components/ui/tooltip"; // Import TooltipProvider

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className="bg-background"> {/* Добавлен className="bg-background" */}
      <body className={inter.className}>
      <App>
        <DashboardProvider>
          <TooltipProvider> {/* Wrap with TooltipProvider */}
            <MainLayout>
              {children}
            </MainLayout>
          </TooltipProvider>
        </DashboardProvider>
      </App>
      <Toaster richColors position="bottom-right" /> {/* Add Toaster component here */}
      </body>
      </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};