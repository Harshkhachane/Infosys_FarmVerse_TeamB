import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const BASE_URL = 'http://localhost:8081/api';

interface SubscriptionScreenProps {
  profile: UserProfile;
  userId: string;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
}

interface Subscription {
  id?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  businessName?: string;
  plan?: string;
  startDate?: string;
  expiryDate?: string;
  status?: string;
  active?: boolean;
}

const PLANS = [
  {
    id: 'FREE_TRIAL',
    name: 'Free Trial',
    price: 'Free',
    duration: '30 Days',
    features: ['Basic crop tracking', 'Weather updates', 'Community forum access', 'Up to 2 farms'],
    color: 'border-yellow-300 bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
    highlight: false,
  },
  {
    id: 'BASIC',
    name: 'Basic',
    price: '₹499/mo',
    duration: 'Monthly',
    features: ['Everything in Trial', 'Up to 10 farms', 'Soil analysis reports', 'Market price alerts'],
    color: 'border-blue-300 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    highlight: false,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '₹1,299/mo',
    duration: 'Monthly',
    features: ['Everything in Basic', 'Unlimited farms', 'AI crop recommendations', 'Priority support'],
    color: 'border-green-400 bg-green-50 ring-2 ring-green-500',
    badge: 'bg-green-100 text-green-700',
    highlight: true,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 'Custom',
    duration: 'Annual',
    features: ['Everything in Premium', 'Custom integrations', 'Dedicated account manager', 'API access'],
    color: 'border-purple-300 bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
    highlight: false,
  },
];

export default function SubscriptionScreen({ profile, userId, onNavigate, onMenuClick }: SubscriptionScreenProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('FREE_TRIAL');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSubs = async () => {
    setLoading(true);
    setError('');
    try {
      if (!userId) {
        setSubscriptions([]);
        return;
      }
      const res = await fetch(`${BASE_URL}/subscriptions/user/${userId}`);
      if (res.ok) {
        setSubscriptions(await res.json());
      } else {
        setSubscriptions([]);
      }
    } catch {
      setError('Could not load subscriptions. Check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubs(); }, [userId]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    if (!businessName.trim()) { setFormError('Please enter your business/organisation name.'); return; }
    setCreating(true);
    try {
      const res = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || '',
          userName: profile.fullName || profile.email || '',
          userEmail: profile.email || '',
          businessName: businessName.trim(),
          plan: selectedPlan,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setSubscriptions(prev => [created, ...prev]);
        setBusinessName('');
        setSelectedPlan('FREE_TRIAL');
        setSuccess('Subscription created successfully!');
      } else {
        setFormError('Failed to create subscription. Try again.');
      }
    } catch {
      setFormError('Server error. Please try again later.');
    } finally {
      setCreating(false);
    }
  };

  const StatusBadge = ({ status }: { status?: string }) => {
    const colors: Record<string, string> = {
      TRIAL: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      EXPIRED: 'bg-red-100 text-red-700 border-red-200',
      INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    const s = status || 'UNKNOWN';
    return (
      <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${colors[s] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
        {s}
      </span>
    );
  };

  // Compute trial days remaining
  const trialDaysLeft = (sub: Subscription) => {
    if (!sub.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(sub.expiryDate);
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EBF5EB] via-[#F7FAF5] to-[#E9EFF2]">
      {/* Header */}
      <header className="bg-white border-b border-[#ecefea] px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-xl hover:bg-[#f1f4ef] text-[#42493e] cursor-pointer">
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <div>
          <h1 className="text-lg font-black text-[#191c1a]">Business Subscription</h1>
          <p className="text-xs text-[#72796e]">Manage your farm business subscription plan</p>
        </div>
      </header>

      <div className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Active Subscriptions */}
        {!loading && subscriptions.length > 0 && (
          <div>
            <h2 className="text-base font-black text-[#191c1a] mb-4">Your Active Subscriptions</h2>
            <div className="space-y-3">
              {subscriptions.map((sub, idx) => {
                const daysLeft = trialDaysLeft(sub);
                return (
                  <div key={sub.id || idx} className="bg-white rounded-2xl border border-[#ecefea] p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-sm font-black text-[#191c1a]">{sub.businessName || '—'}</h3>
                        <p className="text-xs text-[#72796e] mt-0.5">
                          Plan: <span className="font-bold text-primary">{sub.plan || '—'}</span>
                        </p>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-[#f7faf5] rounded-xl p-3">
                        <p className="text-[#72796e] font-bold uppercase tracking-wider text-[10px] mb-0.5">Start Date</p>
                        <p className="font-black text-[#191c1a]">{sub.startDate || '—'}</p>
                      </div>
                      <div className="bg-[#f7faf5] rounded-xl p-3">
                        <p className="text-[#72796e] font-bold uppercase tracking-wider text-[10px] mb-0.5">Expiry Date</p>
                        <p className="font-black text-[#191c1a]">{sub.expiryDate || '—'}</p>
                      </div>
                      {daysLeft !== null && (
                        <div className={`rounded-xl p-3 ${daysLeft <= 0 ? 'bg-red-50' : daysLeft <= 7 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                          <p className="text-[#72796e] font-bold uppercase tracking-wider text-[10px] mb-0.5">Days Remaining</p>
                          <p className={`font-black text-sm ${daysLeft <= 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-yellow-600' : 'text-green-700'}`}>
                            {daysLeft <= 0 ? 'Expired' : `${daysLeft} days`}
                          </p>
                        </div>
                      )}
                    </div>
                    {sub.status === 'TRIAL' && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs font-semibold text-yellow-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">info</span>
                        You are on a 30-day free trial. Contact admin to upgrade to a paid plan after trial ends.
                      </div>
                    )}
                    {sub.status === 'EXPIRED' && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        Your subscription has expired. Please contact admin to renew.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>}

        {/* Subscribe / Plan Selection */}
        <div>
          <h2 className="text-base font-black text-[#191c1a] mb-2">Available Plans</h2>
          <p className="text-xs text-[#72796e] mb-4">Choose a plan for your farm business. Start with a 30-day free trial, then upgrade anytime.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {PLANS.map(plan => (
              <div key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all ${plan.color} ${selectedPlan === plan.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}`}>
                {plan.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                )}
                {selectedPlan === plan.id && (
                  <span className="absolute top-3 right-3 text-primary">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </span>
                )}
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${plan.badge}`}>{plan.name}</span>
                <p className="text-2xl font-black text-[#191c1a] mt-3">{plan.price}</p>
                <p className="text-[10px] text-[#72796e] font-bold">{plan.duration}</p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#42493e]">
                      <span className="material-symbols-outlined text-green-600 text-sm">check</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subscribe Form */}
          <div className="bg-white rounded-2xl border border-[#ecefea] p-6 shadow-sm">
            <h3 className="text-sm font-black text-[#191c1a] mb-4">
              Subscribe with: <span className="text-primary">{PLANS.find(p => p.id === selectedPlan)?.name}</span>
            </h3>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {success}
              </div>
            )}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                  Business / Organisation Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
                  placeholder="e.g. Green Valley Agri Pvt. Ltd."
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold tracking-widest text-[#72796e] mb-1.5 uppercase">
                  Selected Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={e => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fcfdfe] border border-[#c2c9bb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[#191c1a]"
                >
                  {PLANS.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price}</option>)}
                </select>
              </div>
              <p className="text-xs text-[#72796e]">
                {selectedPlan === 'FREE_TRIAL'
                  ? '🎉 Your 30-day free trial starts immediately. No payment required.'
                  : '📞 After subscribing, our team will contact you for payment setup. No real payment is charged now.'}
              </p>
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-primary hover:bg-[#1a4f16] text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {creating ? 'Creating...' : selectedPlan === 'FREE_TRIAL' ? 'Start Free Trial' : `Subscribe to ${PLANS.find(p => p.id === selectedPlan)?.name}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
