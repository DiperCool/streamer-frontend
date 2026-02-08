"use client" // Add this directive at the very top

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { App } from "@/components/App"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardProvider } from "@/src/contexts/DashboardContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const inter = Inter({ subsets: ["latin"] })

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className="bg-gray-900">
      <body className={inter.className}>
      <Elements stripe={stripePromise}>
        <App>
          <DashboardProvider>
            <TooltipProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </TooltipProvider>
          </DashboardProvider>
        </App>
      </Elements>
      <Toaster richColors position="bottom-right" />
      </body>
      </html>
  )
}