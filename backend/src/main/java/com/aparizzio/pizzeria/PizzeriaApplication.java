package com.aparizzio.pizzeria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
// Enables correct JSON serialization for Page objects in REST APIs
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class PizzeriaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PizzeriaApplication.class, args);
	}
}
