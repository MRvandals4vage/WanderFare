"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { apiClient, Vendor, MenuItem } from "@/lib/api"

export function ProfilePage() {
  const { logout, user, userRole } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [vendorData, setVendorData] = useState<Vendor | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loadingMenu, setLoadingMenu] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  })

  useEffect(() => {
    if (userRole === "VENDOR") {
      loadVendorProfile()
    }
  }, [userRole])

  const loadVendorProfile = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Try to load existing vendor profile
      let profile = await apiClient.getVendorProfile()
      setVendorData(profile)
      
      // Load menu items for this vendor
      if (profile.id) {
        loadMenuItems(profile.id)
      }
    } catch (err: any) {
      console.error("Failed to load profile:", err)
      
      // If profile doesn't exist (404), create a fallback profile
      if (err.status === 404 && user) {
        const fallbackProfile: Vendor = {
          id: 0, // Will be set by backend when saved
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: "",
          businessName: "",
          businessAddress: "",
          city: "",
          postalCode: "",
          cuisineType: "",
          description: "",
          openingTime: "09:00",
          closingTime: "22:00",
          minimumOrder: 0,
          deliveryFee: 0,
          rating: 0,
          totalReviews: 0,
          isApproved: false,
          imageUrl: ""
        }
        setVendorData(fallbackProfile)
        setSuccess("Please fill in your business information below.")
      } else {
        setError("Failed to load profile. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const loadMenuItems = async (vendorId: number) => {
    try {
      setLoadingMenu(true)
      const items = await apiClient.getVendorMenu(vendorId)
      setMenuItems(items)
    } catch (err: any) {
      console.error("Failed to load menu items:", err)
    } finally {
      setLoadingMenu(false)
    }
  }

  const handleUpdate = async () => {
    if (!vendorData) return
    
    try {
      setSaving(true)
      setError("")
      setSuccess("")
      
      // Backend identifies the vendor from JWT; always use PUT /vendors/profile
      const updated = await apiClient.updateVendorProfile(vendorData)
      
      setVendorData(updated)
      setSuccess("Profile updated successfully!")
      
      // Reload menu items if vendor ID changed (new profile created)
      if (updated.id && (vendorData.id === 0 || updated.id !== vendorData.id)) {
        loadMenuItems(updated.id)
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddMenuItem = async () => {
    if (!vendorData || !newItem.name || !newItem.price) {
      setError("Please fill in required fields (name and price)")
      return
    }

    try {
      setSaving(true)
      setError("")
      
      const menuItemData = {
        vendorId: vendorData.id,
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category || "Main",
        isAvailable: true,
        isVegetarian: newItem.isVegetarian,
        isVegan: newItem.isVegan,
        isGlutenFree: newItem.isGlutenFree
      }

      await apiClient.createMenuItem(menuItemData)
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
      })
      
      // Reload menu items
      loadMenuItems(vendorData.id)
      setSuccess("Menu item added successfully!")
    } catch (err: any) {
      console.error("Failed to add menu item:", err)
      setError("Failed to add menu item. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMenuItem = async (itemId: number) => {
    try {
      setSaving(true)
      setError("")
      
      await apiClient.deleteMenuItem(itemId)
      
      // Reload menu items
      if (vendorData?.id) {
        loadMenuItems(vendorData.id)
      }
      setSuccess("Menu item deleted successfully!")
    } catch (err: any) {
      console.error("Failed to delete menu item:", err)
      setError("Failed to delete menu item. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Profile</h1>
          <p className="text-xl text-muted-foreground">No profile data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Vendor Profile</h1>
              <p className="text-xl text-muted-foreground">Manage your business information</p>
            </div>
            <Button
              variant="outline"
              className="min-w-[120px]"
              onClick={() => {
                try { logout() } catch {}
                if (typeof window !== 'undefined') {
                  window.location.replace('/')
                }
              }}
            >
              Log out
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Business Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={vendorData.businessName || ''}
                  onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={vendorData.email || user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={vendorData.description || ''}
                onChange={(e) => setVendorData({...vendorData, description: e.target.value})}
                placeholder="Describe your business"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cuisineType">Cuisine Type</Label>
                <Input
                  id="cuisineType"
                  value={vendorData.cuisineType || ''}
                  onChange={(e) => setVendorData({...vendorData, cuisineType: e.target.value})}
                  placeholder="e.g., Italian, Chinese"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={vendorData.city || ''}
                  onChange={(e) => setVendorData({...vendorData, city: e.target.value})}
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={vendorData.businessAddress || ''}
                  onChange={(e) => setVendorData({...vendorData, businessAddress: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={vendorData.phoneNumber || ''}
                  onChange={(e) => setVendorData({...vendorData, phoneNumber: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  value={vendorData.deliveryFee || ''}
                  onChange={(e) => setVendorData({...vendorData, deliveryFee: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="minimumOrder">Minimum Order ($)</Label>
                <Input
                  id="minimumOrder"
                  type="number"
                  step="0.01"
                  value={vendorData.minimumOrder || ''}
                  onChange={(e) => setVendorData({...vendorData, minimumOrder: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={vendorData.isApproved ? "default" : "secondary"}>
                {vendorData.isApproved ? "✓ Approved" : "⏳ Pending Approval"}
              </Badge>
              {vendorData.rating && (
                <Badge variant="outline">
                  ⭐ {vendorData.rating.toFixed(1)} ({vendorData.totalReviews} reviews)
                </Badge>
              )}
            </div>

            <Button onClick={handleUpdate} className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Menu Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Add New Menu Item */}
          <Card>
            <CardHeader>
              <CardTitle>Add Menu Item</CardTitle>
              <CardDescription>Add new items to your menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>
              
              <div>
                <Label htmlFor="itemDescription">Description</Label>
                <Textarea
                  id="itemDescription"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Describe the item"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemPrice">Price ($) *</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="itemCategory">Category</Label>
                  <Input
                    id="itemCategory"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    placeholder="e.g., Main, Appetizer"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.isVegetarian}
                    onChange={(e) => setNewItem({...newItem, isVegetarian: e.target.checked})}
                  />
                  <span className="text-sm">Vegetarian</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.isVegan}
                    onChange={(e) => setNewItem({...newItem, isVegan: e.target.checked})}
                  />
                  <span className="text-sm">Vegan</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newItem.isGlutenFree}
                    onChange={(e) => setNewItem({...newItem, isGlutenFree: e.target.checked})}
                  />
                  <span className="text-sm">Gluten Free</span>
                </label>
              </div>
              
              <Button onClick={handleAddMenuItem} className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Menu Item
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>Current Menu Items</CardTitle>
              <CardDescription>Manage your existing menu</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMenu ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading menu...</span>
                </div>
              ) : menuItems.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.isVegetarian && <Badge variant="secondary">Vegetarian</Badge>}
                            {item.isVegan && <Badge variant="secondary">Vegan</Badge>}
                            {item.isGlutenFree && <Badge variant="secondary">Gluten Free</Badge>}
                            {!item.isAvailable && <Badge variant="destructive">Unavailable</Badge>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="text-destructive hover:text-destructive mt-1"
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No menu items yet. Add your first item!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <Badge>{userRole}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
