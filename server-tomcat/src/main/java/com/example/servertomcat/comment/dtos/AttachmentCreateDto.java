package com.example.servertomcat.comment.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentCreateDto {
    @NotBlank(message = "Le nom du fichier est obligatoire")
    private String fileName;

    @NotBlank(message = "L'empreinte est obligatoire")
    private String empreinte;
}
