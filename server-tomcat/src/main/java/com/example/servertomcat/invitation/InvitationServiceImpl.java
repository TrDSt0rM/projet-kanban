package com.example.servertomcat.invitation;

import com.example.servertomcat.board.entities.Board;
import com.example.servertomcat.board.entities.BoardMember;
import com.example.servertomcat.board.entities.BoardMemberId;
import com.example.servertomcat.board.enums.MemberRole;
import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.board.repositories.BoardRepository;
import com.example.servertomcat.invitation.dtos.InvitationCreateDto;
import com.example.servertomcat.invitation.dtos.InvitationDto;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;
    private final BoardRepository boardRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final UserRepository userRepository;
    private final InvitationMapper invitationMapper;

    @Override
    public InvitationDto createInvitation(String boardId, InvitationCreateDto dto, String pseudo) {
        // Vérifie que l'inviteur est owner du tableau
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUserAndRole(
                boardId, pseudo, MemberRole.OWNER)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul le propriétaire peut inviter des membres");
        }

        // Vérifie que l'utilisateur invité existe
        User invitedUser = userRepository.findById(dto.getPseudo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"));

        // Vérifie que l'utilisateur n'est pas déjà membre
        if (boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, dto.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cet utilisateur est déjà membre du tableau");
        }

        // Vérifie qu'une invitation n'existe pas déjà
        if (invitationRepository.existsByIdPseudoAndIdIdBoard(dto.getPseudo(), boardId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Une invitation est déjà en attente pour cet utilisateur");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tableau introuvable"));

        Invitation invitation = new Invitation();
        invitation.getId().setPseudo(dto.getPseudo());
        invitation.getId().setIdBoard(boardId);
        invitation.setUser(invitedUser);
        invitation.setBoard(board);
        invitation.setStatus(InvitationStatus.PENDING);

        return invitationMapper.toDto(invitationRepository.save(invitation));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvitationDto> getMyInvitations(String pseudo) {
        return invitationRepository.findByIdPseudo(pseudo).stream()
                .map(invitationMapper::toDto)
                .toList();
    }

    @Override
    public void acceptInvitation(String boardId, String pseudo) {
        Invitation invitation = findInvitation(boardId, pseudo);

        // Ajoute l'utilisateur comme membre du tableau
        BoardMember member = new BoardMember();
        BoardMemberId memberId = new BoardMemberId();
        memberId.setIdBoard(boardId);
        memberId.setPseudoUser(pseudo);
        member.setId(memberId);
        member.setBoard(invitation.getBoard());
        member.setUser(invitation.getUser());
        member.setRole(MemberRole.PARTICIPANT);
        boardMemberRepository.save(member);

        // Supprime l'invitation
        invitationRepository.deleteById(invitation.getId());
    }

    @Override
    public void declineInvitation(String boardId, String pseudo) {
        findInvitation(boardId, pseudo);
        InvitationId id = new InvitationId();
        id.setPseudo(pseudo);
        id.setIdBoard(boardId);
        invitationRepository.deleteById(id);
    }

    @Override
    public void cancelInvitation(String boardId, String targetPseudo, String pseudo) {
        // Vérifie que l'annuleur est owner
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUserAndRole(
                boardId, pseudo, MemberRole.OWNER)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul le propriétaire peut annuler une invitation");
        }
        findInvitation(boardId, targetPseudo);
        InvitationId id = new InvitationId();
        id.setPseudo(targetPseudo);
        id.setIdBoard(boardId);
        invitationRepository.deleteById(id);
    }

    private Invitation findInvitation(String boardId, String pseudo) {
        InvitationId id = new InvitationId();
        id.setPseudo(pseudo);
        id.setIdBoard(boardId);
        return invitationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Invitation introuvable"));
    }
}