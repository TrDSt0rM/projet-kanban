package com.example.servertomcat.invitation.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationCreateDto {
    @NotBlank(message = "Le pseudo est obligatoire")
    private String pseudo;
}
