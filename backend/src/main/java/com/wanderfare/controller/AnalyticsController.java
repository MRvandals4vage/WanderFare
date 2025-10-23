package com.wanderfare.controller;

import com.wanderfare.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/vendors/analytics")
@PreAuthorize("hasRole('VENDOR')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Vendor Analytics", description = "Vendor analytics and reporting endpoints")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get vendor dashboard analytics", description = "Get comprehensive analytics for vendor dashboard")
    public ResponseEntity<Map<String, Object>> getVendorDashboard(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            Authentication authentication) {
        
        Long vendorId = getCurrentVendorId(authentication);
        
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        Map<String, Object> analytics = analyticsService.getVendorAnalytics(vendorId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/price-prediction")
    @Operation(summary = "Get price prediction data", description = "Get AI-powered price prediction recommendations")
    public ResponseEntity<Map<String, Object>> getPricePrediction(Authentication authentication) {
        Long vendorId = getCurrentVendorId(authentication);
        Map<String, Object> predictionData = analyticsService.getPricePredictionData(vendorId);
        return ResponseEntity.ok(predictionData);
    }

    @GetMapping("/profits")
    @Operation(summary = "Get profit analytics", description = "Get detailed profit analysis and trends")
    public ResponseEntity<Map<String, Object>> getProfitAnalytics(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            Authentication authentication) {
        
        Long vendorId = getCurrentVendorId(authentication);
        
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        Map<String, Object> profitData = analyticsService.getProfitAnalytics(vendorId, startDate, endDate);
        return ResponseEntity.ok(profitData);
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
