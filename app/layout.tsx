import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { App } from "@/components/App"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardProvider } from "@/src/contexts/DashboardContext";
import { Toaster } from "sonner"; // Import Toaster

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <App>
        <DashboardProvider>
          <MainLayout>
            {children}
          </MainLayout>
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