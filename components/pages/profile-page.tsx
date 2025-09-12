"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function ProfilePage() {
  const [stallInfo, setStallInfo] = useState({
    name: "Mama's Kitchen",
    description: "Authentic home-style cooking with love and tradition",
    location: "Downtown Food Court",
    phone: "+1 (555) 123-4567",
    email: "mama@kitchen.com",
  })

  const [products, setProducts] = useState([
    { id: 1, name: "Chicken Curry", price: 12.99, category: "Main Course" },
    { id: 2, name: "Biryani", price: 14.99, category: "Main Course" },
    { id: 3, name: "Naan Bread", price: 3.99, category: "Sides" },
    { id: 4, name: "Samosas", price: 6.99, category: "Appetizers" },
  ])

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
  })

  const handleStallUpdate = (field: string, value: string) => {
    setStallInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      setProducts((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newProduct.name,
          price: Number.parseFloat(newProduct.price),
          category: newProduct.category,
        },
      ])
      setNewProduct({ name: "", price: "", category: "" })
    }
  }

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Vendor Profile</h1>
          <p className="text-xl text-muted-foreground">Manage your stall information and products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stall Information */}
          <Card>
            <CardHeader>
              <CardTitle>Stall Information</CardTitle>
              <CardDescription>Update your basic stall details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stallName">Stall Name</Label>
                <Input
                  id="stallName"
                  value={stallInfo.name}
                  onChange={(e) => handleStallUpdate("name", e.target.value)}
                  placeholder="Enter stall name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={stallInfo.description}
                  onChange={(e) => handleStallUpdate("description", e.target.value)}
                  placeholder="Describe your stall"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={stallInfo.location}
                  onChange={(e) => handleStallUpdate("location", e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={stallInfo.phone}
                  onChange={(e) => handleStallUpdate("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={stallInfo.email}
                  onChange={(e) => handleStallUpdate("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <Button className="w-full">Update Stall Info</Button>
            </CardContent>
          </Card>

          {/* Add New Product */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Add items to your menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="productPrice">Price ($)</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Input
                  id="productCategory"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Main Course, Appetizers"
                />
              </div>
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Products */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Current Products</CardTitle>
            <CardDescription>Manage your existing menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{product.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No products added yet. Add your first product above!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
