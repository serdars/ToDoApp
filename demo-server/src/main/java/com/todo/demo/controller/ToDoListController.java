package com.todo.demo.controller;

import java.net.URI;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.todo.demo.model.ToDoList;
import com.todo.demo.payload.ApiResponse;
import com.todo.demo.payload.ToDoItemResponse;
import com.todo.demo.payload.ToDoListRequest;
import com.todo.demo.payload.ToDoListResponse;
import com.todo.demo.security.CurrentUser;
import com.todo.demo.security.UserPrincipal;
import com.todo.demo.service.ToDoListService;
import com.todo.demo.util.ModelPayloadMapper;

@RestController
@RequestMapping("/api/todolist")
public class ToDoListController {
	
	@Autowired
	private ToDoListService toDoListService;
	
	@Autowired
	private ModelPayloadMapper modelPayloadMapper;
	
	@PostMapping(value="/createToDoList")
	@PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createToDoList(@CurrentUser UserPrincipal currentUser, @Valid @RequestBody ToDoListRequest toDoListRequest) {
		ToDoList toDoList = toDoListService.createToDoList(currentUser, toDoListRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{listId}")
                .buildAndExpand(toDoList.getId()).toUri();
        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "ToDoList Created"));
    }
	
	@GetMapping("/{listId}")
	@PreAuthorize("hasRole('USER')")
	public ToDoListResponse getToDoListById(@CurrentUser UserPrincipal currentUser, @PathVariable Long listId) {
		return modelPayloadMapper.mapToDoListToToDoListResponse(
				toDoListService.getUserToDoListById(currentUser, listId));
	}
	
	@GetMapping("/lists")
	@PreAuthorize("hasRole('USER')")
	public Set<ToDoListResponse> getToDoLists(@CurrentUser UserPrincipal currentUser) {
		return toDoListService.getUserToDoLists(currentUser).stream().map(toDoListResponse -> 
			modelPayloadMapper.mapToDoListToToDoListResponse(toDoListResponse)).collect(Collectors.toSet());
	}
	
	@GetMapping("/{listId}/todoitems")
	@PreAuthorize("hasRole('USER')")
	public Set<ToDoItemResponse> getToDoLists(@CurrentUser UserPrincipal currentUser, @PathVariable Long listId) {
		return toDoListService.getUserToDoListItemsById(currentUser, listId).stream().map(toDoItemResponse -> 
			modelPayloadMapper.mapToDoItemToToDoItemResponse(toDoItemResponse)).collect(Collectors.toSet());
	}
	
	@DeleteMapping(value="/{listId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> deleteToDoItem(@CurrentUser UserPrincipal currentUser, @PathVariable Long listId) {
		toDoListService.deleteToDoList(currentUser, listId);
		return new ResponseEntity<ApiResponse>(new ApiResponse(true, "ToDoList Deleted"), HttpStatus.OK);
	}
	
}
