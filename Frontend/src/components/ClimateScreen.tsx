import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { t } from '../utils/translations';

interface ClimateScreenProps {
  profile: UserProfile;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

interface WeatherData {
  resolvedCityName: string;
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    weathercode: number[];
  };
}

export default function ClimateScreen({
  profile,
  onNavigate,
  onMenuClick
}: ClimateScreenProps) {
  const lang = profile.preferredLanguage;

  // Use user's actual district/state from profile; fallback to 'Nagpur' (not 'Surat')
  const initialCity = profile?.district || profile?.state || 'Nagpur';
  const [searchCity, setSearchCity] = useState(initialCity);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchWeather(initialCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeather = async (cityToFetch: string) => {
    if (!cityToFetch.trim()) return;
    
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`http://localhost:8081/api/weather?location=${encodeURIComponent(cityToFetch)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Location not found');
      }
      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Location not found or invalid');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return 'sunny';
    if (code >= 1 && code <= 3) return 'partly_cloudy_day';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 80 && code <= 99) return 'thunderstorm';
    return 'cloud';
  };

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Clear outer drainage culverts on North Ridge field.", done: true },
    { id: 2, text: "Pause automated sprinkler irrigation (48h window).", done: false },
    { id: 3, text: "Secure temporary grain/fertilizer bags inside dry barns.", done: false },
    { id: 4, text: "Pre-apply anti-fungal soil treatments to Southern Flat.", done: false }
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  return (
    <div className="min-h-screen bg-[#F9FBF8] pb-12 md:pb-16 text-[#191c1a]">
      {/* Top Header Bar */}
      <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-[#ecefea]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuClick}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#42493e] hover:bg-[#ecefea] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#42493e] hover:bg-[#ecefea] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <span className="text-lg font-black text-primary tracking-tight">{t("Season & Climate", lang)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer"
            >
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-5 pb-12">
        
        {/* High Contrast Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center bg-white p-2 rounded-2xl border border-[#ecefea] shadow-sm">
          <div className="relative flex-1 flex items-center pl-3">
            <span className="material-symbols-outlined text-gray-400 text-xl mr-2">search</span>
            <input
              type="text"
              placeholder="Enter city or location (e.g. Pune, Surat)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full bg-transparent text-sm text-[#191c1a] font-semibold focus:outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#1b2f15] hover:bg-[#154212] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Dynamic Weather Banner */}
        <div className="bg-gradient-to-r from-[#1b2f15] to-[#154212] text-white p-5 rounded-3xl relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[130px] translate-x-6 translate-y-6">
              {weather ? getWeatherIcon(weather.current_weather.weathercode) : 'cloud'}
            </span>
          </div>

          <p className="text-[10px] font-black text-emerald-300 tracking-widest uppercase">
            REGIONAL WEATHER SYNC ({weather?.resolvedCityName ? weather.resolvedCityName.toUpperCase() : 'SEARCHING...'})
          </p>
          <h3 className="text-xl font-black mt-1.5 tracking-tight">
            {weather ? `Current Temp: ${weather.current_weather.temperature}°C` : 'Fetching Weather...'}
          </h3>
          <p className="text-xs text-emerald-100 leading-relaxed mt-1">
            Real-time weather forecast generated via live Open-Meteo satellite feed.
          </p>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10 text-xs">
            <span>Average Temp: {weather ? `${weather.current_weather.temperature}°C` : '--'}</span>
            <span className="font-bold text-[#fcc019]">
              Rain Today: {weather ? `${weather.daily.precipitation_sum[0]}mm` : '--'}
            </span>
          </div>
        </div>

        {/* 5-Day Outlook with Dynamic Days */}
        {weather && (
  <div className="bg-white p-5 rounded-3xl border border-[#ecefea] shadow-sm ambient-tonal-card space-y-4">
    <h4 className="text-sm font-bold text-[#191c1a] uppercase tracking-wider">5-Day Outlook</h4>

    <div className="space-y-3">
      {weather.daily.time.slice(0, 5).map((dateStr, idx) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayName = idx === 0 
          ? `Today (${dateObj.toLocaleDateString('en-US', { weekday: 'short' })})` 
          : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

        const icon = getWeatherIcon(weather.daily.weathercode[idx]);
        const prob = weather.daily.precipitation_probability_max[idx];
        const rainMm = weather.daily.precipitation_sum[idx];
        
        // Match current temp for today's entry, daily max for upcoming days
        const displayTemp = idx === 0 && weather.current_weather
          ? Math.round(weather.current_weather.temperature)
          : Math.round(weather.daily.temperature_2m_max[idx]);

        return (
          <div key={dateStr} className="flex justify-between items-center text-xs py-1.5 border-b border-[#ecefea] last:border-none">
            <span className="w-24 font-bold text-[#42493e]">{dayName}</span>
            <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
            <span className="font-semibold text-primary">{prob}% chance ({rainMm}mm)</span>
            <span className="font-bold text-[#191c1a]">{displayTemp}°C</span>
          </div>
        );
      })}
    </div>
  </div>
)}
        {/* Action Checklist */}
        <div className="bg-white p-5 rounded-3xl border border-[#ecefea] shadow-sm ambient-tonal-card space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-xl">fact_check</span>
              <h4 className="text-base tracking-tight">Monsoon Safeguard Checklist</h4>
            </div>
            
            <span className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">
              {checklist.filter(c => c.done).length} / {checklist.length} DONE
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f1f4ef] transition-colors cursor-pointer"
              >
                <button 
                  type="button"
                  className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    item.done 
                      ? 'bg-primary border-transparent text-white' 
                      : 'bg-white border-[#c2c9bb]'
                  }`}
                >
                  {item.done && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </button>
                <p className={`text-xs leading-relaxed ${item.done ? 'line-through text-[#72796e]' : 'text-[#191c1a]'}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}