import React from 'react';
import { Farm, UserProfile } from '../types';
import { t } from '../utils/translations';

interface FarmDetailsScreenProps {
  selectedFarm: Farm;
  profile: UserProfile;
  onNavigate: (screen: string) => void;
  onBackToDashboard: () => void;
  onMenuClick: () => void;
}

export default function FarmDetailsScreen({
  selectedFarm,
  profile,
  onNavigate,
  onBackToDashboard,
  onMenuClick
}: FarmDetailsScreenProps) {
  const lang = profile.preferredLanguage;
  // We can default details to corn (Golden Maize) or make it dynamic
  const cropTitle = selectedFarm.crop === 'Corn' ? 'Golden Maize' : selectedFarm.crop === 'Wheat' ? 'Winter Wheat (Premium)' : 'Organic Soybeans';
  const suitabilityScore = selectedFarm.crop === 'Corn' ? 92 : selectedFarm.crop === 'Wheat' ? 79 : 84;
  const description = selectedFarm.crop === 'Corn' 
    ? 'Optimal for Loamy Soil & current climate' 
    : 'Excellent soil rotation, standard yields';

  const expectedYieldVal = selectedFarm.crop === 'Corn' ? '4.2' : selectedFarm.crop === 'Wheat' ? '3.5' : '4.5';
  const expectedYieldUnit = selectedFarm.crop === 'Corn' ? 'tons/acre' : selectedFarm.crop === 'Wheat' ? 'tons/acre' : 'tons/acre';
  const regionalDiff = selectedFarm.crop === 'Corn' ? '+12%' : selectedFarm.crop === 'Wheat' ? '+5%' : '+8%';

  const profitEst = selectedFarm.crop === 'Corn' ? '$3,850' : selectedFarm.crop === 'Wheat' ? '$3,120' : '$4,100';
  const estInvestment = selectedFarm.crop === 'Corn' ? '$1,200' : selectedFarm.crop === 'Wheat' ? '$950' : '$1,100';

  return (
    <div className="min-h-screen bg-[#F9FBF8] pb-12 md:pb-16">
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
              onClick={onBackToDashboard}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#42493e] hover:bg-[#ecefea] cursor-pointer"
              title="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <span className="text-lg font-black text-primary tracking-tight">{t("Farm Details", lang)}</span>
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

      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-5 pb-12">
        
        {/* Hero Field Image with Crop Match Badge */}
        <div className="relative h-56 rounded-3xl overflow-hidden bg-emerald-950 shadow-md">
          <img 
            src={selectedFarm.imageUrl} 
            alt={selectedFarm.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#fcc019] text-[#251a00] rounded-full text-xs font-black tracking-widest uppercase shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">verified</span>
              HIGH MATCH
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-bold text-emerald-200 tracking-wider uppercase">CURRENTLY PLANTED IN {selectedFarm.name.toUpperCase()}</p>
            <h2 className="text-2xl font-black tracking-tight">{cropTitle}</h2>
          </div>
        </div>

        {/* Suitability Circle & General Info Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#c2c9bb]/40 shadow-sm ambient-tonal-card">
          <div className="flex justify-between items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-primary tracking-tight">{cropTitle}</h3>
              <p className="text-xs text-[#72796e] font-medium leading-relaxed">{description}</p>
              
              <div className="flex flex-wrap gap-2 pt-3">
                <span className="px-3 py-1 bg-[#f1f4ef] text-[#191c1a] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#c2c9bb]/30">
                  <span className="material-symbols-outlined text-primary text-sm">water_drop</span>
                  Water Req: Moderate
                </span>
                <span className="px-3 py-1 bg-[#f1f4ef] text-[#191c1a] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#c2c9bb]/30">
                  <span className="material-symbols-outlined text-secondary text-sm">science</span>
                  NPK 10-10-10
                </span>
              </div>
            </div>

            {/* Circle Match Progress Bar */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-18 h-18 flex items-center justify-center rounded-full bg-emerald-50 border-4 border-primary">
                <div className="absolute inset-1 rounded-full border-2 border-dashed border-primary/25"></div>
                <span className="text-xl font-black text-primary tracking-tight">{suitabilityScore}%</span>
              </div>
              <span className="text-[10px] font-bold text-[#72796e] mt-1 uppercase tracking-wider">Suitability</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mt-6">
            <button 
              onClick={() => onNavigate('plans')}
              className="w-full bg-primary hover:bg-[#1a4f16] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>View Details</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('crop-comparison')}
                className="w-full border-2 border-[#c2c9bb] text-primary hover:bg-[#ecefea] font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">compare_arrows</span>
                COMPARE
              </button>
              <button 
                onClick={() => onNavigate('reports')}
                className="w-full border-2 border-[#c2c9bb] text-primary hover:bg-[#ecefea] font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">download</span>
                REPORT
              </button>
            </div>
          </div>
        </div>

        {/* Expected Yield & Metrics Cards */}
        <div className="space-y-3">
          {/* Expected Yield */}
          <div className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">agriculture</span>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">EXPECTED YIELD</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#191c1a]">{expectedYieldVal}</span>
                <span className="text-xs font-semibold text-[#72796e]">{expectedYieldUnit}</span>
                <span className="text-xs font-extrabold text-primary shrink-0 ml-1">
                  ({regionalDiff} vs. regional avg)
                </span>
              </div>
            </div>
          </div>

          {/* Profit Estimate */}
          <div className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">PROFIT ESTIMATE</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#191c1a]">{profitEst}</span>
                <span className="text-xs font-semibold text-[#72796e]">/acre</span>
                <span className="text-[10px] font-semibold text-[#72796e] shrink-0 ml-2">
                  (Based on current market pricing)
                </span>
              </div>
            </div>
          </div>

          {/* Est. Investment */}
          <div className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#fcc019]/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">EST. INVESTMENT</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#191c1a]">{estInvestment}</span>
                <span className="text-xs font-semibold text-[#72796e]">/acre</span>
                <span className="text-[10px] font-semibold text-[#72796e] shrink-0 ml-2">
                  (Seed, labor, and nutrients)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Crops Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#191c1a] tracking-tight">Alternative Crops</h3>
            <button 
              onClick={() => onNavigate('crop-comparison')}
              className="text-xs font-bold text-primary hover:underline"
            >
              VIEW ALL
            </button>
          </div>

          {/* Soybean alternative */}
          <div 
            onClick={() => onNavigate('crop-comparison')}
            className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-sm flex gap-4 items-center hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-950 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=200" 
                alt="Soybeans" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow space-y-0.5">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-[#191c1a] group-hover:text-primary transition-colors">Organic Soybeans</h4>
                <span className="px-2 py-0.5 bg-[#f1f4ef] text-primary rounded text-[9px] font-extrabold">84% MATCH</span>
              </div>
              <p className="text-xs text-[#72796e] leading-tight">Lower water usage, higher processing labor.</p>
              <div className="flex gap-4 text-[10px] font-bold text-[#42493e] pt-1">
                <span>ROI: ~210%</span>
                <span>Harvest: 115 days</span>
              </div>
            </div>
          </div>

          {/* Winter Wheat alternative */}
          <div 
            onClick={() => onNavigate('crop-comparison')}
            className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-sm flex gap-4 items-center hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-950 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200" 
                alt="Wheat" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow space-y-0.5">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-[#191c1a] group-hover:text-primary transition-colors">Winter Wheat</h4>
                <span className="px-2 py-0.5 bg-[#f1f4ef] text-[#72796e] rounded text-[9px] font-extrabold">79% MATCH</span>
              </div>
              <p className="text-xs text-[#72796e] leading-tight">Excellent soil rotation, standard yields.</p>
              <div className="flex gap-4 text-[10px] font-bold text-[#42493e] pt-1">
                <span>ROI: ~185%</span>
                <span>Harvest: 140 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Golden Maize Advice panel */}
        <div className="bg-[#154212] text-white p-5 rounded-3xl space-y-4 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[100px] translate-x-4 -translate-y-4">eco</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fcc019] text-xl">psychology</span>
            <h4 className="text-base font-bold tracking-tight">Why Golden Maize?</h4>
          </div>

          <p className="text-xs text-emerald-100 leading-relaxed font-medium">
            Based on your soil analysis (pH 6.5) and the 90-day precipitation forecast, corn offers the most resilient growth profile. Current market demands for non-GMO maize are up 14% this quarter, providing a stronger price floor for your harvest.
          </p>

          {/* Grid layout of 4 pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[#131f00]">
            <div className="bg-white p-2 rounded-xl text-center">
              <p className="text-[8px] font-extrabold text-[#72796e] uppercase tracking-wider mb-0.5">SOIL PH</p>
              <p className="text-xs font-black">6.5 - Ideal</p>
            </div>
            <div className="bg-white p-2 rounded-xl text-center">
              <p className="text-[8px] font-extrabold text-[#72796e] uppercase tracking-wider mb-0.5">NITROGEN</p>
              <p className="text-xs font-black">Optimal</p>
            </div>
            <div className="bg-white p-2 rounded-xl text-center">
              <p className="text-[8px] font-extrabold text-[#72796e] uppercase tracking-wider mb-0.5">DRAINAGE</p>
              <p className="text-xs font-black">Good</p>
            </div>
            <div className="bg-white p-2 rounded-xl text-center">
              <p className="text-[8px] font-extrabold text-[#72796e] uppercase tracking-wider mb-0.5">ALTITUDE</p>
              <p className="text-xs font-black">Perfect</p>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Menu Navigation */}
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
    </div>
  );
}
