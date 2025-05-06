package com.dishcraft.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    private String username;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String password;
    private String profileImage;
}