import React, { useState } from 'react';
import { UserProfile, SoilNutrients } from '../types';
import { t } from '../utils/translations';

interface SoilAnalysisScreenProps {
  profile: UserProfile;
  soilNutrients: SoilNutrients;
  onUpdateSoil: (updated: SoilNutrients) => void;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

export default function SoilAnalysisScreen({
  profile,
  soilNutrients,
  onUpdateSoil,
  onNavigate,
  onMenuClick
}: SoilAnalysisScreenProps) {
  const lang = profile.preferredLanguage;
  const [soilType, setSoilType] = useState(soilNutrients.soilType);
  const [soilMoisture, setSoilMoisture] = useState<'Low' | 'Medium' | 'High'>(soilNutrients.soilMoisture);
  const [pH, setPh] = useState(soilNutrients.pH);
  const [nitrogen, setNitrogen] = useState(soilNutrients.nitrogen);
  const [phosphorus, setPhosphorus] = useState(soilNutrients.phosphorus);
  const [potassium, setPotassium] = useState(soilNutrients.potassium);
  const [organicCarbon, setOrganicCarbon] = useState(soilNutrients.organicCarbon);
  const [salinity, setSalinity] = useState(soilNutrients.salinity);

  // Upload simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const startUpload = (file: File) => {
    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    setSuccessMessage('');

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadSuccess(true);
          
          // Apply parsed ideal values
          setPh(6.8);
          setNitrogen(48);
          setPhosphorus(30);
          setPotassium(220);
          setOrganicCarbon(0.75);
          setSalinity(0.35);
          setSoilType('Loamy');
          setSoilMoisture('Medium');

          setSuccessMessage(`${t("File uploaded successfully!", lang)} ${t("Upload completed! Soil indicators successfully updated below.", lang)}`);
          
          // Trigger parent state update
          onUpdateSoil({
            pH: 6.8,
            nitrogen: 48,
            phosphorus: 30,
            potassium: 220,
            organicCarbon: 0.75,
            salinity: 0.35,
            soilType: 'Loamy',
            soilMoisture: 'Medium',
            lastUpdated: 'TODAY'
          });
        }, 1200);
      }
    }, 120);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    onUpdateSoil({
      pH,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      salinity,
      soilType,
      soilMoisture,
      lastUpdated: 'TODAY'
    });
    setSuccessMessage(t("Upload completed! Soil indicators successfully updated below.", lang));
    setTimeout(() => {
      onNavigate('plans');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F4F9F4] via-[#FDFDFD] to-[#F1F6F9] pb-24 text-[#191c1a]">
      
      {/* Top Header Bar with menu toggle for mobile view */}
      <header className="bg-white/80 backdrop-blur shadow-xs sticky top-0 z-40 border-b border-[#ecefea]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuClick}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer"
              title="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <span className="text-lg font-black text-[#2b5c27] tracking-tight flex items-center gap-1.5">
              <span className="material-symbols-outlined">eco</span>
              {t("AgriYield", lang)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#2b5c27]/20 cursor-pointer"
            >
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 space-y-5 mt-4 md:mt-6 pb-12">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-xs">
          <h2 className="text-2xl font-black text-[#2b5c27] tracking-tight mb-1">{t("Soil Analysis Dashboard", lang)}</h2>
          <p className="text-xs text-[#52634e] font-bold leading-relaxed">
            {t("Update and manage your field's nutritional profile for optimized crop growth.", lang)}
          </p>
        </div>

        {/* Dynamic Status Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-100 text-[#143d12] border-2 border-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-bounce">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Report Drag & Drop Upload Card */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-6 rounded-3xl border-2 border-dashed transition-all duration-300 shadow-sm relative ${
            isDragging 
              ? 'border-primary bg-emerald-50 scale-[1.02]' 
              : 'border-[#c2c9bb] bg-[#FCFDFB] hover:border-primary/50'
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#2b5c27]">
              <span className="material-symbols-outlined text-2xl font-bold">cloud_upload</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-[#191c1a]">{t("Upload Soil Report", lang)}</h3>
              <p className="text-[11px] text-[#72796e] mt-1">
                {t("Drag and drop your soil lab PDF/JPG here, or click to browse", lang)}
              </p>
            </div>

            {isUploading ? (
              <div className="w-full max-w-xs space-y-2 mt-2">
                <div className="flex justify-between text-xs font-black text-primary">
                  <span>{t("Analyzing soil report...", lang)}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#f1f4ef] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-150" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="relative pt-1 w-full max-w-xs">
                <input 
                  type="file" 
                  accept=".pdf,image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  id="soil-file-input"
                />
                <label 
                  htmlFor="soil-file-input"
                  className="w-full bg-[#e8f5e9] hover:bg-primary text-primary hover:text-white border border-[#81c784]/40 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">add_a_photo</span>
                  <span>{t("Choose File", lang)}</span>
                </label>
              </div>
            )}

            {fileName && !isUploading && (
              <p className="text-xs font-extrabold text-[#2b5c27] flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm">insert_drive_file</span>
                {fileName} ({t("Success", lang)})
              </p>
            )}
          </div>
        </div>

        {/* Physical Properties Card - Pastel Yellow Accent */}
        <div className="bg-[#FFFDE7] p-5 rounded-3xl border border-[#FFF59D] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#fcc019] font-black">
            <span className="material-symbols-outlined text-xl">layers</span>
            <h3 className="text-base tracking-tight">{t("Physical Properties", lang)}</h3>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#5c5440] uppercase tracking-wider mb-1.5">
              {t("Soil Type", lang)}
            </label>
            <div className="relative">
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-white border border-[#e0dcbd] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] appearance-none cursor-pointer"
              >
                <option value="Loamy">Loamy</option>
                <option value="Clayey">Clayey</option>
                <option value="Sandy">Sandy</option>
                <option value="Silty">Silty</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#72796e]">
                unfold_more
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#5c5440] uppercase tracking-wider mb-2">
              {t("Soil Moisture", lang)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSoilMoisture(level)}
                  className={`py-2.5 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer border ${
                    soilMoisture === level
                      ? 'bg-[#fcc019] text-white border-transparent shadow-xs'
                      : 'bg-white text-[#5c5440] border-[#e0dcbd] hover:bg-white/80'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chemical & Nutrient Analysis Card - Pastel Blue Accent */}
        <div className="bg-[#E3F2FD] p-5 rounded-3xl border border-[#BBDEFB] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-blue-700 font-black">
              <span className="material-symbols-outlined text-xl">science</span>
              <h3 className="text-base tracking-tight">{t("Chemical & Nutrient Analysis", lang)}</h3>
            </div>
            
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[8px] font-black tracking-wider uppercase border border-blue-200">
              {t("pH Level", lang)}: {pH}
            </span>
          </div>

          {/* pH slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">{t("pH Level", lang)}</span>
              <span className="text-xl font-black text-blue-700">{pH}</span>
            </div>
            
            <input 
              type="range"
              min="4"
              max="9"
              step="0.1"
              value={pH}
              onChange={(e) => setPh(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-gradient-to-r from-red-300 via-green-300 to-blue-300 rounded-lg cursor-pointer"
            />
            
            <div className="flex justify-between text-[9px] font-black text-blue-800 uppercase tracking-wider">
              <span>ACIDIC (4.0)</span>
              <span>NEUTRAL (7.0)</span>
              <span>ALKALINE (9.0)</span>
            </div>
          </div>

          {/* Nitrogen (N) */}
          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              {t("Nitrogen", lang)} (N)
            </label>
            <div className="relative">
              <input 
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(Number(e.target.value))}
                className="w-full pr-16 pl-4 py-3 bg-white border border-[#BBDEFB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#191c1a]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-700">
                mg/kg
              </span>
            </div>
          </div>

          {/* Phosphorus (P) */}
          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              {t("Phosphorus", lang)} (P)
            </label>
            <div className="relative">
              <input 
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(Number(e.target.value))}
                className="w-full pr-16 pl-4 py-3 bg-white border border-[#BBDEFB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#191c1a]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-700">
                mg/kg
              </span>
            </div>
          </div>

          {/* Potassium (K) */}
          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              {t("Potassium", lang)} (K)
            </label>
            <div className="relative">
              <input 
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(Number(e.target.value))}
                className="w-full pr-16 pl-4 py-3 bg-white border border-[#BBDEFB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#191c1a]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-700">
                mg/kg
              </span>
            </div>
          </div>

          {/* Organic Carbon (%) */}
          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              {t("Organic Carbon", lang)} (%)
            </label>
            <input 
              type="number"
              step="0.01"
              value={organicCarbon}
              onChange={(e) => setOrganicCarbon(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border border-[#BBDEFB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#191c1a]"
            />
          </div>

          {/* Salinity (EC) */}
          <div>
            <label className="block text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              {t("Salinity", lang)} (EC)
            </label>
            <input 
              type="text"
              value={`${salinity} dS/m`}
              onChange={(e) => setSalinity(Number(e.target.value.replace(/[^0-9.]/g, '')))}
              className="w-full px-4 py-3 bg-white border border-[#BBDEFB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#191c1a]"
            />
          </div>
        </div>

        {/* Action buttons footer */}
        <div className="flex flex-col gap-3 pt-3 text-center">
          <button 
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-bold text-[#72796e] hover:text-[#2b5c27] transition-colors hover:underline"
          >
            Discard Changes
          </button>
          
          <button 
            type="button"
            onClick={handleSave}
            className="w-full bg-[#2b5c27] hover:bg-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 border border-white/10"
          >
            <span className="material-symbols-outlined text-lg">save_as</span>
            <span>{t("Save Profile", lang)}</span>
          </button>
        </div>
      </main>

      {/* Soil Plans Bottom Navigation */}
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
            className="flex flex-col items-center justify-center gap-0.5 text-[#2b5c27] font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[26px]">science</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">{t("Soil Analysis", lang)}</span>
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
