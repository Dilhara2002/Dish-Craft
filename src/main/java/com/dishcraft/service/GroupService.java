package com.dishcraft.service;

import com.dishcraft.dto.GroupRequestDTO;
import com.dishcraft.model.Group;

import java.util.List;

public interface GroupService {
    Group createGroup(Group group);
    List<Group> getAllGroups();
    Group getGroupById(String id);
    Group joinGroup(String groupId, String userId);
    void deleteGroup(String groupId);
    Group updateGroup(String id, GroupRequestDTO groupDTO);

}



