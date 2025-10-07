package com.wanderfare.service;

import com.wanderfare.dto.MenuItemDto;
import com.wanderfare.model.MenuItem;
import com.wanderfare.model.Vendor;
import com.wanderfare.repository.MenuItemRepository;
import com.wanderfare.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<MenuItemDto> getMenuItemsByVendor(Long vendorId) {
        return menuItemRepository.findAvailableByVendorId(vendorId)
                .stream()
                .map(item -> modelMapper.map(item, MenuItemDto.class))
                .collect(Collectors.toList());
    }

    public Page<MenuItemDto> getMenuItemsByVendorWithFilters(Long vendorId, String category, 
                                                            Boolean isVegetarian, Boolean isVegan, 
                                                            BigDecimal maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return menuItemRepository.findByVendorWithFilters(vendorId, category, isVegetarian, 
                                                         isVegan, maxPrice, pageable)
                .map(item -> modelMapper.map(item, MenuItemDto.class));
    }

    public List<MenuItemDto> searchMenuItems(Long vendorId, String searchTerm) {
        return menuItemRepository.searchByVendorAndName(vendorId, searchTerm)
                .stream()
                .map(item -> modelMapper.map(item, MenuItemDto.class))
                .collect(Collectors.toList());
    }

    public Optional<MenuItemDto> getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .map(item -> modelMapper.map(item, MenuItemDto.class));
    }

    public Optional<MenuItem> getMenuItemEntityById(Long id) {
        return menuItemRepository.findById(id);
    }

    public MenuItemDto createMenuItem(Long vendorId, MenuItemDto menuItemDto) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        MenuItem menuItem = modelMapper.map(menuItemDto, MenuItem.class);
        menuItem.setVendor(vendor);
        menuItem.setIsAvailable(true);

        MenuItem savedItem = menuItemRepository.save(menuItem);
        return modelMapper.map(savedItem, MenuItemDto.class);
    }

    public MenuItemDto updateMenuItem(Long itemId, MenuItemDto menuItemDto) {
        MenuItem existingItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        // Update fields
        existingItem.setName(menuItemDto.getName());
        existingItem.setDescription(menuItemDto.getDescription());
        existingItem.setPrice(menuItemDto.getPrice());
        existingItem.setCategory(menuItemDto.getCategory());
        existingItem.setIsAvailable(menuItemDto.getIsAvailable());
        existingItem.setIsVegetarian(menuItemDto.getIsVegetarian());
        existingItem.setIsVegan(menuItemDto.getIsVegan());
        existingItem.setIsSpicy(menuItemDto.getIsSpicy());
        existingItem.setPreparationTime(menuItemDto.getPreparationTime());
        existingItem.setImageUrl(menuItemDto.getImageUrl());
        existingItem.setIngredients(menuItemDto.getIngredients());
        existingItem.setNutritionalInfo(menuItemDto.getNutritionalInfo());

        MenuItem savedItem = menuItemRepository.save(existingItem);
        return modelMapper.map(savedItem, MenuItemDto.class);
    }

    public void deleteMenuItem(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItemRepository.delete(menuItem);
    }

    public void toggleMenuItemAvailability(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItem.setIsAvailable(!menuItem.getIsAvailable());
        menuItemRepository.save(menuItem);
    }

    public List<String> getCategoriesByVendor(Long vendorId) {
        return menuItemRepository.findCategoriesByVendorId(vendorId);
    }

    public List<MenuItemDto> getVegetarianItems(Long vendorId) {
        return menuItemRepository.findByVendorIdAndIsAvailable(vendorId, true)
                .stream()
                .filter(MenuItem::getIsVegetarian)
                .map(item -> modelMapper.map(item, MenuItemDto.class))
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getVeganItems(Long vendorId) {
        return menuItemRepository.findByVendorIdAndIsAvailable(vendorId, true)
                .stream()
                .filter(MenuItem::getIsVegan)
                .map(item -> modelMapper.map(item, MenuItemDto.class))
                .collect(Collectors.toList());
    }

    public List<MenuItemDto> getItemsByCategory(Long vendorId, String category) {
        return menuItemRepository.findByVendorIdAndIsAvailable(vendorId, true)
                .stream()
                .filter(item -> category.equals(item.getCategory()))
                .map(item -> modelMapper.map(item, MenuItemDto.class))
                .collect(Collectors.toList());
    }
}
