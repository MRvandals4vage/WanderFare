package com.wanderfare.repository;

import com.wanderfare.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    List<Customer> findByCity(String city);
    
    @Query("SELECT c FROM Customer c WHERE c.isActive = :isActive")
    List<Customer> findByIsActive(@Param("isActive") Boolean isActive);
    
    @Query("SELECT c FROM Customer c WHERE c.city = :city AND c.isActive = true")
    List<Customer> findActiveByCityOrderByCreatedAtDesc(@Param("city") String city);
}
