package com.example.servertomcat.user.mappers;

import com.example.servertomcat.user.dtos.*;
import com.example.servertomcat.user.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper (componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "userRole", target = "role")
    UserDto toDto(User user);

    // Pour Deno — avec password hashé
    UserAuthDto toAuthDto(User user);

    @Mapping(target = "userRole", constant = "USER")
    @Mapping(target = "active", constant = "true")
    User toEntity(UserRegisterDto dto);
}
