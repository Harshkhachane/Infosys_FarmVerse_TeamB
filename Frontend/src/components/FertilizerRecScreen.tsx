import React, { useState } from 'react';
import { UserProfile, SoilNutrients } from '../types';
import { t } from '../utils/translations';

interface FertilizerRecScreenProps {
  profile: UserProfile;
  soilNutrients: SoilNutrients;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

export default function FertilizerRecScreen({
  profile,
  soilNutrients,
  onNavigate,
  onMenuClick
}: FertilizerRecScreenProps) {
  const lang = profile.preferredLanguage;
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FAF8FF] via-white to-[#F4FAF5] pb-12 md:pb-16 text-[#191c1a]">
      
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
            <span className="text-xl font-black text-primary tracking-tight flex items-center gap-1.5">
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

      {/* Main Content */}
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-5 pb-12">
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-xs">
          <p className="text-[10px] font-extrabold text-indigo-700 tracking-widest uppercase mb-1">{t("SOIL HEALTH REPORT", lang)}</p>
          <h2 className="text-2xl font-black text-indigo-900 tracking-tight mb-1">{t("Fertilizer Treatment", lang)}</h2>
          <p className="text-xs text-indigo-800 font-bold leading-relaxed">
            {t("Optimized for Field A2 - Winter Wheat", lang)}
          </p>
        </div>

        {downloadSuccess && (
          <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">download_done</span>
            <span>{t("Fertilizer Prescription PDF downloaded. Hand over this plan to your regional distributor for subsidy scanning.", lang)}</span>
          </div>
        )}

        {/* Nutrient Targets cards row - Pastel Pink & Green Themes */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#FFF1F1] p-3 rounded-2xl border-b-4 border-red-400 border-t border-x border-[#FFCDCD] text-center shadow-xs relative overflow-hidden">
            <p className="text-[10px] font-black text-red-800 uppercase tracking-wide leading-tight">N<br/>({t("Nitrogen", lang)})</p>
            <p className="text-2xl font-black text-red-600 mt-2">{soilNutrients.nitrogen}</p>
            <p className="text-[8px] font-bold text-red-700 uppercase tracking-widest mt-1">MG/KG</p>
          </div>

          <div className="bg-[#EAF3FA] p-3 rounded-2xl border-b-4 border-blue-400 border-t border-x border-[#CFE2FE] text-center shadow-xs relative overflow-hidden">
            <p className="text-[10px] font-black text-blue-800 uppercase tracking-wide leading-tight">P<br/>({t("Phosphorus", lang)})</p>
            <p className="text-2xl font-black text-blue-600 mt-2">{soilNutrients.phosphorus}</p>
            <p className="text-[8px] font-bold text-blue-700 uppercase tracking-widest mt-1">MG/KG</p>
          </div>

          <div className="bg-[#FCF8FF] p-3 rounded-2xl border-b-4 border-purple-400 border-t border-x border-[#E9D5FF] text-center shadow-xs relative overflow-hidden">
            <p className="text-[10px] font-black text-purple-800 uppercase tracking-wide leading-tight">K<br/>({t("Potassium", lang)})</p>
            <p className="text-2xl font-black text-purple-600 mt-2">{soilNutrients.potassium}</p>
            <p className="text-[8px] font-bold text-purple-700 uppercase tracking-widest mt-1">MG/KG</p>
          </div>
        </div>

        {/* Warning Alert Banner (Yellow alert card) */}
        {soilNutrients.nitrogen > 40 && (
          <div className="bg-[#FFFDE7] text-amber-900 p-4 rounded-2xl flex items-start gap-3 border border-[#FFF59D] shadow-xs">
            <span className="material-symbols-outlined text-2xl shrink-0 text-amber-600 mt-0.5 animate-pulse">warning</span>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider mb-0.5 text-amber-800">{t("Overuse Alert", lang)}</h4>
              <p className="text-xs leading-relaxed font-bold">
                {t("Nitrogen levels are near the environmental threshold. Avoid excess application to prevent leaching and soil acidification.", lang)}
              </p>
            </div>
          </div>
        )}

        {/* Application Plan Table Card */}
        <div className="bg-white p-4 rounded-3xl border border-[#ecefea] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-[#191c1a] tracking-tight">{t("Application Plan", lang)}</h3>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
              3 {t("Stages", lang)}
            </span>
          </div>

          {/* Plan rows */}
          <div className="divide-y divide-[#ecefea] text-xs">
            {/* Header */}
            <div className="grid grid-cols-3 pb-2 text-[#72796e] font-bold uppercase tracking-wider">
              <span>{t("Fertilizer", lang)}</span>
              <span className="text-center">{t("Quantity", lang)}</span>
              <span className="text-right">{t("Timing", lang)}</span>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-3 py-3 items-center">
              <div>
                <p className="font-bold text-sm text-[#191c1a]">Urea</p>
                <p className="text-[10px] text-[#72796e]">{t("Synthetic", lang)}</p>
              </div>
              <p className="text-center font-black text-primary text-sm">120kg/ha</p>
              <div className="text-right">
                <span className="px-2 py-1 bg-[#f1f4ef] rounded text-[10px] font-bold text-[#42493e]">
                  {t("Pre-plant", lang)}
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 py-3 items-center">
              <div>
                <p className="font-bold text-sm text-[#191c1a]">DAP</p>
                <p className="text-[10px] text-[#72796e]">{t("Phosphate", lang)}</p>
              </div>
              <p className="text-center font-black text-primary text-sm">85kg/ha</p>
              <div className="text-right">
                <span className="px-2 py-1 bg-[#f1f4ef] rounded text-[10px] font-bold text-[#42493e]">
                  {t("Early Till.", lang)}
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 py-3 items-center">
              <div>
                <p className="font-bold text-sm text-[#191c1a]">MOP</p>
                <p className="text-[10px] text-[#72796e]">{t("Potassium", lang)}</p>
              </div>
              <p className="text-center font-black text-primary text-sm">50kg/ha</p>
              <div className="text-right">
                <span className="px-2 py-1 bg-[#f1f4ef] rounded text-[10px] font-bold text-[#42493e]">
                  {t("Heading", lang)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Alternatives section */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-[#191c1a] tracking-tight">{t("Organic Alternatives", lang)}</h3>

          {/* Vermicompost card click option */}
          <div 
            onClick={() => {}}
            className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e8f5e9] text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">compost</span>
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-bold text-[#191c1a] group-hover:text-primary transition-colors">{t("Vermicompost", lang)}</h4>
              <p className="text-xs text-[#72796e]">{t("Recommended 2 tons/ha to improve soil structure and microbial activity.", lang)}</p>
            </div>
            <span className="material-symbols-outlined text-[#72796e] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-xs space-y-1.5">
              <span className="material-symbols-outlined text-primary text-lg">potted_plant</span>
              <h4 className="text-xs font-black text-[#191c1a]">{t("Green Manure", lang)}</h4>
              <p className="text-[10px] text-[#72796e] leading-relaxed">{t("Clover or Alfalfa rotation for standard nitrogen fixing.", lang)}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-xs space-y-1.5">
              <span className="material-symbols-outlined text-amber-700 text-lg">nutrition</span>
              <h4 className="text-xs font-black text-[#191c1a]">{t("Bone Meal", lang)}</h4>
              <p className="text-[10px] text-[#72796e] leading-relaxed">{t("Slow-release organic phosphorus substitute.", lang)}</p>
            </div>
          </div>
        </div>

        {/* Download prescription action button */}
        <button 
          onClick={handleDownload}
          className="w-full bg-[#2b5c27] hover:bg-emerald-800 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 border border-white/10"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>{t("Download Fertilizer Plan", lang)}</span>
        </button>

        {/* View reports secondary link */}
        <div className="text-center pt-1 pb-4">
          <button 
            onClick={() => onNavigate('reports')}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            {t("View Saved Diagnostic Reports Archive", lang)}
          </button>
        </div>

      </main>

      {/* Plans/Recommendations Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ecefea] z-40 md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary cursor-pointer"
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
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">water_drop</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Water & Irrigation", lang)}</span>
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
            className="flex flex-col items-center justify-center gap-0.5 text-[#2b5c27] font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[26px]">assignment</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">{t("Fertilizer Treatment", lang)}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
