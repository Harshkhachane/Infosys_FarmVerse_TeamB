import React, { useState } from 'react';
import { Farm, AdvisoryRecommendation, UserProfile, AppNotification } from '../types';
import { t } from '../utils/translations';

interface DashboardScreenProps {
  farms: Farm[];
  recommendations: AdvisoryRecommendation[];
  profile: UserProfile;
  onNavigate: (screen: string) => void;
  onSelectFarm: (farm: Farm) => void;
  onLogout: () => void;
  notifications: AppNotification[];
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  setTheme: (newTheme: 'light' | 'dark') => void;
}

export default function DashboardScreen({
  farms,
  recommendations,
  profile,
  onNavigate,
  onSelectFarm,
  onLogout,
  notifications,
  onMenuClick,
  theme,
  setTheme
}: DashboardScreenProps) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const lang = profile.preferredLanguage;
  const fallbackCropImage = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' rx='28' fill='%23eef4ec'/%3E%3Ccircle cx='305' cy='76' r='34' fill='%23d7e9d1'/%3E%3Cpath d='M110 225c40-72 81-108 126-108s86 36 126 108H110z' fill='%232b5c27' opacity='0.18'/%3E%3Cpath d='M100 220c31-58 66-88 101-88s70 30 101 88' fill='none' stroke='%232b5c27' stroke-width='16' stroke-linecap='round'/%3E%3Cpath d='M168 175c-10-24-26-42-48-54' fill='none' stroke='%2345a049' stroke-width='12' stroke-linecap='round'/%3E%3Cpath d='M200 162c0-30 8-54 24-72' fill='none' stroke='%2345a049' stroke-width='12' stroke-linecap='round'/%3E%3Cpath d='M232 175c10-24 26-42 48-54' fill='none' stroke='%2345a049' stroke-width='12' stroke-linecap='round'/%3E%3Ctext x='200' y='264' text-anchor='middle' font-family='Arial, sans-serif' font-size='22' font-weight='700' fill='%232b5c27'%3ECrop Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAFDFC] via-white to-[#F6FAF6] pb-8 md:pb-16 text-[#191c1a]">
      {/* Top Header Bar */}
      <header className="bg-white/80 backdrop-blur shadow-xs sticky top-0 z-40 border-b border-[#ecefea]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuClick}
              className="md:hidden w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer"
              title="Open Navigation"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <span className="material-symbols-outlined text-primary text-3xl font-bold animate-pulse-slow">eco</span>
            <span className="text-xl font-black text-primary tracking-tight">AgriYield</span>
          </div>
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Direct Day/Night Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-[#42493e] transition-all cursor-pointer active:scale-90 hover:scale-105 duration-200"
              title={theme === 'light' ? t("Switch to Night Mode", lang) : t("Switch to Day Mode", lang)}
              id="theme-direct-toggle-btn"
            >
              <span className={`material-symbols-outlined text-[26px] transition-transform duration-500 ${theme === 'dark' ? 'rotate-180 text-yellow-500' : 'text-[#42493e]'}`}>
                {theme === 'light' ? 'dark_mode' : 'wb_sunny'}
              </span>
            </button>

            {/* Notification Bell with Badge */}
            <button 
              onClick={() => onNavigate('notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-[#42493e] transition-colors cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[26px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Profile Avatar Button */}
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all cursor-pointer shadow-xs"
              title="View Profile"
            >
              <img 
                src={profile.avatarUrl} 
                alt={profile.fullName} 
                className="w-full h-full object-cover" 
              />
            </button>
 
            {/* Logout Shortcut */}
            <button
              onClick={onLogout}
              className="p-1 text-[#72796e] hover:text-red-500 transition-colors text-sm font-semibold tracking-tight cursor-pointer"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px] align-middle">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-md md:max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-6 pb-6">
        
        {/* Season Alert Banner (Sunset peach-coral alert card with pastel background) */}
        <div className="bg-gradient-to-r from-[#FFF9F3] to-[#FFF4E8] border border-[#FFE0C4] text-[#4E2B00] p-5 rounded-3xl shadow-xs relative overflow-hidden transition-all hover:shadow-sm">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] translate-y-6 translate-x-6 text-[#FFA858]">thunderstorm</span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[#FFE0C4]/60 rounded text-[10px] font-black uppercase tracking-widest text-[#944C00]">
              {t("Season Alert", lang)}
            </span>
          </div>
          <h3 className="text-lg font-black tracking-tight mb-1 text-[#692900]">
            {t("Monsoon Preparation Required", lang)}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-[#7C3E0E] leading-relaxed mb-4">
            {t("High rainfall expected in 48 hours. Ensure drainage systems in Field A are cleared.", lang)}
          </p>
          <button 
            onClick={() => onNavigate('plans')}
            className="bg-primary hover:bg-[#1a4f16] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
          >
            <span>{t("View Plan", lang)}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Desktop Responsive Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Farms list & status */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#191c1a] tracking-tight">{t("My Farms", lang)}</h2>
              <button 
                onClick={() => onNavigate('map')}
                className="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>{t("VIEW ALL", lang) || "VIEW ALL"}</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {farms.map((farm) => (
                <div 
                  key={farm.id}
                  onClick={() => onSelectFarm(farm)}
                  className="bg-white rounded-3xl overflow-hidden border border-[#c2c9bb]/40 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group flex flex-col h-full justify-between"
                >
                  {/* Card Image Cover with Status Badge */}
                  <div className="h-40 relative overflow-hidden bg-emerald-950 shrink-0">
                    <img 
                      src={farm.imageUrl || fallbackCropImage} 
                      alt={farm.name} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = fallbackCropImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Badge top-right */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow-md ${
                        farm.status === 'OPTIMAL' 
                          ? 'bg-[#E2F0D9] text-[#1e431b]' 
                          : 'bg-[#FFF3E0] text-[#b25e00]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                          farm.status === 'OPTIMAL' ? 'bg-[#1e431b]' : 'bg-[#b25e00]'
                        }`}></span>
                        {farm.status}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-[#FAFCFA]">
                    <div>
                      <h3 className="text-lg font-black text-[#191c1a] tracking-tight group-hover:text-primary transition-colors">
                        {farm.name}
                      </h3>
                      <p className="text-xs text-[#72796e] font-bold mb-4">
                        {t(farm.crop, lang) || farm.crop} • {farm.hectares} Hectares ({farm.acres.toFixed(1)} Acres)
                      </p>
                    </div>

                    {/* Info row (Cute pastel boxes) */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="bg-[#EBF3FB] p-2.5 rounded-2xl text-center border border-[#CFE2FE]/30">
                        <p className="text-[9px] font-extrabold text-[#536E8B] uppercase tracking-wider mb-0.5">{t("MOISTURE", lang)}</p>
                        <p className="text-base font-black text-[#0D47A1]">{farm.moisture}%</p>
                      </div>
                      <div className="bg-[#FFF4E8] p-2.5 rounded-2xl text-center border border-[#F6DBC2]/30">
                        <p className="text-[9px] font-extrabold text-[#8D6B4E] uppercase tracking-wider mb-0.5">
                          {farm.crop === 'Wheat' ? t("PEST RISK", lang) : t("YIELD EST.", lang)}
                        </p>
                        <p className={`text-base font-black ${
                          farm.crop === 'Wheat' && farm.pestRisk === 'Medium' ? 'text-amber-700' : 'text-[#3E2723]'
                        }`}>
                          {farm.crop === 'Wheat' ? t(farm.pestRisk, lang) : farm.yieldEst}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Weather and recommendations (Pastel Lavender and Peach theme) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Current Weather Widget (Cute light lavender card) */}
            <div className="bg-gradient-to-br from-[#FCF8FF] to-[#F6ECFF] p-5 rounded-3xl border border-[#E9D5FF] shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-extrabold text-[#7C5CA5] uppercase tracking-wider mb-1">{t("CURRENT WEATHER", lang)}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#581C87]">28°C</span>
                    <span className="text-xs font-bold text-[#7C5CA5]">/ Subtropical</span>
                  </div>
                </div>
                {/* Dynamic animated sun icon */}
                <span className="material-symbols-outlined text-[#A855F7] text-5xl font-light animate-spin-slow">
                  partly_cloudy_day
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E9D5FF]/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#7C5CA5] font-black">{t("Humidity", lang)}</span>
                  <span className="font-black text-[#581C87]">64%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#7C5CA5] font-black">{t("Wind Speed", lang)}</span>
                  <span className="font-black text-[#581C87]">12 km/h</span>
                </div>
              </div>
            </div>

            {/* Recent Recommendations (Pastel Peach/Pink theme) */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#191c1a] tracking-tight">{t("LATEST ADVISORIES", lang)}</h2>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div 
                    key={rec.id}
                    onClick={() => {
                      if (rec.type === 'irrigation') onNavigate('water');
                      else if (rec.type === 'pest') onNavigate('soil');
                      else onNavigate('plans');
                    }}
                    className="bg-white p-4 rounded-3xl border border-[#ecefea] shadow-xs flex items-start gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99] group bg-gradient-to-r from-white to-[#FFFDFB]"
                  >
                    {/* Cute rounded icon box */}
                    <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${
                      rec.type === 'irrigation' ? 'bg-[#E3F2FD] text-[#0D47A1]' : 'bg-[#FFF3E0] text-[#E65100]'
                    }`}>
                      <span className="material-symbols-outlined text-2xl font-semibold">{rec.icon}</span>
                    </div>
                    
                    {/* Description */}
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-black text-[#191c1a] tracking-tight group-hover:text-primary transition-colors">
                          {t(rec.title, lang) || rec.title}
                        </h4>
                        <span className="text-[9px] font-extrabold text-[#72796e] tracking-widest shrink-0 ml-2">
                          {rec.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-[#52594e] font-medium leading-relaxed">
                        {t(rec.description, lang) || rec.description}
                      </p>
                    </div>

                    {/* Chevron */}
                    <span className="material-symbols-outlined text-[#72796e] text-lg self-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Menu Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ecefea] z-40 md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center justify-center gap-0.5 text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[26px]">home</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">{t("Dashboard", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('map')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">agriculture</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("My Farms & Map", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('market')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">storefront</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Mandi Prices", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('weather')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">partly_cloudy_day</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Climate & Weather", lang)}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">person</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">{t("Farmer Profile", lang)}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
