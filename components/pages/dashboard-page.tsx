"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

type AnalyticsStat = {
  name: string
  value: number
  change?: number
}

export function DashboardPage() {
  const [stats, setStats] = useState<AnalyticsStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await apiClient.getVendorAnalytics()

        // Normalize result into cards
        const normalized: AnalyticsStat[] = []
        if (res) {
          if (typeof res.totalRevenue === 'number') normalized.push({ name: "Total Revenue", value: res.totalRevenue })
          if (typeof res.totalOrders === 'number') normalized.push({ name: "Total Orders", value: res.totalOrders })
          if (typeof res.avgOrderValue === 'number') normalized.push({ name: "Avg Order Value", value: res.avgOrderValue })
          if (typeof res.uniqueCustomers === 'number') normalized.push({ name: "Unique Customers", value: res.uniqueCustomers })
          if (typeof res.repeatRate === 'number') normalized.push({ name: "Repeat Order %", value: res.repeatRate })
        }

        if (Array.isArray(res) && res.length) {
          setStats(res as AnalyticsStat[])
        } else {
          setStats(normalized)
        }
      } catch (e: any) {
        setError(e?.message || "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Vendor Dashboard</h1>
          <p className="text-xl text-muted-foreground">Business performance overview</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading analytics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((s, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-primary">
                    {typeof s.value === 'number' ? s.value.toLocaleString() : String(s.value)}
                  </CardTitle>
                  <CardDescription>{s.name}</CardDescription>
                </CardHeader>
                {typeof s.change === 'number' && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {s.change >= 0 ? (
                        <span className="text-green-600">{s.change.toFixed(1)}% ↑</span>
                      ) : (
                        <span className="text-red-600">{s.change.toFixed(1)}% ↓</span>
                      )}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
            {stats.length === 0 && (
              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>No analytics yet</CardTitle>
                  <CardDescription>Place some orders to see insights.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
