package com.tilestore.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrueOrderByIdDesc();
    List<Product> findByCategoryAndActiveTrueOrderByIdDesc(String category);
}
