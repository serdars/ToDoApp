package com.todo.demo.model;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.todo.demo.model.audit.UserDateAudit;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "to_do_lists")
@Getter @Setter
public class ToDoList extends UserDateAudit {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@NotBlank
    @Size(max = 100)
    private String name;
	
	@OneToMany(mappedBy="toDoList")
    private Set<ToDoItem> items;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "owned_by", nullable = false)
	private User owner;

}
