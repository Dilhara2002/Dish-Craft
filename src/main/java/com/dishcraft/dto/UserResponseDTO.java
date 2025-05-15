package com.dishcraft.dto;

import lombok.*;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
     private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String profileImage;
    private Set<String> roles;
}