import React, { useState } from 'react';
import { UserProfile, Farm } from '../types';
import { t } from '../utils/translations';

interface FarmerProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (screen: string) => void;
  farms?: Farm[];
  onMenuClick: () => void;
}

type ProfileTab = 'personal' | 'farms' | 'prefs' | 'security' | 'actions';

export default function FarmerProfileScreen({
  profile,
  onUpdateProfile,
  onNavigate,
  farms = [],
  onMenuClick
}: FarmerProfileScreenProps) {
  const lang = profile.preferredLanguage;
  // Main screen navigation tab controller
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  
  // Edit mode controller
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states matching original and extended parameters
 // Form states matching original and extended parameters
const [fullName, setFullName] = useState(profile?.fullName || (profile as any)?.name || '');
const [mobileNumber, setMobileNumber] = useState(profile?.mobileNumber || (profile as any)?.phone || '');
const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferredLanguage || 'English');
const [email, setEmail] = useState((profile as any)?.email || '');
const [streetAddress, setStreetAddress] = useState(profile?.streetAddress || '');
const [state, setState] = useState(profile?.state || (profile as any)?.stateRegion || '');
const [district, setDistrict] = useState(profile?.district || '');
const [village, setVillage] = useState(profile?.village || '');
const [avatar, setAvatar] = useState(profile?.avatarUrl);


  // App preferences states
  const [appPrefs, setAppPrefs] = useState({
    rainfallAlerts: true,
    pestWarnings: true,
    priceSpikes: true,
    voiceGuidance: false,
    offlineCaching: true,
    autoBackup: true
  });

  // Security states
  const [securitySettings, setSecuritySettings] = useState({
    pinLock: true,
    biometrics: false,
    cloudSync: true,
    dataEncryption: true
  });

  // Interactive utility states
  const [calibrationStatus, setCalibrationStatus] = useState<'idle' | 'calibrating' | 'completed'>('idle');
  const [showIdCard, setShowIdCard] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Sync state with parent profile when changed externally
  React.useEffect(() => {
    setFullName(profile.fullName);
    setMobileNumber(profile.mobileNumber);
    setPreferredLanguage(profile.preferredLanguage);
    if (profile.streetAddress) setStreetAddress(profile.streetAddress);
    if (profile.state) setState(profile.state);
    if (profile.district) setDistrict(profile.district);
    if (profile.village) setVillage(profile.village);
    if (profile.avatarUrl) setAvatar(profile.avatarUrl);
  }, [profile]);

  // Cycle avatar selection
  const handleAvatarChange = () => {
    const photos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // Original Man
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',  // Female Farmer
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',  // Female Agronomist
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'   // Elder Farmer
    ];
    const currentIndex = photos.indexOf(avatar);
    const nextIndex = (currentIndex + 1) % photos.length;
    setAvatar(photos[nextIndex]);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      mobileNumber,
      preferredLanguage,
      avatarUrl: avatar,
      streetAddress,
      state,
      district,
      village
    });
    setIsEditing(false);
    triggerToast('Profile successfully synchronized with AgriYield servers!');
  };

  const runSensorCalibration = () => {
    setCalibrationStatus('calibrating');
    setTimeout(() => {
      setCalibrationStatus('completed');
      triggerToast('All sub-surface moisture sensor calibration tables updated successfully!');
    }, 2000);
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast('Soil chemistry & field metadata exported as AgriYield_Backup.csv!');
    }, 1500);
  };

  const handleDeleteProfileSim = () => {
    const confirm = window.confirm('Are you absolutely sure you want to clear your local profile cache? This will reset all field coordinates.');
    if (confirm) {
      triggerToast('Local user profile cache reset. Refreshing state...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  // Derivative metrics
  const totalAreaAcres = farms.reduce((acc, f) => acc + (f.acres || f.hectares * 2.471), 0);
  const activeCrops = Array.from(new Set(farms.map(f => f.crop)));
  const primaryCropList = activeCrops.length > 0 ? activeCrops.join(', ') : 'Wheat, Soybean';

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
              title="Go Back"
              id="profile_back_btn"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <span className="text-base font-black text-primary tracking-tight uppercase">
              {isEditing ? t('Modify Info', lang) : t('Farmer Profile', lang)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
              {t("Online", lang)}
            </span>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20">
              <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-4 pb-12">
        
        {/* Animated Custom Success Banner */}
        {showSuccessToast && (
          <div className="bg-emerald-50 border-2 border-emerald-500/20 text-emerald-900 rounded-2xl p-4 flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-4 duration-200">
            <span className="material-symbols-outlined text-emerald-600 text-2xl shrink-0">verified</span>
            <div className="flex-grow">
              <h4 className="text-xs font-bold leading-none text-emerald-800">Operation Successful</h4>
              <p className="text-[10px] text-emerald-700/90 leading-tight mt-1">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="text-emerald-800 hover:text-emerald-950 text-base font-black cursor-pointer px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Hero Digital ID / Card Widget (Provides supreme agricultural styling) */}
        <div className="bg-gradient-to-br from-[#1b4318] to-[#2d6e27] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          {/* Wave background aesthetic */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-black tracking-widest uppercase text-emerald-100">
                Official AgriID Card
              </span>
              <h3 className="text-lg font-black tracking-tight mt-1">{profile.fullName || fullName}</h3>
              <p className="text-[10px] text-emerald-100 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">location_on</span>
                {profile.village || village}, {profile.district || district} ({profile.state || state})
              </p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-1 shrink-0">
              {/* Mock QR Code representing digital credential */}
              <div className="w-full h-full bg-white rounded-xl flex flex-col p-1 gap-0.5 justify-between items-center overflow-hidden">
                <div className="grid grid-cols-4 gap-0.5 w-full">
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-[1px] ${
                        (i * 7 + 13) % 5 === 0 || i === 0 || i === 15 || i === 6 || i === 9 
                          ? 'bg-black' 
                          : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                <span className="text-[6px] font-black text-[#1b4318] uppercase tracking-wide">ID-{profile.mobileNumber?.slice(-4) || '9283'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-5 mt-4 border-t border-white/10 text-xs">
            <div>
              <p className="text-[8px] text-emerald-200/90 font-black uppercase tracking-wider">Crops Logged</p>
              <p className="font-extrabold text-white truncate">{activeCrops.length > 0 ? activeCrops[0] : 'Wheat'}</p>
            </div>
            <div>
              <p className="text-[8px] text-emerald-200/90 font-black uppercase tracking-wider">Fields Registered</p>
              <p className="font-extrabold text-white">{farms.length || 3} Blocks</p>
            </div>
            <div>
              <p className="text-[8px] text-emerald-200/90 font-black uppercase tracking-wider">Acreage</p>
              <p className="font-extrabold text-white">{totalAreaAcres.toFixed(1)} Acres</p>
            </div>
          </div>
        </div>

        {/* User Friendly Segmented Tabs Control */}
        <div className="bg-white rounded-2xl p-1 border border-[#ecefea] shadow-sm flex overflow-x-auto scrollbar-none gap-0.5">
          {[
            { id: 'personal', label: 'Personal', icon: 'person' },
            { id: 'farms', label: 'Farms', icon: 'agriculture' },
            { id: 'prefs', label: 'Preferences', icon: 'toggle_on' },
            { id: 'security', label: 'Security', icon: 'shield' },
            { id: 'actions', label: 'Quick Tools', icon: 'extension' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ProfileTab);
                  setIsEditing(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm font-black' 
                    : 'text-[#42493e] hover:bg-[#f1f4ef]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="space-y-4">
          
          {/* 1. PERSONAL INFORMATION SECTION */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              {!isEditing ? (
                <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f1f4ef]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">badge</span>
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#191c1a]">Personal Information</h3>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/15 rounded-lg text-[10px] font-black uppercase tracking-wide cursor-pointer"
                    >
                      Edit Fields
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs font-semibold">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#72796e]">Full Legal Name</span>
                      <span className="text-[#191c1a] font-extrabold">{profile.fullName || fullName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#72796e]">Mobile Number</span>
                      <span className="text-[#191c1a] font-extrabold">{profile.mobileNumber || mobileNumber}</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#72796e]">Email Address</span>
                      <span className="text-[#191c1a] font-extrabold lowercase">{email}</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#72796e]">Language Setup</span>
                      <span className="text-[#191c1a] font-extrabold uppercase tracking-wider">{profile.preferredLanguage || preferredLanguage}</span>
                    </div>

                    <div className="pt-3 border-t border-[#f1f4ef] space-y-2.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Registered Address</p>
                      
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#72796e]">Village / Mandal</span>
                        <span className="text-[#191c1a] font-extrabold">{profile.village || village}</span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <span className="text-[#72796e]">District</span>
                        <span className="text-[#191c1a] font-extrabold">{profile.district || district}</span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <span className="text-[#72796e]">State Region</span>
                        <span className="text-[#191c1a] font-extrabold">{profile.state || state}</span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <span className="text-[#72796e]">Street Address</span>
                        <span className="text-[#191c1a] font-extrabold text-right max-w-[180px] truncate">{profile.streetAddress || streetAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT FORM FOR PERSONAL DETAILS */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="bg-white p-5 rounded-3xl border border-[#ecefea] shadow-sm space-y-4">
                    <div className="flex flex-col items-center text-center space-y-2 pb-2">
                      <div className="relative">
                        <img 
                          src={avatar} 
                          alt="Farmer avatar" 
                          className="w-20 h-20 rounded-full border-2 border-primary object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleAvatarChange}
                          className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white hover:scale-105 cursor-pointer shadow"
                          title="Change Photo"
                        >
                          <span className="material-symbols-outlined text-xs">photo_camera</span>
                        </button>
                      </div>
                      <span className="text-[9px] text-[#72796e] font-semibold">Change Profile Picture</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                          Full Legal Name
                        </label>
                        <input 
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                          Mobile Number
                        </label>
                        <input 
                          type="text"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a]"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                          Preferred Language
                        </label>
                        <select
                          value={preferredLanguage}
                          onChange={(e) => {
                            const val = e.target.value as 'English' | 'తెలుగు' | 'हिन्दी';
                            setPreferredLanguage(val);
                            onUpdateProfile({
                              ...profile,
                              preferredLanguage: val
                            });
                          }}
                          className="w-full bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#191c1a] focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="English">English</option>
                          <option value="తెలుగు">తెలుగు (Telugu)</option>
                          <option value="हिन्दी">हिन्दी (Hindi)</option>
                        </select>
                      </div>

                      <div className="pt-2 border-t border-[#f1f4ef] space-y-3">
                        <p className="text-[9px] font-black uppercase text-[#72796e] tracking-widest">Address Configuration</p>
                        
                        <div>
                          <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                            Street Address
                          </label>
                          <input 
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                              State
                            </label>
                            <input 
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="w-full px-3 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                              District
                            </label>
                            <input 
                              type="text"
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              className="w-full px-3 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">
                            Village
                          </label>
                          <input 
                            type="text"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-1/3 bg-white hover:bg-gray-50 border border-[#ecefea] text-[#42493e] py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-[#1a4f16] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Save Profile</span>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2. FARM PORTFOLIO SECTION */}
          {activeTab === 'farms' && (
            <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#f1f4ef]">
                <span className="material-symbols-outlined text-primary">agriculture</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#191c1a]">Farm Information & Land Assets</h3>
              </div>

              {/* Dynamic land holdings grid summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-50/50 to-primary/5 p-3.5 rounded-2xl border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-xl">dataset</span>
                  <h4 className="text-[10px] font-black text-[#72796e] uppercase tracking-wider mt-1.5 leading-none">Soil Quality Index</h4>
                  <p className="text-base font-black text-primary mt-1 leading-none">Optimal (84%)</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50/50 to-primary/5 p-3.5 rounded-2xl border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-xl">water_drop</span>
                  <h4 className="text-[10px] font-black text-[#72796e] uppercase tracking-wider mt-1.5 leading-none">Drip Efficiency</h4>
                  <p className="text-base font-black text-primary mt-1 leading-none">94% Coverage</p>
                </div>
              </div>

              {/* Active Crops List */}
              <div className="bg-[#f1f4ef]/40 p-4 rounded-2xl space-y-2.5">
                <h4 className="text-[10px] font-black text-[#72796e] uppercase tracking-widest leading-none">Registered Agricultural Crops</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeCrops.map((crop, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-white border border-[#ecefea] rounded-full text-[10px] font-bold text-primary flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {crop}
                    </span>
                  ))}
                  {activeCrops.length === 0 && (
                    <span className="px-2.5 py-1 bg-white border border-[#ecefea] rounded-full text-[10px] font-bold text-primary">Wheat</span>
                  )}
                </div>
              </div>

              {/* List of active registered land blocks */}
              <div className="space-y-3 pt-1">
                <h4 className="text-[10px] font-black text-[#191c1a] uppercase tracking-widest leading-none">Field Block Records ({farms.length})</h4>
                
                <div className="space-y-2">
                  {farms.map((f, i) => (
                    <div 
                      key={f.id}
                      className="p-3.5 rounded-2xl border border-[#ecefea] hover:border-primary/20 bg-white shadow-xs flex justify-between items-center transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                          <span className="text-xs font-black text-[#191c1a]">{f.name}</span>
                        </div>
                        <p className="text-[10px] text-[#72796e] font-semibold">
                          Target crop: <strong className="text-primary font-bold">{f.crop}</strong> | Soil Type: Black Clay
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-primary">{f.acres || (f.hectares * 2.471).toFixed(1)} Acres</span>
                        <p className="text-[9px] text-[#72796e] font-medium leading-none mt-0.5">Verified coordinates</p>
                      </div>
                    </div>
                  ))}

                  {farms.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-[#c2c9bb] rounded-2xl">
                      <span className="material-symbols-outlined text-[#72796e] text-3xl">landscape</span>
                      <p className="text-xs font-bold text-[#72796e] mt-2">No registered land assets found.</p>
                      <button 
                        onClick={() => onNavigate('map')}
                        className="mt-2 text-primary font-black text-[10px] uppercase tracking-wide underline"
                      >
                        Register first field block
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 3. APP PREFERENCES SECTION */}
          {activeTab === 'prefs' && (
            <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#f1f4ef]">
                <span className="material-symbols-outlined text-primary">toggle_on</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#191c1a]">App preferences & telemetry</h3>
              </div>

              <div className="space-y-4">
                {/* Preferred Language Setting */}
                <div className="pb-3.5 border-b border-[#f1f4ef] space-y-1.5">
                  <label className="block text-[10px] font-black text-[#72796e] uppercase tracking-widest">
                    Preferred Language / భాష / भाषा
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => {
                      const val = e.target.value as 'English' | 'తెలుగు' | 'हिन्दी';
                      setPreferredLanguage(val);
                      onUpdateProfile({
                        ...profile,
                        preferredLanguage: val
                      });
                    }}
                    className="w-full bg-[#f1f4ef] border border-[#ecefea] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#191c1a] focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all"
                  >
                    <option value="English">English</option>
                    <option value="తెలుగు">తెలుగు (Telugu)</option>
                    <option value="हिन्दी">हिन्दी (Hindi)</option>
                  </select>
                </div>

                {/* Pref 1 */}
                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <h4 className="text-xs font-bold text-[#191c1a]">Heavy Rainfall Advisories</h4>
                    <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                      Notify immediately if local precipitation rates forecast limits &gt; 25mm.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={appPrefs.rainfallAlerts}
                      onChange={() => setAppPrefs(p => ({ ...p, rainfallAlerts: !p.rainfallAlerts }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Pref 2 */}
                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <h4 className="text-xs font-bold text-[#191c1a]">Pest Infestation Threat Warnings</h4>
                    <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                      Trigger smart preventative advisories if outbreaks logged within 10km.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={appPrefs.pestWarnings}
                      onChange={() => setAppPrefs(p => ({ ...p, pestWarnings: !p.pestWarnings }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Pref 3 */}
                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <h4 className="text-xs font-bold text-[#191c1a]">Mandi Rate Trigger Notifications</h4>
                    <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                      Receive sound alarms if targeted grain rate indices fluctuate more than 5%.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={appPrefs.priceSpikes}
                      onChange={() => setAppPrefs(p => ({ ...p, priceSpikes: !p.priceSpikes }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Pref 4 */}
                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <h4 className="text-xs font-bold text-[#191c1a]">Voice Guidance & Local TTS</h4>
                    <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                      Hear spoken notifications aloud in your profile language setup.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={appPrefs.voiceGuidance}
                      onChange={() => setAppPrefs(p => ({ ...p, voiceGuidance: !p.voiceGuidance }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Pref 5 */}
                <div className="flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <h4 className="text-xs font-bold text-[#191c1a]">Offline Imagery Caching</h4>
                    <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                      Store crop vegetation satellite index layers locally to allow disconnected work.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={appPrefs.offlineCaching}
                      onChange={() => setAppPrefs(p => ({ ...p, offlineCaching: !p.offlineCaching }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 4. SECURITY & ACCOUNTS SECTION */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#f1f4ef]">
                  <span className="material-symbols-outlined text-primary">shield</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#191c1a]">App Security & Data Integrity</h3>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Security 1 */}
                  <div className="flex items-center justify-between">
                    <div className="max-w-[75%]">
                      <h4 className="text-xs font-bold text-[#191c1a]">4-Digit App PIN Lock</h4>
                      <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                        Require a pin code when opening AgriYield database application.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={securitySettings.pinLock}
                        onChange={() => setSecuritySettings(p => ({ ...p, pinLock: !p.pinLock }))}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Security 2 */}
                  <div className="flex items-center justify-between">
                    <div className="max-w-[75%]">
                      <h4 className="text-xs font-bold text-[#191c1a]">Biometric Fingerprint Authentication</h4>
                      <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                        Integrate device security sensors for rapid biometric validation.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={securitySettings.biometrics}
                        onChange={() => setSecuritySettings(p => ({ ...p, biometrics: !p.biometrics }))}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Security 3 */}
                  <div className="flex items-center justify-between">
                    <div className="max-w-[75%]">
                      <h4 className="text-xs font-bold text-[#191c1a]">Encrypted Database Transport</h4>
                      <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                        Encrypt telemetric signals before sending them to regional agronomists.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={securitySettings.dataEncryption}
                        disabled
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/50 cursor-not-allowed"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Export / Backup / Delete account option */}
              <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f1f4ef]">
                  <span className="material-symbols-outlined text-red-600">dangerous</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-red-700">Account Safety & Core Actions</h3>
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between items-center bg-red-50/40 p-3 rounded-2xl border border-red-100">
                    <div>
                      <h4 className="text-xs font-bold text-red-950">Reset Local Memory Cache</h4>
                      <p className="text-[9px] text-red-800 leading-tight">Wipes active field credentials on this smartphone device.</p>
                    </div>
                    <button 
                      onClick={handleDeleteProfileSim}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Reset App
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. QUICK ACTIONS & UTILITIES */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              
              {/* Sensors calibration live panel */}
              <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f4ef]">
                  <span className="material-symbols-outlined text-primary">sensors</span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#191c1a]">Telemetry Hardware calibrator</h3>
                    <p className="text-[9px] text-[#72796e] font-semibold leading-none mt-1">Calibrate sub-surface IoT soil diagnostic grids</p>
                  </div>
                </div>

                <div className="bg-[#f1f4ef]/50 p-3.5 rounded-2xl border border-[#ecefea] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#191c1a]">Regional Sensor Status</h4>
                    <p className="text-[10px] text-[#72796e] leading-tight">
                      Re-calibrate sensor diagnostic arrays to realign humidity, moisture, and NPK indices.
                    </p>
                  </div>
                  
                  {calibrationStatus === 'idle' && (
                    <button 
                      onClick={runSensorCalibration}
                      className="px-4 py-2 bg-primary hover:bg-[#1a4f16] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Calibrate
                    </button>
                  )}
                  {calibrationStatus === 'calibrating' && (
                    <button 
                      disabled
                      className="px-3 py-2 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1 shrink-0"
                    >
                      <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      <span>Syncing...</span>
                    </button>
                  )}
                  {calibrationStatus === 'completed' && (
                    <button 
                      onClick={() => setCalibrationStatus('idle')}
                      className="px-3 py-2 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-emerald-200 transition-all shrink-0 cursor-pointer"
                    >
                      Reset Check ✓
                    </button>
                  )}
                </div>
              </div>

              {/* General utilities panel */}
              <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#f1f4ef]">
                  <span className="material-symbols-outlined text-primary">stars</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#191c1a]">Quick Utility Toolkit</h3>
                </div>

                <div className="space-y-2 pt-1">
                  {/* Action Item 1 */}
                  <button 
                    onClick={() => setShowIdCard(!showIdCard)}
                    className="w-full flex items-center justify-between bg-[#f1f4ef]/40 hover:bg-[#f1f4ef]/80 p-3.5 rounded-2xl border border-[#ecefea] text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-xl">contact_emergency</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#191c1a]">Generate Digital AgriCard</h4>
                        <p className="text-[10px] text-[#72796e] leading-tight">View print-ready official AgriYield Farmer identity token.</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#72796e]">
                      {showIdCard ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* ID Card Display Panel */}
                  {showIdCard && (
                    <div className="p-4 border-2 border-dashed border-[#c2c9bb] bg-[#f1f4ef]/20 rounded-2xl animate-in slide-in-from-top duration-150 space-y-3 text-center">
                      <div className="bg-white border border-[#ecefea] p-4 rounded-xl max-w-xs mx-auto text-left shadow-sm space-y-3.5">
                        <div className="flex justify-between items-center border-b border-[#f1f4ef] pb-2">
                          <div>
                            <span className="text-[7px] font-black tracking-widest text-[#72796e] block">AGRIYIELD IDENTITY</span>
                            <span className="text-xs font-black text-primary">MEMBER ID CERTIFICATE</span>
                          </div>
                          <span className="material-symbols-outlined text-primary text-2xl">eco</span>
                        </div>

                        <div className="flex gap-3">
                          <img 
                            src={avatar} 
                            alt="Farmer" 
                            className="w-12 h-12 rounded-lg object-cover border border-[#ecefea]"
                          />
                          <div className="space-y-0.5 text-[9px] font-bold text-[#191c1a]">
                            <p className="text-[#72796e] text-[7px] font-black leading-none">HOLDER</p>
                            <p className="text-xs font-black">{profile.fullName || fullName}</p>
                            <p>LANG: {profile.preferredLanguage || preferredLanguage}</p>
                            <p>PIN: {profile.mobileNumber?.slice(-5) || '92831'}</p>
                          </div>
                        </div>

                        <div className="bg-[#f1f4ef] p-2 rounded text-[8px] font-bold text-[#72796e] flex justify-between">
                          <span>REGISTRATION DATE</span>
                          <span className="text-primary font-black">24-JUN-2024</span>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerToast('AgriCard downloaded locally in high resolution (PNG)!')}
                        className="px-3.5 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xs cursor-pointer"
                      >
                        Download PDF Token
                      </button>
                    </div>
                  )}

                  {/* Action Item 2 */}
                  <button 
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="w-full flex items-center justify-between bg-[#f1f4ef]/40 hover:bg-[#f1f4ef]/80 p-3.5 rounded-2xl border border-[#ecefea] text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-xl">file_download</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#191c1a]">{isExporting ? 'Generating Report...' : 'Backup Diagnostic Logs'}</h4>
                        <p className="text-[10px] text-[#72796e] leading-tight">Export soil chemistry, mandi pricing, and rainfall history metrics.</p>
                      </div>
                    </div>
                    {isExporting ? (
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span className="material-symbols-outlined text-[#72796e]">chevron_right</span>
                    )}
                  </button>

                  {/* Action Item 3 */}
                  <button 
                    onClick={() => {
                      triggerToast('Live callback requested! An agricultural advisor will call your mobile within 15 minutes.');
                    }}
                    className="w-full flex items-center justify-between bg-[#f1f4ef]/40 hover:bg-[#f1f4ef]/80 p-3.5 rounded-2xl border border-[#ecefea] text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-xl">ring_volume</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#191c1a]">AgriYield Expert Consultation Helpline</h4>
                        <p className="text-[10px] text-[#72796e] leading-tight">Schedule an instant, real-time consultation voice-call or chat.</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#72796e]">chevron_right</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Persistent Navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ecefea] z-40 md:hidden">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">home</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
          </button>
          
          <button 
            onClick={() => onNavigate('map')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">agriculture</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Farms</span>
          </button>
          
          <button 
            onClick={() => onNavigate('market')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-primary cursor-pointer"
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
            className="flex flex-col items-center justify-center gap-0.5 text-primary font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[26px]">person</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
