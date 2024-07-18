package com.culiso.culiso;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CulisoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CulisoApplication.class, args);
		System.out.println("서버가 성공적으로 열림");
	}

}
