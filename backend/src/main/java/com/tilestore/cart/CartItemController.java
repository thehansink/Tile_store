package com.tilestore.cart;

import com.tilestore.product.Product;
import com.tilestore.product.ProductRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {
    private final CartItemRepository cartRepository;
    private final ProductRepository productRepository;

    public CartItemController(CartItemRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<CartItem> list(@RequestParam(defaultValue = "demo-user") String cartKey) {
        return cartRepository.findByCartKeyOrderByIdAsc(cartKey);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartItem add(@RequestParam(defaultValue = "demo-user") String cartKey,
                        @Valid @RequestBody AddCartRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("商品不存在：" + request.productId()));
        CartItem item = cartRepository.findByCartKeyAndProductId(cartKey, product.getId()).orElseGet(CartItem::new);
        item.setCartKey(cartKey);
        item.setProduct(product);
        item.setQuantity((item.getQuantity() == null ? 0 : item.getQuantity()) + request.quantity());
        return cartRepository.save(item);
    }

    @PutMapping("/{productId}")
    public CartItem update(@RequestParam(defaultValue = "demo-user") String cartKey,
                           @PathVariable Long productId,
                           @Valid @RequestBody UpdateCartRequest request) {
        CartItem item = cartRepository.findByCartKeyAndProductId(cartKey, productId)
                .orElseThrow(() -> new IllegalArgumentException("购物车中没有这个商品"));
        item.setQuantity(request.quantity());
        return cartRepository.save(item);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@RequestParam(defaultValue = "demo-user") String cartKey, @PathVariable Long productId) {
        cartRepository.findByCartKeyAndProductId(cartKey, productId).ifPresent(cartRepository::delete);
    }

    public record AddCartRequest(@NotNull Long productId, @NotNull @Min(1) Integer quantity) {}
    public record UpdateCartRequest(@NotNull @Min(1) Integer quantity) {}
}
