import React, { useState } from 'react';
import { UserProfile } from '../types';
import { t } from '../utils/translations';

interface WaterIrrigationScreenProps {
  profile: UserProfile;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

export default function WaterIrrigationScreen({
  profile,
  onNavigate,
  onMenuClick
}: WaterIrrigationScreenProps) {
  const lang = profile.preferredLanguage;
  const [waterSource, setWaterSource] = useState('Borewell');
  const [availability, setAvailability] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [irrigationType, setIrrigationType] = useState('Drip');
  const [frequency, setFrequency] = useState('2 times/week');
  const [gwLevel, setGwLevel] = useState('45');
  const [soilMoisture, setSoilMoisture] = useState(28);

  const handleSave = () => {
    // Elegant non-blocking UI alert
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F4F9FB] via-white to-[#F6FAF6] pb-12 md:pb-16 text-[#191c1a]">
      
      {/* Top Header Bar */}
      <header className="bg-white/80 backdrop-blur shadow-xs sticky top-0 z-40 border-b border-[#ecefea]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuClick}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <span className="text-lg font-black text-primary tracking-tight flex items-center gap-1.5">
              <span className="material-symbols-outlined">eco</span>
              {t("AgriYield", lang)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer animate-pulse-slow"
            >
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Fields */}
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 space-y-5 mt-4 md:mt-6 pb-12">
        <div className="p-4 rounded-2xl bg-[#E3F2FD] border border-[#BBDEFB] shadow-xs">
          <h2 className="text-2xl font-black text-blue-800 tracking-tight mb-1">{t("Water & Irrigation", lang)}</h2>
          <p className="text-xs text-blue-900 font-bold leading-relaxed">
            {t("Configure your farm's hydration strategy to optimize crop yield.", lang)}
          </p>
        </div>

        {/* Primary Supply Card - Pastel Blue Accent */}
        <div className="bg-[#E3F2FD] p-5 rounded-3xl border border-[#BBDEFB] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <span className="material-symbols-outlined text-xl">water_drop</span>
            <h3 className="text-base tracking-tight">{t("Primary Supply", lang)}</h3>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              {t("Water Source", lang)}
            </label>
            <div className="relative">
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full bg-white border border-[#BBDEFB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#191c1a] appearance-none cursor-pointer font-semibold"
              >
                <option value="Borewell">Borewell</option>
                <option value="Canal">Canal</option>
                <option value="Rainwater Harvesting">Rainwater Harvesting</option>
                <option value="Open Well">Open Well</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-700">
                unfold_more
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">
              {t("CURRENT WATER AVAILABILITY", lang)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setAvailability(level)}
                  className={`py-3 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer border ${
                    availability === level
                      ? 'bg-blue-600 text-white border-transparent shadow-xs'
                      : 'bg-white text-blue-900 border-[#BBDEFB] hover:bg-blue-50/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm align-middle mr-1">
                    {level === 'LOW' ? 'humidity_low' : level === 'MEDIUM' ? 'humidity_mid' : 'humidity_high'}
                  </span>
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Irrigation Setup Card - Pastel Yellow Accent */}
        <div className="bg-[#FFFDE7] p-5 rounded-3xl border border-[#FFF59D] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <span className="material-symbols-outlined text-xl">settings_input_component</span>
            <h3 className="text-base tracking-tight">{t("Irrigation Setup", lang)}</h3>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              {t("IRRIGATION TYPE", lang)}
            </label>
            <div className="relative">
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full bg-white border border-[#FFF59D] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#191c1a] appearance-none cursor-pointer font-semibold"
              >
                <option value="Drip">Drip</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Flood">Flood</option>
                <option value="Furrow">Furrow</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600">
                unfold_more
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                {t("FREQUENCY", lang)}
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-white border border-[#FFF59D] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#191c1a] font-semibold"
                placeholder="e.g., 2 times/week"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                {t("GW LEVEL (M)", lang)}
              </label>
              <input
                type="number"
                value={gwLevel}
                onChange={(e) => setGwLevel(e.target.value)}
                className="w-full bg-white border border-[#FFF59D] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#191c1a] font-semibold"
                placeholder="e.g., 45"
              />
            </div>
          </div>
        </div>

        {/* Pro Tip Yellow Banner */}
        <div className="bg-[#FFF9C4] border border-[#FFF176] text-[#5D4037] p-4 rounded-2xl flex items-start gap-3 shadow-xs">
          <span className="material-symbols-outlined text-2xl shrink-0 text-[#E65100] mt-0.5 animate-bounce">lightbulb</span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-0.5">{t("PRO TIP", lang)}</h4>
            <p className="text-xs leading-relaxed font-bold">
              {t("Switching to Drip irrigation can reduce water waste by up to 40% for your current soil profile.", lang)}
            </p>
          </div>
        </div>

        {/* Smart Monitoring Image with Slide Adjustment */}
        <div className="relative h-44 rounded-3xl overflow-hidden bg-emerald-950 shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600" 
            alt="Hydrated field rows" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          
          <div className="absolute inset-4 flex flex-col justify-between text-white">
            <div>
              <span className="px-2 py-0.5 bg-primary/80 rounded text-[9px] font-bold uppercase tracking-widest">
                {t("Smart Monitoring", lang)}
              </span>
              <h4 className="text-lg font-black tracking-tight mt-1">
                {t("Real-time Soil Moisture", lang)}: {soilMoisture}%
              </h4>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-emerald-200">
                <span>{t("DRY FIELD", lang) || "DRY FIELD"}</span>
                <span>{t("WET / SATURATED", lang) || "WET / SATURATED"}</span>
              </div>
              <input 
                type="range"
                min="5"
                max="95"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-primary h-1 rounded-full cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Save & Continue */}
        <button 
          onClick={handleSave}
          className="w-full bg-primary hover:bg-[#1a4f16] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{t("Save & Continue", lang)}</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </main>

      {/* Water Plans Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ecefea] z-40 md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">grid_view</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Dashboard", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('soil')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">science</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Soil Analysis", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('water')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#2b5c27] font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[26px]">water_drop</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">{t("Water & Irrigation", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('market')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">storefront</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Mandi Prices", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('plans')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">assignment</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Fertilizer Treatment", lang)}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
