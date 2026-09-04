import React from 'react';

interface LandingScreenProps {
  onGetStarted: () => void;
}

export default function LandingScreen({ onGetStarted }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-[#FBFDF8] text-[#191C1A] font-sans overflow-x-hidden">
      
      {/* Custom Keyframe Animations via style tag */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 6s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Navigation Header */}
      <header className="sticky top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-[#ECEFEA] px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="material-symbols-outlined text-[#2B5C27] text-3xl font-bold transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125">
              eco
            </span>
            <span className="text-2xl font-black text-[#2B5C27] tracking-tight transition-colors duration-300 group-hover:text-[#1e421b]">
              AgriYield
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#42493E] uppercase tracking-wider">
            {['features', 'farms', 'ai-advisor', 'mandi'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                className="relative py-1 hover:text-[#2B5C27] transition-colors duration-300 group"
              >
                {item.replace('-', ' ')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2B5C27] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={onGetStarted}
              className="bg-[#2B5C27] hover:bg-[#20471e] text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 bg-gradient-to-b from-[#EBF5EB]/60 via-transparent to-transparent overflow-hidden">
        {/* Decorative Blurred Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#2B5C27]/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#EBF5EB] border border-[#2B5C27]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2B5C27] shadow-xs hover:border-[#2B5C27] transition-all duration-300 cursor-default">
              <span className="material-symbols-outlined text-sm animate-spin" style={{ animationDuration: '6s' }}>auto_awesome</span>
              <span>Next-Gen Smart IoT & AI Crop Cockpit</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#191C1A] leading-[1.15] tracking-tight">
              Sustaining Generations with{' '}
              <span className="text-[#2B5C27] bg-clip-text text-transparent bg-gradient-to-r from-[#2B5C27] via-emerald-600 to-[#2B5C27] animate-pulse">
                Precision Farming
              </span>
            </h1>

            <p className="text-[#42493E] text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Empower your farm with real-time soil moisture monitoring, IoT irrigation triggers, <strong>Kisan Mitra AI</strong>, and live market prices—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={onGetStarted}
                className="group relative overflow-hidden bg-[#2B5C27] hover:bg-[#20471e] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span className="relative z-10">Launch Dashboard</span>
                <span className="material-symbols-outlined text-lg relative z-10 transition-transform duration-300 group-hover:translate-x-2">arrow_forward</span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-white/20 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>

            <div className="pt-6 border-t border-[#ECEFEA] grid grid-cols-3 gap-4">
              {[
                { value: '98.4%', label: 'Yield Accuracy' },
                { value: '30%', label: 'Water Saved' },
                { value: '24/7', label: 'AI Crop Advisor' },
              ].map((stat, idx) => (
                <div key={idx} className="p-3 rounded-2xl hover:bg-[#EBF5EB]/50 transition-colors duration-300 cursor-default">
                  <p className="text-2xl font-black text-[#2B5C27] group-hover:scale-105 transition-transform">{stat.value}</p>
                  <p className="text-[11px] font-bold text-[#72796E] uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Dashboard Preview Card with Float Animation */}
          <div className="relative group animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2B5C27]/30 to-emerald-400/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70 group-hover:opacity-100" />
            <div className="relative bg-white rounded-3xl p-3 shadow-2xl border border-[#ECEFEA] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1000" 
                alt="AgriYield Farm Dashboard Preview" 
                className="rounded-2xl w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xl flex items-center justify-between transition-all duration-300 group-hover:translate-y-[-4px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2B5C27] text-white flex items-center justify-center font-bold shadow-md">
                    <span className="material-symbols-outlined animate-bounce">water_drop</span>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#191C1A]">Smart Irrigation Active</p>
                    <p className="text-[10px] font-bold text-[#72796E]">North Ridge Valley • Soil Moisture 18.4%</p>
                  </div>
                </div>
                <span className="bg-[#EBF5EB] text-[#2B5C27] text-[10px] font-black px-2.5 py-1 rounded-full uppercase border border-[#2B5C27]/20 animate-pulse">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section id="features" className="py-20 px-6 bg-white border-y border-[#ECEFEA]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black text-[#2B5C27] uppercase tracking-widest">Platform Capabilities</h2>
            <p className="text-3xl font-black text-[#191C1A]">Everything You Need To Maximise Yield</p>
            <p className="text-sm font-medium text-[#72796E]">Complete ecosystem tailored for modern precision farming.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'agriculture',
                title: 'My Farms & GPS Mapping',
                desc: 'Track multiple farms like Tomato, Wheat, and Soybeans. View real-time satellite maps and moisture sensors.',
              },
              {
                icon: 'smart_toy',
                title: 'Kisan Mitra AI Assistant',
                desc: 'Integrated Kisan Mitra bot gives automated soil nutrient advice, fertilizer plans, pest alerts, and disease diagnosis on demand.',
              },
              {
                icon: 'storefront',
                title: 'Live Mandi & Weather',
                desc: 'Access up-to-date regional market rates (Mandi prices) and hyper-local weather alerts for proactive irrigation planning.',
              },
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="group bg-[#F7FAF5] p-6 rounded-3xl border border-[#ECEFEA] space-y-4 hover:bg-white hover:border-[#2B5C27]/40 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#2B5C27] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#191C1A] group-hover:text-[#2B5C27] transition-colors">{feat.title}</h3>
                <p className="text-xs text-[#42493E] font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Farm Cockpit Section */}
      <section id="farms" className="py-20 px-6 bg-[#F7FAF5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-black text-[#2B5C27] uppercase tracking-widest">INTERACTIVE COCKPIT</h2>
              <p className="text-3xl font-black text-[#191C1A] mt-1">My Farm Management Cockpit</p>
            </div>
            <button 
              onClick={onGetStarted}
              className="group text-xs font-bold text-[#2B5C27] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Explore All Managed Fields</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-[#ECEFEA] shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-emerald-100">
                <img 
                  src="https://images.unsplash.com/photo-1592417817098-8f3d6eb16431?auto=format&fit=crop&q=80&w=800" 
                  alt="Tomato Farm" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <span className="absolute top-4 right-4 bg-[#EBF5EB] text-[#2B5C27] text-[10px] font-black px-3 py-1 rounded-full uppercase border border-[#2B5C27]/20 shadow-md">
                  Optimal
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#191C1A] group-hover:text-[#2B5C27] transition-colors">North Ridge Valley</h3>
                  <p className="text-xs text-[#72796E] font-medium">Tomato • 42 Hectares (103.8 Acres)</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#ECEFEA]">
                  <div className="bg-[#F7FAF5] group-hover:bg-[#EBF5EB]/50 p-2.5 rounded-2xl text-center transition-colors">
                    <p className="text-[10px] font-extrabold text-[#72796E] uppercase">Moisture</p>
                    <p className="text-sm font-black text-[#2B5C27]">18.4%</p>
                  </div>
                  <div className="bg-[#F7FAF5] group-hover:bg-[#EBF5EB]/50 p-2.5 rounded-2xl text-center transition-colors">
                    <p className="text-[10px] font-extrabold text-[#72796E] uppercase">Yield Est.</p>
                    <p className="text-sm font-black text-[#191C1A]">8.2t/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-[#ECEFEA] shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-amber-100">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800" 
                  alt="East Plateau" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <span className="absolute top-4 right-4 bg-[#EBF5EB] text-[#2B5C27] text-[10px] font-black px-3 py-1 rounded-full uppercase border border-[#2B5C27]/20 shadow-md">
                  Optimal
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#191C1A] group-hover:text-[#2B5C27] transition-colors">East Plateau</h3>
                  <p className="text-xs text-[#72796E] font-medium">Wheat • 120 Hectares (296.5 Acres)</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#ECEFEA]">
                  <div className="bg-[#F7FAF5] group-hover:bg-[#EBF5EB]/50 p-2.5 rounded-2xl text-center transition-colors">
                    <p className="text-[10px] font-extrabold text-[#72796E] uppercase">Moisture</p>
                    <p className="text-sm font-black text-[#2B5C27]">12.1%</p>
                  </div>
                  <div className="bg-[#F7FAF5] group-hover:bg-[#EBF5EB]/50 p-2.5 rounded-2xl text-center transition-colors">
                    <p className="text-[10px] font-extrabold text-[#72796E] uppercase">Pest Risk</p>
                    <p className="text-sm font-black text-amber-600">Medium</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-[#ECEFEA] shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-emerald-100">
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800" 
                  alt="Southern Delta Zone" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-amber-300 shadow-md">
                  Attention
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#191C1A] group-hover:text-[#2B5C27] transition-colors">Southern Delta Zone</h3>
                  <p className="text-xs text-[#72796E] font-medium">Soybeans • 85 Hectares (210 Acres)</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#ECEFEA]">
                  <div className="bg-[#F7FAF5] group-hover:bg-[#EBF5EB]/50 p-2.5 rounded-2xl text-center transition-colors">
                    <p className="text-[10px] font-extrabold text-[#72796E] uppercase">Moisture</p>
                    <p className="text-sm font-black text-[#2B5C27]">22.0%</p>
                  </div>
                  <div className="bg-[#F7FAF5] group-hover:bg-[#EBF5EB]/50 p-2.5 rounded-2xl text-center transition-colors">
                    <p className="text-[10px] font-extrabold text-[#72796E] uppercase">Yield Est.</p>
                    <p className="text-sm font-black text-[#191C1A]">4.5t/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Kisan Mitra AI Section */}
      <section id="ai-advisor" className="py-20 px-6 bg-[#2B5C27] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
              <span className="material-symbols-outlined text-sm animate-pulse">smart_toy</span>
              <span>POWERED BY KISAN MITRA AI</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              Instant Answers & Automated Farming Advisories
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal">
              Our <strong>Kisan Mitra AI</strong> chatbot analyzes your farm's soil moisture level, N-P-K nutrient balance, and local weather forecasts to deliver step-by-step actionable guidance.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm font-semibold text-emerald-100">
              {[
                'Automated Fertilizer Treatment Plans',
                'Watering schedule based on hyper-local weather forecasts',
                'Multi-language support (English, Hindi, Marathi, Telugu)',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 group">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-emerald-200 flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-[#2B5C27]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={onGetStarted}
              className="mt-4 bg-white text-[#2B5C27] hover:bg-emerald-50 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center gap-2 group"
            >
              <span>Try Kisan Mitra AI Free</span>
              <span className="material-symbols-outlined text-base transition-transform group-hover:rotate-12">auto_awesome</span>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 space-y-6 shadow-2xl transition-all duration-300 hover:border-white/40">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-emerald-300/40 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-white">smart_toy</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-white">Kisan Mitra AI</p>
                    <span className="bg-emerald-400/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-md uppercase border border-emerald-400/30">Official Bot</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 font-medium">Kisan Mitra Assistant • Online</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="bg-white/10 border border-white/10 p-3.5 rounded-2xl max-w-[88%] text-emerald-50 shadow-xs">
                👨‍🌾 <strong>Farmer:</strong> North Ridge Valley field me Tomato crop ke liye kitna pani chahiye?
              </div>
              <div className="bg-white text-[#191C1A] p-4 rounded-2xl max-w-[90%] ml-auto shadow-2xl space-y-2 border border-emerald-100 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-1.5 text-[#2B5C27] font-black text-[11px]">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  <span>Kisan Mitra Recommendation</span>
                </div>
                <p className="leading-relaxed text-xs text-gray-800">
                  Current Soil Moisture level is <strong>18.4%</strong>. Weather radar predicts light rain in 48 hrs.
                </p>
                <div className="bg-[#EBF5EB] p-2.5 rounded-xl border border-[#2B5C27]/20 text-[#2B5C27] text-[11px] font-bold flex items-center gap-1">
                  <span>⚡ Action: Activate Zone B Drip Irrigation for 45 mins tonight.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Mandi Rates Section */}
      <section id="mandi" className="py-20 px-6 bg-white border-b border-[#ECEFEA]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black text-[#2B5C27] uppercase tracking-widest">Market Intelligence</h2>
            <p className="text-3xl font-black text-[#191C1A]">Live Mandi Rates</p>
            <p className="text-sm font-medium text-[#72796E]">Real-time regional crop prices to maximize your trade margins.</p>
          </div>

          <div className="bg-[#F7FAF5] rounded-3xl p-6 border border-[#ECEFEA] overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ECEFEA] text-[#72796E] font-black uppercase text-[10px]">
                  <th className="pb-3">Crop</th>
                  <th className="pb-3">Market (Mandi)</th>
                  <th className="pb-3">Min Price</th>
                  <th className="pb-3">Max Price</th>
                  <th className="pb-3">Modal Price</th>
                  <th className="pb-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEFEA] font-semibold text-[#191C1A]">
                {[
                  { crop: 'Tomato', mandi: 'Nagpur Central Mandi', min: '₹2,200 / qtl', max: '₹2,800 / qtl', modal: '₹2,600 / qtl', trend: '▲ +4.2%', trendClass: 'text-emerald-600' },
                  { crop: 'Wheat (Lok-1)', mandi: 'Amravati APMC', min: '₹2,450 / qtl', max: '₹2,900 / qtl', modal: '₹2,750 / qtl', trend: '▲ +1.8%', trendClass: 'text-emerald-600' },
                  { crop: 'Soybeans', mandi: 'Latur Mandi', min: '₹4,100 / qtl', max: '₹4,650 / qtl', modal: '₹4,500 / qtl', trend: '▼ -0.5%', trendClass: 'text-amber-600' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white hover:shadow-md transition-all duration-200 cursor-default">
                    <td className="py-3.5 font-extrabold text-[#2B5C27]">{row.crop}</td>
                    <td className="py-3.5">{row.mandi}</td>
                    <td className="py-3.5">{row.min}</td>
                    <td className="py-3.5">{row.max}</td>
                    <td className="py-3.5 font-bold text-[#2B5C27]">{row.modal}</td>
                    <td className={`py-3.5 text-right font-bold ${row.trendClass}`}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#191C1A] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="material-symbols-outlined text-[#2B5C27] text-2xl font-bold transition-transform duration-500 group-hover:rotate-180">eco</span>
            <span className="text-lg font-black tracking-tight">AgriYield</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} AgriYield Platform. Powered by Kisan Mitra AI.
          </p>
          <button 
            onClick={onGetStarted}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-all cursor-pointer flex items-center gap-1 group"
          >
            <span>Go to Login</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </footer>
    </div>
  );
}