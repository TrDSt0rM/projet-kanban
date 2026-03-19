package com.example.servertomcat.invitation.dtos;

import com.example.servertomcat.invitation.InvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDto {
    private String pseudo;
    private String idBoard;
    private String boardName;
    private String ownerPseudo;
    private InvitationStatus status;
}
