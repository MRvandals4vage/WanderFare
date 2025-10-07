package com.wanderfare.repository;

import com.wanderfare.model.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByVendorId(Long vendorId);
    
    List<MenuItem> findByVendorIdAndIsAvailable(Long vendorId, Boolean isAvailable);
    
    List<MenuItem> findByCategory(String category);
    
    List<MenuItem> findByIsVegetarian(Boolean isVegetarian);
    
    List<MenuItem> findByIsVegan(Boolean isVegan);
    
    @Query("SELECT m FROM MenuItem m WHERE m.vendor.id = :vendorId AND m.isAvailable = true")
    List<MenuItem> findAvailableByVendorId(@Param("vendorId") Long vendorId);
    
    @Query("SELECT m FROM MenuItem m WHERE m.vendor.id = :vendorId AND " +
           "(:category IS NULL OR m.category = :category) AND " +
           "(:isVegetarian IS NULL OR m.isVegetarian = :isVegetarian) AND " +
           "(:isVegan IS NULL OR m.isVegan = :isVegan) AND " +
           "(:maxPrice IS NULL OR m.price <= :maxPrice) AND " +
           "m.isAvailable = true")
    Page<MenuItem> findByVendorWithFilters(@Param("vendorId") Long vendorId,
                                          @Param("category") String category,
                                          @Param("isVegetarian") Boolean isVegetarian,
                                          @Param("isVegan") Boolean isVegan,
                                          @Param("maxPrice") BigDecimal maxPrice,
                                          Pageable pageable);
    
    @Query("SELECT m FROM MenuItem m WHERE m.vendor.id = :vendorId AND " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND " +
           "m.isAvailable = true")
    List<MenuItem> searchByVendorAndName(@Param("vendorId") Long vendorId, 
                                        @Param("searchTerm") String searchTerm);
    
    @Query("SELECT DISTINCT m.category FROM MenuItem m WHERE m.vendor.id = :vendorId")
    List<String> findCategoriesByVendorId(@Param("vendorId") Long vendorId);
}
