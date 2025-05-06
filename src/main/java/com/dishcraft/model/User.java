package com.dishcraft.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;
import java.util.HashSet;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String profileImage;
    
    @Builder.Default
    private Set<String> roles = new HashSet<>();
    
    public void addRole(String role) {
        roles.add(role);
    }
    
    public void removeRole(String role) {
        roles.remove(role);
    }
    
    public boolean hasRole(String role) {
        return roles.contains(role);
    }
}