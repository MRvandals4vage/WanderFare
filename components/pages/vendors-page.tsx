"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, MapPin, Star, Clock, DollarSign, Utensils, TrendingUp } from "lucide-react"
import { apiClient, Vendor } from "@/lib/api"
import type { PageType } from "@/app/page"

interface VendorsPageProps {
  setCurrentPage: (page: PageType) => void
  setSelectedVendorId: (id: number) => void
}

export function VendorsPage({ setCurrentPage, setSelectedVendorId }: VendorsPageProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("rating")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Get unique cities and cuisines for filters
  const cities = [...new Set(vendors.map(v => v.city))].sort()
  const cuisines = [...new Set(vendors.map(v => v.cuisineType))].sort()

  const loadVendors = async () => {
    try {
      setLoading(true)
      setError("")
      
      let response
      if (searchTerm.trim()) {
        response = await apiClient.searchVendors(searchTerm, page, 12)
      } else if (selectedCity !== "all" || selectedCuisine !== "all") {
        const filters: any = { page: page, size: 12 }
        if (selectedCity !== "all") filters.city = selectedCity
        if (selectedCuisine !== "all") filters.cuisineType = selectedCuisine
        response = await apiClient.filterVendors(filters)
      } else {
        response = await apiClient.getVendors({
          page: page,
          size: 12,
          sortBy: sortBy,
          sortDir: "desc"
        })
      }
      
      setVendors(response.content || [])
      setTotalPages((response as any)?.totalPages || Math.ceil((response.content?.length || 0) / 12))
    } catch (err: any) {
      console.error("Failed to load vendors:", err)
      setError("Failed to load vendors. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [page, sortBy])

  const handleSearch = () => {
    setPage(0)
    loadVendors()
  }

  const handleFilter = () => {
    setPage(0)
    loadVendors()
  }

  const formatTime = (time: string) => {
    if (!time) return "N/A"
    return time.slice(0, 5) // Remove seconds
  }

  const isPopularVendor = (vendor: Vendor) => {
    const rating = vendor.rating || 0
    const isVerified = vendor.isApproved
    return rating >= 4.5 && isVerified
  }

  const VendorCard = ({ vendor }: { vendor: Vendor }) => (
    <Card className="group relative overflow-hidden h-full border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-foreground/10">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">{vendor.businessName}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {vendor.description || "Delicious food awaits you!"}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs px-2.5 py-1">
            <Star className="w-3 h-3 mr-1" />
            {vendor.rating?.toFixed(1) || "New"}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-foreground/70" />
            {vendor.city}
          </div>
          <div className="flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-foreground/70" />
            {vendor.cuisineType || "Mixed"}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-foreground/70" />
            {formatTime(vendor.openingTime)} - {formatTime(vendor.closingTime)}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-foreground/70" />
            Delivery: ${vendor.deliveryFee?.toFixed(2) || "0.00"}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-full text-xs px-2.5 py-1">
            {vendor.cuisineType || "Mixed"}
          </Badge>
          {vendor.isApproved && (
            <Badge variant="outline" className="rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1">
              Verified
            </Badge>
          )}
          {isPopularVendor(vendor) && (
            <Badge variant="outline" className="rounded-full bg-[oklch(0.75_0.03_45)] text-[oklch(0.15_0.01_30)] border-[oklch(0.75_0.03_45)] text-xs px-2.5 py-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="sm:w-auto w-full" onClick={() => {
            setSelectedVendorId(vendor.id)
            setCurrentPage("vendor-menu")
          }}>
            View Menu
          </Button>
          <Button variant="outline" className="sm:w-auto w-full" onClick={() => {
            // TODO: Navigate to vendor reviews
            console.log("View reviews for vendor:", vendor.id)
          }}>
            Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Discover Vendors</h1>
          <p className="text-xl text-muted-foreground">
            Find amazing food vendors and explore authentic culinary experiences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                {cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="businessName">Name</SelectItem>
                <SelectItem value="deliveryFee">Delivery Fee</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleFilter} variant="outline" disabled={loading}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading vendors...</span>
          </div>
        )}

        {/* Vendors Grid */}
        {!loading && vendors.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={page >= totalPages - 1 || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && vendors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No vendors found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new vendors.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
