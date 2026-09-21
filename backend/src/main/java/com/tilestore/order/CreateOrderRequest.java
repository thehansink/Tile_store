package com.tilestore.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateOrderRequest(
        @NotBlank String receiverName,
        @Pattern(regexp = "^1\\d{10}$", message = "请输入 11 位手机号") String receiverPhone,
        @NotBlank String shippingAddress,
        @NotBlank String paymentMethod) {
}
