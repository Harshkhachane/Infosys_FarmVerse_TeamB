import React, { useState } from 'react';
import { UserProfile, SavedReport } from '../types';
import { t } from '../utils/translations';

interface SavedReportsScreenProps {
  profile: UserProfile;
  reports: SavedReport[];
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

export default function SavedReportsScreen({
  profile,
  reports,
  onNavigate,
  onMenuClick
}: SavedReportsScreenProps) {
  const lang = profile.preferredLanguage;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (title: string) => {
    alert(`Downloading "${title}" locally for offline reference.`);
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
            <span className="text-lg font-black text-primary tracking-tight">{t("Saved Reports", lang)}</span>
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
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-4 pb-12">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight mb-1">Reports Cabinet</h2>
          <p className="text-xs text-[#72796e] font-medium leading-relaxed">
            Access, view, and share historical diagnostic documents drawn for your agricultural holdings.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72796e]">
            search
          </span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#c2c9bb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a]"
            placeholder="Search report name or date..."
          />
        </div>

        {/* Reports Cards list */}
        <div className="space-y-3">
          {filteredReports.map((rep) => (
            <div 
              key={rep.id}
              className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4"
            >
              {/* Report Details info block */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                </div>
                
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#191c1a] tracking-tight leading-snug">
                    {rep.title}
                  </h4>
                  <p className="text-[10px] font-bold text-[#72796e] uppercase tracking-wide">
                    {rep.date} • {rep.fileSize}
                  </p>
                  <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-extrabold rounded uppercase tracking-wider">
                    {rep.category}
                  </span>
                </div>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => alert(`Opening preview of "${rep.title}"...`)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#f1f4ef] text-primary transition-colors cursor-pointer"
                  title="View report"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button 
                  onClick={() => handleDownload(rep.title)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#f1f4ef] text-primary transition-colors cursor-pointer"
                  title="Download report"
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <p className="text-center py-10 text-sm text-[#72796e] font-medium bg-white rounded-2xl border border-[#ecefea]">
              No archived documents match your parameters.
            </p>
          )}
        </div>

        {/* Sync telemetry prompt */}
        <div className="bg-[#f1f4ef] p-5 rounded-3xl border border-[#c2c9bb]/35 text-center space-y-3">
          <span className="material-symbols-outlined text-primary text-3xl">cloud_sync</span>
          <h4 className="text-sm font-bold text-[#191c1a]">Need custom date range reports?</h4>
          <p className="text-xs text-[#72796e] max-w-[280px] mx-auto leading-relaxed">
            Our telemetry servers back up active field indices every 6 hours. Toggle custom filters to print on-demand GIS analysis.
          </p>
          <button 
            onClick={() => alert("Custom telemetry report compilation triggered. Check back in 5 minutes.")}
            className="bg-white hover:bg-[#f1f4ef] text-primary border border-primary/40 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            Compile New Report
          </button>
        </div>

      </main>

      {/* Bottom Navigation bar */}
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
