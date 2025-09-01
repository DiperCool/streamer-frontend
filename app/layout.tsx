import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { App } from "@/components/App"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardProvider } from "@/src/contexts/DashboardContext"; // Import DashboardProvider

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
        <DashboardProvider> {/* Wrap MainLayout with DashboardProvider */}
          <MainLayout>
            {children}
          </MainLayout>
        </DashboardProvider>
      </App>
      </body>
      </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};