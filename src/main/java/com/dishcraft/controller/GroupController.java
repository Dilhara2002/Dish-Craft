package com.dishcraft.controller;

import com.dishcraft.dto.GroupRequestDTO;
import com.dishcraft.model.Group;
import com.dishcraft.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
}
