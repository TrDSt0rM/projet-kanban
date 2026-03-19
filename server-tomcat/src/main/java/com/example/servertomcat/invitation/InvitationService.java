package com.example.servertomcat.invitation;

import com.example.servertomcat.invitation.dtos.InvitationCreateDto;
import com.example.servertomcat.invitation.dtos.InvitationDto;

import java.util.List;

public interface InvitationService {
    InvitationDto createInvitation(String boardId, InvitationCreateDto dto, String pseudo);
    List<InvitationDto> getMyInvitations(String pseudo);
    void acceptInvitation(String boardId, String pseudo);
    void declineInvitation(String boardId, String pseudo);
    void cancelInvitation(String boardId, String targetPseudo, String pseudo);
}