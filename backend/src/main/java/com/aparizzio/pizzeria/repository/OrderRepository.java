package com.aparizzio.pizzeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aparizzio.pizzeria.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
