package com.fresherscafe.backend.dto;

import java.math.BigDecimal;

public class CartItemResponse {

    private Long id;
    private String name;
    private BigDecimal price;
    private String image;
    private Integer quantity;

    public CartItemResponse(Long id, String name, BigDecimal price, String image, Integer quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }

    public Integer getQuantity() {
        return quantity;
    }
}
