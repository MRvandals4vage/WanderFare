package com.wanderfare.repository;

import com.wanderfare.model.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    Optional<Vendor> findByEmail(String email);
    
    List<Vendor> findByIsApproved(Boolean isApproved);
    
    List<Vendor> findByCity(String city);
    
    List<Vendor> findByCuisineType(String cuisineType);
    
    @Query("SELECT v FROM Vendor v WHERE v.isApproved = true AND v.isActive = true")
    List<Vendor> findApprovedAndActive();
    
    @Query("SELECT v FROM Vendor v WHERE v.isApproved = true AND v.isActive = true")
    Page<Vendor> findApprovedAndActive(Pageable pageable);
    
    @Query("SELECT v FROM Vendor v WHERE v.isApproved = true AND v.isActive = true AND " +
           "(:city IS NULL OR v.city = :city) AND " +
           "(:cuisineType IS NULL OR v.cuisineType = :cuisineType) AND " +
           "(:minRating IS NULL OR v.rating >= :minRating)")
    Page<Vendor> findWithFilters(@Param("city") String city, 
                                @Param("cuisineType") String cuisineType,
                                @Param("minRating") BigDecimal minRating,
                                Pageable pageable);
    
    @Query("SELECT v FROM Vendor v WHERE v.isApproved = true AND v.isActive = true AND " +
           "(LOWER(v.businessName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.cuisineType) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Vendor> searchVendors(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.isApproved = :isApproved")
    Long countByIsApproved(@Param("isApproved") Boolean isApproved);
    
    @Query("SELECT v FROM Vendor v ORDER BY v.rating DESC")
    List<Vendor> findTopRatedVendors(Pageable pageable);
}
