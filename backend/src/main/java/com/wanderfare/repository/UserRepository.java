package com.wanderfare.repository;

import com.wanderfare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = :isActive")
    List<User> findByRoleAndIsActive(@Param("role") User.Role role, @Param("isActive") Boolean isActive);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") User.Role role);
}
