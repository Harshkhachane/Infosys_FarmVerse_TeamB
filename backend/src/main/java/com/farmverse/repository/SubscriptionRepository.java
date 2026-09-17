package com.farmverse.repository;

import com.farmverse.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    List<Subscription> findByUserId(String userId);
    List<Subscription> findByStatus(String status);
}
