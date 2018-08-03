package com.todo.demo.controller;

import java.net.URI;
import java.util.Set;

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

import com.todo.demo.model.ToDoItem;
import com.todo.demo.payload.ApiResponse;
import com.todo.demo.payload.ToDoItemRequest;
import com.todo.demo.payload.ToDoItemResponse;
import com.todo.demo.security.CurrentUser;
import com.todo.demo.security.UserPrincipal;
import com.todo.demo.service.ToDoItemService;
import com.todo.demo.util.ModelPayloadMapper;

@RestController
@RequestMapping("/api/todoitem")
public class ToDoItemController {
	
	@Autowired
	private ToDoItemService toDoItemService;
	
	@Autowired
	private ModelPayloadMapper modelPayloadMapper;

	@PostMapping(value="/createToDoItem")
	@PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createToDoItem(@CurrentUser UserPrincipal currentUser, @Valid @RequestBody ToDoItemRequest toDoItemRequest) {
		ToDoItem toDoItem = toDoItemService.createToDoItem(currentUser, toDoItemRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{toDoItemId}")
                .buildAndExpand(toDoItem.getId()).toUri();
        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "ToDoItem Created"));
    }
	
	@PostMapping(value="/complete/{itemId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> completeToDoItem(@CurrentUser UserPrincipal currentUser, @PathVariable Long itemId) {
		ToDoItemResponse toDoItemResponse = modelPayloadMapper.mapToDoItemToToDoItemResponse(
				toDoItemService.completeToDoItem(currentUser, itemId));
		return new ResponseEntity<ToDoItemResponse>(toDoItemResponse, HttpStatus.OK);
	}
	
	@DeleteMapping(value="/{itemId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> deleteToDoItem(@CurrentUser UserPrincipal currentUser, @PathVariable Long itemId) {
		toDoItemService.deleteToDoItem(currentUser, itemId);
		return new ResponseEntity<ApiResponse>(new ApiResponse(true, "ToDoItem Deleted"), HttpStatus.OK);
	}
	
	@PostMapping(value="/depend/{dependentItemId}/{itemId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> createDependency(@CurrentUser UserPrincipal currentUser, @PathVariable Long dependentItemId, @PathVariable Long itemId) {
		toDoItemService.addItemDependency(currentUser, dependentItemId, itemId);
		return new ResponseEntity<ApiResponse>(new ApiResponse(true, "Dependency Created"), HttpStatus.OK);
	}
	
	@PostMapping(value="/free/{dependentItemId}/{itemId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<?> removeDependency(@CurrentUser UserPrincipal currentUser, @PathVariable Long dependentItemId, @PathVariable Long itemId) {
		toDoItemService.removeItemDependency(currentUser, dependentItemId, itemId);
		return new ResponseEntity<ApiResponse>(new ApiResponse(true, "Dependency Removed"), HttpStatus.OK);
	}
	
	@GetMapping(value="/dependency/{itemId}")
	@PreAuthorize("hasRole('USER')")
	public Set<Long> getToDoItemDependencies(@CurrentUser UserPrincipal currentUser,  @PathVariable Long itemId) {
		return toDoItemService.getItemDependencyIdsById(currentUser, itemId);
	}
	
}
