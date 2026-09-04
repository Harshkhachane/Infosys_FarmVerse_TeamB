package com.farmverse.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.farmverse.model.Crop;
import java.util.List;

@Repository
public interface CropRepository extends MongoRepository<Crop, String> {
    List<Crop> findByFarmId(String farmId);
}