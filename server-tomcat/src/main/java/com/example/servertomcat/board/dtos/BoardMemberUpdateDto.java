package com.example.servertomcat.board.dtos;

import com.example.servertomcat.board.enums.MemberRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardMemberUpdateDto {
    @NotNull(message = "Le rôle est obligatoire")
    private MemberRole memberRole;
}
