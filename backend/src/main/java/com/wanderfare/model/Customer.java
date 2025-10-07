package com.wanderfare.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "customers")
@PrimaryKeyJoinColumn(name = "user_id")
public class Customer extends User {
    
    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "preferences")
    private String preferences;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    // Constructors
    public Customer() {
        super();
        setRole(Role.CUSTOMER);
    }

    // Getters and Setters
    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}
