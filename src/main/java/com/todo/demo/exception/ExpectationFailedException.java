package com.todo.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@ResponseStatus(HttpStatus.EXPECTATION_FAILED)
@Getter
public class ExpectationFailedException extends RuntimeException  {
	
	private String message;

    public ExpectationFailedException( String message) {
        super(message);
        this.message = message;
    }

}
