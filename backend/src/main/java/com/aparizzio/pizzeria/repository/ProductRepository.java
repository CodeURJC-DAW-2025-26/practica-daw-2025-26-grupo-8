package com.aparizzio.pizzeria.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.aparizzio.pizzeria.model.Product;

import java.util.Set;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = """
            SELECT p FROM Product p
            WHERE NOT EXISTS (
                SELECT allergy FROM Product p2 JOIN p2.allergies allergy
                WHERE p2 = p
                  AND lower(replace(replace(replace(replace(replace(allergy,
                      'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) IN :excludedAllergens
            )
            """, countQuery = """
            SELECT COUNT(p) FROM Product p
            WHERE NOT EXISTS (
                SELECT allergy FROM Product p2 JOIN p2.allergies allergy
                WHERE p2 = p
                  AND lower(replace(replace(replace(replace(replace(allergy,
                      'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) IN :excludedAllergens
            )
            """)
    Page<Product> findByExcludedAllergens(@Param("excludedAllergens") Set<String> excludedAllergens, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    long countByCategoryId(Long categoryId);
}
