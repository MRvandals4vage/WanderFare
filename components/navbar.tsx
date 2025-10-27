"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {
  Home,
  Menu,
  MessageSquare,
  Settings,
  Users,
  ShoppingBag,
  History,
  User,
  TrendingUp,
  BarChart3,
  LogOut,
  Utensils,
  Search,
  Clock,
  DollarSign,
  Star,
  ChevronDown,
  Bell,
  ShoppingCart
} from "lucide-react"
import type { PageType } from "@/app/page"
import { useState } from "react"

interface TopNavbarProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
}

function TopNavbar({ currentPage, setCurrentPage }: TopNavbarProps) {
  const { user, userRole, logout, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setCurrentPage("home")
    setIsMobileMenuOpen(false)
    window.location.href = "/"
  }

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page)
    setIsMobileMenuOpen(false)
  }

  const getNavItems = () => {
    if (!isAuthenticated || !userRole) {
      return [
        { label: "Home", page: "home" as PageType, icon: Home },
        { label: "Browse Vendors", page: "vendors" as PageType, icon: Search },
      ]
    }

    switch (userRole) {
      case "CUSTOMER":
        return [
          { label: "Home", page: "home" as PageType, icon: Home },
          { label: "Browse Vendors", page: "vendors" as PageType, icon: Search },
          { label: "Order History", page: "history" as PageType, icon: History },
          { label: "Profile", page: "profile" as PageType, icon: User },
        ]
      case "VENDOR":
        return [
          { label: "Home", page: "home" as PageType, icon: Home },
          { label: "My Profile", page: "profile" as PageType, icon: User },
          { label: "Price Prediction", page: "price-prediction" as PageType, icon: TrendingUp },
          { label: "Profits & Analytics", page: "profits" as PageType, icon: BarChart3 },
        ]
      case "ADMIN":
        return [
          { label: "Home", page: "home" as PageType, icon: Home },
          { label: "Dashboard", page: "dashboard" as PageType, icon: BarChart3 },
          { label: "Manage Vendors", page: "manage-vendors" as PageType, icon: Utensils },
          { label: "Manage Customers", page: "manage-customers" as PageType, icon: Users },
        ]
      default:
        return [{ label: "Home", page: "home" as PageType, icon: Home }]
    }
  }

  const navItems = getNavItems()
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : "U"

  return (
    <nav className="relative z-50">
      {/* Floating Navbar Container */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <div className="bg-background/60 backdrop-blur-md border border-border/30 rounded-full shadow-lg px-3 py-2 sm:px-4 sm:py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavClick("home")}
                className="text-base sm:text-lg font-bold text-primary hover:text-accent transition-colors duration-200 hover:underline hover:underline-offset-4 flex items-center gap-2"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">WF</span>
                </div>
                <span className="hidden sm:block">WanderFare</span>
              </button>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-baseline gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNavClick(item.page)}
                      className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        currentPage === item.page
                          ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                          : "text-foreground hover:text-primary hover:bg-primary/10 hover:transform hover:scale-105"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:block">{item.label}</span>
                      <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Side - User Menu & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-2">
              {/* Quick Actions for Role */}
              {isAuthenticated && userRole === "CUSTOMER" && (
                <div className="hidden xl:flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick("vendors")}
                    className="hidden 2xl:flex items-center gap-2 rounded-full"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Find Food
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick("vendors")}
                    className="xl:flex 2xl:hidden items-center gap-2 rounded-full"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isAuthenticated && userRole === "VENDOR" && (
                <div className="hidden xl:flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick("price-prediction")}
                    className="hidden 2xl:flex items-center gap-2 rounded-full"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Predict
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick("price-prediction")}
                    className="xl:flex 2xl:hidden items-center gap-2 rounded-full"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isAuthenticated && userRole === "ADMIN" && (
                <div className="hidden xl:flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick("dashboard")}
                    className="hidden 2xl:flex items-center gap-2 rounded-full"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick("dashboard")}
                    className="xl:flex 2xl:hidden items-center gap-2 rounded-full"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* User Menu - Desktop */}
              {isAuthenticated && user ? (
                <div className="hidden md:flex items-center gap-2 sm:gap-2">
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative rounded-full p-1">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>

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

                  {/* Backup Sign out button */}
                  <Button onClick={handleLogout} variant="outline" size="sm" className="hidden xl:flex rounded-full">
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex">
                  <Button onClick={() => handleNavClick("login")} variant="outline" size="sm" className="rounded-full px-3">
                    Sign In
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-primary rounded-full p-1"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-18 left-4 right-4 bg-background/60 backdrop-blur-md border border-border/30 rounded-2xl shadow-lg p-4">
            {/* User Info in Mobile */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 p-3 mb-3 bg-muted/60 rounded-xl">
                <Avatar className="h-10 w-10">
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

            {/* Navigation Items */}
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full px-4 py-2.5 rounded-xl text-base font-medium text-left transition-all duration-200 flex items-center gap-3 mb-2 ${
                    currentPage === item.page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}

            {/* Quick Actions in Mobile */}
            {isAuthenticated && userRole === "CUSTOMER" && (
              <div className="pt-3 border-t border-border mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavClick("vendors")}
                  className="w-full justify-start mb-2 rounded-xl px-4 py-2.5"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Find Food
                </Button>
              </div>
            )}

            {isAuthenticated && userRole === "VENDOR" && (
              <div className="pt-3 border-t border-border mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavClick("price-prediction")}
                  className="w-full justify-start mb-2 rounded-xl px-4 py-2.5"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Price Predictor
                </Button>
              </div>
            )}

            {isAuthenticated && userRole === "ADMIN" && (
              <div className="pt-3 border-t border-border mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavClick("dashboard")}
                  className="w-full justify-start mb-2 rounded-xl px-4 py-2.5"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            )}

            {/* Auth Actions */}
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full mt-3 rounded-xl px-4 py-2.5">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button onClick={() => handleNavClick("login")} variant="outline" size="sm" className="w-full mt-3 rounded-xl px-4 py-2.5">
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default TopNavbar
