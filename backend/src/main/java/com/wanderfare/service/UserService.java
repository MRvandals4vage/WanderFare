package com.wanderfare.service;

import com.wanderfare.dto.auth.AuthResponse;
import com.wanderfare.dto.auth.LoginRequest;
import com.wanderfare.dto.auth.RegisterRequest;
import com.wanderfare.model.Customer;
import com.wanderfare.model.User;
import com.wanderfare.model.Vendor;
import com.wanderfare.repository.CustomerRepository;
import com.wanderfare.repository.UserRepository;
import com.wanderfare.repository.VendorRepository;
import com.wanderfare.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());

        String token = jwtUtil.generateToken(user, claims);

        return new AuthResponse(token, user.getId(), user.getEmail(), 
                               user.getFirstName(), user.getLastName(), user.getRole());
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User savedUser = switch (registerRequest.getRole()) {
            case CUSTOMER -> {
                Customer customer = createCustomer(registerRequest);
                yield customerRepository.save(customer);
            }
            case VENDOR -> {
                Vendor vendor = createVendor(registerRequest);
                yield vendorRepository.save(vendor);
            }
            case ADMIN -> {
                User admin = createAdmin(registerRequest);
                yield userRepository.save(admin);
            }
            default -> throw new RuntimeException("Invalid role");
        };

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", savedUser.getRole().name());
        claims.put("userId", savedUser.getId());

        String token = jwtUtil.generateToken(savedUser, claims);

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(),
                               savedUser.getFirstName(), savedUser.getLastName(), savedUser.getRole());
    }

    private Customer createCustomer(RegisterRequest request) {
        Customer customer = new Customer();
        setCommonUserFields(customer, request);
        customer.setDeliveryAddress(request.getDeliveryAddress());
        customer.setCity(request.getCity());
        customer.setPostalCode(request.getPostalCode());
        customer.setPreferences(request.getPreferences());
        return customer;
    }

    private Vendor createVendor(RegisterRequest request) {
        Vendor vendor = new Vendor();
        setCommonUserFields(vendor, request);
        vendor.setBusinessName(request.getBusinessName());
        vendor.setBusinessAddress(request.getBusinessAddress());
        vendor.setCity(request.getCity());
        vendor.setPostalCode(request.getPostalCode());
        vendor.setCuisineType(request.getCuisineType());
        vendor.setDescription(request.getDescription());
        vendor.setIsApproved(false); // Vendors need admin approval
        return vendor;
    }

    private User createAdmin(RegisterRequest request) {
        User admin = new User();
        setCommonUserFields(admin, request);
        admin.setRole(User.Role.ADMIN);
        return admin;
    }

    private void setCommonUserFields(User user, RegisterRequest request) {
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setIsActive(true);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());

        return userRepository.save(existingUser);
    }

    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
    }

    public Map<String, Long> getUserStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("customers", userRepository.countByRole(User.Role.CUSTOMER));
        stats.put("vendors", userRepository.countByRole(User.Role.VENDOR));
        stats.put("admins", userRepository.countByRole(User.Role.ADMIN));
        return stats;
    }
}
