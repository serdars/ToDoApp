package com.todo.demo.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todo.demo.exception.ExpectationFailedException;
import com.todo.demo.exception.ResourceNotFoundException;
import com.todo.demo.model.ToDoItem;
import com.todo.demo.model.ToDoItemStatus;
import com.todo.demo.model.ToDoList;
import com.todo.demo.model.User;
import com.todo.demo.payload.ToDoItemRequest;
import com.todo.demo.repository.ToDoItemRepository;
import com.todo.demo.repository.ToDoListRepository;
import com.todo.demo.repository.UserRepository;
import com.todo.demo.security.UserPrincipal;

@Service
public class ToDoItemService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ToDoItemRepository toDoItemRepository;

	@Autowired
	private ToDoListRepository toDoListRepository;

	public ToDoItem createToDoItem(UserPrincipal currentUser, ToDoItemRequest toDoItemRequest) {
		ToDoItem toDoItem = new ToDoItem();
		toDoItem.setName(toDoItemRequest.getName());
		toDoItem.setDescription(toDoItemRequest.getDescription());
		toDoItem.setDeadline(toDoItemRequest.getDeadline());
		toDoItem.setItemStatus(ToDoItemStatus.WAITING);
		ToDoList toDoList = toDoListRepository.findById(toDoItemRequest.getToDoListId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoList", "id", toDoItemRequest.getToDoListId()));
		toDoItem.setToDoList(toDoList);
		User user = userRepository.findById(currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));
		toDoItem.setOwner(user);
		return toDoItemRepository.save(toDoItem);
	}

	@Transactional
	public boolean deleteToDoItem(UserPrincipal currentUser, Long itemId) {
		ToDoItem toDoItem = toDoItemRepository.findByIdAndOwnerId(itemId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoItem", "id", itemId));
		/*if(toDoItem.getDependsTo().size()>0) {
			toDoItem.getDependsTo().clear();
			toDoItemRepository.save(toDoItem);
		}*/
		toDoItemRepository.delete(toDoItem);
		return true;
	}

	public ToDoItem completeToDoItem(UserPrincipal currentUser, Long itemId) {
		ToDoItem toDoItem = toDoItemRepository.findByIdAndOwnerId(itemId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoItem", "id", itemId));
		if(toDoItem.getDependsTo().stream().filter(e -> e.getItemStatus().equals(ToDoItemStatus.WAITING)).findFirst().isPresent()){
			throw new ExpectationFailedException("Dependent item not completed.");
		}
		toDoItem.setItemStatus(ToDoItemStatus.COMPLETED);
		return toDoItemRepository.save(toDoItem);
	}

	public void addItemDependency(UserPrincipal currentUser, Long dependentItemId, Long itemId) {
		ToDoItem dependentToDoItem = toDoItemRepository.findByIdAndOwnerId(dependentItemId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoItem", "id", dependentItemId));
		ToDoItem toDoItem = toDoItemRepository.findByIdAndOwnerId(itemId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoItem", "id", itemId));
		Set<ToDoItem> dependsTo = dependentToDoItem.getDependsTo();
		if(dependsTo.add(toDoItem)){
			dependentToDoItem.setDependsTo(dependsTo);
			toDoItemRepository.save(dependentToDoItem);
		}
	}
	
	public void removeItemDependency(UserPrincipal currentUser, Long dependentItemId, Long itemId) {
		ToDoItem dependentToDoItem = toDoItemRepository.findByIdAndOwnerId(dependentItemId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoItem", "id", dependentItemId));
		if(dependentToDoItem.getDependsTo().removeIf(dep -> dep.getId() == itemId)) {
			toDoItemRepository.save(dependentToDoItem);
		} else throw new ResourceNotFoundException("ToDoDependency", "id", itemId);
	}
	
	public Set<Long> getItemDependencyIdsById(UserPrincipal currentUser, Long itemId) {
		ToDoItem toDoItem = toDoItemRepository.findByIdAndOwnerId(itemId, currentUser.getId())
				.orElseThrow(() -> new ResourceNotFoundException("ToDoItem", "id", itemId));
		Set<Long> dependencyIds = new HashSet<Long>();
		for(ToDoItem dep : toDoItem.getDependsTo()) dependencyIds.add(dep.getId());
		return dependencyIds;
    }

}
