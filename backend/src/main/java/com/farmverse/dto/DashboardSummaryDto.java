package com.farmverse.dto;

public class DashboardSummaryDto {

    private long totalFarms;
    private long totalActiveCrops;
    private double averageMoisture;
    private long highRiskFarmsCount;

    public DashboardSummaryDto() {}

    public DashboardSummaryDto(long totalFarms, long totalActiveCrops, double averageMoisture, long highRiskFarmsCount) {
        this.totalFarms = totalFarms;
        this.totalActiveCrops = totalActiveCrops;
        this.averageMoisture = averageMoisture;
        this.highRiskFarmsCount = highRiskFarmsCount;
    }

    
    public long getTotalFarms() { return totalFarms; }
    public void setTotalFarms(long totalFarms) { this.totalFarms = totalFarms; }

    public long getTotalActiveCrops() { return totalActiveCrops; }
    public void setTotalActiveCrops(long totalActiveCrops) { this.totalActiveCrops = totalActiveCrops; }

    public double getAverageMoisture() { return averageMoisture; }
    public void setAverageMoisture(double averageMoisture) { this.averageMoisture = averageMoisture; }

    public long getHighRiskFarmsCount() { return highRiskFarmsCount; }
    public void setHighRiskFarmsCount(long highRiskFarmsCount) { this.highRiskFarmsCount = highRiskFarmsCount; }
}