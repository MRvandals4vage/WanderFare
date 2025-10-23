package com.wanderfare.repository;

import com.wanderfare.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByCustomerId(Long customerId);
    
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);
    
    List<Order> findByVendorId(Long vendorId);
    
    Page<Order> findByVendorId(Long vendorId, Pageable pageable);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByPaymentStatus(Order.PaymentStatus paymentStatus);
    
    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId AND o.status = :status")
    List<Order> findByCustomerIdAndStatus(@Param("customerId") Long customerId, 
                                         @Param("status") Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.vendor.id = :vendorId AND o.status = :status")
    List<Order> findByVendorIdAndStatus(@Param("vendorId") Long vendorId, 
                                       @Param("status") Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT o FROM Order o WHERE o.vendor.id = :vendorId AND " +
           "o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByVendorIdAndDateRange(@Param("vendorId") Long vendorId,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(o.finalAmount) FROM Order o WHERE o.vendor.id = :vendorId AND " +
           "o.status <> 'CANCELLED' AND o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateVendorRevenue(@Param("vendorId") Long vendorId,
                                     @Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    Page<Order> findAllOrderByCreatedAtDesc(Pageable pageable);
}
