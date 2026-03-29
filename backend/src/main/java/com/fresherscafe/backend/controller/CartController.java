package com.fresherscafe.backend.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fresherscafe.backend.dto.CartItemRequest;
import com.fresherscafe.backend.dto.CartItemResponse;
import com.fresherscafe.backend.dto.CartQuantityRequest;
import com.fresherscafe.backend.model.AppUser;
import com.fresherscafe.backend.service.AuthService;
import com.fresherscafe.backend.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@Validated
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class CartController {

    private final AuthService authService;
    private final CartService cartService;

    public CartController(AuthService authService, CartService cartService) {
        this.authService = authService;
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItemResponse> getCart(@RequestHeader("Authorization") String authHeader) {
        AppUser user = authService.getUserByToken(authHeader);
        return cartService.getCart(user);
    }

    @PostMapping("/add")
    public List<CartItemResponse> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CartItemRequest request) {
        AppUser user = authService.getUserByToken(authHeader);
        return cartService.addToCart(user, request);
    }

    @PutMapping("/quantity")
    public List<CartItemResponse> updateQuantity(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CartQuantityRequest request) {
        AppUser user = authService.getUserByToken(authHeader);
        return cartService.updateQuantity(user, request);
    }

    @DeleteMapping("/{productName}")
    public List<CartItemResponse> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String productName) {
        AppUser user = authService.getUserByToken(authHeader);
        return cartService.removeFromCart(user, productName);
    }

    @DeleteMapping("/clear")
    public List<CartItemResponse> clearCart(@RequestHeader("Authorization") String authHeader) {
        AppUser user = authService.getUserByToken(authHeader);
        return cartService.clearCart(user);
    }
}
