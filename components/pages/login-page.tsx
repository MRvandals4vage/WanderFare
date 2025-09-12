"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginPage() {
  const { setUserRole } = useAuth()

  const handleRoleSelection = (role: "customer" | "vendor" | "admin") => {
    setUserRole(role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to WanderFare</h1>
          <p className="text-muted-foreground">Choose your role to continue</p>
        </div>

        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-center group-hover:text-primary transition-colors">Customer</CardTitle>
              <CardDescription className="text-center">
                Discover amazing food vendors and explore culinary experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleRoleSelection("customer")} className="w-full" size="lg">
                Login as Customer
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-center group-hover:text-primary transition-colors">Vendor</CardTitle>
              <CardDescription className="text-center">
                Manage your food stall, predict prices, and track profits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleRoleSelection("vendor")} className="w-full" size="lg">
                Login as Vendor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-center group-hover:text-primary transition-colors">Admin</CardTitle>
              <CardDescription className="text-center">Oversee platform operations and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleRoleSelection("admin")} className="w-full" size="lg">
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          This is a demo app. No real authentication is required.
        </div>
      </div>
    </div>
  )
}
