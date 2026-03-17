package com.example.servertomcat.dtos;

import com.example.servertomcat.enums.RoleMember;
import lombok.Data;

@Data
public class BoardMemberDTO {
    private String boardId;
    private String pseudo;
    private RoleMember role;
}
