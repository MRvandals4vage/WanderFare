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

        // Update allowed fields - only update if not null
        if (vendorDto.getBusinessName() != null) {
            vendor.setBusinessName(vendorDto.getBusinessName());
        }
        if (vendorDto.getBusinessAddress() != null) {
            vendor.setBusinessAddress(vendorDto.getBusinessAddress());
        }
        if (vendorDto.getCity() != null) {
            vendor.setCity(vendorDto.getCity());
        }
        if (vendorDto.getPostalCode() != null) {
            vendor.setPostalCode(vendorDto.getPostalCode());
        }
        if (vendorDto.getCuisineType() != null) {
            vendor.setCuisineType(vendorDto.getCuisineType());
        }
        if (vendorDto.getDescription() != null) {
            vendor.setDescription(vendorDto.getDescription());
        }
        if (vendorDto.getOpeningTime() != null) {
            vendor.setOpeningTime(vendorDto.getOpeningTime());
        }
        if (vendorDto.getClosingTime() != null) {
            vendor.setClosingTime(vendorDto.getClosingTime());
        }
        if (vendorDto.getMinimumOrder() != null) {
            vendor.setMinimumOrder(vendorDto.getMinimumOrder());
        }
        if (vendorDto.getDeliveryFee() != null) {
            vendor.setDeliveryFee(vendorDto.getDeliveryFee());
        }
        if (vendorDto.getImageUrl() != null) {
            vendor.setImageUrl(vendorDto.getImageUrl());
        }
        if (vendorDto.getFirstName() != null) {
            vendor.setFirstName(vendorDto.getFirstName());
        }
        if (vendorDto.getLastName() != null) {
            vendor.setLastName(vendorDto.getLastName());
        }
        if (vendorDto.getPhoneNumber() != null) {
            vendor.setPhoneNumber(vendorDto.getPhoneNumber());
        }

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
