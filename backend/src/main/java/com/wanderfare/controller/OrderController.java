package com.wanderfare.controller;

import com.wanderfare.dto.OrderDto;
import com.wanderfare.model.Order;
import com.wanderfare.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Order management endpoints")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create order", description = "Create new order for customer")
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody OrderDto orderDto,
            Authentication authentication) {
        Long customerId = getCurrentUserId(authentication);
        OrderDto createdOrder = orderService.createOrder(customerId, orderDto);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'VENDOR', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get order by ID", description = "Get order details by ID")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'VENDOR', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get order by number", description = "Get order details by order number")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/my-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get customer orders", description = "Get paginated list of customer's orders")
    public ResponseEntity<Page<OrderDto>> getCustomerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long customerId = getCurrentUserId(authentication);
        Page<OrderDto> orders = orderService.getCustomerOrders(customerId, page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/vendor/my-orders")
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get vendor orders", description = "Get paginated list of vendor's orders")
    public ResponseEntity<Page<OrderDto>> getVendorOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long vendorId = getCurrentUserId(authentication);
        Page<OrderDto> orders = orderService.getVendorOrders(vendorId, page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get orders by status", description = "Get orders filtered by status")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<OrderDto> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update order status", description = "Update order status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Order.OrderStatus status) {
        OrderDto updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @PatchMapping("/{orderId}/payment-status")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update payment status", description = "Update order payment status")
    public ResponseEntity<OrderDto> updatePaymentStatus(
            @PathVariable Long orderId,
            @RequestParam Order.PaymentStatus paymentStatus) {
        OrderDto updatedOrder = orderService.updatePaymentStatus(orderId, paymentStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cancel order", description = "Cancel order")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reorder/{originalOrderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Reorder", description = "Create new order based on previous order")
    public ResponseEntity<OrderDto> reorderPreviousOrder(
            @PathVariable Long originalOrderId,
            Authentication authentication) {
        Long customerId = getCurrentUserId(authentication);
        OrderDto newOrder = orderService.reorderPreviousOrder(customerId, originalOrderId);
        return ResponseEntity.ok(newOrder);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all orders (Admin)", description = "Get paginated list of all orders for admin")
    public ResponseEntity<Page<OrderDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDto> orders = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(orders);
    }

    private Long getCurrentUserId(Authentication authentication) {
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
