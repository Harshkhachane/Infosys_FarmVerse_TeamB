import React, { useState } from 'react';
import { UserProfile, Farm } from '../types';
import { t } from '../utils/translations';

interface CropComparisonScreenProps {
  profile: UserProfile;
  selectedFarm: Farm;
  onUpdateFarmCrop: (farmId: string, newCrop: string) => void;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

export default function CropComparisonScreen({
  profile,
  selectedFarm,
  onUpdateFarmCrop,
  onNavigate,
  onMenuClick
}: CropComparisonScreenProps) {
  const lang = profile.preferredLanguage;
  const [cropA, setCropA] = useState('Corn');
  const [cropB, setCropB] = useState('Soybeans');

  const handleSwitchSchedule = () => {
    onUpdateFarmCrop(selectedFarm.id, cropB);
    alert(`Successfully switched "${selectedFarm.name}" schedule to ${cropB}. Soil irrigation schedules and Mandi alerts updated.`);
    onNavigate('dashboard');
  };

  // Static matrix parameters for rendering
  const matrix = [
    { label: 'Suitability Index', corn: '92% (High)', soybeans: '84% (High)', wheat: '79% (Medium)' },
    { label: 'Water Requirement', corn: 'Moderate (18 inches)', soybeans: 'Low (12 inches)', wheat: 'Low (10 inches)' },
    { label: 'Est. Yield / Acre', corn: '4.2 Tons', soybeans: '1.8 Tons', wheat: '3.5 Tons' },
    { label: 'Mandi Price / Quintal', corn: '₹2,450', soybeans: '₹5,120', wheat: '₹2,350' },
    { label: 'Net Profit Est / Acre', corn: '$3,850', soybeans: '$3,450', wheat: '$3,120' },
    { label: 'Soil Nutrient Target', corn: 'NPK 10-10-10', soybeans: 'NPK 0-20-20 (Rhizobia)', wheat: 'NPK 12-32-16' },
  ];

  const getCropValue = (crop: string, row: typeof matrix[0]) => {
    if (crop === 'Corn') return row.corn;
    if (crop === 'Soybeans') return row.soybeans;
    return row.wheat;
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
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#42493e] hover:bg-[#ecefea] cursor-pointer"
              title="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <span className="text-lg font-black text-primary tracking-tight">{t("Crop Advisor Comparison", lang)}</span>
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

      {/* Main Content */}
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-5 pb-12">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight mb-1">Comparative Insights</h2>
          <p className="text-xs text-[#72796e] font-medium leading-relaxed">
            Compare target agricultural models for <span className="font-bold text-[#191c1a]">{selectedFarm.name}</span>.
          </p>
        </div>

        {/* Dynamic drop selectors side by side */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white p-3 rounded-2xl border border-[#ecefea] shadow-sm">
            <label className="block text-[9px] font-bold text-[#72796e] uppercase mb-1">PRIMARY CROP</label>
            <div className="relative">
              <select 
                value={cropA}
                onChange={(e) => setCropA(e.target.value)}
                className="w-full bg-[#f1f4ef] border border-[#c2c9bb]/60 rounded-xl px-3 py-2.5 text-xs font-bold text-[#191c1a] appearance-none cursor-pointer"
              >
                <option value="Corn">Golden Maize</option>
                <option value="Soybeans">Organic Soybeans</option>
                <option value="Wheat">Winter Wheat</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#72796e]">
                unfold_more
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#ecefea] shadow-sm">
            <label className="block text-[9px] font-bold text-[#72796e] uppercase mb-1">ALTERNATIVE CROP</label>
            <div className="relative">
              <select 
                value={cropB}
                onChange={(e) => setCropB(e.target.value)}
                className="w-full bg-[#f1f4ef] border border-[#c2c9bb]/60 rounded-xl px-3 py-2.5 text-xs font-bold text-[#191c1a] appearance-none cursor-pointer"
              >
                <option value="Soybeans">Organic Soybeans</option>
                <option value="Corn">Golden Maize</option>
                <option value="Wheat">Winter Wheat</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#72796e]">
                unfold_more
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-3xl border border-[#ecefea] shadow-sm overflow-hidden ambient-tonal-card">
          <div className="bg-[#f1f4ef] px-4 py-3 border-b border-[#ecefea]">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Suitability Matrix</h3>
          </div>

          <div className="divide-y divide-[#ecefea]">
            {matrix.map((row, idx) => (
              <div key={idx} className="p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider block">
                  {row.label}
                </span>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="border-l-2 border-primary pl-2">
                    <p className="text-[10px] text-[#72796e] uppercase tracking-wide">
                      {cropA === 'Corn' ? 'Golden Maize' : cropA === 'Soybeans' ? 'Organic Soybeans' : 'Winter Wheat'}
                    </p>
                    <p className="font-bold text-[#191c1a] mt-0.5">{getCropValue(cropA, row)}</p>
                  </div>

                  <div className="border-l-2 border-[#785900] pl-2">
                    <p className="text-[10px] text-[#72796e] uppercase tracking-wide">
                      {cropB === 'Corn' ? 'Golden Maize' : cropB === 'Soybeans' ? 'Organic Soybeans' : 'Winter Wheat'}
                    </p>
                    <p className="font-bold text-[#191c1a] mt-0.5">{getCropValue(cropB, row)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive switch schedule card */}
        <div className="bg-gradient-to-r from-[#fcc019]/10 to-[#fcc019]/25 p-5 rounded-3xl border border-[#fcc019]/30 space-y-4 shadow-sm text-[#251a00]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">swap_horiz</span>
            <h4 className="text-sm font-black tracking-tight">Schedule Adjustment Action</h4>
          </div>

          <p className="text-xs leading-relaxed font-medium text-[#3b2d03]">
            Would you like to swap the current seeding model from <span className="font-bold">{cropA === 'Corn' ? 'Golden Maize' : cropA === 'Soybeans' ? 'Organic Soybeans' : 'Winter Wheat'}</span> to <span className="font-bold">{cropB === 'Corn' ? 'Golden Maize' : cropB === 'Soybeans' ? 'Organic Soybeans' : 'Winter Wheat'}</span> for this field? This will immediately recalibrate crop water and soil treatment plans.
          </p>

          <button 
            type="button"
            onClick={handleSwitchSchedule}
            className="w-full bg-[#154212] hover:bg-[#1b2f15] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Switch Field Schedule</span>
            <span className="material-symbols-outlined text-sm font-bold">check</span>
          </button>
        </div>

      </main>

      {/* Persistent Navigation bar */}
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
            onClick={() => onNavigate('map')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">agriculture</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Farms</span>
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
    </div>
  );
}
