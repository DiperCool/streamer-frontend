import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { App } from "@/components/App"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardProvider } from "@/src/contexts/DashboardContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Elements } from "@stripe/react-stripe-js"; // Import Elements
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe

const inter = Inter({ subsets: ["latin"] })

// Load Stripe outside of the component to avoid re-creating it on re-renders
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className="bg-gray-900">
      <body className={inter.className}>
      <Elements stripe={stripePromise}> {/* Wrap with Elements */}
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

export const metadata = {
  generator: 'v0.dev'
};