package com.example.servertomcat.board.dtos;

import com.example.servertomcat.board.enums.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardMemberDto {
    private String idBoard;
    private String pseudo;
    private MemberRole memberRole;
}
