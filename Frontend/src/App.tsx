import React, { useState, useEffect } from 'react';
import { 
  initialFarms, 
  initialSoilNutrients, 
  initialRecommendations, 
  initialSavedReports,
  initialNotifications
} from './data/mockData';
import { Farm, UserProfile, SoilNutrients, AppNotification } from './types';
import { t } from './utils/translations';
  
// Screens imports
import WelcomeScreen from './components/WelcomeScreen';
import DashboardScreen from './components/DashboardScreen';
import FarmDetailsScreen from './components/FarmDetailsScreen';
import FarmsScreen from './components/FarmsScreen';
import WaterIrrigationScreen from './components/WaterIrrigationScreen';
import SoilAnalysisScreen from './components/SoilAnalysisScreen';
import MarketPricesScreen from './components/MarketPricesScreen';
import FarmerProfileScreen from './components/FarmerProfileScreen';
import FertilizerRecScreen from './components/FertilizerRecScreen';
import SavedReportsScreen from './components/SavedReportsScreen';
import ClimateScreen from './components/ClimateScreen';
import CropComparisonScreen from './components/CropComparisonScreen';
import NotificationsScreen from './components/NotificationsScreen';
import ChatBot from './components/AIChat/ChatBot';
import LandingScreen from './components/LandingScreen';
import AdminDashboard from './components/AdminDashboard';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: blank / empty profile (no hardcoded personal data)
// ─────────────────────────────────────────────────────────────────────────────
const blankProfile: UserProfile = {
  fullName: '',
  mobileNumber: '',
  email: '',
  preferredLanguage: 'English',
  avatarUrl: 'https://ui-avatars.com/api/?name=User&background=2b5c27&color=fff&size=150',
  role: 'USER',
  streetAddress: '',
  state: '',
  district: '',
  village: '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build UserProfile from backend user data object
// ─────────────────────────────────────────────────────────────────────────────
function buildProfileFromUserData(userData: any, lang: 'English' | 'తెలుగు' | 'हिन्दी' = 'English'): UserProfile {
  const name = userData?.name || userData?.fullName || '';
  return {
    fullName: name,
    email: userData?.email || '',
    mobileNumber: userData?.mobileNumber || userData?.phone || userData?.mobile || '',
    preferredLanguage: lang,
    avatarUrl: userData?.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=2b5c27&color=fff&size=150`,
    role: userData?.role || 'USER',
    streetAddress: userData?.streetAddress || '',
    state: userData?.stateRegion || userData?.state || '',
    district: userData?.district || '',
    village: userData?.village || '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Session helpers
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_KEY = 'agriyield-session';

function saveSession(profile: UserProfile, userId: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ profile, userId }));
}

function loadSession(): { profile: UserProfile; userId: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export default function App() {
  // ── Restore session from localStorage on mount ──
  const storedSession = loadSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedSession);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>(storedSession?.userId || '');

  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [farmsScreenMode, setFarmsScreenMode] = useState<'list' | 'map-records' | 'add-details' | 'add-map'>('list');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('agriyield-theme') as 'light' | 'dark') || 'light';
  });

  const handleToggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('agriyield-theme', newTheme);
  };
  
  // App states — farms are always from localStorage/backend; mock data is only fallback for non-profile data
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(initialFarms[0]);
  const [profile, setProfile] = useState<UserProfile>(storedSession?.profile || blankProfile);
  const [soilNutrients, setSoilNutrients] = useState<SoilNutrients>(initialSoilNutrients);
  const [recommendations] = useState(initialRecommendations);
  const [reports] = useState(initialSavedReports);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Keep session in sync when profile changes after mount
  useEffect(() => {
    if (isLoggedIn && profile.email) {
      saveSession(profile, currentUserId);
    }
  }, [profile, isLoggedIn, currentUserId]);

  const handleTriggerAddFarm = () => {
    setFarmsScreenMode('add-details');
    setCurrentScreen('map');
  };

  // ── Authentication callbacks ──
  const handleLoginSuccess = (
    lang: 'English' | 'తెలుగు' | 'हिन्दी',
    userData?: any,
    userId?: string
  ) => {
    const newProfile = buildProfileFromUserData(userData, lang);
    const uid = userId || userData?.id || userData?._id || '';
    
    setProfile(newProfile);
    setCurrentUserId(uid);
    saveSession(newProfile, uid);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setShowLogin(false);
    setCurrentScreen('dashboard');
    setProfile(blankProfile);
    setCurrentUserId('');
  };

  // ── State update callbacks ──
  const handleAddFarm = (newFarmData: Omit<Farm, 'id'>) => {
    const newFarm: Farm = {
      ...newFarmData,
      id: `farm-${Date.now()}`
    };
    setFarms(prev => [newFarm, ...prev]);
    setSelectedFarm(newFarm);
  };

  const handleDeleteFarm = (farmId: string) => {
    setFarms(previousFarms => {
      const remainingFarms = previousFarms.filter(farm => farm.id !== farmId);
      if (selectedFarm.id === farmId && remainingFarms.length > 0) {
        setSelectedFarm(remainingFarms[0]);
      }
      return remainingFarms;
    });
  };

  const handleUpdateFarmCrop = (farmId: string, newCrop: string) => {
    setFarms(prev => prev.map(f => {
      if (f.id === farmId) {
        return {
          ...f,
          crop: newCrop,
          moisture: newCrop === 'Soybeans' ? 22.0 : newCrop === 'Wheat' ? 12.1 : 18.4,
          yieldEst: newCrop === 'Soybeans' ? '4.5t/h' : newCrop === 'Wheat' ? '3.5t/h' : '8.2t/h',
          pestRisk: newCrop === 'Wheat' ? 'Medium' : 'Low'
        };
      }
      return f;
    }));
    
    setSelectedFarm(prev => {
      if (prev.id === farmId) {
        return {
          ...prev,
          crop: newCrop,
          moisture: newCrop === 'Soybeans' ? 22.0 : newCrop === 'Wheat' ? 12.1 : 18.4,
          yieldEst: newCrop === 'Soybeans' ? '4.5t/h' : newCrop === 'Wheat' ? '3.5t/h' : '8.2t/h',
          pestRisk: newCrop === 'Wheat' ? 'Medium' : 'Low'
        };
      }
      return prev;
    });
  };

  const handleSelectFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setCurrentScreen('farm-details');
  };

  // ── Notification Management ──
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // ── Not logged in: show landing or login ──
  if (!isLoggedIn) {
    if (!showLogin) {
      return <LandingScreen onGetStarted={() => setShowLogin(true)} />;
    }

    return (
      <div className="app-container">
        <WelcomeScreen
          profile={profile}
          onLoginSuccess={handleLoginSuccess}
        />
        <ChatBot />
      </div>
    );
  }

  // ── ADMIN role: show Admin Dashboard ──
  if (profile.role === 'ADMIN') {
    return (
      <div className={`theme-${theme}`}>
        <AdminDashboard
          profile={profile}
          onLogout={handleLogout}
          onNavigate={setCurrentScreen}
        />
        <ChatBot />
      </div>
    );
  }

  // ── Farmer Dashboard screens ──
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <div className="dashboard-wrapper">
            <DashboardScreen
              farms={farms}
              recommendations={recommendations}
              profile={profile}
              onNavigate={setCurrentScreen}
              onSelectFarm={handleSelectFarm}
              onLogout={handleLogout}
              notifications={notifications}
              onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
              theme={theme}
              setTheme={handleToggleTheme}
            />
            <ChatBot />
          </div>
        );

      case 'farm-details':
        return (
          <FarmDetailsScreen 
            selectedFarm={selectedFarm}
            profile={profile}
            onNavigate={setCurrentScreen}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'map':
        return (
          <FarmsScreen 
            farms={farms}
            onAddFarm={handleAddFarm}
            onDeleteFarm={handleDeleteFarm}
            onSelectFarm={handleSelectFarm}
            onNavigate={setCurrentScreen}
            profile={profile}
            initialViewMode={farmsScreenMode}
            onViewModeChange={setFarmsScreenMode}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'water':
        return (
          <WaterIrrigationScreen 
            profile={profile}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'soil':
        return (
          <SoilAnalysisScreen 
            profile={profile}
            soilNutrients={soilNutrients}
            onUpdateSoil={setSoilNutrients}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'market':
        return (
          <MarketPricesScreen 
            profile={profile}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'profile':
        return (
          <FarmerProfileScreen 
            profile={profile}
            onUpdateProfile={setProfile}
            onNavigate={setCurrentScreen}
            farms={farms}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'plans':
        return (
          <FertilizerRecScreen 
            profile={profile}
            soilNutrients={soilNutrients}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'reports':
        return (
          <SavedReportsScreen 
            profile={profile}
            reports={reports}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'weather':
        return (
          <ClimateScreen 
            profile={profile}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'crop-comparison':
        return (
          <CropComparisonScreen 
            profile={profile}
            selectedFarm={selectedFarm}
            onUpdateFarmCrop={handleUpdateFarmCrop}
            onNavigate={setCurrentScreen}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            onNavigate={setCurrentScreen}
            profile={profile}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
            onUpdateProfile={setProfile}
          />
        );

      default:
        return (
          <DashboardScreen 
            farms={farms}
            recommendations={recommendations}
            profile={profile}
            onNavigate={setCurrentScreen}
            onSelectFarm={handleSelectFarm}
            onLogout={handleLogout}
            notifications={notifications}
            onMenuClick={() => setIsMobileSidebarOpen(p => !p)}
            theme={theme}
            setTheme={handleToggleTheme}
          />
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Build a user location label from actual profile data
  const userLocationLabel = [profile.district, profile.state]
    .filter(Boolean)
    .join(', ') || 'India';

  const renderSidebarContent = (isMobile: boolean = false) => {
    const lang = profile.preferredLanguage;
    return (
      <div className="flex flex-col h-full bg-white text-[#191c1a]">
        <div className="p-6 border-b border-[#ecefea] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl font-bold animate-pulse-slow">eco</span>
            <span className="text-xl font-bold text-primary tracking-tight">AgriYield</span>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-[#42493e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        <div className="p-4 border-b border-[#ecefea] bg-[#F7FAF5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#191c1a] truncate">{profile.fullName || 'Farmer'}</h4>
              <p className="text-[10px] text-[#72796e] font-extrabold tracking-tight uppercase">{userLocationLabel}</p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-[#ecefea]">
            <span className="text-[10px] font-extrabold uppercase text-[#72796e] tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">translate</span>
              <span>{t("Language", lang) || "Language"}</span>
            </span>
            <select
              value={lang}
              onChange={(e) => {
                const newLang = e.target.value as 'English' | 'తెలుగు' | 'हिन्दी';
                setProfile(prev => ({ ...prev, preferredLanguage: newLang }));
              }}
              className="bg-white border border-[#ecefea] hover:border-primary/50 text-[#191c1a] text-xs font-bold py-1 px-2 rounded-xl focus:outline-none cursor-pointer transition-all shadow-xs"
            >
              <option value="English">English</option>
              <option value="తెలుగు">తెలుగు</option>
              <option value="हिन्दी">हिन्दी</option>
            </select>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={() => {
                handleTriggerAddFarm();
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className="w-full bg-[#EBF5EB] text-primary hover:bg-primary hover:text-white px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-xs border border-primary/20"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>{t("Add New Farm", lang)}</span>
            </button>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-6 overflow-y-auto">
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider">{t("Core Monitoring", lang)}</p>
            <button 
              onClick={() => {
                setCurrentScreen('dashboard');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'dashboard' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">home</span>
                <span>{t("Dashboard", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setFarmsScreenMode('list');
                setCurrentScreen('map');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'map' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">agriculture</span>
                <span>{t("My Farms & Map", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentScreen('weather');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'weather' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">partly_cloudy_day</span>
                <span>{t("Climate & Weather", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentScreen('notifications');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'notifications' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">notifications</span>
                <span>{t("Alerts & Logs", lang)}</span>
              </div>
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-none ${
                  currentScreen === 'notifications' ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider">{t("Management Tools", lang)}</p>
            <button 
              onClick={() => {
                setCurrentScreen('water');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'water' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">water_drop</span>
                <span>{t("Water & Irrigation", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentScreen('soil');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'soil' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">science</span>
                <span>{t("Soil Analysis", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentScreen('plans');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'plans' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">assessment</span>
                <span>{t("Fertilizer Treatment", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentScreen('crop-comparison');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'crop-comparison' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">compare</span>
                <span>{t("Variety Cockpit", lang)}</span>
              </div>
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider">{t("Insights & Archive", lang)}</p>
            <button 
              onClick={() => {
                setCurrentScreen('market');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'market' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">storefront</span>
                <span>{t("Mandi Prices", lang)}</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentScreen('reports');
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'reports' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-[#42493e] hover:bg-[#f1f4ef]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">folder_open</span>
                <span>{t("Saved Reports", lang)}</span>
              </div>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-[#ecefea] bg-white space-y-1">
          <button 
            onClick={() => {
              setCurrentScreen('profile');
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentScreen === 'profile' ? 'bg-[#f1f4ef] text-primary' : 'text-[#42493e] hover:bg-[#f1f4ef]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            <span>{t("Farmer Profile", lang)}</span>
          </button>
          <button 
            onClick={() => {
              handleLogout();
              if (isMobile) setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-red-600">logout</span>
            <span>{t("Sign Out", lang)}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen theme-${theme} transition-all duration-300`}>
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-[#ecefea] sticky top-0 h-screen z-50 shrink-0 overflow-y-auto">
        {renderSidebarContent(false)}
      </aside>

      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50 flex transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            className="w-72 bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsMobileSidebarOpen(p => !p)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-[#2b5c27] text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary flex items-center justify-center cursor-pointer transition-all active:scale-95 border-2 border-white/20"
        title="Open/Close Navigation Menu"
      >
        <span className="material-symbols-outlined text-2xl font-black">menu</span>
      </button>

      <div className="flex-grow flex flex-col min-w-0">
        {renderActiveScreen()}
      </div>
    </div>
  );
}