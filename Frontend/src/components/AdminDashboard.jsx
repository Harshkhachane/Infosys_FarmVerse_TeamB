import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:8081/api';

const AdminDashboard = ({ profile, onLogout, onNavigate }) => {
  const [usersList, setUsersList] = useState([]);
  const [farmsList, setFarmsList] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [subscriptionsList, setSubscriptionsList] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalFarmers: 0, totalAdmins: 0, totalFarms: 0, totalCrops: 0 });
  const [subStats, setSubStats] = useState({ total: 0, trial: 0, active: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [activeTab, setActiveTab] = useState('overview');
  const [deletingId, setDeletingId] = useState(null);

  // Subscription form state
  const [showSubForm, setShowSubForm] = useState(false);
  const [subForm, setSubForm] = useState({ userId: '', userName: '', userEmail: '', businessName: '', plan: 'FREE_TRIAL' });
  const [subFormError, setSubFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, farmsRes, cropsRes, statsRes, subsRes, subStatsRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/users`),
        fetch(`${BASE_URL}/admin/farms`),
        fetch(`${BASE_URL}/admin/crops`),
        fetch(`${BASE_URL}/admin/stats`),
        fetch(`${BASE_URL}/subscriptions`),
        fetch(`${BASE_URL}/subscriptions/stats`),
      ]);
      if (!usersRes.ok || !statsRes.ok) throw new Error('Failed to fetch admin data');
      const usersData = await usersRes.json();
      const farmsData = farmsRes.ok ? await farmsRes.json() : [];
      const cropsData = cropsRes.ok ? await cropsRes.json() : [];
      const statsData = await statsRes.json();
      const subsData = subsRes.ok ? await subsRes.json() : [];
      const subStatsData = subStatsRes.ok ? await subStatsRes.json() : {};
      setUsersList(usersData);
      setFarmsList(farmsData);
      setCropsList(cropsData);
      setStats(statsData);
      setSubscriptionsList(subsData);
      setSubStats(subStatsData);
    } catch (err) {
      setError('Could not connect to backend. Please ensure the Spring Boot server is running on port 8081.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      } else alert('Failed to delete user.');
    } catch (err) { alert('Error deleting user.'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Delete this farm record?')) return;
    setDeletingId(farmId);
    try {
      const res = await fetch(`${BASE_URL}/admin/farms/${farmId}`, { method: 'DELETE' });
      if (res.ok) { setFarmsList(prev => prev.filter(f => f.id !== farmId)); }
      else alert('Failed to delete farm.');
    } catch (err) { alert('Error.'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm('Delete this crop record?')) return;
    setDeletingId(cropId);
    try {
      const res = await fetch(`${BASE_URL}/admin/crops/${cropId}`, { method: 'DELETE' });
      if (res.ok) { setCropsList(prev => prev.filter(c => c.id !== cropId)); }
      else alert('Failed to delete crop.');
    } catch (err) { alert('Error.'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteSub = async (subId) => {
    if (!window.confirm('Delete this subscription?')) return;
    setDeletingId(subId);
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/${subId}`, { method: 'DELETE' });
      if (res.ok) { setSubscriptionsList(prev => prev.filter(s => s.id !== subId)); }
      else alert('Failed to delete subscription.');
    } catch (err) { alert('Error.'); }
    finally { setDeletingId(null); }
  };

  const handleToggleSub = async (subId) => {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/${subId}/toggle`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setSubscriptionsList(prev => prev.map(s => s.id === subId ? updated : s));
      }
    } catch (err) { alert('Error toggling subscription.'); }
  };

  const handleCreateSub = async (e) => {
    e.preventDefault();
    setSubFormError('');
    if (!subForm.businessName.trim()) { setSubFormError('Business name is required.'); return; }
    try {
      const res = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subForm),
      });
      if (res.ok) {
        const created = await res.json();
        setSubscriptionsList(prev => [created, ...prev]);
        setShowSubForm(false);
        setSubForm({ userId: '', userName: '', userEmail: '', businessName: '', plan: 'FREE_TRIAL' });
      } else {
        setSubFormError('Failed to create subscription.');
      }
    } catch (err) { setSubFormError('Server error.'); }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.district || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminName = profile?.fullName || profile?.name || 'Admin';
  const adminEmail = profile?.email || '';

  const StatusBadge = ({ status }) => {
    const colors = {
      TRIAL: 'bg-yellow-100 text-yellow-700',
      ACTIVE: 'bg-green-100 text-green-700',
      EXPIRED: 'bg-red-100 text-red-700',
      INACTIVE: 'bg-gray-100 text-gray-500',
    };
    return (
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status || 'UNKNOWN'}
      </span>
    );
  };

  const StatCard = ({ icon, label, value, color, bg }) => (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-white/60 hover:shadow-md transition-all`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-inner`}>
        <span className="material-symbols-outlined text-2xl text-white">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );

  const TABS = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'users', label: 'Users', icon: 'group' },
    { id: 'farms', label: 'Farms', icon: 'agriculture' },
    { id: 'crops', label: 'Crops', icon: 'grass' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'card_membership' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-xl">eco</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">FarmVerse Admin</h1>
              <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
              <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-none">{adminName}</p>
                <p className="text-[10px] text-gray-500">{adminEmail}</p>
              </div>
              <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">ADMIN</span>
            </div>
            <button onClick={fetchData} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all" title="Refresh Data">
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
              <span className="material-symbols-outlined text-base">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">error</span>
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={fetchData} className="ml-auto text-xs font-bold underline">Retry</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-24" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard icon="group" label="Total Users" value={stats.totalUsers} color="bg-blue-600" bg="bg-blue-50" />
                <StatCard icon="agriculture" label="Farmers" value={stats.totalFarmers} color="bg-green-700" bg="bg-green-50" />
                <StatCard icon="admin_panel_settings" label="Admins" value={stats.totalAdmins} color="bg-red-600" bg="bg-red-50" />
                <StatCard icon="landscape" label="Total Farms" value={stats.totalFarms} color="bg-amber-600" bg="bg-amber-50" />
                <StatCard icon="grass" label="Total Crops" value={stats.totalCrops} color="bg-teal-600" bg="bg-teal-50" />
              </div>
            )}

            {/* Subscription Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="card_membership" label="Total Subscriptions" value={subStats.total || 0} color="bg-indigo-600" bg="bg-indigo-50" />
              <StatCard icon="hourglass_top" label="Trial" value={subStats.trial || 0} color="bg-yellow-600" bg="bg-yellow-50" />
              <StatCard icon="check_circle" label="Active" value={subStats.active || 0} color="bg-emerald-600" bg="bg-emerald-50" />
              <StatCard icon="cancel" label="Expired" value={subStats.expired || 0} color="bg-gray-600" bg="bg-gray-100" />
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">Recent Users</h2>
                <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              {loading ? (
                <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{['Name', 'Email', 'Phone', 'District', 'Role'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {usersList.slice(0, 5).map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                                {(u.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-gray-800">{u.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.phone || u.mobileNumber || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.district || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {u.role || 'USER'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-base font-black text-gray-800">
                All Registered Users
                <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-lg">{filteredUsers.length}</span>
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:w-64 flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                  <input type="text" placeholder="Search name, email, district..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none text-gray-800 placeholder-gray-400" />
                </div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                  className="text-xs font-bold bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none text-gray-700">
                  <option value="ALL">All Roles</option>
                  <option value="USER">User/Farmer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500">Loading users from database...</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-center">
                <div>
                  <span className="material-symbols-outlined text-4xl text-gray-300">group_off</span>
                  <p className="text-sm font-bold text-gray-400 mt-2">No users found</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['#', 'User', 'Email', 'Phone', 'Location', 'Role', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u, idx) => (
                      <tr key={u.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold flex-shrink-0">
                              {(u.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{u.name || 'N/A'}</p>
                              <p className="text-[10px] text-gray-400">{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{u.email || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{u.phone || u.mobileNumber || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{[u.village, u.district, u.stateRegion].filter(Boolean).join(', ') || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {u.role || 'USER'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteUser(u.id)} disabled={deletingId === u.id || u.role === 'ADMIN'}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title={u.role === 'ADMIN' ? 'Cannot delete Admin' : 'Delete User'}>
                            {deletingId === u.id
                              ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                              : <span className="material-symbols-outlined text-sm">delete</span>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── FARMS TAB ── */}
        {activeTab === 'farms' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-800">All Farms <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-lg">{farmsList.length}</span></h2>
            </div>
            {loading ? <div className="p-6 text-center text-gray-400 text-sm">Loading...</div> :
              farmsList.length === 0 ? <div className="p-10 text-center text-gray-400">No farms found</div> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['#', 'Farm ID', 'Owner ID', 'Crop', 'Area', 'Location', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {farmsList.map((f, idx) => (
                      <tr key={f.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 font-mono">{f.id || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 font-mono">{f.userId || f.ownerId || '—'}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{f.crop || f.cropType || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{f.area || f.size || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{f.location || f.address || '—'}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteFarm(f.id)} disabled={deletingId === f.id}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            {deletingId === f.id
                              ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                              : <span className="material-symbols-outlined text-sm">delete</span>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CROPS TAB ── */}
        {activeTab === 'crops' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-800">All Crops <span className="ml-2 bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-lg">{cropsList.length}</span></h2>
            </div>
            {loading ? <div className="p-6 text-center text-gray-400 text-sm">Loading...</div> :
              cropsList.length === 0 ? <div className="p-10 text-center text-gray-400">No crops found</div> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['#', 'Crop Name', 'Category', 'Farm ID', 'Sowing Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cropsList.map((c, idx) => (
                      <tr key={c.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{c.name || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.category || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{c.farmId || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.sowingDate || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
                            c.status === 'HARVESTED' ? 'bg-gray-100 text-gray-600' :
                            c.status === 'GROWING' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{c.status || 'UNKNOWN'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteCrop(c.id)} disabled={deletingId === c.id}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            {deletingId === c.id
                              ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                              : <span className="material-symbols-outlined text-sm">delete</span>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SUBSCRIPTIONS TAB ── */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {/* Sub Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="card_membership" label="Total" value={subStats.total || 0} color="bg-indigo-600" bg="bg-indigo-50" />
              <StatCard icon="hourglass_top" label="Trial" value={subStats.trial || 0} color="bg-yellow-600" bg="bg-yellow-50" />
              <StatCard icon="check_circle" label="Active" value={subStats.active || 0} color="bg-emerald-600" bg="bg-emerald-50" />
              <StatCard icon="cancel" label="Expired" value={subStats.expired || 0} color="bg-gray-600" bg="bg-gray-100" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">Business Subscriptions
                  <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-lg">{subscriptionsList.length}</span>
                </h2>
                <button onClick={() => setShowSubForm(v => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Subscription
                </button>
              </div>

              {/* Create Subscription Form */}
              {showSubForm && (
                <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                  <h3 className="text-sm font-black text-gray-800 mb-3">New Business Subscription</h3>
                  {subFormError && <p className="text-red-600 text-xs mb-2">{subFormError}</p>}
                  <form onSubmit={handleCreateSub} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase mb-1 block">Business Name *</label>
                      <input type="text" required value={subForm.businessName} onChange={e => setSubForm(p => ({ ...p, businessName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. Green Farms Co." />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase mb-1 block">User Email</label>
                      <input type="email" value={subForm.userEmail} onChange={e => setSubForm(p => ({ ...p, userEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="user@email.com" />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase mb-1 block">Plan</label>
                      <select value={subForm.plan} onChange={e => setSubForm(p => ({ ...p, plan: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="FREE_TRIAL">Free Trial (30 days)</option>
                        <option value="BASIC">Basic</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="ENTERPRISE">Enterprise</option>
                      </select>
                    </div>
                    <div className="col-span-full flex gap-2">
                      <button type="submit" className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition-all">
                        Create Subscription
                      </button>
                      <button type="button" onClick={() => setShowSubForm(false)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? <div className="p-6 text-center text-gray-400">Loading...</div> :
                subscriptionsList.length === 0 ? (
                  <div className="p-10 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200">card_membership</span>
                    <p className="text-sm text-gray-400 mt-2 font-bold">No subscriptions yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Subscription" to get started.</p>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>{['#', 'Business', 'User', 'Plan', 'Start Date', 'Expiry Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subscriptionsList.map((s, idx) => (
                        <tr key={s.id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-gray-800">{s.businessName || '—'}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700">{s.userName || '—'}</p>
                            <p className="text-[10px] text-gray-400">{s.userEmail || ''}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
                              s.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                              s.plan === 'PREMIUM' ? 'bg-blue-100 text-blue-700' :
                              s.plan === 'BASIC' ? 'bg-teal-100 text-teal-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>{s.plan || 'FREE_TRIAL'}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.startDate || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.expiryDate || '—'}</td>
                          <td className="px-4 py-3"><StatusBadge status={s.status || s.computeStatus?.() || '—'} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleToggleSub(s.id)} title={s.active ? 'Deactivate' : 'Activate'}
                                className={`p-1.5 rounded-lg transition-all ${s.active ? 'text-orange-400 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}>
                                <span className="material-symbols-outlined text-sm">{s.active ? 'pause_circle' : 'play_circle'}</span>
                              </button>
                              <button onClick={() => handleDeleteSub(s.id)} disabled={deletingId === s.id}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                {deletingId === s.id
                                  ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                                  : <span className="material-symbols-outlined text-sm">delete</span>}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="max-w-lg">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-green-700 to-green-500 px-6 py-8 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-black border-2 border-white/40">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-black text-xl">{adminName}</p>
                  <p className="text-green-100 text-sm">{adminEmail}</p>
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded mt-1 inline-block">ADMIN</span>
                </div>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</span>
                  <span className="text-sm font-semibold text-gray-800">{adminName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</span>
                  <span className="text-sm font-semibold text-gray-800">{adminEmail}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role</span>
                  <span className="text-sm font-bold text-red-600">ADMIN</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Users Managed</span>
                  <span className="text-sm font-semibold text-gray-800">{stats.totalUsers}</span>
                </div>
                <button onClick={onLogout} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all">
                  <span className="material-symbols-outlined text-base">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;