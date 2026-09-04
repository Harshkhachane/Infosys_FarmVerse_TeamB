export interface UserProfile {
  fullName: string;
  mobileNumber: string;
  email?: string;
  preferredLanguage: 'English' | 'తెలుగు' | 'हिन्दी';
  avatarUrl: string;
  role?: string; 
  streetAddress?: string;
  state?: string;
  district?: string;
  village?: string;
}

export type FarmStatus = 'OPTIMAL' | 'ATTENTION';

export interface Farm {
  id: string;
  name: string;
  crop: string;
  farmDate?: string;
  hectares: number;
  moisture: number;
  yieldEst: string;
  status: FarmStatus;
  pestRisk: 'Low' | 'Medium' | 'High';
  imageUrl: string;
  lat: number;
  lng: number;
  acres: number;
  /** GPS polygon vertices. The x/y variant keeps older demo records readable. */
  boundaryPoints?: ({ lat: number; lng: number } | { x: number; y: number })[];
  /** ISO timestamp recorded when the geographic boundary was confirmed. */
  mappedAt?: string;
  /** Human-readable area resolved from the map coordinates. */
  locationName?: string;
  stage?: string;
  health?: 'Good' | 'Moderate' | 'Poor';
  lifecycle?: 'Growing' | 'Harvested';
  cropVariety?: string;
  sowingDate?: string;
  soilType?: string;
}

export interface LiveMandiRate {
  id: string;
  cropName: string;
  marketName: string;
  arrivalTons: number;
  ratePerQuintal: number;
  trendPercent: number; // Positive = increase, Negative = decrease, 0 = stable
}

export type MandiRate = LiveMandiRate;

export interface SoilNutrients {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  salinity: number;
  soilType: string;
  soilMoisture: 'Low' | 'Medium' | 'High';
  lastUpdated: string;
}

export interface AdvisoryRecommendation {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  icon: string;
  type: 'irrigation' | 'pest' | 'fertilizer' | 'harvest';
}

export interface SavedReport {
  id: string;
  title: string;
  crop: string;
  season: string;
  location: string;
  date: string;
  category: 'yield' | 'irrigation' | 'soil' | 'market';
  fileSize?: string;
}

export interface ClimateState {
  season: 'KHARIF' | 'RABI' | 'ZAID';
  sowingMonth: string;
  climateType: string;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'advisory' | 'market' | 'weather';
  timestamp: string;
  isRead: boolean;
  farmId?: string;
}
