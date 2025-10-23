package com.wanderfare.controller;

import com.wanderfare.dto.MenuItemDto;
import com.wanderfare.service.MenuItemService;
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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/vendors/menu")
@Tag(name = "Menu Items", description = "Menu item management endpoints")
@CrossOrigin(origins = "*")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get vendor menu", description = "Get all available menu items for a vendor")
    public ResponseEntity<List<MenuItemDto>> getVendorMenu(@PathVariable Long vendorId) {
        List<MenuItemDto> menuItems = menuItemService.getMenuItemsByVendor(vendorId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/vendor/{vendorId}/paginated")
    @Operation(summary = "Get vendor menu with pagination and filters", description = "Get paginated menu items with filters")
    public ResponseEntity<Page<MenuItemDto>> getVendorMenuWithFilters(
            @PathVariable Long vendorId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isVegetarian,
            @RequestParam(required = false) Boolean isVegan,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<MenuItemDto> menuItems = menuItemService.getMenuItemsByVendorWithFilters(
                vendorId, category, isVegetarian, isVegan, maxPrice, page, size);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/vendor/{vendorId}/search")
    @Operation(summary = "Search menu items", description = "Search menu items by name")
    public ResponseEntity<List<MenuItemDto>> searchMenuItems(
            @PathVariable Long vendorId,
            @RequestParam String searchTerm) {
        List<MenuItemDto> menuItems = menuItemService.searchMenuItems(vendorId, searchTerm);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{itemId}")
    @Operation(summary = "Get menu item by ID", description = "Get menu item details by ID")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long itemId) {
        return menuItemService.getMenuItemById(itemId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create menu item", description = "Create new menu item for vendor")
    public ResponseEntity<MenuItemDto> createMenuItem(
            @Valid @RequestBody MenuItemDto menuItemDto,
            Authentication authentication) {
        Long vendorId = getCurrentVendorId(authentication);
        MenuItemDto createdItem = menuItemService.createMenuItem(vendorId, menuItemDto);
        return ResponseEntity.ok(createdItem);
    }

    @PutMapping("/{itemId}")
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update menu item", description = "Update existing menu item")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable Long itemId,
            @Valid @RequestBody MenuItemDto menuItemDto,
            Authentication authentication) {
        // Verify ownership of menu item
        MenuItemDto updatedItem = menuItemService.updateMenuItem(itemId, menuItemDto);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete menu item", description = "Delete menu item")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{itemId}/toggle-availability")
    @PreAuthorize("hasRole('VENDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle menu item availability", description = "Toggle availability of menu item")
    public ResponseEntity<Void> toggleMenuItemAvailability(
            @PathVariable Long itemId,
            Authentication authentication) {
        menuItemService.toggleMenuItemAvailability(itemId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vendor/{vendorId}/categories")
    @Operation(summary = "Get menu categories", description = "Get all categories for vendor's menu")
    public ResponseEntity<List<String>> getMenuCategories(@PathVariable Long vendorId) {
        List<String> categories = menuItemService.getCategoriesByVendor(vendorId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/vendor/{vendorId}/vegetarian")
    @Operation(summary = "Get vegetarian items", description = "Get all vegetarian menu items")
    public ResponseEntity<List<MenuItemDto>> getVegetarianItems(@PathVariable Long vendorId) {
        List<MenuItemDto> items = menuItemService.getVegetarianItems(vendorId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/vendor/{vendorId}/vegan")
    @Operation(summary = "Get vegan items", description = "Get all vegan menu items")
    public ResponseEntity<List<MenuItemDto>> getVeganItems(@PathVariable Long vendorId) {
        List<MenuItemDto> items = menuItemService.getVeganItems(vendorId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/vendor/{vendorId}/category/{category}")
    @Operation(summary = "Get items by category", description = "Get menu items by category")
    public ResponseEntity<List<MenuItemDto>> getItemsByCategory(
            @PathVariable Long vendorId,
            @PathVariable String category) {
        List<MenuItemDto> items = menuItemService.getItemsByCategory(vendorId, category);
        return ResponseEntity.ok(items);
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
