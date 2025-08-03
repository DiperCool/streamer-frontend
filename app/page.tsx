"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Users, Trophy, Zap } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const router = useRouter()



  if (isLoading) {
    return (
     <div></div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div>

    </div>
  )
}
