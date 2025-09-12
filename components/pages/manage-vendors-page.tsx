"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock vendor data
const initialVendors = [
  {
    id: 1,
    name: "Mama's Kitchen",
    email: "mama@kitchen.com",
    phone: "+1 (555) 123-4567",
    location: "Downtown Food Court",
    status: "approved",
    joinDate: "2023-08-15",
    orders: 1250,
    rating: 4.9,
    revenue: 23400,
  },
  {
    id: 2,
    name: "Street Tacos Express",
    email: "info@streettacos.com",
    phone: "+1 (555) 234-5678",
    location: "Central Park Area",
    status: "approved",
    joinDate: "2023-09-22",
    orders: 980,
    rating: 4.7,
    revenue: 18200,
  },
  {
    id: 3,
    name: "Spicy Noodle House",
    email: "contact@spicynoodles.com",
    phone: "+1 (555) 345-6789",
    location: "University District",
    status: "pending",
    joinDate: "2024-01-10",
    orders: 0,
    rating: 0,
    revenue: 0,
  },
  {
    id: 4,
    name: "Healthy Bowls Co.",
    email: "hello@healthybowls.com",
    phone: "+1 (555) 456-7890",
    location: "Business District",
    status: "approved",
    joinDate: "2023-11-05",
    orders: 650,
    rating: 4.5,
    revenue: 12800,
  },
  {
    id: 5,
    name: "Pizza Corner",
    email: "orders@pizzacorner.com",
    phone: "+1 (555) 567-8901",
    location: "Mall Food Court",
    status: "suspended",
    joinDate: "2023-07-12",
    orders: 420,
    rating: 3.8,
    revenue: 8900,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    case "rejected":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ManageVendorsPage() {
  const [vendors, setVendors] = useState(initialVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleStatusChange = (vendorId: number, newStatus: string) => {
    setVendors((prev) => prev.map((vendor) => (vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor)))
  }

  const handleRemoveVendor = (vendorId: number) => {
    setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId))
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Manage Vendors</h1>
          <p className="text-xl text-muted-foreground">Approve, monitor, and manage vendor accounts</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-green-600">
                {vendors.filter((v) => v.status === "approved").length}
              </CardTitle>
              <CardDescription>Approved Vendors</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-yellow-600">
                {vendors.filter((v) => v.status === "pending").length}
              </CardTitle>
              <CardDescription>Pending Approval</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-red-600">
                {vendors.filter((v) => v.status === "suspended").length}
              </CardTitle>
              <CardDescription>Suspended</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">{vendors.length}</CardTitle>
              <CardDescription>Total Vendors</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search vendors by name or email..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vendors List */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor List</CardTitle>
            <CardDescription>Manage individual vendor accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-2 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <h3 className="font-semibold text-lg">{vendor.name}</h3>
                      <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <span>📧 {vendor.email}</span>
                      <span>📞 {vendor.phone}</span>
                      <span>📍 {vendor.location}</span>
                      <span>📅 Joined {vendor.joinDate}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <span>
                        <strong>{vendor.orders}</strong> orders
                      </span>
                      <span>
                        <strong>{vendor.rating > 0 ? `${vendor.rating}★` : "No ratings"}</strong>
                      </span>
                      <span>
                        <strong>${vendor.revenue.toLocaleString()}</strong> revenue
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-4">
                    {vendor.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(vendor.id, "approved")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(vendor.id, "rejected")}
                          className="bg-transparent"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {vendor.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(vendor.id, "suspended")}
                        className="bg-transparent border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Suspend
                      </Button>
                    )}
                    {vendor.status === "suspended" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(vendor.id, "approved")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Reactivate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="bg-transparent">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveVendor(vendor.id)}
                      className="bg-transparent border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No vendors found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
