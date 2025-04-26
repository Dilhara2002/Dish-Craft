package com.dishcraft.repository;

import com.dishcraft.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GroupRepository extends MongoRepository<Group, String> {
    Group findByName(String name);
}
