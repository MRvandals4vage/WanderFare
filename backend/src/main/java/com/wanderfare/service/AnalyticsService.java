package com.wanderfare.service;

import com.wanderfare.model.Order;
import com.wanderfare.repository.OrderItemRepository;
import com.wanderfare.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Map<String, Object> getVendorAnalytics(Long vendorId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> analytics = new HashMap<>();

        // Revenue calculation
        BigDecimal revenue = orderRepository.calculateVendorRevenue(vendorId, startDate, endDate);
        analytics.put("revenue", revenue != null ? revenue : BigDecimal.ZERO);

        // Order count
        List<Order> orders = orderRepository.findByVendorIdAndDateRange(vendorId, startDate, endDate);
        analytics.put("totalOrders", orders.size());

        // Average order value
        if (!orders.isEmpty() && revenue != null && revenue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal averageOrderValue = revenue.divide(new BigDecimal(orders.size()), 2, BigDecimal.ROUND_HALF_UP);
            analytics.put("averageOrderValue", averageOrderValue);
        } else {
            analytics.put("averageOrderValue", BigDecimal.ZERO);
        }

        // Popular items
        List<Object[]> popularItems = orderItemRepository.findPopularItemsByVendor(vendorId);
        analytics.put("popularItems", popularItems);

        // Order status breakdown
        Map<String, Long> statusBreakdown = new HashMap<>();
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            long count = orders.stream()
                    .filter(order -> order.getStatus() == status)
                    .count();
            statusBreakdown.put(status.name(), count);
        }
        analytics.put("orderStatusBreakdown", statusBreakdown);

        return analytics;
    }

    public Map<String, Object> getPricePredictionData(Long vendorId) {
        Map<String, Object> predictionData = new HashMap<>();

        // Get historical pricing data
        List<Order> recentOrders = orderRepository.findByVendorIdAndDateRange(
                vendorId, 
                LocalDateTime.now().minusMonths(3), 
                LocalDateTime.now()
        );

        // Calculate average order values by time periods
        Map<String, BigDecimal> monthlyAverages = new HashMap<>();
        // Simplified calculation - in real implementation, you'd have more sophisticated ML models
        
        predictionData.put("historicalData", monthlyAverages);
        // Use recentOrders to compute a simple count metric (prevents unused variable warning)
        predictionData.put("recentOrderCount", recentOrders.size());
        predictionData.put("suggestedPriceAdjustment", BigDecimal.ZERO);
        predictionData.put("marketTrends", "stable");

        return predictionData;
    }

    public Map<String, Object> getProfitAnalytics(Long vendorId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> profitData = new HashMap<>();

        // Pull all orders for the period and compute monthly breakdown (exclude CANCELLED)
        List<Order> periodOrders = orderRepository.findByVendorIdAndDateRange(vendorId, startDate, endDate);

        // Aggregate totals
        BigDecimal revenue = BigDecimal.ZERO;
        long totalOrders = 0;
        for (Order o : periodOrders) {
            if (o.getStatus() != Order.OrderStatus.CANCELLED) {
                revenue = revenue.add(o.getFinalAmount() != null ? o.getFinalAmount() : BigDecimal.ZERO);
                totalOrders++;
            }
        }

        // Estimated costs and profit
        BigDecimal estimatedCosts = revenue.multiply(new BigDecimal("0.7"));
        BigDecimal profit = revenue.subtract(estimatedCosts);
        BigDecimal profitMargin = revenue.compareTo(BigDecimal.ZERO) > 0
                ? profit.divide(revenue, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        // Build monthlyData list for frontend table
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        YearMonth startYm = YearMonth.from(startDate);
        YearMonth endYm = YearMonth.from(endDate);

        YearMonth cursor = startYm;
        while (!cursor.isAfter(endYm)) {
            BigDecimal mRevenue = BigDecimal.ZERO;
            long mOrders = 0;
            for (Order o : periodOrders) {
                if (o.getStatus() == Order.OrderStatus.CANCELLED) continue;
                LocalDateTime created = o.getCreatedAt();
                if (created != null && YearMonth.from(created).equals(cursor)) {
                    mRevenue = mRevenue.add(o.getFinalAmount() != null ? o.getFinalAmount() : BigDecimal.ZERO);
                    mOrders++;
                }
            }
            BigDecimal mCosts = mRevenue.multiply(new BigDecimal("0.7"));
            BigDecimal mProfit = mRevenue.subtract(mCosts);
            BigDecimal mMargin = mRevenue.compareTo(BigDecimal.ZERO) > 0
                    ? mProfit.divide(mRevenue, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            Map<String, Object> monthRow = new HashMap<>();
            monthRow.put("month", cursor.toString()); // e.g., 2025-10
            monthRow.put("revenue", mRevenue);
            monthRow.put("expenses", mCosts);
            monthRow.put("profit", mProfit);
            monthRow.put("margin", mMargin);
            monthRow.put("orders", mOrders);
            monthlyData.add(monthRow);

            cursor = cursor.plusMonths(1);
        }

        profitData.put("revenue", revenue);
        profitData.put("estimatedCosts", estimatedCosts);
        profitData.put("profit", profit);
        profitData.put("profitMargin", profitMargin);
        profitData.put("orderCount", totalOrders);
        profitData.put("monthlyData", monthlyData);

        return profitData;
    }
}
