import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CloudRain, 
  TrendingUp, 
  Leaf, 
  ArrowLeft, 
  CheckCheck, 
  Trash2, 
  Inbox, 
  Settings,
  ChevronRight,
  Info,
  Sliders,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { AppNotification, UserProfile } from '../types';
import { t } from '../utils/translations';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigate: (screen: string) => void;
  profile: UserProfile;
  onMenuClick: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
}

export default function NotificationsScreen({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigate,
  profile,
  onMenuClick,
  onUpdateProfile
}: NotificationsScreenProps) {
  const lang = profile.preferredLanguage;
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'weather' | 'market' | 'advisory'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<AppNotification | null>(null);

  // Customized notification settings state
  const [settings, setSettings] = useState({
    heavyRainAlerts: true,
    pestRiskOutbreaks: true,
    mandiPriceThreshold: true,
    fertilizerDeficiencies: true,
    weeklyReportSummaries: false,
    soundVibration: true,
  });

  // Filter logic
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'alerts') return notif.type === 'alert';
    if (activeTab === 'weather') return notif.type === 'weather';
    if (activeTab === 'market') return notif.type === 'market';
    if (activeTab === 'advisory') return notif.type === 'advisory';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-error" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-secondary" />;
      case 'advisory':
        return <Leaf className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-[#f1f4ef]/40 border-[#ecefea]';
    switch (type) {
      case 'alert':
        return 'bg-red-50/70 border-red-100';
      case 'weather':
        return 'bg-blue-50/70 border-blue-100';
      case 'market':
        return 'bg-amber-50/70 border-amber-100';
      case 'advisory':
        return 'bg-emerald-50/70 border-emerald-100';
      default:
        return 'bg-[#f1f4ef]/60 border-[#ecefea]';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F9FBF8] pb-12 md:pb-16 text-[#191c1a]">
      {/* Top Header Bar */}
      <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-[#ecefea]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-1">
            <button 
              onClick={onMenuClick}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-[#ecefea] text-[#42493e] transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <button 
              onClick={() => {
                if (showSettings) {
                  setShowSettings(false);
                } else {
                  onNavigate('dashboard');
                }
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ecefea] text-[#42493e] transition-colors cursor-pointer"
              title="Go Back"
              id="back_btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          
          <h1 className="text-lg font-black text-primary tracking-tight">
            {showSettings ? t('Notification Config', lang) : t('Notifications', lang)}
          </h1>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`w-10 h-10 -mr-2 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                showSettings ? 'bg-primary/10 text-primary' : 'hover:bg-[#ecefea] text-[#42493e]'
              }`}
              title="Notification Settings"
              id="settings_toggle_btn"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md md:max-w-5xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-4 pb-12">
        {showSettings ? (
          /* NOTIFICATION SETTINGS UI */
          <div className="bg-white rounded-3xl border border-[#ecefea] p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1f4ef]">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191c1a]">Preferences Cockpit</h3>
                <p className="text-[10px] text-[#72796e] font-medium leading-none">Configure trigger criteria thresholds</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Preferred Language Setting */}
              <div className="pb-3.5 border-b border-[#f1f4ef] space-y-1.5">
                <label className="block text-[10px] font-extrabold uppercase text-[#72796e] tracking-widest">
                  {t("Preferred Language", lang)}
                </label>
                <select
                  value={profile.preferredLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value as 'English' | 'తెలుగు' | 'हिन्दी';
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profile,
                        preferredLanguage: newLang
                      });
                    }
                  }}
                  className="w-full bg-[#f1f4ef] border border-[#ecefea] rounded-xl px-3 py-2 text-xs font-bold text-[#191c1a] focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all"
                >
                  <option value="English">English</option>
                  <option value="తెలుగు">తెలుగు (Telugu)</option>
                  <option value="हिन्दी">हिन्दी (Hindi)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#191c1a]">Heavy Rainfall Alerts</h4>
                  <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                    Notify me immediately if forecast precipitation exceeds 25mm in 24 hours.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={settings.heavyRainAlerts}
                    onChange={() => setSettings(p => ({ ...p, heavyRainAlerts: !p.heavyRainAlerts }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#191c1a]">Pest Outbreak Threats</h4>
                  <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                    Trigger smart recommendations if crop pest incidents are reported within 10km.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={settings.pestRiskOutbreaks}
                    onChange={() => setSettings(p => ({ ...p, pestRiskOutbreaks: !p.pestRiskOutbreaks }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#191c1a]">Mandi Price Fluctuations</h4>
                  <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                    Notify when target grain prices increase or decrease by over 5% in regional markets.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={settings.mandiPriceThreshold}
                    onChange={() => setSettings(p => ({ ...p, mandiPriceThreshold: !p.mandiPriceThreshold }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#191c1a]">Fertilizer Deficiencies</h4>
                  <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                    Alert if automated soil sensors detect low nitrogen or organic carbon ratios.
                  </p>
                </div>
                <label className="relative inline-flex inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={settings.fertilizerDeficiencies}
                    onChange={() => setSettings(p => ({ ...p, fertilizerDeficiencies: !p.fertilizerDeficiencies }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="max-w-[75%]">
                  <h4 className="text-xs font-bold text-[#191c1a]">Weekly Summary Reports</h4>
                  <p className="text-[10px] text-[#72796e] leading-tight mt-0.5">
                    Receive cumulative analytics reports of weekly moisture statistics and overall yield predictions.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={settings.weeklyReportSummaries}
                    onChange={() => setSettings(p => ({ ...p, weeklyReportSummaries: !p.weeklyReportSummaries }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-primary">Smart Translation Mode</h5>
                <p className="text-[10px] text-primary/80 leading-normal mt-0.5">
                  All alerts will automatically arrive in <strong className="font-extrabold uppercase">{profile.preferredLanguage}</strong> matching your profile language setup.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full bg-primary hover:bg-[#1a4f16] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        ) : (
          /* NOTIFICATIONS LIST UI */
          <>
            {/* Header statistics summary info */}
            <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-[#ecefea] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="w-5 h-5 text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-error text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#191c1a]">Inbox Health Overview</h3>
                  <p className="text-[10px] text-[#72796e] font-semibold">{unreadCount} unread diagnostic signals</p>
                </div>
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={onMarkAllAsRead}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary rounded-xl text-[9px] font-extrabold tracking-wide uppercase transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Read All</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearAll}
                    className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-red-50 text-error rounded-xl text-[9px] font-extrabold tracking-wide uppercase transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Segmented Filter Tab Controls */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
              {[
                { id: 'all', label: 'All Messages' },
                { id: 'alerts', label: 'Safety Alerts' },
                { id: 'weather', label: 'Weather' },
                { id: 'market', label: 'Mandi Rates' },
                { id: 'advisory', label: 'Recommendations' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                      isActive 
                        ? 'bg-primary border-primary text-white shadow-sm' 
                        : 'bg-white border-[#ecefea] text-[#42493e] hover:border-[#c2c9bb]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* List of Messages */}
            <div className="space-y-2.5">
              {filteredNotifications.map((notif) => {
                const isRead = notif.isRead;
                return (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      onMarkAsRead(notif.id);
                      setSelectedNotif(notif);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] group flex gap-3 ${getBgColor(notif.type, isRead)}`}
                  >
                    {/* Icon Column */}
                    <div className="shrink-0 pt-0.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm border border-[#ecefea]`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-grow space-y-1 overflow-hidden">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[9px] font-extrabold text-[#72796e] uppercase tracking-widest">{notif.type}</span>
                        <span className="text-[9px] font-semibold text-[#72796e]">{notif.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs tracking-tight truncate flex-grow ${isRead ? 'text-[#42493e] font-semibold' : 'text-[#191c1a] font-bold'}`}>
                          {notif.title}
                        </h4>
                        {!isRead && (
                          <span className="w-1.5 h-1.5 bg-error rounded-full shrink-0"></span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#42493e]/90 leading-relaxed font-medium line-clamp-2">
                        {notif.message}
                      </p>
                    </div>

                    {/* Arrow sign */}
                    <div className="shrink-0 flex items-center text-primary/40 group-hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}

              {filteredNotifications.length === 0 && (
                <div className="bg-white rounded-3xl py-12 px-6 border border-[#ecefea] text-center shadow-sm">
                  <Inbox className="w-12 h-12 text-[#72796e]/30 mx-auto mb-3" />
                  <h4 className="text-xs font-bold text-[#191c1a]">No Notifications Found</h4>
                  <p className="text-[10px] text-[#72796e] mt-1 max-w-[220px] mx-auto leading-normal">
                    You are fully caught up with the farm diagnostics. Modify your filter category above.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Expanded Modal Details Dialog for Selected Notification */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden border border-[#ecefea] shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Header banner colored by type */}
            <div className={`p-4 flex items-center gap-3 border-b border-[#ecefea] ${
              selectedNotif.type === 'alert' ? 'bg-red-50 text-error' :
              selectedNotif.type === 'weather' ? 'bg-blue-50 text-blue-800' :
              selectedNotif.type === 'market' ? 'bg-amber-50 text-amber-800' :
              'bg-emerald-50 text-primary'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-black/5">
                {getIcon(selectedNotif.type)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[8px] font-black tracking-widest uppercase opacity-75">{selectedNotif.type} DIAGNOSTIC</span>
                <h4 className="text-xs font-black truncate leading-tight mt-0.5">{selectedNotif.title}</h4>
              </div>
            </div>

            {/* Message content */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-[#42493e] font-medium leading-relaxed">
                {selectedNotif.message}
              </p>

              <div className="bg-[#f1f4ef] p-3 rounded-xl flex items-center justify-between text-[10px] text-[#72796e]">
                <span className="font-semibold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  Time Raised
                </span>
                <span className="font-black text-[#191c1a]">{selectedNotif.timestamp}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 pt-1">
                {selectedNotif.type === 'weather' && (
                  <button 
                    onClick={() => {
                      setSelectedNotif(null);
                      onNavigate('weather');
                    }}
                    className="flex-grow bg-[#154212] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Check Radar</span>
                  </button>
                )}
                {selectedNotif.type === 'market' && (
                  <button 
                    onClick={() => {
                      setSelectedNotif(null);
                      onNavigate('market');
                    }}
                    className="flex-grow bg-[#fcc019] text-[#131f00] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Mandi</span>
                  </button>
                )}
                {selectedNotif.type === 'advisory' && (
                  <button 
                    onClick={() => {
                      setSelectedNotif(null);
                      onNavigate('plans');
                    }}
                    className="flex-grow bg-[#154212] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Plan</span>
                  </button>
                )}
                {selectedNotif.type === 'alert' && (
                  <button 
                    onClick={() => {
                      setSelectedNotif(null);
                      onNavigate('soil');
                    }}
                    className="flex-grow bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Pest Stats</span>
                  </button>
                )}
                <button 
                  onClick={() => setSelectedNotif(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#42493e] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
