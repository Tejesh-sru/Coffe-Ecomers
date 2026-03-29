package com.fresherscafe.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fresherscafe.backend.dto.CartItemRequest;
import com.fresherscafe.backend.dto.CartItemResponse;
import com.fresherscafe.backend.dto.CartQuantityRequest;
import com.fresherscafe.backend.model.AppUser;
import com.fresherscafe.backend.model.CartItem;
import com.fresherscafe.backend.repository.CartItemRepository;

@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItemResponse> getCart(AppUser user) {
        return cartItemRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CartItemResponse> addToCart(AppUser user, CartItemRequest request) {
        CartItem cartItem = cartItemRepository.findByUserAndProductName(user, request.getName())
                .orElseGet(CartItem::new);

        cartItem.setUser(user);
        cartItem.setProductName(request.getName());
        cartItem.setPrice(request.getPrice());
        cartItem.setImage(request.getImage());
        int existingQuantity = cartItem.getQuantity() == null ? 0 : cartItem.getQuantity();
        cartItem.setQuantity(existingQuantity + Math.max(1, request.getQuantity()));

        cartItemRepository.save(cartItem);
        return getCart(user);
    }

    public List<CartItemResponse> updateQuantity(AppUser user, CartQuantityRequest request) {
        cartItemRepository.findByUserAndProductName(user, request.getName())
                .ifPresent(item -> {
                    if (request.getQuantity() <= 0) {
                        cartItemRepository.delete(item);
                    } else {
                        item.setQuantity(request.getQuantity());
                        cartItemRepository.save(item);
                    }
                });

        return getCart(user);
    }

    public List<CartItemResponse> removeFromCart(AppUser user, String productName) {
        cartItemRepository.deleteByUserAndProductName(user, productName);
        return getCart(user);
    }

    public List<CartItemResponse> clearCart(AppUser user) {
        cartItemRepository.deleteByUser(user);
        return getCart(user);
    }

    private CartItemResponse mapToResponse(CartItem cartItem) {
        return new CartItemResponse(
                cartItem.getId(),
                cartItem.getProductName(),
                cartItem.getPrice(),
                cartItem.getImage(),
                cartItem.getQuantity());
    }
}
