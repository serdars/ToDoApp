package com.todo.demo.util;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.todo.demo.model.ToDoItem;
import com.todo.demo.model.ToDoList;
import com.todo.demo.payload.ToDoItemResponse;
import com.todo.demo.payload.ToDoListResponse;

@Component
public class ModelPayloadMapper {
	
    private ModelMapper modelMapper = new ModelMapper();
	
	public ToDoListResponse mapToDoListToToDoListResponse(ToDoList toDoList) {
		ToDoListResponse toDoListResponse = modelMapper.map(toDoList, ToDoListResponse.class);
		
		/*toDoListResponse.setToDoItems(
				toDoList.getItems().stream().map(
						toDoItem -> this.mapToDoItemToToDoItemResponse(toDoItem)
						).collect(Collectors.toList()));*/
		
	    return toDoListResponse;
	}
	
	public ToDoItemResponse mapToDoItemToToDoItemResponse(ToDoItem toDoItem) {
		return modelMapper.map(toDoItem, ToDoItemResponse.class);
	}

}
