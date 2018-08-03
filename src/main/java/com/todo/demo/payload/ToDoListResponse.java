package com.todo.demo.payload;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ToDoListResponse {

	private Long id;

	private String name;
	
	private Date createdAt;

}
