"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, DollarSign, Star, RotateCcw, MessageSquare } from "lucide-react"
import { apiClient, Order } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "bg-green-100 text-green-800"
    case "PREPARING":
      return "bg-blue-100 text-blue-800"
    case "OUT_FOR_DELIVERY":
      return "bg-purple-100 text-purple-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "CANCELLED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Order History</h1>
          <p className="text-xl text-muted-foreground">Track your past orders and experiences</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary flex items-center">
                <Package className="w-6 h-6 mr-2" />
                {totalOrders}
              </CardTitle>
              <CardDescription>Total Orders</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary flex items-center">
                <DollarSign className="w-6 h-6 mr-2" />
                ${totalSpent.toFixed(2)}
              </CardTitle>
              <CardDescription>Total Spent</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary flex items-center">
                <Star className="w-6 h-6 mr-2" />
                ${averageOrderValue.toFixed(2)}
              </CardTitle>
              <CardDescription>Average Order Value</CardDescription>
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
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription>
                        {new Date(order.createdAt).toLocaleDateString()} • 
                        Vendor ID: {order.vendorId}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {formatStatus(order.orderStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Items Ordered:</h4>
                      <ul className="text-muted-foreground space-y-1">
                        {order.orderItems?.map((item, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                              <span>{item.menuItem?.name || `Item ${item.menuItemId}`}</span>
                              <span className="ml-2 text-sm">x{item.quantity}</span>
                            </div>
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </li>
                        )) || (
                          <li className="text-muted-foreground">No items details available</li>
                        )}
                      </ul>
                    </div>

                    {order.specialInstructions && (
                      <div>
                        <h4 className="font-semibold mb-1">Special Instructions:</h4>
                        <p className="text-muted-foreground text-sm">{order.specialInstructions}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-lg">
                            ${(order.totalAmount + order.deliveryFee).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (${order.totalAmount.toFixed(2)} + ${order.deliveryFee.toFixed(2)} delivery)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className={
                            order.paymentStatus === "PAID" ? "text-green-600" : "text-orange-600"
                          }>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReorder(order.id)}
                          disabled={reorderingId === order.id}
                        >
                          {reorderingId === order.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <RotateCcw className="w-4 h-4 mr-1" />
                          )}
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
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
            <Button variant="outline" onClick={loadMoreOrders} disabled={loading}>
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
