package com.tilestore.order;

import com.tilestore.cart.CartItem;
import com.tilestore.cart.CartItemRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final CartItemRepository cartRepository;
    private final StoreOrderRepository orderRepository;

    public OrderService(CartItemRepository cartRepository, StoreOrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public StoreOrder create(String cartKey, CreateOrderRequest request) {
        List<CartItem> cartItems = cartRepository.findByCartKeyOrderByIdAsc(cartKey);
        if (cartItems.isEmpty()) throw new IllegalArgumentException("购物车为空，无法创建订单");

        StoreOrder order = new StoreOrder();
        order.setOrderNumber("LS" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + ThreadLocalRandom.current().nextInt(1000, 10000));
        order.setCartKey(cartKey);
        order.setReceiverName(request.receiverName());
        order.setReceiverPhone(request.receiverPhone());
        order.setShippingAddress(request.shippingAddress());
        order.setPaymentMethod(request.paymentMethod());
        order.setStatus("PENDING_PAYMENT");

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            OrderItem item = new OrderItem();
            item.setProductId(cartItem.getProduct().getId());
            item.setProductName(cartItem.getProduct().getName());
            item.setUnit(cartItem.getProduct().getUnit());
            item.setUnitPrice(cartItem.getProduct().getPrice());
            item.setQuantity(cartItem.getQuantity());
            order.addItem(item);
            total = total.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setTotalAmount(total);
        StoreOrder saved = orderRepository.save(order);
        cartRepository.deleteAll(cartItems);
        return saved;
    }
}
