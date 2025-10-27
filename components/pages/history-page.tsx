"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, DollarSign, Star, RotateCcw, MessageSquare, Clock, ShoppingBag } from "lucide-react"
import { apiClient, Order } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

const getStatusColor = (status?: string) => {
  const s = (status ?? "PENDING").toUpperCase()
  switch (s) {
    case "DELIVERED":
      return "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
    case "PREPARING":
      return "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
    case "OUT_FOR_DELIVERY":
      return "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
    case "PENDING":
      return "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
    case "CANCELLED":
      return "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
    default:
      return "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
  }
}

const formatStatus = (status?: string) => {
  const s = (status ?? "PENDING")
  return s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
    />
  ))
}

export function HistoryPage() {
  const { userRole, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [reorderingId, setReorderingId] = useState<number | null>(null)

  const loadOrders = async (page = 0, append = false) => {
    try {
      setLoading(true)
      setError("")

      const response = await apiClient.getCustomerOrders(page, 10)
      const newOrders = response.content || []

      if (append) {
        setOrders(prev => [...prev, ...newOrders])
      } else {
        setOrders(newOrders)
      }

      setHasMore(newOrders.length === 10)
    } catch (err: any) {
      console.error("Failed to load orders:", err)
      setError("Failed to load order history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && userRole === "CUSTOMER") {
      loadOrders()
    }
  }, [isAuthenticated, userRole])

  const handleReorder = async (orderId: number) => {
    try {
      setReorderingId(orderId)
      await apiClient.reorder(orderId)
      // Refresh orders to show the new order
      loadOrders()
    } catch (err: any) {
      console.error("Failed to reorder:", err)
      setError("Failed to reorder. Please try again.")
    } finally {
      setReorderingId(null)
    }
  }

  const loadMoreOrders = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    loadOrders(nextPage, true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Order History</h1>
          <p className="text-xl text-muted-foreground mb-8">Please log in to view your order history</p>
          <Button onClick={() => window.location.reload()}>Sign In</Button>
        </div>
      </div>
    )
  }

  if (userRole !== "CUSTOMER") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Order History</h1>
          <p className="text-xl text-muted-foreground">This page is only available for customers</p>
        </div>
      </div>
    )
  }

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount + order.deliveryFee, 0)
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Order History</h1>
          <p className="text-xl text-muted-foreground">Track your past orders and experiences</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="group relative overflow-hidden border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl text-primary flex items-center font-semibold">
                <Package className="w-6 h-6 mr-2" />
                {totalOrders}
              </CardTitle>
              <CardDescription className="text-base">Total Orders</CardDescription>
            </CardHeader>
          </Card>
          <Card className="group relative overflow-hidden border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl text-primary flex items-center font-semibold">
                <DollarSign className="w-6 h-6 mr-2" />
                ${totalSpent.toFixed(2)}
              </CardTitle>
              <CardDescription className="text-base">Total Spent</CardDescription>
            </CardHeader>
          </Card>
          <Card className="group relative overflow-hidden border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl text-primary flex items-center font-semibold">
                <Star className="w-6 h-6 mr-2" />
                ${averageOrderValue.toFixed(2)}
              </CardTitle>
              <CardDescription className="text-base">Average Order Value</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your orders...</span>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="group relative overflow-hidden border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-foreground/10">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold tracking-tight">Order #{order.id}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1.5 text-base">
                        <Clock className="h-4 w-4 text-foreground/70" />
                        {new Date(order.createdAt).toLocaleDateString()} • Vendor ID: {order.vendorId}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {formatStatus(order.orderStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Items Ordered:</h4>
                    <ul className="text-muted-foreground space-y-2">
                      {order.orderItems?.map((item, index) => {
                        const name = (item as any).menuItem?.name || (item as any).menuItemName || `Item ${item.menuItemId}`
                        const quantity = Number(item.quantity || 1)
                        const unitRaw = (item as any).price ?? (item as any).unitPrice ?? ((((item as any).totalPrice) ?? 0) / (quantity || 1))
                        const unitPrice = Number(unitRaw || 0)
                        return (
                          <li key={index} className="flex items-center justify-between py-2 px-3 rounded-lg border bg-muted/40">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-foreground/70" />
                              <span className="font-medium">{name}</span>
                              <span className="text-sm text-muted-foreground">x{quantity}</span>
                            </div>
                            <span className="font-medium">${unitPrice.toFixed(2)}</span>
                          </li>
                        )
                      }) || (
                        <li className="text-muted-foreground">No items details available</li>
                      )}
                    </ul>
                  </div>

                  {order.specialInstructions && (
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <h4 className="font-semibold mb-1 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        Special Instructions:
                      </h4>
                      <p className="text-muted-foreground text-sm">{order.specialInstructions}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-border">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {
                          (() => {
                            const ta = Number(order.totalAmount || 0)
                            const df = Number(order.deliveryFee || 0)
                            return `$${(ta + df).toFixed(2)}`
                          })()
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {
                          (() => {
                            const ta = Number(order.totalAmount || 0)
                            const df = Number(order.deliveryFee || 0)
                            return `Subtotal: $${ta.toFixed(2)} + $${df.toFixed(2)} delivery`
                          })()
                        }
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          order.paymentStatus === "PAID" ?
                            "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1" :
                            "rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1"
                        }>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order.id)}
                        disabled={reorderingId === order.id}
                        className="sm:w-auto w-full"
                      >
                        {reorderingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <RotateCcw className="w-4 h-4 mr-1" />
                        )}
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="sm:w-auto w-full">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Orders */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start exploring vendors and place your first order!
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Browse Vendors
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {!loading && orders.length > 0 && hasMore && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={loadMoreOrders} disabled={loading} className="px-8">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More Orders"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
