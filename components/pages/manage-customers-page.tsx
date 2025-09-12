"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialCustomers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 111-2222",
    status: "active",
    joinDate: "2023-06-15",
    orders: 45,
    totalSpent: 892.5,
    lastOrder: "2024-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 333-4444",
    status: "active",
    joinDate: "2023-08-22",
    orders: 32,
    totalSpent: 654.75,
    lastOrder: "2024-01-10",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "+1 (555) 555-6666",
    status: "suspended",
    joinDate: "2023-04-10",
    orders: 12,
    totalSpent: 234.5,
    lastOrder: "2023-12-15",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 777-8888",
    status: "active",
    joinDate: "2023-09-05",
    orders: 67,
    totalSpent: 1245.25,
    lastOrder: "2024-01-14",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1 (555) 999-0000",
    status: "inactive",
    joinDate: "2023-03-18",
    orders: 8,
    totalSpent: 156.0,
    lastOrder: "2023-11-20",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ManageCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleStatusChange = (customerId: number, newStatus: string) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === customerId ? { ...customer, status: newStatus } : customer)),
    )
  }

  const handleRemoveCustomer = (customerId: number) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Manage Customers</h1>
          <p className="text-xl text-muted-foreground">Monitor and manage customer accounts and activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-green-600">
                {customers.filter((c) => c.status === "active").length}
              </CardTitle>
              <CardDescription>Active Customers</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-gray-600">
                {customers.filter((c) => c.status === "inactive").length}
              </CardTitle>
              <CardDescription>Inactive Customers</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-red-600">
                {customers.filter((c) => c.status === "suspended").length}
              </CardTitle>
              <CardDescription>Suspended</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">{customers.length}</CardTitle>
              <CardDescription>Total Customers</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search customers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>Manage individual customer accounts and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-2 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span>📧 {customer.email}</span>
                      <span>📞 {customer.phone}</span>
                      <span>📅 Joined {customer.joinDate}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <span>
                        <strong>{customer.orders}</strong> orders
                      </span>
                      <span>
                        <strong>${customer.totalSpent.toFixed(2)}</strong> total spent
                      </span>
                      <span>
                        Last order: <strong>{customer.lastOrder}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-4">
                    {customer.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(customer.id, "suspended")}
                        className="bg-transparent border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Suspend
                      </Button>
                    )}
                    {customer.status === "suspended" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(customer.id, "active")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Reactivate
                      </Button>
                    )}
                    {customer.status === "inactive" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(customer.id, "active")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Activate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="bg-transparent">
                      View Orders
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Send Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveCustomer(customer.id)}
                      className="bg-transparent border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No customers found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
