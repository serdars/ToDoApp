package com.todo.demo.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.demo.model.ToDoItem;

@Repository
public interface ToDoItemRepository extends JpaRepository<ToDoItem, Long> {
	
	Set<ToDoItem> findByToDoListId(Long toDoListId);
	
	Optional<ToDoItem> findByIdAndOwnerId(Long id, Long ownerId);

}
