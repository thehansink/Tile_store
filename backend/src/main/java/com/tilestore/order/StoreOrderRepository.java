package com.tilestore.order;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreOrderRepository extends JpaRepository<StoreOrder, Long> {
    List<StoreOrder> findByCartKeyOrderByCreatedAtDesc(String cartKey);
}
