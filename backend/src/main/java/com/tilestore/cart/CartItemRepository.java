package com.tilestore.cart;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartKeyOrderByIdAsc(String cartKey);
    Optional<CartItem> findByCartKeyAndProductId(String cartKey, Long productId);
}
