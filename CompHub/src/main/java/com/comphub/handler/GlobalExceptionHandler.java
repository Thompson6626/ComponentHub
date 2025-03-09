package com.comphub.handler;

import com.comphub.exception.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException exp) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ExceptionResponse.builder()
                        .validationErrors(
                                exp.getBindingResult()
                                        .getAllErrors()
                                        .stream()
                                        .map(ObjectError::getDefaultMessage)
                                        .collect(Collectors.toSet())
                        )
                        .build()
        );
    }


    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(getExceptionResponse(ex));
    }


    @ExceptionHandler({
            IllegalArgumentException.class,
            UserOperationException.class
    })
    public ResponseEntity<ExceptionResponse> handleException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(getExceptionResponse(ex));
    }


    @ExceptionHandler({
            UserNotEnabledException.class,
            UnauthorizedAccessException.class
    })
    public ResponseEntity<ExceptionResponse> handleUserNotEnabledException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(getExceptionResponse(ex));
    }

    @ExceptionHandler({BadCredentialsException.class, TokenExpiredException.class})
    public ResponseEntity<ExceptionResponse> handleTokenExpiredException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(getExceptionResponse(ex));
    }

    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleEmailAlreadyAssociatedException(EntityAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(getExceptionResponse(ex));

    }


    @ExceptionHandler(FileProcessingException.class)
    public ResponseEntity<ExceptionResponse> handleFileProcessingException(FileProcessingException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(getExceptionResponse(ex));
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleException(Exception exp) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ExceptionResponse.builder()
                        .businessErrorDescription("An unexpected error occurred")
                        .message(exp.getMessage())
                        .build()
        );
    }


    private ExceptionResponse getExceptionResponse(Exception ex) {
        return ExceptionResponse.builder()
                .message(ex.getMessage())
                .build();
    }

}
