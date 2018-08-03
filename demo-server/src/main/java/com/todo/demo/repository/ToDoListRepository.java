package com.todo.demo.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.demo.model.ToDoList;

@Repository
public interface ToDoListRepository extends JpaRepository<ToDoList, Long> {
	
	//Set<ToDoList> findByName(String name);
	
	Optional<ToDoList> findByIdAndOwnerId(Long id, Long ownerId);
	
	Set<ToDoList> findByOwnerId(Long ownerId);

}
