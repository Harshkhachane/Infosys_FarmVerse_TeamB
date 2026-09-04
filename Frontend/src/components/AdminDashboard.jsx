import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ profile, onLogout, onNavigate }) => {
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalFarmers: 0, totalAdmins: 0, totalFarms: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [activeTab, setActiveTab] = useState('overview');
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('http://localhost:8081/api/admin/users'),
        fetch('http://localhost:8081/api/admin/stats')
      ]);
      if (!usersRes.ok || !statsRes.ok) throw new Error('Failed to fetch admin data');
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      setUsersList(usersData);
      setStats(statsData);
    } catch (err) {
      setError('Could not connect to backend. Please ensure the Spring Boot server is running on port 8081.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`http://localhost:8081/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          totalFarmers: usersList.find(u => u.id === userId)?.role !== 'ADMIN'
            ? prev.totalFarmers - 1 : prev.totalFarmers,
          totalAdmins: usersList.find(u => u.id === userId)?.role === 'ADMIN'
            ? prev.totalAdmins - 1 : prev.totalAdmins,
        }));
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    } finally {
      setDeletingId(null);
    }
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

  const StatCard = ({ icon, label, value, color, bg }) => (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-white/60`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-2xl text-white">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center">
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
              <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                ADMIN
              </span>
            </div>
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
              title="Refresh Data"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
            >
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
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'users', label: 'Users', icon: 'group' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-24" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="group" label="Total Users" value={stats.totalUsers} color="bg-blue-600" bg="bg-blue-50" />
                <StatCard icon="agriculture" label="Farmers" value={stats.totalFarmers} color="bg-green-700" bg="bg-green-50" />
                <StatCard icon="admin_panel_settings" label="Admins" value={stats.totalAdmins} color="bg-red-600" bg="bg-red-50" />
                <StatCard icon="landscape" label="Total Farms" value={stats.totalFarms} color="bg-amber-600" bg="bg-amber-50" />
              </div>
            )}

            {/* Quick User Table Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">Recent Users</h2>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
                >
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              {loading ? (
                <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Name', 'Email', 'Phone', 'District', 'Role'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
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
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
                              u.role === 'ADMIN'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>{u.role || 'USER'}</span>
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-base font-black text-gray-800">
                All Registered Users
                <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-lg">
                  {filteredUsers.length}
                </span>
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:w-64 flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Search name, email, district..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="text-xs font-bold bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl outline-none text-gray-700"
                >
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
                    <tr>
                      {['#', 'User', 'Email', 'Phone', 'Location', 'Role', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
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
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {[u.village, u.district, u.stateRegion].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
                            u.role === 'ADMIN'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>{u.role || 'USER'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deletingId === u.id || u.role === 'ADMIN'}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title={u.role === 'ADMIN' ? 'Cannot delete Admin' : 'Delete User'}
                          >
                            {deletingId === u.id
                              ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                              : <span className="material-symbols-outlined text-sm">delete</span>
                            }
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
      </div>
    </div>
  );
};

export default AdminDashboard;