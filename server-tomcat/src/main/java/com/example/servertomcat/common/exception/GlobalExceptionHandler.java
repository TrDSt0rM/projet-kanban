package com.example.servertomcat.common.exception;

import com.example.servertomcat.common.dtos.ApiError;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Erreurs de validation — @NotBlank, @Size, @NotNull
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(400)
                .body(new ApiError("VALIDATION_ERROR", message));
    }

    // Erreurs métier — ResponseStatusException
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode())
                .body(new ApiError("ERROR", e.getReason()));
    }

    // Erreurs de contrainte SQL — doublons, violations de FK
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(DataIntegrityViolationException e) {
        return ResponseEntity.status(409)
                .body(new ApiError("DUPLICATE_ENTRY", "Une ressource identique existe déjà"));
    }

    // Erreur générique — tout ce qui n'est pas capturé ailleurs
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception e) {
        return ResponseEntity.status(500)
                .body(new ApiError("INTERNAL_ERROR", "Une erreur interne s'est produite"));
    }
}
