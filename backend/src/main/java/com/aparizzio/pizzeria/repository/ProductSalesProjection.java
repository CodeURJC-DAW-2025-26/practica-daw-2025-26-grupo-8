package com.aparizzio.pizzeria.repository;

public interface ProductSalesProjection {
    Long getProductId();

    String getName();

    Long getCount();
}