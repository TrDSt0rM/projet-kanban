package com.example.servertomcat.invitation;

import com.example.servertomcat.invitation.dtos.InvitationCreateDto;
import com.example.servertomcat.invitation.dtos.InvitationDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping("/boards/{boardId}/invitations")
    public ResponseEntity<InvitationDto> createInvitation(
            @PathVariable String boardId,
            @Valid @RequestBody InvitationCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201)
                .body(invitationService.createInvitation(boardId, dto, pseudo));
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<InvitationDto>> getMyInvitations(
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(invitationService.getMyInvitations(pseudo));
    }

    @PostMapping("/invitations/{boardId}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable String boardId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        invitationService.acceptInvitation(boardId, pseudo);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/invitations/{boardId}")
    public ResponseEntity<Void> declineInvitation(
            @PathVariable String boardId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        invitationService.declineInvitation(boardId, pseudo);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/boards/{boardId}/invitations/{targetPseudo}")
    public ResponseEntity<Void> cancelInvitation(
            @PathVariable String boardId,
            @PathVariable String targetPseudo,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        invitationService.cancelInvitation(boardId, targetPseudo, pseudo);
        return ResponseEntity.noContent().build();
    }
}
