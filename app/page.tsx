"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { HomePage } from "@/components/pages/home-page"
import { LoginPage } from "@/components/pages/login-page"
import { VendorsPage } from "@/components/pages/vendors-page"
import { HistoryPage } from "@/components/pages/history-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { PricePredictionPage } from "@/components/pages/price-prediction-page"
import { ProfitsPage } from "@/components/pages/profits-page"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { ManageVendorsPage } from "@/components/pages/manage-vendors-page"
import { ManageCustomersPage } from "@/components/pages/manage-customers-page"
import { useState, useEffect } from "react"

export type PageType =
  | "home"
  | "login"
  | "vendors"
  | "history"
  | "profile"
  | "price-prediction"
  | "profits"
  | "dashboard"
  | "manage-vendors"
  | "manage-customers"

export default function App() {
  const { userRole } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>("home")

  useEffect(() => {
    if (!userRole && currentPage !== "home" && currentPage !== "login") {
      setCurrentPage("home")
    }
  }, [userRole, currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "login":
        return <LoginPage />
      case "vendors":
        return <VendorsPage />
      case "history":
        return <HistoryPage />
      case "profile":
        return <ProfilePage />
      case "price-prediction":
        return <PricePredictionPage />
      case "profits":
        return <ProfitsPage />
      case "dashboard":
        return <DashboardPage />
      case "manage-vendors":
        return <ManageVendorsPage />
      case "manage-customers":
        return <ManageCustomersPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="transition-all duration-300 ease-in-out">{renderPage()}</main>
      <footer className="bg-muted border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-2">WanderFare</h3>
            <p className="text-muted-foreground mb-4">Connecting food lovers with amazing vendors</p>
            <p className="text-sm text-muted-foreground">
              © 2024 WanderFare. Built with React, TypeScript, and TailwindCSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
