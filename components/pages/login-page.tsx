"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginPage() {
  const { login, register, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      setSuccess("Login successful!")
      router.replace("/")
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const userData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      role: selectedRole,
      city: formData.get("city") as string,
    }

    // Add role-specific fields
    if (selectedRole === "VENDOR") {
      Object.assign(userData, {
        businessName: formData.get("businessName") as string,
        businessAddress: formData.get("businessAddress") as string,
        cuisineType: formData.get("cuisineType") as string,
        description: formData.get("description") as string,
        postalCode: formData.get("postalCode") as string,
      })
    } else {
      Object.assign(userData, {
        deliveryAddress: formData.get("deliveryAddress") as string,
        postalCode: formData.get("postalCode") as string,
        preferences: formData.get("preferences") as string,
      })
    }

    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      setError("Please fill in all required fields")
      return
    }

    try {
      await register(userData)
      setSuccess("Registration successful!")
      router.replace("/")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    }
  }

  // Redirect away from login if already authenticated
  if (isAuthenticated) {
    typeof window !== "undefined" && router.replace("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to WanderFare</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      name="password" 
                      type="password" 
                      placeholder="Enter your password"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <Input id="register-email" name="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password *</Label>
                    <Input id="register-password" name="password" type="password" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a *</Label>
                    <Select value={selectedRole} onValueChange={(value: "CUSTOMER" | "VENDOR") => setSelectedRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="VENDOR">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required />
                  </div>

                  {selectedRole === "VENDOR" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input id="businessName" name="businessName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Input id="businessAddress" name="businessAddress" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cuisineType">Cuisine Type</Label>
                        <Input id="cuisineType" name="cuisineType" placeholder="e.g., Italian, Chinese, Indian" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" placeholder="Describe your business" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">Delivery Address</Label>
                        <Input id="deliveryAddress" name="deliveryAddress" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferences">Food Preferences</Label>
                        <Input id="preferences" name="preferences" placeholder="e.g., Vegetarian, No spicy food" />
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" name="postalCode" />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Connect with real vendors and enjoy authentic food experiences.
        </div>
      </div>
    </div>
  )
}
