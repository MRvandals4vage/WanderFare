"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import type { PageType } from "@/app/page"
import { useState } from "react"
import { User, LogOut, Settings } from "lucide-react"

interface NavbarProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
}

export function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const { user, userRole, logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setCurrentPage("home")
    setIsMobileMenuOpen(false)
    // Force page reload to clear all state
    window.location.href = "/"
  }

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page)
    setIsMobileMenuOpen(false)
  }

  const getNavItems = () => {
    if (!isAuthenticated || !userRole) {
      return [
        { label: "Home", page: "home" as PageType },
        { label: "Login", page: "login" as PageType },
      ]
    }

    switch (userRole) {
      case "CUSTOMER":
        return [
          { label: "Home", page: "home" as PageType },
          { label: "Vendors", page: "vendors" as PageType },
          { label: "History", page: "history" as PageType },
        ]
      case "VENDOR":
        return [
          { label: "Home", page: "home" as PageType },
          { label: "Profile", page: "profile" as PageType },
          { label: "Price Prediction", page: "price-prediction" as PageType },
          { label: "Profits", page: "profits" as PageType },
        ]
      case "ADMIN":
        return [
          { label: "Home", page: "home" as PageType },
          { label: "Dashboard", page: "dashboard" as PageType },
          { label: "Manage Vendors", page: "manage-vendors" as PageType },
          { label: "Manage Customers", page: "manage-customers" as PageType },
        ]
      default:
        return [{ label: "Home", page: "home" as PageType }]
    }
  }

  const navItems = getNavItems()
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : "U"

  return (
    <nav className="bg-background/95 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      {/* Curved design using SVG path */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0 L1200 0 L1200 60 Q600 80 0 60 Z"
            fill="rgb(var(--primary) / 0.05)"
            stroke="rgb(var(--primary) / 0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick("home")}
              className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-200"
            >
              WanderFare
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentPage === item.page
                      ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                      : "text-foreground hover:text-primary hover:bg-primary/10 hover:transform hover:scale-105"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {userRole?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavClick("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavClick("profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Always-visible Sign out button as a backup */}
              <Button onClick={handleLogout} variant="outline" size="sm">
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button onClick={() => handleNavClick("login")} variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border mt-2 bg-background/95 backdrop-blur-sm">
              {isAuthenticated && user && (
                <div className="flex items-center gap-2 p-3 mb-2 bg-muted rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{userRole?.toLowerCase()}</p>
                  </div>
                </div>
              )}
              
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200 ${
                    currentPage === item.page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button onClick={() => handleNavClick("login")} variant="outline" size="sm" className="w-full mt-2">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
