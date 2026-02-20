package com.aparizzio.pizzeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aparizzio.pizzeria.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
