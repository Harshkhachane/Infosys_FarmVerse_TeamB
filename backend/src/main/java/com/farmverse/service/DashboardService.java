package com.farmverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.farmverse.dto.DashboardSummaryDto;
import com.farmverse.model.Farm;
import com.farmverse.repository.CropRepository;
import com.farmverse.repository.FarmRepository;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private CropRepository cropRepository;

    public DashboardSummaryDto getSummaryByUserId(String userId) {
        List<Farm> userFarms = farmRepository.findByUserId(userId);

        long totalFarms = userFarms.size();

        // High Pest Risk Farms Count
        long highRiskFarmsCount = userFarms.stream()
                .filter(farm -> "high".equalsIgnoreCase(farm.getPestRisk()))
                .count();

        // Average Moisture Calculation
        double averageMoisture = userFarms.stream()
                .mapToDouble(Farm::getMoisture)
                .average()
                .orElse(0.0);

        // Round off to 2 decimal places
        averageMoisture = Math.round(averageMoisture * 100.0) / 100.0;

        // Total Crops count for these farms
        long totalActiveCrops = userFarms.stream()
                .mapToLong(farm -> cropRepository.findByFarmId(farm.getId()).size())
                .sum();

        return new DashboardSummaryDto(totalFarms, totalActiveCrops, averageMoisture, highRiskFarmsCount);
    }
}