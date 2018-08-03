package com.todo.demo.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.todo.demo.model.audit.UserDateAudit;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "to_do_items")
@Getter @Setter
public class ToDoItem extends UserDateAudit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 100)
	private String name;

	@Size(max = 500)
	private String description;

	private Date deadline;

	@Enumerated(EnumType.STRING)
	private ToDoItemStatus itemStatus;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "to_do_list_id", nullable = false)
	private ToDoList toDoList;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "owned_by", nullable = false)
	private User owner;
	
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "to_do_item_dependencies",
            joinColumns = { @JoinColumn(name = "dependent_id") },
            inverseJoinColumns = { @JoinColumn(name = "depends_to_id") })
    private Set<ToDoItem> dependsTo = new HashSet<>();
	
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "to_do_item_dependencies",
            joinColumns = { @JoinColumn(name = "depends_to_id") },
            inverseJoinColumns = { @JoinColumn(name = "dependent_id") })
    private Set<ToDoItem> dependedOn = new HashSet<>();

	@Override
	public boolean equals(Object obj) {
		return this.getId() == ((ToDoItem)obj).getId() ? true : false;
	}

}
