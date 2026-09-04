import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { t } from '../utils/translations';

interface MarketPricesScreenProps {
  profile: UserProfile;
  onNavigate: (screen: string) => void;
  onMenuClick: () => void;
  // mandiRates prop removed — now fetched directly from backend
}

interface MandiRecord {
  id?: string;
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  arrival_date?: string;
  min_price?: string | number;
  max_price?: string | number;
  modal_price?: string | number;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function MarketPricesScreen({
  profile,
  onNavigate,
  onMenuClick
}: MarketPricesScreenProps) {
  const lang = profile.preferredLanguage;

  // Determine initial state from user profile or default to Maharashtra
  const defaultState = profile?.state || profile?.district ? 'Maharashtra' : 'Gujarat';

  const [selectedState, setSelectedState] = useState(defaultState);
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetched, setLastFetched] = useState('');

  const fetchMandiData = useCallback(async (state: string, search: string) => {
    setLoading(true);
    setError('');
    try {
      let url = `http://localhost:8081/api/mandi?state=${encodeURIComponent(state)}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.status === 'error') {
        throw new Error('Failed to fetch mandi data from government API');
      }

      setRecords(data.records || []);
      setLastFetched(new Date().toLocaleTimeString('en-IN'));
    } catch (err: any) {
      setError(err.message || 'Failed to load mandi prices. Please check your connection.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when state changes
  useEffect(() => {
    fetchMandiData(selectedState, '');
    setSearchQuery('');
  }, [selectedState, fetchMandiData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMandiData(selectedState, searchQuery);
  };

  const handleRefresh = () => {
    fetchMandiData(selectedState, searchQuery);
  };

  // Compute price trends by comparing min/max
  const getModalPrice = (r: MandiRecord): number => {
    const p = r.modal_price || r.max_price || 0;
    return typeof p === 'string' ? parseFloat(p) : p;
  };

  const getMinPrice = (r: MandiRecord): number => {
    const p = r.min_price || 0;
    return typeof p === 'string' ? parseFloat(p) : p;
  };

  const getMaxPrice = (r: MandiRecord): number => {
    const p = r.max_price || 0;
    return typeof p === 'string' ? parseFloat(p) : p;
  };

  const trendLabel = (r: MandiRecord) => {
    const modal = getModalPrice(r);
    const min = getMinPrice(r);
    const max = getMaxPrice(r);
    if (modal >= max) return { positive: true, label: '▲ High' };
    if (modal <= min) return { positive: false, label: '▼ Low' };
    return { positive: true, label: '↔ Stable' };
  };

  return (
    <div className="flex-1 bg-[#f8faf6] min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl bg-white shadow-xs border border-[#ecefea] text-[#191c1a]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#191c1a]">
              {t("Mandi Prices", lang) || "Live Mandi Rates"}
            </h1>
            <p className="text-xs text-[#72796e] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">storefront</span>
              {t("Real-time crop market rates from Govt. of India", lang) || "Live data from data.gov.in"}
              {lastFetched && <span className="ml-2 text-[10px]">Updated: {lastFetched}</span>}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>refresh</span>
          <span className="hidden sm:inline">{loading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ecefea] shadow-xs mb-6 flex flex-col sm:flex-row gap-3">
        {/* State Selector */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#72796e] text-lg">location_on</span>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="bg-[#f1f4ef] text-xs font-bold text-[#191c1a] px-3 py-2 rounded-xl outline-none cursor-pointer border-none"
          >
            {INDIAN_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 bg-[#f1f4ef] px-3 py-2 rounded-xl">
          <span className="material-symbols-outlined text-[#72796e]">search</span>
          <input
            type="text"
            placeholder={t("Search commodity or market...", lang) || "Search commodity or market..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm w-full outline-none text-[#191c1a] font-medium placeholder-[#72796e]"
          />
          <button type="submit" className="text-xs font-bold text-primary px-2 py-1 rounded-lg hover:bg-primary/10 transition-all">
            Go
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          <div>
            <p className="text-sm font-bold">Failed to load Mandi data</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
          <button onClick={handleRefresh} className="ml-auto text-xs font-bold underline">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#ecefea] animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && (
        <>
          <p className="text-xs font-bold text-[#72796e] mb-3">
            {records.length} records found for <span className="text-primary">{selectedState}</span>
            {searchQuery && <span> — filtered by "<span className="text-primary">{searchQuery}</span>"</span>}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.length > 0 ? (
              records.map((record, idx) => {
                const modal = getModalPrice(record);
                const min = getMinPrice(record);
                const max = getMaxPrice(record);
                const { positive, label } = trendLabel(record);
                return (
                  <div
                    key={record.id || idx}
                    className="bg-white p-5 rounded-2xl border border-[#ecefea] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-extrabold text-[#191c1a] leading-tight">
                          {record.commodity || 'Unknown'}
                          {record.variety && record.variety !== 'Other' && (
                            <span className="text-[10px] font-bold text-[#72796e] ml-1">({record.variety})</span>
                          )}
                        </h3>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                          positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#72796e] font-bold flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-xs">storefront</span>
                        {record.market || '—'}, {record.district || record.state || '—'}
                      </p>
                      {record.arrival_date && (
                        <p className="text-[10px] text-[#72796e] flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">calendar_today</span>
                          {record.arrival_date}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#ecefea] mt-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#72796e]">
                            Modal Price / Quintal
                          </span>
                          <p className="text-xl font-black text-[#2b5c27]">
                            ₹{modal ? modal.toLocaleString('en-IN') : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <span className="text-[10px] text-green-600 font-bold">
                          Min: ₹{min ? min.toLocaleString('en-IN') : '—'}
                        </span>
                        <span className="text-[10px] text-red-600 font-bold">
                          Max: ₹{max ? max.toLocaleString('en-IN') : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              !error && (
                <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-[#ecefea]">
                  <span className="material-symbols-outlined text-4xl text-[#72796e] mb-2 block">storefront</span>
                  <p className="text-sm font-bold text-[#72796e]">No mandi records found for {selectedState}.</p>
                  <p className="text-xs text-[#72796e] mt-1">Try selecting a different state or clearing the search filter.</p>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}