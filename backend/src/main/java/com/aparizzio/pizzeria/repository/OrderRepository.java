package com.aparizzio.pizzeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aparizzio.pizzeria.model.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByProductsId(Long productId);
}