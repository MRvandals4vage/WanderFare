package com.wanderfare.repository;

import com.wanderfare.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderId(Long orderId);
    
    List<OrderItem> findByMenuItemId(Long menuItemId);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.vendor.id = :vendorId")
    List<OrderItem> findByVendorId(@Param("vendorId") Long vendorId);
    
    @Query("SELECT oi.menuItem.name, SUM(oi.quantity) as totalQuantity FROM OrderItem oi " +
           "WHERE oi.order.vendor.id = :vendorId GROUP BY oi.menuItem.id, oi.menuItem.name " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> findPopularItemsByVendor(@Param("vendorId") Long vendorId);
}
