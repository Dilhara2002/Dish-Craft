package com.dishcraft.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class GroupRequestDTO {
    @NotBlank(message = "Group name is required")
    private String name;

    private String description;
}
