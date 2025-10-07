package com.wanderfare.controller;

import com.wanderfare.dto.VendorDto;
import com.wanderfare.service.OrderService;
import com.wanderfare.service.UserService;
import com.wanderfare.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin management endpoints")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get dashboard statistics", description = "Get platform statistics for admin dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Long> userStats = userService.getUserStatistics();
        
        // Add more statistics as needed
        return ResponseEntity.ok(Map.of(
            "userStats", userStats,
            "totalVendors", userStats.get("vendors"),
            "totalCustomers", userStats.get("customers")
        ));
    }

    @GetMapping("/vendors/pending")
    @Operation(summary = "Get pending vendors", description = "Get list of vendors pending approval")
    public ResponseEntity<List<VendorDto>> getPendingVendors() {
        List<VendorDto> pendingVendors = vendorService.getPendingVendors();
        return ResponseEntity.ok(pendingVendors);
    }

    @PostMapping("/vendors/{vendorId}/approve")
    @Operation(summary = "Approve vendor", description = "Approve vendor registration")
    public ResponseEntity<String> approveVendor(@PathVariable Long vendorId) {
        vendorService.approveVendor(vendorId);
        return ResponseEntity.ok("Vendor approved successfully");
    }

    @PostMapping("/vendors/{vendorId}/reject")
    @Operation(summary = "Reject vendor", description = "Reject vendor registration")
    public ResponseEntity<String> rejectVendor(@PathVariable Long vendorId) {
        vendorService.rejectVendor(vendorId);
        return ResponseEntity.ok("Vendor rejected successfully");
    }

    @PostMapping("/vendors/{vendorId}/deactivate")
    @Operation(summary = "Deactivate vendor", description = "Deactivate vendor account")
    public ResponseEntity<String> deactivateVendor(@PathVariable Long vendorId) {
        vendorService.deactivateVendor(vendorId);
        return ResponseEntity.ok("Vendor deactivated successfully");
    }

    @PostMapping("/vendors/{vendorId}/activate")
    @Operation(summary = "Activate vendor", description = "Activate vendor account")
    public ResponseEntity<String> activateVendor(@PathVariable Long vendorId) {
        vendorService.activateVendor(vendorId);
        return ResponseEntity.ok("Vendor activated successfully");
    }

    @PostMapping("/users/{userId}/deactivate")
    @Operation(summary = "Deactivate user", description = "Deactivate user account")
    public ResponseEntity<String> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @PostMapping("/users/{userId}/activate")
    @Operation(summary = "Activate user", description = "Activate user account")
    public ResponseEntity<String> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok("User activated successfully");
    }

    @GetMapping("/analytics/revenue")
    @Operation(summary = "Get platform revenue analytics", description = "Get revenue analytics for the platform")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        // Calculate platform-wide revenue
        // This is a simplified version - in real implementation, you'd have more complex analytics
        Map<String, Object> analytics = Map.of(
            "period", Map.of("start", startDate, "end", endDate),
            "totalRevenue", BigDecimal.ZERO, // Implement actual calculation
            "totalOrders", 0L,
            "averageOrderValue", BigDecimal.ZERO
        );

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/vendors/{vendorId}/analytics")
    @Operation(summary = "Get vendor analytics", description = "Get analytics for specific vendor")
    public ResponseEntity<Map<String, Object>> getVendorAnalytics(
            @PathVariable Long vendorId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        BigDecimal revenue = orderService.calculateVendorRevenue(vendorId, startDate, endDate);
        
        Map<String, Object> analytics = Map.of(
            "vendorId", vendorId,
            "period", Map.of("start", startDate, "end", endDate),
            "revenue", revenue
        );

        return ResponseEntity.ok(analytics);
    }
}
