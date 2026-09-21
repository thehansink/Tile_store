package com.tilestore.order;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final StoreOrderRepository orderRepository;

    public OrderController(OrderService orderService, StoreOrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@RequestParam(defaultValue = "demo-user") String cartKey,
                                @Valid @RequestBody CreateOrderRequest request) {
        return OrderResponse.from(orderService.create(cartKey, request));
    }

    @GetMapping
    public List<OrderResponse> list(@RequestParam(defaultValue = "demo-user") String cartKey) {
        return orderRepository.findByCartKeyOrderByCreatedAtDesc(cartKey).stream().map(OrderResponse::from).toList();
    }

    public record OrderResponse(Long id, String orderNumber, String status, BigDecimal totalAmount,
                                int itemCount, LocalDateTime createdAt) {
        static OrderResponse from(StoreOrder order) {
            return new OrderResponse(order.getId(), order.getOrderNumber(), order.getStatus(), order.getTotalAmount(),
                    order.getItems().size(), order.getCreatedAt());
        }
    }
}
