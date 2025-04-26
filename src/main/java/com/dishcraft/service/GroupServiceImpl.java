package com.dishcraft.service;

import com.dishcraft.model.Group;
import com.dishcraft.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Override
    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    @Override
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    @Override
    public Group getGroupById(String id) {
        return groupRepository.findById(id).orElse(null);
    }

    @Override
    public Group joinGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group != null && !group.getMembers().contains(userId)) {
            group.getMembers().add(userId);
            return groupRepository.save(group);
        }
        return group;
    }

    @Override
public void deleteGroup(String groupId) {
    groupRepository.deleteById(groupId);
}

}
