package com.todo.demo.payload;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
public class ToDoItemResponse {
	
	private Long id;

	private String name;
	
	private String description;
	
	private Date deadline;
	
	private String itemStatus;
	
	private Date createdAt;

}
