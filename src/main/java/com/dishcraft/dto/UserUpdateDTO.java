package com.dishcraft.dto;

import jakarta.validation.constraints.Email;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    private String username;
    private String firstName;
    private String lastName;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String password;
    private String profileImage;
}