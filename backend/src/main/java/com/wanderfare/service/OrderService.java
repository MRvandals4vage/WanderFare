package com.wanderfare.service;

import com.wanderfare.dto.OrderDto;
import com.wanderfare.model.*;
import com.wanderfare.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.08"); // 8% tax

    public OrderDto createOrder(Long customerId, OrderDto orderDto) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Vendor vendor = vendorRepository.findById(orderDto.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setVendor(vendor);
        order.setDeliveryAddress(orderDto.getDeliveryAddress());
        order.setSpecialInstructions(orderDto.getSpecialInstructions());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);

        // Calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (OrderDto.OrderItemDto itemDto : orderDto.getOrderItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));
            
            BigDecimal itemTotal = menuItem.getPrice().multiply(new BigDecimal(itemDto.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal deliveryFee = vendor.getDeliveryFee() != null ? vendor.getDeliveryFee() : BigDecimal.ZERO;
        BigDecimal taxAmount = subtotal.multiply(TAX_RATE);
        BigDecimal finalAmount = subtotal.add(deliveryFee).add(taxAmount);

        order.setTotalAmount(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTaxAmount(taxAmount);
        order.setFinalAmount(finalAmount);
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(45)); // Default 45 min

        Order savedOrder = orderRepository.save(order);

        // Create order items
        for (OrderDto.OrderItemDto itemDto : orderDto.getOrderItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setUnitPrice(menuItem.getPrice());
            orderItem.setTotalPrice(menuItem.getPrice().multiply(new BigDecimal(itemDto.getQuantity())));
            orderItem.setSpecialInstructions(itemDto.getSpecialInstructions());

            orderItemRepository.save(orderItem);
        }

        return convertToDto(savedOrder);
    }

    public Optional<OrderDto> getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(this::convertToDto);
    }

    public Optional<OrderDto> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(this::convertToDto);
    }

    public Page<OrderDto> getCustomerOrders(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByCustomerId(customerId, pageable)
                .map(this::convertToDto);
    }

    public Page<OrderDto> getVendorOrders(Long vendorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByVendorId(vendorId, pageable)
                .map(this::convertToDto);
    }

    public List<OrderDto> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        
        if (newStatus == Order.OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }

        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    public OrderDto updatePaymentStatus(Long orderId, Order.PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentStatus(paymentStatus);
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public OrderDto reorderPreviousOrder(Long customerId, Long originalOrderId) {
        Order originalOrder = orderRepository.findById(originalOrderId)
                .orElseThrow(() -> new RuntimeException("Original order not found"));

        if (!originalOrder.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Order does not belong to customer");
        }

        // Create new order DTO based on original order
        OrderDto newOrderDto = new OrderDto();
        newOrderDto.setVendorId(originalOrder.getVendor().getId());
        newOrderDto.setDeliveryAddress(originalOrder.getDeliveryAddress());
        newOrderDto.setSpecialInstructions(originalOrder.getSpecialInstructions());

        // Convert order items
        List<OrderDto.OrderItemDto> orderItems = originalOrder.getOrderItems() != null
                ? originalOrder.getOrderItems().stream()
                .map(item -> {
                    OrderDto.OrderItemDto itemDto = new OrderDto.OrderItemDto();
                    itemDto.setMenuItemId(item.getMenuItem().getId());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setSpecialInstructions(item.getSpecialInstructions());
                    return itemDto;
                })
                .collect(Collectors.toList())
                : new java.util.ArrayList<>();

        newOrderDto.setOrderItems(orderItems);

        return createOrder(customerId, newOrderDto);
    }

    public BigDecimal calculateVendorRevenue(Long vendorId, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal revenue = orderRepository.calculateVendorRevenue(vendorId, startDate, endDate);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    public Page<OrderDto> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAllOrderByCreatedAtDesc(pageable)
                .map(this::convertToDto);
    }

    private OrderDto convertToDto(Order order) {
        OrderDto dto = modelMapper.map(order, OrderDto.class);
        dto.setCustomerId(order.getCustomer().getId());
        dto.setVendorId(order.getVendor().getId());
        dto.setVendorName(order.getVendor().getBusinessName());

        // Convert order items
        List<OrderDto.OrderItemDto> orderItemDtos = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                .map(item -> {
                    OrderDto.OrderItemDto itemDto = new OrderDto.OrderItemDto();
                    itemDto.setMenuItemId(item.getMenuItem().getId());
                    itemDto.setMenuItemName(item.getMenuItem().getName());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setUnitPrice(item.getUnitPrice());
                    itemDto.setTotalPrice(item.getTotalPrice());
                    itemDto.setSpecialInstructions(item.getSpecialInstructions());
                    return itemDto;
                })
                .collect(Collectors.toList())
                : new java.util.ArrayList<>();

        dto.setOrderItems(orderItemDtos);
        return dto;
    }
}
