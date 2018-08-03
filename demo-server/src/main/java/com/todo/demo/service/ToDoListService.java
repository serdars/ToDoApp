package com.todo.demo.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todo.demo.exception.ResourceNotFoundException;
import com.todo.demo.model.ToDoItem;
import com.todo.demo.model.ToDoList;
import com.todo.demo.model.User;
import com.todo.demo.payload.ToDoListRequest;
import com.todo.demo.repository.ToDoItemRepository;
import com.todo.demo.repository.ToDoListRepository;
import com.todo.demo.repository.UserRepository;
import com.todo.demo.security.UserPrincipal;

@Service
public class ToDoListService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ToDoListRepository toDoListRepository;
	
	@Autowired
	private ToDoItemRepository toDoItemRepository;
	
	public ToDoList createToDoList(UserPrincipal currentUser, ToDoListRequest toDoListRequest) {
		ToDoList toDoList = new ToDoList();
		toDoList.setName(toDoListRequest.getName());
		User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));
        toDoList.setOwner(user);
        return toDoListRepository.save(toDoList);
    }
	
	public ToDoList getUserToDoListById(UserPrincipal currentUser, Long listId) {
		return toDoListRepository.findByIdAndOwnerId(listId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoList", "id", listId));
	}
	
	public Set<ToDoList> getUserToDoLists(UserPrincipal currentUser) {
		return toDoListRepository.findByOwnerId(currentUser.getId());
    }
	
	public Set<ToDoItem> getUserToDoListItemsById(UserPrincipal currentUser, Long listId) {
		ToDoList toDoList = toDoListRepository.findByIdAndOwnerId(listId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoList", "id", listId));
		return toDoItemRepository.findByToDoListId(toDoList.getId());
    }
	
	@Transactional
	public boolean deleteToDoList(UserPrincipal currentUser, Long listId) {
		ToDoList toDoList = toDoListRepository.findByIdAndOwnerId(listId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoList", "id", listId));
		Set<ToDoItem> toDoItems = toDoItemRepository.findByToDoListId(toDoList.getId());
		//toDoItemRepository.saveAll(toDoItems.stream().map(e-> {e.getDependsTo().clear(); return e;}).collect(Collectors.toSet()));
		toDoItemRepository.deleteAll(toDoItems);
		toDoListRepository.delete(toDoList);
		return true;
	}

}
