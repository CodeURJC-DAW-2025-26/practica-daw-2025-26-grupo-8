package com.aparizzio.pizzeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aparizzio.pizzeria.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {

}