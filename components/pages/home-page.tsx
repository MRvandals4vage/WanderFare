"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PageType } from "@/app/page"

interface HomePageProps {
  setCurrentPage?: (page: PageType) => void
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  const { userRole } = useAuth()

  const handleGetStarted = () => {
    if (setCurrentPage) {
      setCurrentPage("login")
    }
  }

  const handleExploreVendors = () => {
    if (setCurrentPage) {
      if (userRole === "CUSTOMER") {
        setCurrentPage("vendors")
      } else {
        setCurrentPage("login")
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/bustling-food-market-with-vendors-cooking.jpg)' }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Discover Amazing
            <span className="text-accent block">Food Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Connect with local food vendors, explore diverse cuisines, and embark on culinary adventures that will
            tantalize your taste buds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!userRole ? (
              <>
                <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
                <button className="px-6 py-3 rounded-full border border-white/80 text-white font-medium hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  Explore Vendors
                </button>
              </>
            ) : (
              <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
                Welcome back, {userRole}!
              </button>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose WanderFare?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              We bring together food lovers and vendors in one seamless platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <CardTitle>Discover Local Vendors</CardTitle>
                <CardDescription>
                  Find amazing food vendors in your area with detailed profiles, menus, and real-time locations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  Vendors get powerful insights with price prediction models and profit tracking tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Join a vibrant community of food enthusiasts and vendors sharing their culinary passions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Food Journey?</h2>
          <p className="text-xl mb-8 text-pretty">
            Join thousands of food lovers and vendors who are already part of the WanderFare community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-full bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-all duration-300 transform hover:scale-105">
              Join as Customer
            </button>
            <button className="px-6 py-3 rounded-full border border-primary-foreground/80 text-primary-foreground font-medium hover:bg-primary-foreground/10 transition-all duration-300 transform hover:scale-105">
              Become a Vendor
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
