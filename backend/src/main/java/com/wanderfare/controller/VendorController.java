package com.wanderfare.controller;

import com.wanderfare.dto.VendorDto;
import com.wanderfare.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/vendors")
@Tag(name = "Vendors", description = "Vendor management endpoints")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @GetMapping("/browse")
    @Operation(summary = "Browse all approved vendors", description = "Get list of all approved and active vendors")
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        List<VendorDto> vendors = vendorService.getAllApprovedVendors();
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/browse/paginated")
    @Operation(summary = "Browse vendors with pagination", description = "Get paginated list of approved vendors")
    public ResponseEntity<Page<VendorDto>> getVendorsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "businessName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<VendorDto> vendors = vendorService.getVendorsWithPagination(page, size, sortBy, sortDir);
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/search")
    @Operation(summary = "Search vendors", description = "Search vendors by name, cuisine type, or description")
    public ResponseEntity<Page<VendorDto>> searchVendors(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<VendorDto> vendors = vendorService.searchVendors(searchTerm, page, size);
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter vendors", description = "Filter vendors by city, cuisine type, and minimum rating")
    public ResponseEntity<Page<VendorDto>> filterVendors(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<VendorDto> vendors = vendorService.filterVendors(city, cuisineType, minRating, page, size);
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vendor by ID", description = "Get vendor details by ID")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable Long id) {
        return vendorService.getVendorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get vendor profile", description = "Get current vendor's profile")
    public ResponseEntity<VendorDto> getVendorProfile(Authentication authentication) {
        // Get vendor profile for current authenticated vendor
        return vendorService.getVendorById(getCurrentVendorId(authentication))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update vendor profile", description = "Update current vendor's profile")
    public ResponseEntity<VendorDto> updateVendorProfile(
            @RequestBody VendorDto vendorDto,
            Authentication authentication) {
        Long vendorId = getCurrentVendorId(authentication);
        VendorDto updatedVendor = vendorService.updateVendorProfile(vendorId, vendorDto);
        return ResponseEntity.ok(updatedVendor);
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated vendors", description = "Get list of top rated vendors")
    public ResponseEntity<List<VendorDto>> getTopRatedVendors(
            @RequestParam(defaultValue = "10") int limit) {
        List<VendorDto> vendors = vendorService.getTopRatedVendors(limit);
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/cuisine-types")
    @Operation(summary = "Get available cuisine types", description = "Get list of all available cuisine types")
    public ResponseEntity<List<String>> getAvailableCuisineTypes() {
        List<String> cuisineTypes = vendorService.getAvailableCuisineTypes();
        return ResponseEntity.ok(cuisineTypes);
    }

    @GetMapping("/cities")
    @Operation(summary = "Get available cities", description = "Get list of all cities with vendors")
    public ResponseEntity<List<String>> getAvailableCities() {
        List<String> cities = vendorService.getAvailableCities();
        return ResponseEntity.ok(cities);
    }

    private Long getCurrentVendorId(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Unauthenticated access");
        }
        
        // Extract userId from authentication details set by JwtAuthenticationFilter
        Object details = authentication.getDetails();
        if (details instanceof java.util.Map) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> detailsMap = (java.util.Map<String, Object>) details;
            Object userId = detailsMap.get("userId");
            if (userId instanceof Long) {
                return (Long) userId;
            } else if (userId instanceof Integer) {
                return ((Integer) userId).longValue();
            }
        }
        
        throw new IllegalStateException("Unable to extract user ID from authentication");
    }
}
