import React, { useState, useEffect, useRef } from 'react';
import { Farm, UserProfile } from '../types';
import { t } from '../utils/translations';
import LiveSatelliteMap, { GeoPoint } from './LiveSatelliteMap';
import { getCropImage } from '../utils/cropImages';

interface FarmsScreenProps {
  farms: Farm[];
  onAddFarm: (newFarm: Omit<Farm, 'id'>) => void;
  onDeleteFarm: (farmId: string) => void;
  onSelectFarm: (farm: Farm) => void;
  onNavigate: (screen: string) => void;
  profile: UserProfile;
  initialViewMode?: FarmViewMode;
  onViewModeChange?: (mode: FarmViewMode) => void;
  onMenuClick?: () => void;
}

type FarmViewMode = 'list' | 'map-records' | 'add-details' | 'add-map';

export default function FarmsScreen({
  farms,
  onAddFarm,
  onDeleteFarm,
  onSelectFarm,
  onNavigate,
  profile,
  initialViewMode = 'list',
  onViewModeChange,
  onMenuClick
}: FarmsScreenProps) {
  // Screen sub-modes: 'list' | 'add-details' | 'add-map'
  const [viewMode, _setViewMode] = useState<FarmViewMode>(initialViewMode);

  useEffect(() => {
    _setViewMode(initialViewMode);
  }, [initialViewMode]);

  const setViewMode = (newMode: FarmViewMode) => {
    _setViewMode(newMode);
    onViewModeChange?.(newMode);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [lifecycleFilter, setLifecycleFilter] = useState<'All' | 'Growing' | 'Harvested'>('All');
  const [mapNotification, setMapNotification] = useState<string | null>(null);

  // Form State for Adding New Farm (Step 1)
  const [formName, setFormName] = useState('');
  const [formCrop, setFormCrop] = useState('Wheat');
  const [formVariety, setFormVariety] = useState('');
  const [formSowingDate, setFormSowingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [formSoilType, setFormSoilType] = useState('Clayey Black');
  const [formAcres, setFormAcres] = useState<number>(10);

  // Satellite Mapping State (Step 2)
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [activeTool, setActiveTool] = useState<'draw' | 'pin'>('draw');
  const [satellitePrecision, setSatellitePrecision] = useState<number | null>(null);
  const [mapSearch, setMapSearch] = useState('');
  const [latitude, setLatitude] = useState(21.1458); // default Nagpur region coordinates
  const [longitude, setLongitude] = useState(79.0882);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const hasCenteredOnUser = useRef(false);
  const [locationName, setLocationName] = useState('Resolving area name…');

  // Resolve the selected coordinates into a readable village/district/state name.
  useEffect(() => {
    if (viewMode !== 'add-map') return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&lat=${latitude}&lon=${longitude}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('Reverse geocoding failed');
        const result = await response.json();
        const address = result.address || {};
        const areaParts = [
          address.village || address.town || address.city || address.hamlet || address.suburb,
          address.county || address.state_district,
          address.state,
          address.country
        ].filter(Boolean);
        setLocationName(areaParts.length ? [...new Set(areaParts)].join(', ') : result.display_name);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setLocationName('Area name unavailable');
      }
    }, 500);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [latitude, longitude, viewMode]);

  // Track the farmer while the live mapping screen is open.
  useEffect(() => {
    if (viewMode !== 'add-map' || !navigator.geolocation) return;
    hasCenteredOnUser.current = false;
    setIsLocating(true);
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const livePoint = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(livePoint);
        if (!hasCenteredOnUser.current) {
          setLatitude(livePoint.lat);
          setLongitude(livePoint.lng);
          hasCenteredOnUser.current = true;
        }
        setSatellitePrecision(Math.round(coords.accuracy));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        notifyMap('Enable location permission to show your live position');
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 12000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [viewMode]);

  // Auto-generate a suitable farm name based on crop & location if left blank
  useEffect(() => {
    if (viewMode === 'add-details' && !formName) {
      const count = farms.length + 1;
      setFormName(`${formCrop} Block ${count}`);
    }
  }, [formCrop, viewMode]);

  // Calculate geodesic polygon area on the earth's surface.
  const calculateArea = () => {
    if (points.length < 3) return 0;
    const earthRadius = 6378137;
    const radians = (value: number) => value * Math.PI / 180;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      area += radians(next.lng - current.lng) *
        (2 + Math.sin(radians(current.lat)) + Math.sin(radians(next.lat)));
    }
    const squareMetres = Math.abs(area * earthRadius * earthRadius / 2);
    return Number((squareMetres / 4046.8564224).toFixed(2));
  };

  const calculatedAcres = calculateArea();

  const notifyMap = (message: string) => {
    setMapNotification(message);
    window.setTimeout(() => setMapNotification(null), 3000);
  };

  const handleMapClick = (point: GeoPoint) => {
    setLatitude(point.lat);
    setLongitude(point.lng);
    if (activeTool === 'pin') {
      setPoints([point]);
    } else {
      setPoints(prev => [...prev, point]);
    }
  };

  const handleMapSearchLocate = async () => {
    const coordinateMatch = mapSearch.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (coordinateMatch) {
      setLatitude(Number(coordinateMatch[1]));
      setLongitude(Number(coordinateMatch[2]));
      notifyMap('Map moved to the supplied coordinates');
      return;
    }
    if (!mapSearch.trim()) {
      if (!navigator.geolocation) return notifyMap('Location is not supported by this browser');
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
          setUserLocation({ lat: coords.latitude, lng: coords.longitude });
          setSatellitePrecision(Math.round(coords.accuracy));
          setIsLocating(false);
          notifyMap('Your live GPS location is centred');
        },
        () => {
          setIsLocating(false);
          notifyMap('Location permission was denied or unavailable');
        },
        { enableHighAccuracy: true, timeout: 12000 }
      );
      return;
    }
    setIsLocating(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(mapSearch)}`);
      const [result] = await response.json();
      if (!result) throw new Error('No location found');
      setLatitude(Number(result.lat));
      setLongitude(Number(result.lon));
      notifyMap(`Found ${result.display_name}`);
    } catch {
      notifyMap('No matching location was found');
    } finally {
      setIsLocating(false);
    }
  };

  // Switch to step 2 after basic validation
  const handleProceedToMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Please provide a name for the field.");
      return;
    }
    if (formAcres <= 0) {
      alert("Please specify a valid acreage value.");
      return;
    }
    setViewMode('add-map');
  };

  // Finalize and submit the farm
  const handleSaveFarm = () => {
    const finalAcres = calculatedAcres > 0 ? calculatedAcres : formAcres;
    const finalHectares = Math.max(1, Math.round(finalAcres * 0.4046));

    const newFarmData: Omit<Farm, 'id'> = {
      name: formName,
      crop: formCrop,
      farmDate: new Date().toISOString(),
      hectares: finalHectares,
      moisture: 20.2, // normal baseline
      yieldEst: formCrop === 'Wheat' ? '3.8t/h' : formCrop === 'Corn' || formCrop === 'Maize' ? '7.5t/h' : formCrop === 'Tomato' ? '8.2t/h' : formCrop === 'Cotton' ? '4.2t/h' : formCrop === 'Rice' ? '5.1t/h' : formCrop === 'Soybeans' ? '4.5t/h' : formCrop === 'Sugarcane' ? '12.0t/h' : '4.2t/h',
      status: 'OPTIMAL',
      pestRisk: 'Low',
      imageUrl:
  formCrop === "Wheat"
    ? "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : formCrop === "Rice"
    ? "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : formCrop === "Corn"
    ? "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : formCrop === "Soybeans"
    ? "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : formCrop === "Cotton"
    ? "https://images.pexels.com/photos/6157045/pexels-photo-6157045.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : formCrop === "Sugarcane"
    ? "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : formCrop === "Tomato"
    ? "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1200"
    : "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1200",
      lat: Number(latitude.toFixed(4)),
      lng: Number(longitude.toFixed(4)),
      acres: Number(finalAcres.toFixed(1)),
      boundaryPoints: points,
      mappedAt: new Date().toISOString(),
      locationName,
      stage: formCrop === 'Tomato' ? 'Flowering' : formCrop === 'Cotton' ? 'Boll Formation' : formCrop === 'Wheat' ? 'Grain Filling' : 'Vegetative',
      health: 'Good',
      lifecycle: 'Growing',
      // Custom crop variety details stored
      ...({
        cropVariety: formVariety || 'Standard Seed Hybrid',
        sowingDate: formSowingDate,
        soilType: formSoilType
      } as any)
    };

    onAddFarm(newFarmData);
    
    // Reset state & go back
    setFormName('');
    setFormVariety('');
    setFormAcres(10);
    setViewMode('list');
    onNavigate('dashboard');
  };

  const handleDeleteMapRecord = (farm: Farm) => {
    const confirmed = window.confirm(
      `Delete the map record for "${farm.name}"?\n\nThis removes its farm details and saved boundary from this application.`
    );
    if (confirmed) onDeleteFarm(farm.id);
  };

  // Aggregate values for UI components on Farms list
  const totalAcres = farms.reduce((acc, f) => acc + f.acres, 0);
  const averageMoisture = (farms.reduce((acc, f) => acc + f.moisture, 0) / farms.length) || 0;
  const attentionCount = farms.filter(f => f.status === 'ATTENTION').length;

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          farm.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCropFilter === 'All' || farm.crop === selectedCropFilter;
    const matchesStatus = selectedStatusFilter === 'All' || farm.status === selectedStatusFilter;
    
    // Lifecycle filter matching ('All' | 'Growing' | 'Harvested')
    const matchesLifecycle = lifecycleFilter === 'All' ||
                             (lifecycleFilter === 'Growing' && (farm.lifecycle || 'Growing') === 'Growing') ||
                             (lifecycleFilter === 'Harvested' && farm.lifecycle === 'Harvested');

    return matchesSearch && matchesCrop && matchesStatus && matchesLifecycle;
  });

  return (
    <div className="min-h-screen bg-[#F9FBF8] pb-24 text-[#191c1a]">
      
      {/* View Mode 1: List Registered Farms */}
      {viewMode === 'list' && (
        <>
          {/* Main Top Header */}
          <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-[#ecefea]">
            <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onMenuClick}
                  className="md:hidden w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer"
                  title="Open Navigation"
                >
                  <span className="material-symbols-outlined text-[26px]">menu</span>
                </button>
                <span className="material-symbols-outlined text-primary text-3xl font-bold">agriculture</span>
                <span className="text-xl font-bold text-primary tracking-tight">{t("My Farms & Map", profile.preferredLanguage)}</span>
              </div>
              <button
                onClick={() => setViewMode('map-records')}
                className="flex items-center gap-1.5 rounded-xl bg-[#eef4ec] px-3 py-2 text-[11px] font-extrabold text-[#2b5c27] hover:bg-[#e1ebde]"
              >
                <span className="material-symbols-outlined text-lg">map</span>
                <span className="hidden sm:inline">Map Records</span>
              </button>
            </div>
          </header>

          <main className="w-full max-w-md md:max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-5 pb-6">
            
            {/* Reference Image Styled Filter Pills */}
            <div className="flex gap-2 bg-transparent justify-start items-center">
              <button 
                onClick={() => setLifecycleFilter('All')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                  lifecycleFilter === 'All'
                    ? 'bg-[#2b5c27] text-white shadow-sm'
                    : 'bg-[#f1f4ef] text-[#42493e] hover:bg-[#e4e9e1]'
                }`}
              >
                All Crops
              </button>
              <button 
                onClick={() => setLifecycleFilter('Growing')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                  lifecycleFilter === 'Growing'
                    ? 'bg-[#2b5c27] text-white shadow-sm'
                    : 'bg-[#f1f4ef] text-[#42493e] hover:bg-[#e4e9e1]'
                }`}
              >
                Growing
              </button>
              <button 
                onClick={() => setLifecycleFilter('Harvested')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                  lifecycleFilter === 'Harvested'
                    ? 'bg-[#2b5c27] text-white shadow-sm'
                    : 'bg-[#f1f4ef] text-[#42493e] hover:bg-[#e4e9e1]'
                }`}
              >
                Harvested
              </button>
            </div>

            {/* Collapsible Search & Advanced Filters */}
            <div className="bg-white p-3.5 rounded-[24px] border border-[#ecefea] shadow-xs space-y-2.5">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-lg">
                  search
                </span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-medium"
                  placeholder="Search fields or crop..."
                />
              </div>

              <div className="flex gap-2 text-[10px] items-center justify-between">
                <div className="flex gap-1.5">
                  <select 
                    value={selectedCropFilter} 
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                    className="bg-[#f1f4ef] border border-[#c2c9bb]/40 rounded-lg px-2 py-1.5 font-bold cursor-pointer focus:outline-none text-[#42493e] text-[10px]"
                  >
                    <option value="All">All Crops</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Corn">Corn</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Rice">Rice</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Cotton">Cotton</option>
                  </select>

                  <select 
                    value={selectedStatusFilter} 
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-[#f1f4ef] border border-[#c2c9bb]/40 rounded-lg px-2 py-1.5 font-bold cursor-pointer focus:outline-none text-[#42493e] text-[10px]"
                  >
                    <option value="All">All Status</option>
                    <option value="OPTIMAL">Optimal</option>
                    <option value="ATTENTION">Needs Attention</option>
                  </select>
                </div>

                {(searchQuery || selectedCropFilter !== 'All' || selectedStatusFilter !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCropFilter('All');
                      setSelectedStatusFilter('All');
                    }}
                    className="font-bold text-primary hover:underline text-[9px] uppercase tracking-wider"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats overview */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#f4f6f2] px-3 py-2 rounded-xl text-center">
                <p className="text-[8px] font-bold text-[#72796e] uppercase tracking-wider">My Crops</p>
                <p className="text-sm font-extrabold text-[#191c1a]">{filteredFarms.length}</p>
              </div>
              <div className="bg-[#f4f6f2] px-3 py-2 rounded-xl text-center">
                <p className="text-[8px] font-bold text-[#72796e] uppercase tracking-wider">Total Area</p>
                <p className="text-sm font-extrabold text-[#191c1a]">
                  {filteredFarms.reduce((acc, f) => acc + f.acres, 0).toFixed(1)} ac
                </p>
              </div>
              <div className="bg-[#f4f6f2] px-3 py-2 rounded-xl text-center">
                <p className="text-[8px] font-bold text-[#72796e] uppercase tracking-wider">Avg Moisture</p>
                <p className="text-sm font-extrabold text-[#191c1a]">
                  {(filteredFarms.reduce((acc, f) => acc + f.moisture, 0) / (filteredFarms.length || 1)).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Farms Grid / List - Styled EXACTLY like the reference image, now fully responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-1">
              {filteredFarms.map((farm) => {
                const stageVal = farm.stage || 'Vegetative';
                const healthVal = farm.health || 'Good';
                const healthColor = healthVal === 'Good' 
                  ? 'text-[#2b5c27]' 
                  : healthVal === 'Moderate'
                  ? 'text-[#f59e0b]'
                  : 'text-[#ef4444]';
                const farmDate = farm.farmDate ? new Date(farm.farmDate) : null;

                return (
                  <div 
                    key={farm.id}
                    onClick={() => onSelectFarm(farm)}
                    className="bg-white rounded-[28px] p-4 border border-[#ecefea] shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between group relative"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Crop Square Image with Rounded Corners */}
                      <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-[20px] bg-gray-50 border border-[#ecefea]">
                        <img 
                          src={farm.imageUrl || getCropImage(farm.crop)} 
                          alt={farm.crop} 
                          onError={(e) => {
                            e.currentTarget.src = getCropImage(farm.crop);
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Crop details */}
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold text-[#191c1a] tracking-tight leading-none mb-2">
                          {farm.crop}
                        </h3>
                        <p className="text-xs text-gray-500 mb-0.5 font-bold tracking-tight">
                          {farm.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mb-1 font-semibold tracking-tight">
                          Added: {farmDate && !Number.isNaN(farmDate.getTime())
                            ? farmDate.toLocaleDateString(undefined, {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'Date unavailable'}
                        </p>
                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                          Stage: <span className="text-[#191c1a] font-bold">{stageVal}</span>
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          Health: <span className={`font-bold ${healthColor}`}>{healthVal}</span>
                        </p>
                      </div>
                    </div>

                    {/* Chevron arrow icon */}
                    <div className="flex shrink-0 items-center gap-2 pr-2 text-gray-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMapRecord(farm);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                        title={`Delete ${farm.name}`}
                        aria-label={`Delete farm ${farm.name}`}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <div className="group-hover:translate-x-0.5 transition-transform">
                        <span className="material-symbols-outlined text-xl font-bold">chevron_right</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredFarms.length === 0 && (
                <div className="col-span-full bg-white rounded-[28px] p-8 text-center border border-[#ecefea] shadow-sm">
                  <span className="material-symbols-outlined text-5xl text-[#72796e]/30 mb-2">agriculture</span>
                  <h4 className="text-sm font-bold text-[#191c1a]">No Crops Found</h4>
                  <p className="text-xs text-[#72796e] mt-1">Try selecting a different filter above.</p>
                </div>
              )}
            </div>

            {/* Quick comparison action card */}
            <div className="bg-gradient-to-br from-[#154212] to-[#1e581a] text-white p-5 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <span className="material-symbols-outlined text-[100px] translate-x-5 translate-y-5">insights</span>
              </div>
              <h4 className="text-sm font-bold tracking-tight mb-1">Crop Yield Comparison Cockpit</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
                Analyze different seeds variety performance indicators across sub-regional climate conditions before planting.
              </p>
              <button 
                onClick={() => onNavigate('crop-comparison')}
                className="bg-[#fcc019] hover:bg-[#ebd01a] text-[#131f00] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition-colors"
              >
                <span>Launch Compare Tool</span>
                <span className="material-symbols-outlined text-sm">trending_up</span>
              </button>
            </div>
          </main>
        </>
      )}

      {/* Dedicated map records and controls workspace */}
      {viewMode === 'map-records' && (
        <>
          <header className="sticky top-0 z-40 border-b border-[#ecefea] bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('list')}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f1f4ef]"
                  title="Back to farms"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-base font-black text-[#191c1a]">Map Records</h1>
                  <p className="text-[10px] font-semibold text-[#72796e]">Land boundaries and geographic details</p>
                </div>
              </div>
              <button
                onClick={() => setViewMode('add-details')}
                className="flex items-center gap-1.5 rounded-xl bg-[#183d1c] px-3 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-[#112d14]"
              >
                <span className="material-symbols-outlined text-lg">add_location_alt</span>
                New Map
              </button>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 md:px-8">
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: 'Map Records', value: farms.length, icon: 'map' },
                { label: 'Mapped Area', value: `${totalAcres.toFixed(1)} ac`, icon: 'square_foot' },
                { label: 'GPS Boundaries', value: farms.filter(f => f.boundaryPoints && f.boundaryPoints.length >= 3).length, icon: 'polyline' },
                { label: 'Need Mapping', value: farms.filter(f => !f.boundaryPoints || f.boundaryPoints.length < 3).length, icon: 'location_off' }
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-[#e4e9e1] bg-white p-4 shadow-sm">
                  <span className="material-symbols-outlined mb-2 text-xl text-[#2b5c27]">{item.icon}</span>
                  <p className="text-xl font-black text-[#191c1a]">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#72796e]">{item.label}</p>
                </div>
              ))}
            </section>

            <section className="overflow-hidden rounded-3xl border border-[#e4e9e1] bg-white shadow-sm">
              <div className="border-b border-[#ecefea] px-5 py-4">
                <h2 className="text-sm font-black text-[#191c1a]">Saved land records</h2>
                <p className="mt-0.5 text-[10px] text-[#72796e]">Select a record to review its complete farm information.</p>
              </div>
              <div className="divide-y divide-[#ecefea]">
                {farms.map(farm => {
                  const vertexCount = farm.boundaryPoints?.length || 0;
                  const isGpsMapped = vertexCount >= 3 &&
                    farm.boundaryPoints?.every(point => 'lat' in point && 'lng' in point);
                  const mappedDate = farm.mappedAt ? new Date(farm.mappedAt) : null;
                  return (
                    <article key={farm.id} className="p-4 transition-colors hover:bg-[#fbfcfa] md:p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ec] text-[#2b5c27]">
                            <span className="material-symbols-outlined">landscape</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-sm font-extrabold">{farm.name}</h3>
                              <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                                isGpsMapped ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isGpsMapped ? 'GPS mapped' : 'Legacy record'}
                              </span>
                            </div>
                            <p className="mt-1 text-[10px] font-semibold text-[#72796e]">
                              {farm.crop} · {farm.acres.toFixed(1)} acres · {vertexCount} boundary points
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#42493e]">
                              <span className="material-symbols-outlined text-sm text-[#2b5c27]">location_on</span>
                              <span className="truncate">{farm.locationName || 'Area name unavailable'}</span>
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#72796e]">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              {mappedDate && !Number.isNaN(mappedDate.getTime())
                                ? `Mapped: ${mappedDate.toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}`
                                : 'Legacy record · mapping time unavailable'}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#72796e]">
                              <span className="material-symbols-outlined text-sm">event</span>
                              {farm.farmDate && !Number.isNaN(new Date(farm.farmDate).getTime())
                                ? `Added: ${new Date(farm.farmDate).toLocaleDateString(undefined, {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}`
                                : 'Added date unavailable'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] md:w-64">
                          <div className="rounded-xl bg-[#f5f7f3] px-3 py-2">
                            <span className="block text-[#72796e]">Latitude</span>
                            <strong className="font-mono">{farm.lat.toFixed(5)}</strong>
                          </div>
                          <div className="rounded-xl bg-[#f5f7f3] px-3 py-2">
                            <span className="block text-[#72796e]">Longitude</span>
                            <strong className="font-mono">{farm.lng.toFixed(5)}</strong>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onSelectFarm(farm)}
                            className="flex items-center justify-center gap-1 rounded-xl border border-[#cdd7ca] px-3 py-2 text-[10px] font-extrabold text-[#2b5c27] hover:bg-[#eef4ec]"
                          >
                            Full Details
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMapRecord(farm)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                            title={`Delete ${farm.name}`}
                            aria-label={`Delete map record for ${farm.name}`}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </main>
        </>
      )}

      {/* View Mode 2: Step 1 of Form (Enter Crop & Field Details) */}
      {viewMode === 'add-details' && (
        <>
          <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-[#ecefea]">
            <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-7xl mx-auto w-full">
              <button 
                onClick={() => setViewMode('list')}
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-[#ecefea]"
                title="Back to list"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <span className="text-lg font-bold text-[#191c1a]">New Farm: Step 1 of 2</span>
              <div className="w-8"></div>
            </div>
          </header>

          <main className="w-full max-w-md md:max-w-xl mx-auto px-4 mt-4 pb-6">
            <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-5">
              
              {/* Process Bar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f4ef]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-extrabold">1</div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#191c1a]">Crop & Soil Details</h3>
                    <p className="text-[10px] text-[#72796e] font-medium leading-none">Register seeding variety parameters</p>
                  </div>
                </div>
                <div className="text-[10px] font-extrabold text-[#72796e] tracking-widest">
                  NEXT: GPS MAP
                </div>
              </div>

              <form onSubmit={handleProceedToMapping} className="space-y-4">
                {/* Farm name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#42493e] uppercase tracking-wide">Farm Field Name</label>
                  <input 
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Riverside Soya Block B"
                    className="w-full px-4 py-3 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-semibold"
                  />
                  <p className="text-[10px] text-[#72796e] font-medium">Provide a distinct local label for mapping telemetry tracking.</p>
                </div>

                {/* Crop Quick Selection Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#42493e] uppercase tracking-wide block">Select Crop Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Wheat', icon: 'grain' },
                      { name: 'Corn', icon: 'potted_plant' },
                      { name: 'Soybeans', icon: 'grass' },
                      { name: 'Rice', icon: 'spa' },
                      { name: 'Cotton', icon: 'cloud' },
                      { name: 'Sugarcane', icon: 'stacked_line_chart' }
                    ].map((cropItem) => {
                      const isSelected = formCrop === cropItem.name;
                      return (
                        <button
                          key={cropItem.name}
                          type="button"
                          onClick={() => setFormCrop(cropItem.name)}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-primary/15 border-primary text-primary font-bold shadow-sm' 
                              : 'bg-white border-[#ecefea] text-[#42493e] font-medium hover:border-[#c2c9bb]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg mb-1">{cropItem.icon}</span>
                          <span className="text-xs tracking-tight">{cropItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seed Variety Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#42493e] uppercase tracking-wide">Seed Variety / Hybrid Name</label>
                  <input 
                    type="text"
                    value={formVariety}
                    onChange={(e) => setFormVariety(e.target.value)}
                    placeholder="e.g., Lok-1 Golden, HD 2967, Pioneer P3396"
                    className="w-full px-4 py-3 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-semibold"
                  />
                  <p className="text-[10px] text-[#72796e] font-medium">Enter seed brand/hybrid for accurate localized yield estimation.</p>
                </div>

                {/* Sowing Date Picker */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#42493e] uppercase tracking-wide">Sowing Date</label>
                    <input 
                      type="date"
                      required
                      value={formSowingDate}
                      onChange={(e) => setFormSowingDate(e.target.value)}
                      className="w-full px-3 py-3 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#42493e] uppercase tracking-wide">Soil Classification</label>
                    <select
                      value={formSoilType}
                      onChange={(e) => setFormSoilType(e.target.value)}
                      className="w-full px-3 py-3 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-bold cursor-pointer"
                    >
                      <option value="Clayey Black">Clayey Black Soil</option>
                      <option value="Red Sandy">Red Sandy Soil</option>
                      <option value="Loamy Alluvial">Loamy Alluvial Soil</option>
                      <option value="Laterite Acidic">Laterite Acidic Soil</option>
                      <option value="Silty Clay">Silty Clay Soil</option>
                    </select>
                  </div>
                </div>

                {/* Estimated Area in Acres & preset options */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold text-[#42493e] uppercase tracking-wide">Acreage Estimate (Target)</label>
                    <span className="text-xs font-bold text-primary">{(formAcres * 0.4046).toFixed(1)} Hectares</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <input 
                      type="number"
                      required
                      min={1}
                      max={5000}
                      value={formAcres || ''}
                      onChange={(e) => setFormAcres(Number(e.target.value))}
                      className="w-24 px-3 py-2.5 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-black text-center"
                    />
                    
                    <div className="flex gap-1.5 flex-grow">
                      {[5, 10, 20, 50].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormAcres(amt)}
                          className={`flex-grow py-2 rounded-lg border text-xs font-bold transition-colors ${
                            formAcres === amt 
                              ? 'bg-primary border-primary text-white' 
                              : 'bg-white border-[#c2c9bb]/60 text-[#42493e] hover:bg-[#f1f4ef]'
                          }`}
                        >
                          {amt} ac
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#72796e] font-medium leading-normal">
                    This provides a default estimate which will be refined automatically once you draw the field boundaries on the satellite map in the next step.
                  </p>
                </div>

                {/* Forward Button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#1a4f16] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-sm mt-6 cursor-pointer"
                >
                  <span>Proceed to Geolocation Map</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            </div>
          </main>
        </>
      )}

      {/* View Mode 3: Satellite boundary mapping (Step 2 of Wizard) */}
      {viewMode === 'add-map' && (
        <div className="bg-[#f7faf5] text-[#191c1a] overflow-hidden h-screen flex flex-col relative select-none">
          
          {/* Header bar */}
          <header className="bg-white/95 backdrop-blur shadow-sm z-50 relative border-b border-[#ecefea]">
            <div className="flex justify-between items-center px-4 md:px-8 h-14 w-full max-w-md md:max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2b5c27] text-2xl font-bold">eco</span>
                <span className="text-lg font-black text-[#1c3c19] tracking-tight">AgriYield</span>
              </div>
              <button 
                onClick={() => setViewMode('list')}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 cursor-pointer"
                title="Close"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </header>

          {/* Map viewport canvas area */}
          <main className="relative flex-grow overflow-hidden max-w-md md:max-w-7xl mx-auto w-full md:rounded-3xl md:shadow-lg md:my-4 md:border md:border-[#ecefea]">
            <LiveSatelliteMap
              center={{ lat: latitude, lng: longitude }}
              points={points}
              mode={activeTool}
              onMapClick={handleMapClick}
              userLocation={userLocation}
              locationAccuracy={satellitePrecision}
              locationName={locationName}
            />

            {/* Floating Map Search Bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] z-20">
              <div className="bg-white rounded-2xl shadow-md border border-[#ecefea] flex items-center px-3.5 h-12">
                <span className="material-symbols-outlined text-gray-400 text-lg mr-2 font-bold">search</span>
                <input 
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMapSearchLocate()}
                  className="flex-grow bg-transparent border-none focus:outline-none text-xs text-[#191c1a] font-medium placeholder:text-gray-400" 
                  placeholder="Search farm address or coord" 
                />
                <button 
                  onClick={handleMapSearchLocate}
                  disabled={isLocating}
                  className="p-1 text-[#2b5c27] hover:bg-[#f1f4ef] rounded-full transition-colors cursor-pointer"
                  title={mapSearch ? 'Search location' : 'Use my live location'}
                >
                  <span className="material-symbols-outlined text-lg">{isLocating ? 'progress_activity' : 'my_location'}</span>
                </button>
              </div>
            </div>

            {/* Floating Instructions Tooltip */}
            <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 z-20 pointer-events-none w-auto max-w-[90%]">
              <div className="bg-[#333d36]/90 text-white rounded-[14px] px-4 py-1.5 backdrop-blur-md shadow-md text-center flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wide text-gray-100">
                  {activeTool === 'draw' 
                    ? 'Tap map to place field vertices' 
                    : 'Tap to place single pinpoint marker coordinate'}
                </span>
              </div>
            </div>

            {/* Custom Map State/Search Toast Notification Overlay */}
            {mapNotification && (
              <div className="absolute top-[7.5rem] left-1/2 -translate-x-1/2 z-30 w-auto max-w-[85%] animate-bounce">
                <div className="bg-primary text-white rounded-full px-4 py-1 text-[9px] font-bold shadow-lg flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs">done</span>
                  <span>{mapNotification}</span>
                </div>
              </div>
            )}

            {/* Floating Sidebar Action Menu Controls */}
            <div className="absolute right-4 top-[35%] flex flex-col gap-3.5 z-25 pointer-events-auto">
              
              {/* Top Menu Block (Pin, Connect Vertices, Edit, Clear) */}
              <div className="flex flex-col bg-white rounded-2xl shadow-md border border-[#ecefea] p-1 gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveTool('pin'); }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                    activeTool === 'pin' 
                      ? 'bg-[#183d1c] text-white shadow-sm' 
                      : 'hover:bg-gray-100 text-[#42493e]'
                  }`} 
                  title="Pin Point"
                >
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveTool('draw'); }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                    activeTool === 'draw' 
                      ? 'bg-[#183d1c] text-white shadow-sm' 
                      : 'hover:bg-gray-100 text-[#42493e]'
                  }`} 
                  title="Draw Polygon"
                >
                  <span className="material-symbols-outlined text-[20px]">polyline</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setPoints(prev => prev.slice(0, -1)); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-[#42493e] cursor-pointer" 
                  title="Undo last vertex"
                >
                  <span className="material-symbols-outlined text-[20px]">undo</span>
                </button>
                <div className="h-[1px] bg-gray-100 mx-1.5 my-0.5"></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setPoints([]); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer" 
                  title="Reset Field"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

            </div>

            {/* Boundary Details Overlay Card */}
            <div className="absolute bottom-[4.8rem] left-4 z-20 flex flex-col gap-2.5 pointer-events-auto">
              
              {/* Boundary Card */}
              <div className="bg-white p-4 rounded-[22px] border border-[#ecefea] shadow-md w-48 space-y-3">
                <div>
                  <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">CURRENT BOUNDARY</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-black text-[#1c3c19] tracking-tight leading-none">
                      {points.length < 3 ? formAcres.toFixed(1) : calculatedAcres.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-gray-500">Acres</span>
                  </div>
                </div>
                
                <div className="space-y-1.5 pt-2 border-t border-gray-100 text-[11px] font-semibold text-[#42493e]">
                  <div className="mb-2 rounded-xl bg-[#f1f4ef] p-2">
                    <span className="mb-0.5 block text-[8px] font-bold uppercase tracking-wider text-gray-400">Area name</span>
                    <span className="block text-[10px] font-extrabold leading-snug text-[#191c1a]">{locationName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Latitude</span>
                    <span className="font-extrabold text-[#191c1a] font-mono text-[10px]">{Math.abs(latitude).toFixed(4)}° {latitude >= 0 ? 'N' : 'S'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Longitude</span>
                    <span className="font-extrabold text-[#191c1a] font-mono text-[10px]">{Math.abs(longitude).toFixed(4)}° {longitude >= 0 ? 'E' : 'W'}</span>
                  </div>
                </div>
              </div>

              {/* Satellite Precision Pill */}
              <div className="bg-white px-3 py-1.5 rounded-full border border-[#ecefea] shadow-sm flex items-center gap-1.5 w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2b5c27]"></span>
                <span className="text-[9px] font-bold text-[#42493e]">
                  {satellitePrecision ? `GPS accuracy: ±${satellitePrecision}m` : 'Satellite imagery active'}
                </span>
              </div>
            </div>

            {/* Bottom Centered Confirm Button */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[92%] z-20 bottom-4 pointer-events-auto">
              <button 
                onClick={handleSaveFarm}
                disabled={points.length < 3}
                className="w-full bg-[#183d1c] hover:bg-[#112d14] disabled:bg-gray-500 disabled:cursor-not-allowed text-white h-12 rounded-[20px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Confirm Field Boundary</span>
                <span className="material-symbols-outlined text-base">check_circle</span>
              </button>
            </div>
          </main>
        </div>
      )}

      {/* Persistent Navigation bar (Synced across key screens) */}
      {viewMode === 'list' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ecefea] z-40 md:hidden">
          <div className="flex justify-around items-center h-16 max-w-md mx-auto">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]">home</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
            </button>
            
            <button 
              onClick={() => setViewMode('list')}
              className="flex flex-col items-center justify-center gap-0.5 text-primary font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined font-bold text-[26px]">agriculture</span>
              <span className="text-[10px] font-bold tracking-wider uppercase">Farms</span>
            </button>
            
            <button 
              onClick={() => onNavigate('market')}
              className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]">storefront</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Market</span>
            </button>
            
            <button 
              onClick={() => onNavigate('weather')}
              className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]">partly_cloudy_day</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Weather</span>
            </button>
            
            <button 
              onClick={() => onNavigate('profile')}
              className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]">person</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
