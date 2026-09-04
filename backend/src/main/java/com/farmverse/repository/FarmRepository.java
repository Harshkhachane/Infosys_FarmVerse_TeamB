package com.farmverse.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.farmverse.model.Farm;
import java.util.List;

@Repository
public interface FarmRepository extends MongoRepository<Farm, String> {
    
    // Iska matlab: MongoDB ke "farms" collection me se 
    // wo saare khet dhoondho jinka userId matching ho!
    List<Farm> findByUserId(String userId); 
} 