"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const dashboardStats = {
  totalVendors: 247,
  activeVendors: 189,
  totalCustomers: 12450,
  activeCustomers: 8920,
  totalOrders: 45230,
  monthlyRevenue: 125400,
  avgOrderValue: 18.75,
  customerSatisfaction: 4.6,
}

const recentActivity = [
  {
    id: 1,
    type: "vendor_registration",
    message: "New vendor 'Spicy Noodle House' registered",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "customer_complaint",
    message: "Customer complaint about 'Street Tacos Express'",
    timestamp: "4 hours ago",
    status: "urgent",
  },
  {
    id: 3,
    type: "order_milestone",
    message: "Platform reached 45,000 total orders",
    timestamp: "6 hours ago",
    status: "success",
  },
  {
    id: 4,
    type: "vendor_approval",
    message: "Approved vendor 'Healthy Bowls Co.'",
    timestamp: "8 hours ago",
    status: "completed",
  },
  {
    id: 5,
    type: "system_alert",
    message: "High traffic detected - servers scaling up",
    timestamp: "12 hours ago",
    status: "info",
  },
]

const topVendors = [
  { name: "Mama's Kitchen", orders: 1250, revenue: 23400, rating: 4.9 },
  { name: "Street Tacos Express", orders: 980, revenue: 18200, rating: 4.7 },
  { name: "Noodle Master", orders: 875, revenue: 19800, rating: 4.8 },
  { name: "Fresh Farm Produce", orders: 720, revenue: 12600, rating: 4.6 },
  { name: "Spice World", orders: 650, revenue: 8900, rating: 4.5 },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "vendor_registration":
      return "👤"
    case "customer_complaint":
      return "⚠️"
    case "order_milestone":
      return "🎉"
    case "vendor_approval":
      return "✅"
    case "system_alert":
      return "🔧"
    default:
      return "📋"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "urgent":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "success":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "info":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Platform overview and key metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">{dashboardStats.totalVendors}</CardTitle>
              <CardDescription>Total Vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dashboardStats.activeVendors} active (
                {((dashboardStats.activeVendors / dashboardStats.totalVendors) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">{dashboardStats.totalCustomers.toLocaleString()}</CardTitle>
              <CardDescription>Total Customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dashboardStats.activeCustomers.toLocaleString()} active (
                {((dashboardStats.activeCustomers / dashboardStats.totalCustomers) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">{dashboardStats.totalOrders.toLocaleString()}</CardTitle>
              <CardDescription>Total Orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Avg: ${dashboardStats.avgOrderValue.toFixed(2)} per order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">${dashboardStats.monthlyRevenue.toLocaleString()}</CardTitle>
              <CardDescription>Monthly Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{dashboardStats.customerSatisfaction}★ satisfaction</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
              <CardDescription>Vendors ranked by orders and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.orders} orders • {vendor.rating}★
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${vendor.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Vendors
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-lg">👥</span>
                <span>Manage Vendors</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <span className="text-lg">🛒</span>
                <span>Manage Customers</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <span className="text-lg">📊</span>
                <span>View Reports</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <span className="text-lg">⚙️</span>
                <span>System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
