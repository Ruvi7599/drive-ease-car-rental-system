package com.example.drive_ease_new;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DriveEaseNewApplication {

	public static void main(String[] args) {
		SpringApplication.run(DriveEaseNewApplication.class, args);
	}
	@Bean
	public ModelMapper modelMapper(){

		return new ModelMapper();
	}
}
