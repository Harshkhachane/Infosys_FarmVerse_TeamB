import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { t } from '../utils/translations';
import { loginUser, signupUser } from '../service/api';

const PROFILE_CACHE_KEY = 'agriyield-user-profiles';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readProfileCache = (): Record<string, any> => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeProfileCache = (email: string, profile: any) => {
  const cache = readProfileCache();
  cache[normalizeEmail(email)] = profile;
  localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
};

const getCachedProfile = (email: string) => {
  const cache = readProfileCache();
  return cache[normalizeEmail(email)];
};

interface WelcomeScreenProps {
  // Updated to pass user details back to App on successful auth (lang, userData, userId)
  onLoginSuccess: (lang: 'English' | 'తెలుగు' | 'हिन्दी', userResponseData?: any, userId?: string) => void;
  profile: UserProfile;
}

export default function WelcomeScreen({ onLoginSuccess, profile }: WelcomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedLang, setSelectedLang] = useState<'English' | 'తెలుగు' | 'हिन्दी'>(profile.preferredLanguage || 'English');
  
  // Login form states
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Mobile login states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showSmsPopup, setShowSmsPopup] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [regEmail, setRegEmail] = useState('');
  // Register form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.trim().length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError('');
    
    // Generate a random 4 digit code
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(generated);
    setOtpSent(true);
    setCountdown(30);
    setShowSmsPopup(true);

    // Auto-hide the mock SMS toast after 8 seconds
    setTimeout(() => {
      setShowSmsPopup(false);
    }, 8000);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === otpCode || enteredOtp === '1234') {
      // Mobile OTP login — no backend data, pass what we have
      onLoginSuccess(selectedLang, {
        name: mobileNumber,
        mobileNumber: mobileNumber,
        phone: mobileNumber,
        role: 'USER'
      }, '');
    } else {
      setOtpError('Incorrect OTP entered. Please try again or use the mock code displayed above.');
    }
  };

  // ---------------------------------------------
  // Backend Integration: Email Login Submit
  // ---------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
      const response = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });

      if (response && (response.success || response.token || response.data)) {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        // Extract user object from backend response
        const rawUser = response.data || response.user || response;
        
        const userData = {
          fullName: rawUser.fullName || rawUser.name || loginEmail.split('@')[0],
          name: rawUser.fullName || rawUser.name || loginEmail.split('@')[0],
          email: rawUser.email || loginEmail,
          mobileNumber: rawUser.mobileNumber || rawUser.mobile || rawUser.phone || '',
          phone: rawUser.mobileNumber || rawUser.mobile || rawUser.phone || '',
          stateRegion: rawUser.stateRegion || rawUser.state || '',
          district: rawUser.district || '',
          village: rawUser.village || '',
          streetAddress: rawUser.streetAddress || '',
          role: rawUser.role || 'USER',
          avatarUrl: rawUser.avatarUrl || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || loginEmail.split('@')[0])}&background=2b5c27&color=fff&size=150`
        };

        const userId = rawUser.id || rawUser._id || '';
        writeProfileCache(loginEmail, userData);
        onLoginSuccess(selectedLang, userData, userId);
      } else {
        setLoginError(response?.message || 'Invalid Login Credentials');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      setLoginError(error?.response?.data?.message || 'Backend connection failed! Please ensure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    // Google sign-in is simulated; show a message
    setLoginError('Google Sign-In is not yet connected. Please use Email Login.');
  };

  // ---------------------------------------------
  // Backend Integration: Registration Submit
  // ---------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegisterError('Passwords do not match. Please ensure both passwords match.');
      return;
    }
    setRegisterError('');
    setIsLoading(true);

    try {
      const response = await signupUser({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email: regEmail,
        mobile: regMobile,
        phone: regMobile,
        password: regPassword,
      });

      if (response && (response.success || response.data)) {
        const rawUser = response.data || response.user || {};
        const userData = {
          name: rawUser.name || `${firstName} ${lastName}`.trim(),
          fullName: rawUser.name || `${firstName} ${lastName}`.trim(),
          email: rawUser.email || regEmail,
          mobileNumber: rawUser.mobileNumber || rawUser.phone || regMobile,
          phone: rawUser.mobileNumber || rawUser.phone || regMobile,
          role: rawUser.role || 'USER',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${firstName} ${lastName}`.trim())}&background=2b5c27&color=fff&size=150`
        };
        const userId = rawUser.id || rawUser._id || '';
        writeProfileCache(regEmail, userData);
        onLoginSuccess(selectedLang, userData, userId);
      } else {
        setRegisterError(response?.message || 'Registration failed.');
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      setRegisterError(error?.response?.data?.message || 'Backend server error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time password matching state
  const isPasswordMatching = regPassword && regConfirmPassword && regPassword === regConfirmPassword;
  const hasTypedBoth = regPassword.length > 0 && regConfirmPassword.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start overflow-x-hidden bg-gradient-to-br from-[#EBF5EB] via-[#F7FAF5] to-[#E9EFF2] pb-10">
      
      {/* Mock SMS Floating Notification Tray */}
      {showSmsPopup && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-bounce bg-[#1a1f16] text-white p-4 rounded-2xl shadow-2xl border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-white">
              <span className="material-symbols-outlined text-xl">sms</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-black text-primary-container tracking-wider uppercase">SIMULATED SMS AGENT</span>
                <span className="text-[10px] text-gray-400 font-bold">Just Now</span>
              </div>
              <p className="text-xs text-gray-100 font-medium">
                Your <span className="font-extrabold text-secondary-container text-yellow-400">AgriYield OTP code</span> is <span className="font-black text-sm bg-white/20 px-2 py-0.5 rounded text-white tracking-widest">{otpCode}</span>. Use this to verify your mobile number.
              </p>
            </div>
            <button 
              onClick={() => setShowSmsPopup(false)}
              className="text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Beautiful High-Contrast Curved Hero Design */}
      <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center filter saturate-[1.1]" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200')" 
          }}
        />
        {/* Soft light dual-gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#154212]/80 via-[#154212]/30 to-black/10"></div>
        
        {/* Brand identity on the gradient overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/25 flex flex-col items-center gap-1.5 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8be278] text-4xl font-bold drop-shadow-md">eco</span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">AgriYield</h1>
            </div>
            <p className="text-[#e2ebd9] font-bold text-xs tracking-wider uppercase">
              Smart IoT Crop Cockpit
            </p>
          </div>
          <p className="text-white/90 text-sm font-medium max-w-[320px] mt-4 drop-shadow-md italic">
            "Sustaining generations with precision agriculture"
          </p>
        </div>
      </div>

      {/* Main Authentic Card Box */}
      <main className="w-full max-w-md px-4 -mt-12 z-10">
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/80 ambient-tonal-card" id="auth-card">
          
          {/* Tab switches with pleasant micro-animations */}
          <div className="flex bg-[#f1f4ef] p-1.5 rounded-2xl mb-6">
            <button 
              onClick={() => {
                setActiveTab('login');
                setRegisterError('');
              }}
              className={`flex-1 py-3 text-xs font-black tracking-widest rounded-xl transition-all text-center uppercase cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-[#42493e] hover:text-primary hover:bg-white/40'
              }`}
              id="tab-login"
            >
              {t("SECURE LOGIN", selectedLang)}
            </button>
            <button 
              onClick={() => {
                setActiveTab('register');
                setOtpError('');
              }}
              className={`flex-1 py-3 text-xs font-black tracking-widest rounded-xl transition-all text-center uppercase cursor-pointer ${
                activeTab === 'register' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-[#42493e] hover:text-primary hover:bg-white/40'
              }`}
              id="tab-register"
            >
              {t("REGISTER NEW PROFILE", selectedLang)}
            </button>
          </div>

          {/* Login tab cont  ent */}
          {activeTab === 'login' ? (
            <div className="space-y-5">
              
              {/* Inner login methods buttons (Email vs Mobile OTP) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#f7faf5] rounded-xl border border-[#ecefea]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setOtpError('');
                  }}
                  className={`py-2 text-[11px] font-extrabold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-white text-[#154212] border border-[#ecefea] shadow-xs'
                      : 'text-[#72796e] hover:text-[#154212]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>{t("EMAIL LOGIN", selectedLang)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('mobile');
                    setOtpError('');
                  }}
                  className={`py-2 text-[11px] font-extrabold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'mobile'
                      ? 'bg-white text-[#154212] border border-[#ecefea] shadow-xs'
                      : 'text-[#72796e] hover:text-[#154212]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">phone_iphone</span>
                  <span>{t("MOBILE OTP", selectedLang)}</span>
                </button>
              </div>

              {/* METHOD 1: EMAIL LOGIN FORM */}
              {loginMethod === 'email' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                      {t("EMAIL OR USERNAME", selectedLang)}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72796e] text-lg">
                        alternate_email
                      </span>
                      <input 
                        type="text"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#191c1a]"
                        placeholder="e.g. user@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                      {t("PASSWORD", selectedLang)}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72796e] text-lg">
                        lock_open
                      </span>
                      <input 
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#191c1a]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a 
                      href="#forgot" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert("For demonstration, please log in with the default credentials or use the Mobile OTP flow.");
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-[#1a4f16] text-black font-bold text-sm py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/25 disabled:opacity-50"
                  >
                    <span>{isLoading ? "SIGNING IN..." : t("SIGN IN SECURELY", selectedLang)}</span>
                    <span className="material-symbols-outlined text-sm">login</span>
                  </button>

                  {loginError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">error</span>
                      <span>{loginError}</span>
                    </div>
                  )}
                </form>
              ) : (
                /* METHOD 2: MOBILE OTP LOGIN FORM */
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                  {otpError && (
                    <div className="bg-[#FFF0F0] text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">error</span>
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                      {t("Enter mobile number", selectedLang)}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#72796e] text-lg">
                          call
                        </span>
                        <input 
                          type="tel"
                          disabled={otpSent}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full pl-11 pr-4 py-3 bg-[#fcfdfe] disabled:bg-[#f1f4ef] disabled:text-gray-500 border border-[#c2c9bb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[#191c1a] font-mono tracking-wider"
                          placeholder="9876543210"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={countdown > 0}
                        className={`px-4 text-[11px] font-black rounded-xl border transition-all cursor-pointer ${
                          countdown > 0
                            ? 'bg-gray-100 text-gray-400 border-gray-200'
                            : 'bg-white text-primary border-primary hover:bg-primary/5 active:scale-[0.97]'
                        }`}
                      >
                        {countdown > 0 ? `Retry in ${countdown}s` : otpSent ? 'Resend' : t("SEND SECURE OTP", selectedLang)}
                      </button>
                    </div>
                    <p className="text-[10px] text-[#72796e] font-medium mt-1">
                      An authentic simulated SMS notification will pop up at the top.
                    </p>
                  </div>

                  {otpSent && (
                    <div className="bg-[#FFFCEB] border border-yellow-200 p-4 rounded-2xl space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-extrabold tracking-widest text-[#785900] uppercase">
                          ENTER 4-DIGIT VERIFICATION CODE
                        </label>
                        <span className="text-[10px] text-primary font-black animate-pulse">OTP SENT</span>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#785900] text-lg animate-bounce">
                          password
                        </span>
                        <input 
                          type="text"
                          required
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full pl-11 pr-4 py-3 bg-white border border-[#fcc019] rounded-xl text-base text-center font-mono font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-[#fcc019] transition-all text-black"
                          placeholder="••••"
                        />
                      </div>
                      <p className="text-[10px] text-gray-600 font-bold text-center">
                        Hint: Use code <span className="bg-yellow-200 text-black px-1.5 py-0.5 rounded font-mono font-black">{otpCode || "4821"}</span> or <span className="bg-yellow-200 text-black px-1.5 py-0.5 rounded font-mono font-black">1234</span>
                      </p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={!otpSent}
                    className="w-full disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed bg-primary hover:bg-[#1a4f16] text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/25"
                  >
                    <span>{t("VERIFY OTP", selectedLang)}</span>
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                  </button>
                </form>
              )}

              {/* Google Sign In option & secondary auth channels */}
              <div className="pt-4 border-t border-[#ecefea] text-center space-y-4">
                <p className="text-[10px] font-black text-[#72796e] uppercase tracking-wider">
                  OR SIGN IN VIA PROVIDERS
                </p>
                
                {/* Beautiful custom Google Sign-In Button */}
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-[#f7faf5] border border-gray-200 hover:border-primary/30 text-gray-700 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="register-form">
              {registerError && (
                <div className="bg-[#FFF0F0] text-red-700 p-3 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span>{registerError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                    {t("First Name", selectedLang)}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
                    placeholder="e.g. First Name" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                    {t("Last Name", selectedLang)}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
                    placeholder="Last Name" 
                  />
                </div>
              </div>

                  <div>
  <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
    Email Address
  </label>
  <input 
    type="email" 
    required
    value={regEmail}
    onChange={(e) => setRegEmail(e.target.value)}
    className="w-full px-4 py-2.5 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
    placeholder="e.g. xyz@gmail.com" 
  />
</div>


              <div>
                <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                  {t("Mobile Number", selectedLang)}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-base">
                    call
                  </span>
                  <input 
                    type="tel" 
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a] font-mono"
                    placeholder="10-digit mobile number" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                  {t("CHOOSE PASSWORD", selectedLang)}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-base">
                    password
                  </span>
                  <input 
                    type="password" 
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
                    placeholder="Minimum 6 characters" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                  {t("CONFIRM PASSWORD", selectedLang)}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-base">
                    lock_reset
                  </span>
                  <input 
                    type="password" 
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
                    placeholder="Retype password to confirm" 
                  />
                </div>
              </div>

              {/* Password Match Status Pill Indicator */}
              {hasTypedBoth && (
                <div className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  isPasswordMatching
                    ? 'bg-[#EBF5EB] text-[#154212] border-[#c4e3be]'
                    : 'bg-[#FFF0F0] text-[#ba1a1a] border-[#fbc9c9]'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {isPasswordMatching ? 'check_circle' : 'cancel'}
                  </span>
                  <span>
                    {isPasswordMatching ? 'Passwords match correctly' : 'Passwords do not match yet'}
                  </span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black hover:bg-[#268b1f] text-white font-bold text-sm py-3 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-primary/10 mt-2 disabled:opacity-50"
              >
                {isLoading ? "CREATING ACCOUNT..." : t("CREATE COCKPIT ACCOUNT", selectedLang)}
              </button>
            </form>
          )}

        </div>

        {/* Selected language helper */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-[10px] font-extrabold tracking-widest text-[#72796e] uppercase">{t("Preferred Language", selectedLang)}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(['English', 'తెలుగు', 'हिन्दी'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLang(lang)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedLang === lang 
                    ? 'bg-primary text-white border-transparent shadow-xs' 
                    : 'bg-white text-[#42493e] border-[#ecefea] hover:bg-[#f1f4ef]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer block */}
      <footer className="mt-auto py-8 text-center w-full px-4">
        <p className="text-xs text-[#72796e] font-medium">© 2026 AgriYield Technologies. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#privacy" className="text-xs text-primary font-bold hover:underline">Privacy Policy</a>
          <span className="text-[#c2c9bb]">•</span>
          <a href="#support" className="text-xs text-primary font-bold hover:underline">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}