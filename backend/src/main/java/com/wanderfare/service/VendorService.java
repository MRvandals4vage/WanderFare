package com.wanderfare.service;

import com.wanderfare.dto.VendorDto;
import com.wanderfare.model.Vendor;
import com.wanderfare.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<VendorDto> getAllApprovedVendors() {
        return vendorRepository.findApprovedAndActive()
                .stream()
                .map(vendor -> modelMapper.map(vendor, VendorDto.class))
                .collect(Collectors.toList());
    }

    public Page<VendorDto> getVendorsWithPagination(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return vendorRepository.findApprovedAndActive(pageable)
                .map(vendor -> modelMapper.map(vendor, VendorDto.class));
    }

    public Page<VendorDto> searchVendors(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return vendorRepository.searchVendors(searchTerm, pageable)
                .map(vendor -> modelMapper.map(vendor, VendorDto.class));
    }

    public Page<VendorDto> filterVendors(String city, String cuisineType, BigDecimal minRating, 
                                        int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return vendorRepository.findWithFilters(city, cuisineType, minRating, pageable)
                .map(vendor -> modelMapper.map(vendor, VendorDto.class));
    }

    public Optional<VendorDto> getVendorById(Long id) {
        return vendorRepository.findById(id)
                .map(vendor -> modelMapper.map(vendor, VendorDto.class));
    }

    public Optional<Vendor> getVendorEntityById(Long id) {
        return vendorRepository.findById(id);
    }

    public VendorDto updateVendorProfile(Long vendorId, VendorDto vendorDto) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        // Update allowed fields
        vendor.setBusinessName(vendorDto.getBusinessName());
        vendor.setBusinessAddress(vendorDto.getBusinessAddress());
        vendor.setCity(vendorDto.getCity());
        vendor.setPostalCode(vendorDto.getPostalCode());
        vendor.setCuisineType(vendorDto.getCuisineType());
        vendor.setDescription(vendorDto.getDescription());
        vendor.setOpeningTime(vendorDto.getOpeningTime());
        vendor.setClosingTime(vendorDto.getClosingTime());
        vendor.setMinimumOrder(vendorDto.getMinimumOrder());
        vendor.setDeliveryFee(vendorDto.getDeliveryFee());
        vendor.setImageUrl(vendorDto.getImageUrl());
        vendor.setFirstName(vendorDto.getFirstName());
        vendor.setLastName(vendorDto.getLastName());
        vendor.setPhoneNumber(vendorDto.getPhoneNumber());

        Vendor savedVendor = vendorRepository.save(vendor);
        return modelMapper.map(savedVendor, VendorDto.class);
    }

    public void approveVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setIsApproved(true);
        vendorRepository.save(vendor);
    }

    public void rejectVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setIsApproved(false);
        vendorRepository.save(vendor);
    }

    public List<VendorDto> getPendingVendors() {
        return vendorRepository.findByIsApproved(false)
                .stream()
                .map(vendor -> modelMapper.map(vendor, VendorDto.class))
                .collect(Collectors.toList());
    }

    public List<VendorDto> getTopRatedVendors(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return vendorRepository.findTopRatedVendors(pageable)
                .stream()
                .map(vendor -> modelMapper.map(vendor, VendorDto.class))
                .collect(Collectors.toList());
    }

    public List<String> getAvailableCuisineTypes() {
        return vendorRepository.findApprovedAndActive()
                .stream()
                .map(Vendor::getCuisineType)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<String> getAvailableCities() {
        return vendorRepository.findApprovedAndActive()
                .stream()
                .map(Vendor::getCity)
                .distinct()
                .collect(Collectors.toList());
    }

    public void updateVendorRating(Long vendorId, BigDecimal newRating) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        // Simple rating update - in a real system, this would be more complex
        vendor.setRating(newRating);
        vendor.setTotalReviews(vendor.getTotalReviews() + 1);
        vendorRepository.save(vendor);
    }

    public void deactivateVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setIsActive(false);
        vendorRepository.save(vendor);
    }

    public void activateVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setIsActive(true);
        vendorRepository.save(vendor);
    }
}
