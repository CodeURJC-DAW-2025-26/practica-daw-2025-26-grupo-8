package com.aparizzio.pizzeria.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aparizzio.pizzeria.model.Product;

import java.util.Set;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT p FROM Product p " +
            "WHERE p.id NOT IN (SELECT p2.id FROM Product p2 JOIN p2.allergies a WHERE a IN :excludedAllergens)", countQuery = "SELECT COUNT(p) FROM Product p "
                    +
                    "WHERE p.id NOT IN (SELECT p2.id FROM Product p2 JOIN p2.allergies a WHERE a IN :excludedAllergens)")
    Page<Product> findByExcludedAllergens(@Param("excludedAllergens") Set<String> excludedAllergens, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    List<Product> findByCategoryIdAndIdNot(Long categoryId, Long productId);

    long countByCategoryId(Long categoryId);
}
