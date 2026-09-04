import { UserProfile, Farm, LiveMandiRate, SoilNutrients, AdvisoryRecommendation, SavedReport, ClimateState, AppNotification } from '../types';

export const initialProfile: UserProfile = {
  fullName: '',
  mobileNumber: '',
  email: '',
  preferredLanguage: 'English',
  avatarUrl: 'https://ui-avatars.com/api/?name=User&background=2b5c27&color=fff&size=150',
  role: 'USER',
  streetAddress: '',
  state: '',
  district: '',
  village: '',
};

export const initialFarms: Farm[] = [
  {
    id: 'farm-1',
    name: 'North Ridge Valley',
    crop: 'Tomato',
    hectares: 42,
    moisture: 18.4,
    yieldEst: '8.2t/h',
    status: 'OPTIMAL',
    pestRisk: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
    lat: 41.8780,
    lng: -93.0977,
    acres: 103.8,
    boundaryPoints: [
      { x: 400, y: 300 },
      { x: 600, y: 350 },
      { x: 580, y: 550 },
      { x: 350, y: 500 }
    ],
    stage: 'Flowering',
    health: 'Good',
    lifecycle: 'Growing'
  },
  {
    id: 'farm-2',
    name: 'East Plateau',
    crop: 'Wheat',
    hectares: 120,
    moisture: 12.1,
    yieldEst: '3.5t/h',
    status: 'OPTIMAL',
    pestRisk: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    lat: 41.8812,
    lng: -93.1025,
    acres: 296.5,
    boundaryPoints: [
      { x: 450, y: 280 },
      { x: 580, y: 310 },
      { x: 550, y: 480 },
      { x: 410, y: 450 }
    ],
    stage: 'Grain Filling',
    health: 'Good',
    lifecycle: 'Growing'
  },
  {
    id: 'farm-3',
    name: 'Southern Flat',
    crop: 'Maize',
    hectares: 65,
    moisture: 22.0,
    yieldEst: '4.5t/h',
    status: 'ATTENTION',
    pestRisk: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600',
    lat: 41.8715,
    lng: -93.0910,
    acres: 160.6,
    boundaryPoints: [
      { x: 380, y: 320 },
      { x: 520, y: 340 },
      { x: 490, y: 510 },
      { x: 320, y: 470 }
    ],
    stage: 'Vegetative',
    health: 'Moderate',
    lifecycle: 'Growing'
  },
  {
    id: 'farm-4',
    name: 'Cotton Meadows',
    crop: 'Cotton',
    hectares: 35,
    moisture: 14.2,
    yieldEst: '2.8t/h',
    status: 'OPTIMAL',
    pestRisk: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1594488349141-f7614f1797c6?auto=format&fit=crop&q=80&w=600',
    lat: 41.8655,
    lng: -93.0850,
    acres: 86.4,
    boundaryPoints: [
      { x: 200, y: 150 },
      { x: 350, y: 170 },
      { x: 320, y: 300 },
      { x: 180, y: 280 }
    ],
    stage: 'Boll Formation',
    health: 'Good',
    lifecycle: 'Growing'
  },
  {
    id: 'farm-5',
    name: 'West Field',
    crop: 'Soybeans',
    hectares: 50,
    moisture: 9.5,
    yieldEst: '4.1t/h',
    status: 'OPTIMAL',
    pestRisk: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600',
    lat: 41.8620,
    lng: -93.0780,
    acres: 123.5,
    boundaryPoints: [
      { x: 150, y: 100 },
      { x: 280, y: 120 },
      { x: 250, y: 250 },
      { x: 120, y: 230 }
    ],
    stage: 'Harvested',
    health: 'Good',
    lifecycle: 'Harvested'
  }
];

export const initialMandiRates: LiveMandiRate[] = [
  {
    id: 'rate-1',
    cropName: 'Wheat (Malwa)',
    marketName: 'Arrival: 420 Tons',
    arrivalTons: 420,
    ratePerQuintal: 2450,
    trendPercent: -2.1
  },
  {
    id: 'rate-2',
    cropName: 'Soybean (Yellow)',
    marketName: 'Arrival: 180 Tons',
    arrivalTons: 180,
    ratePerQuintal: 5120,
    trendPercent: 5.4
  },
  {
    id: 'rate-3',
    cropName: 'Cotton (Long)',
    marketName: 'Arrival: 95 Tons',
    arrivalTons: 95,
    ratePerQuintal: 7800,
    trendPercent: 0
  },
  {
    id: 'rate-4',
    cropName: 'Chickpeas (Desi)',
    marketName: 'Arrival: 310 Tons',
    arrivalTons: 310,
    ratePerQuintal: 4900,
    trendPercent: 1.8
  }
];

export const initialSoilNutrients: SoilNutrients = {
  pH: 6.5,
  nitrogen: 45,
  phosphorus: 28,
  potassium: 185,
  organicCarbon: 0.75,
  salinity: 1.2,
  soilType: 'Loamy',
  soilMoisture: 'Medium',
  lastUpdated: 'FEB 12'
};

export const initialRecommendations: AdvisoryRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Irrigation Optimization',
    description: 'North Ridge Valley soil moisture is at 18.4%. Recommend activating Zone B irrigation for 45 minutes tonight.',
    timeAgo: '2 HOURS AGO',
    icon: 'water_drop',
    type: 'irrigation'
  },
  {
    id: 'rec-2',
    title: 'Pest Alert: Fall Armyworm',
    description: 'Regional detection reported 5km from East Plateau. Inspect fields and apply organic neem spray preventative.',
    timeAgo: '6 HOURS AGO',
    icon: 'bug_report',
    type: 'pest'
  }
];

export const initialSavedReports: SavedReport[] = [
  {
    id: 'report-1',
    title: 'Yield Efficiency Analysis',
    crop: 'CORN • SUMMER 2023',
    season: 'KHARIF',
    location: 'Central Valley Ranch • Oct 12, 2023',
    date: 'Oct 12, 2023',
    category: 'yield',
    fileSize: '2.4 MB'
  },
  {
    id: 'report-2',
    title: 'Irrigation Strategy Report',
    crop: 'WHEAT • WINTER 2023',
    season: 'RABI',
    location: 'Oak Ridge Farm • Sep 28, 2023',
    date: 'Sep 28, 2023',
    category: 'irrigation',
    fileSize: '1.8 MB'
  },
  {
    id: 'report-3',
    title: 'Soil Nutrient Audit',
    crop: 'SOYBEAN • SPRING 2023',
    season: 'ZAID',
    location: 'River Delta Block B • Aug 15, 2023',
    date: 'Aug 15, 2023',
    category: 'soil',
    fileSize: '3.1 MB'
  },
  {
    id: 'report-4',
    title: 'Market Pricing Projection',
    crop: 'MIXED • ANNUAL 2022',
    season: 'ANNUAL',
    location: 'Global Portfolio • Jan 05, 2023',
    date: 'Jan 05, 2023',
    category: 'market',
    fileSize: '4.2 MB'
  }
];

export const initialClimate: ClimateState = {
  season: 'RABI',
  sowingMonth: 'November',
  climateType: 'Subtropical',
  temperature: 24,
  humidity: 65,
  rainfall: 850
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Monsoon Surcharge Warning',
    message: 'High precipitation (+45mm) forecast within 48 hours. Ensure deep drainage outlets in fields are fully cleared to prevent root-rot waterlogging.',
    type: 'weather',
    timestamp: '10 mins ago',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Pest Detection Alert',
    message: 'Fall Armyworm has been logged within 5km of your location. Inspect standard broadleaf seedlings and consider applying preemptive neem oil solutions.',
    type: 'alert',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Mandi Price Spike',
    message: 'Wheat (Sarbati) rate jumped +₹180/Quintal at the local Nagpur Market due to increased inter-state logistics demands. Consider harvesting surplus crops.',
    type: 'market',
    timestamp: '5 hours ago',
    isRead: false
  },
  {
    id: 'notif-4',
    title: 'Soil Nutrient Check Complete',
    message: 'Your soil analysis reports for Wheat Block A have been updated. Nitrogen (N) index is marginally deficient. New fertilizer recommendation generated.',
    type: 'advisory',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: 'notif-5',
    title: 'Drip Irrigation Efficiency',
    message: 'Weekly water footprint diagnostic complete: Sub-surface irrigation system is operating at 94% flow-rate efficiency. Filters are clear.',
    type: 'advisory',
    timestamp: '3 days ago',
    isRead: true
  }
];

