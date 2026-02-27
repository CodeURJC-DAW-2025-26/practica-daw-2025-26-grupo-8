package com.aparizzio.pizzeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import com.aparizzio.pizzeria.model.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByProductsId(Long productId);

    @Query("SELECT COUNT(o) FROM OrderTable o")
    long countAllOrders();

    @Query("SELECT COUNT(p) FROM OrderTable o JOIN o.products p")
    long countAllSoldProducts();

    @Query("SELECT COUNT(DISTINCT p.id) FROM OrderTable o JOIN o.products p")
    long countDistinctSoldProducts();

    @Query("""
            SELECT p.title AS name, COUNT(p) AS count
            FROM OrderTable o
            JOIN o.products p
            GROUP BY p.id, p.title
            ORDER BY COUNT(p) DESC
            """)
    List<ProductSalesProjection> findTopSoldProducts(Pageable pageable);
}