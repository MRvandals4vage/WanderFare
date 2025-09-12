"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock order history data
const orderHistory = [
  {
    id: "ORD-001",
    vendor: "Mama's Kitchen",
    items: ["Chicken Curry", "Basmati Rice", "Naan Bread"],
    total: 24.99,
    date: "2024-01-15",
    status: "Delivered",
    rating: 5,
  },
  {
    id: "ORD-002",
    vendor: "Street Tacos Express",
    items: ["Fish Tacos (3)", "Guacamole", "Churros"],
    total: 18.5,
    date: "2024-01-12",
    status: "Delivered",
    rating: 4,
  },
  {
    id: "ORD-003",
    vendor: "Noodle Master",
    items: ["Tonkotsu Ramen", "Gyoza (6)", "Green Tea"],
    total: 22.75,
    date: "2024-01-10",
    status: "Delivered",
    rating: 5,
  },
  {
    id: "ORD-004",
    vendor: "Fresh Farm Produce",
    items: ["Organic Tomatoes (2lb)", "Fresh Basil", "Bell Peppers"],
    total: 15.3,
    date: "2024-01-08",
    status: "Delivered",
    rating: 4,
  },
  {
    id: "ORD-005",
    vendor: "Spice World",
    items: ["Cardamom Pods", "Cinnamon Sticks", "Star Anise"],
    total: 12.99,
    date: "2024-01-05",
    status: "Delivered",
    rating: 5,
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
      ★
    </span>
  ))
}

export function HistoryPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Order History</h1>
          <p className="text-xl text-muted-foreground">Track your past orders and experiences</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">{orderHistory.length}</CardTitle>
              <CardDescription>Total Orders</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">
                ${orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </CardTitle>
              <CardDescription>Total Spent</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">
                {(orderHistory.reduce((sum, order) => sum + order.rating, 0) / orderHistory.length).toFixed(1)}★
              </CardTitle>
              <CardDescription>Average Rating</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Order History List */}
        <div className="space-y-4">
          {orderHistory.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.vendor}</CardTitle>
                    <CardDescription>
                      Order #{order.id} • {order.date}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Items Ordered:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(order.rating)}
                        <span className="text-sm text-muted-foreground ml-2">Your Rating</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">Load More Orders</Button>
        </div>
      </div>
    </div>
  )
}
