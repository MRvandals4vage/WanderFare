"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShoppingCart, Plus, Minus, ArrowLeft, Star, MapPin, Clock } from "lucide-react"
import { apiClient, Vendor, MenuItem } from "@/lib/api"
import type { PageType } from "@/app/page"

interface VendorMenuPageProps {
  vendorId: number
  setCurrentPage: (page: PageType) => void
}

interface CartItem extends MenuItem {
  quantity: number
}

export function VendorMenuPage({ vendorId, setCurrentPage }: VendorMenuPageProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [placingOrder, setPlacingOrder] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadVendorAndMenu()
  }, [vendorId])

  const loadVendorAndMenu = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [vendorData, menuData] = await Promise.all([
        apiClient.getVendorById(vendorId),
        apiClient.getVendorMenu(vendorId)
      ])
      
      setVendor(vendorData)
      setMenuItems(menuData)
    } catch (err: any) {
      console.error("Failed to load vendor menu:", err)
      setError("Failed to load menu. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
      }
      return prev.filter(i => i.id !== itemId)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = vendor?.deliveryFee || 0
    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee
    }
  }

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address")
      return
    }

    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }

    const { total } = calculateTotal()
    const minimumOrder = vendor?.minimumOrder || 0
    if (total < minimumOrder) {
      setError(`Minimum order amount is $${minimumOrder.toFixed(2)}`)
      return
    }

    try {
      setPlacingOrder(true)
      setError("")
      setSuccess("")

      const orderData = {
        vendorId: vendorId,
        deliveryAddress: deliveryAddress.trim(),
        specialInstructions: specialInstructions.trim() || undefined,
        orderItems: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      }

      await apiClient.createOrder(orderData)
      
      setSuccess("Order placed successfully!")
      setCart([])
      setDeliveryAddress("")
      setSpecialInstructions("")
      
      // Redirect to history page after 2 seconds
      setTimeout(() => {
        setCurrentPage("history")
      }, 2000)
    } catch (err: any) {
      console.error("Failed to place order:", err)
      setError(err.message || "Failed to place order. Please try again.")
    } finally {
      setPlacingOrder(false)
    }
  }

  const categories = ["all", ...new Set(menuItems.map(item => item.category))]
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory && item.isAvailable
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading menu...</span>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Vendor Not Found</h1>
          <Button onClick={() => setCurrentPage("vendors")}>Back to Vendors</Button>
        </div>
      </div>
    )
  }

  const { subtotal, deliveryFee, total } = calculateTotal()

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setCurrentPage("vendors")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vendors
        </Button>

        {/* Vendor Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{vendor.businessName}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {vendor.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Star className="w-4 h-4 mr-1" />
                {vendor.rating?.toFixed(1) || "New"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {vendor.city}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {vendor.openingTime?.slice(0, 5)} - {vendor.closingTime?.slice(0, 5)}
              </div>
              <Badge variant="outline">{vendor.cuisineType}</Badge>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-medium">Delivery Fee:</span> ${vendor.deliveryFee?.toFixed(2) || "0.00"}
              {vendor.minimumOrder && vendor.minimumOrder > 0 && (
                <span className="ml-4">
                  <span className="font-medium">Minimum Order:</span> ${vendor.minimumOrder.toFixed(2)}
                </span>
              )}
            </div>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === "all" ? "All" : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </div>
                      <span className="text-lg font-bold text-primary ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.isVegetarian && <Badge variant="secondary">Vegetarian</Badge>}
                      {item.isVegan && <Badge variant="secondary">Vegan</Badge>}
                      {item.isGlutenFree && <Badge variant="secondary">Gluten Free</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full"
                      disabled={!item.isAvailable}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No menu items found
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Your Cart ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(item)}
                              className="h-7 w-7 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div>
                        <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                        <Textarea
                          id="deliveryAddress"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Enter your delivery address"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialInstructions">Special Instructions</Label>
                        <Textarea
                          id="specialInstructions"
                          value={specialInstructions}
                          onChange={(e) => setSpecialInstructions(e.target.value)}
                          placeholder="Any special requests?"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={handlePlaceOrder}
                        className="w-full"
                        disabled={placingOrder}
                      >
                        {placingOrder ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="w-full"
                        disabled={placingOrder}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
