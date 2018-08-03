package com.todo.demo.payload;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ToDoItemRequest {
	
	private String name;
	
	private String description;

	private Date deadline;
	
	private Long toDoListId;

}
