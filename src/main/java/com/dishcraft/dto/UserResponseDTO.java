package com.dishcraft.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private String username;
    private String email;
    private Set<String> roles;
}
