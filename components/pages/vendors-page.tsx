"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock vendor data
const foodVendors = [
  {
    id: 1,
    name: "Mama's Kitchen",
    description: "Authentic home-style cooking with love and tradition",
    location: "Downtown Food Court",
    rating: 4.8,
    products: ["Chicken Curry", "Biryani", "Naan Bread", "Samosas"],
    mapEmbedId:
      "pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959404065!5m2!1sen!2sus",
  },
  {
    id: 2,
    name: "Street Tacos Express",
    description: "Fresh Mexican street food made with authentic ingredients",
    location: "Central Park Area",
    rating: 4.6,
    products: ["Fish Tacos", "Carnitas", "Guacamole", "Churros"],
    mapEmbedId:
      "pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959404065!5m2!1sen!2sus",
  },
  {
    id: 3,
    name: "Noodle Master",
    description: "Hand-pulled noodles and traditional Asian soups",
    location: "Chinatown District",
    rating: 4.9,
    products: ["Ramen", "Pho", "Dumplings", "Bao Buns"],
    mapEmbedId:
      "pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959404065!5m2!1sen!2sus",
  },
]

const ingredientVendors = [
  {
    id: 4,
    name: "Fresh Farm Produce",
    description: "Organic vegetables and fruits directly from local farms",
    location: "Farmers Market",
    rating: 4.7,
    products: ["Organic Tomatoes", "Fresh Herbs", "Seasonal Fruits", "Root Vegetables"],
    mapEmbedId:
      "pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959404065!5m2!1sen!2sus",
  },
  {
    id: 5,
    name: "Spice World",
    description: "Premium spices and seasonings from around the globe",
    location: "International Market",
    rating: 4.5,
    products: ["Exotic Spices", "Herb Blends", "Chili Powders", "Vanilla Beans"],
    mapEmbedId:
      "pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959404065!5m2!1sen!2sus",
  },
]

export function VendorsPage() {
  const [activeTab, setActiveTab] = useState("food")

  const VendorCard = ({ vendor }: { vendor: (typeof foodVendors)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{vendor.name}</CardTitle>
            <CardDescription className="mt-1">{vendor.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            ★ {vendor.rating}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">📍 {vendor.location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Embedded Google Maps */}
        <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
          <iframe
            src={`https://www.google.com/maps/embed?${vendor.mapEmbedId}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${vendor.name} location`}
          />
        </div>

        {/* Products List */}
        <div>
          <h4 className="font-semibold mb-2">Popular Items:</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.products.map((product, index) => (
              <Badge key={index} variant="outline">
                {product}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1">View Menu</Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Vendors</h1>
          <p className="text-xl text-muted-foreground">
            Find amazing food vendors and ingredient suppliers in your area
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="food" className="text-lg py-3">
              Food Vendors
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="text-lg py-3">
              Ingredient Suppliers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="food" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ingredientVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
