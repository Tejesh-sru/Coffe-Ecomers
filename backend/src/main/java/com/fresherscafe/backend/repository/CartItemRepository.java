package com.fresherscafe.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fresherscafe.backend.model.AppUser;
import com.fresherscafe.backend.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(AppUser user);

    Optional<CartItem> findByUserAndProductName(AppUser user, String productName);

    void deleteByUserAndProductName(AppUser user, String productName);

    void deleteByUser(AppUser user);
}
