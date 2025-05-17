package com.dishcraft.controller;

import com.dishcraft.dto.GroupRequestDTO;
import com.dishcraft.model.Group;
import com.dishcraft.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public Group createGroup(@Valid @RequestBody GroupRequestDTO groupDTO) {
        Group group = Group.builder()
                .name(groupDTO.getName())
                .description(groupDTO.getDescription())
                .members(new java.util.ArrayList<>()) // Initially empty
                .build();
        return groupService.createGroup(group);
    }

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public Group getGroupById(@PathVariable String id) {
        return groupService.getGroupById(id);
    }

    @PostMapping("/{groupId}/join")
    public Group joinGroup(@PathVariable String groupId, @RequestHeader("userId") String userId) {
        return groupService.joinGroup(groupId, userId);
    }
    @DeleteMapping("/{groupId}")
public void deleteGroup(@PathVariable String groupId) {
    groupService.deleteGroup(groupId);
}

      @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(
            @PathVariable String id,
            @Valid @RequestBody GroupRequestDTO groupDTO,
            @RequestHeader("userId") String userId) {
        
        // Verify the user is the group creator
        Group existingGroup = groupService.getGroupById(id);
        if (existingGroup == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingGroup.getMembers().isEmpty() && 
            !existingGroup.getMembers().get(0).equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Group updatedGroup = groupService.updateGroup(id, groupDTO);
        return ResponseEntity.ok(updatedGroup);
    }

}



