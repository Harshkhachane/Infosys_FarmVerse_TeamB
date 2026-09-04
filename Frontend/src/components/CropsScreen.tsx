import React, { useState, useEffect } from 'react';
import { Crop, Farm, UserProfile } from '../types';
import { t } from '../utils/translations';
import { 
  fetchAllCrops, 
  createCrop, 
  updateCrop, 
  deleteCrop 
} from '../service/api';

interface CropsScreenProps {
  profile: UserProfile;
  farms: Farm[];
  onNavigate: (screen: string) => void;
  onMenuClick?: () => void;
}

export default function CropsScreen({
  profile,
  farms,
  onNavigate,
  onMenuClick
}: CropsScreenProps) {
  const lang = profile.preferredLanguage;
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and view states
  const [selectedFarmFilter, setSelectedFarmFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [formFarmId, setFormFarmId] = useState('');
  const [formName, setFormName] = useState('Wheat');
  const [formCategory, setFormCategory] = useState('Grain');
  const [formSowingDate, setFormSowingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState('PLANTED'); // PLANTED, GROWING, HARVESTED

  // Detail View State
  const [selectedCropDetails, setSelectedCropDetails] = useState<Crop | null>(null);

  // Load all crops
  const loadCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllCrops();
      if (Array.isArray(data)) {
        setCrops(data);
      } else {
        setCrops([]);
      }
    } catch (err: any) {
      console.error("Failed to load crops:", err);
      setError("Unable to connect to the backend server. Operating locally.");
      // Fallback local crops for testing if api fails
      setCrops([
        { id: 'crop-1', farmId: farms[0]?.id || 'farm-1', name: 'Tomato', category: 'Vegetable', sowingDate: '2026-04-10', status: 'GROWING' },
        { id: 'crop-2', farmId: farms[1]?.id || 'farm-2', name: 'Wheat', category: 'Grain', sowingDate: '2025-11-15', status: 'HARVESTED' },
        { id: 'crop-3', farmId: farms[0]?.id || 'farm-1', name: 'Okra', category: 'Vegetable', sowingDate: '2026-05-20', status: 'PLANTED' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  // Set default farm when form opens
  useEffect(() => {
    if (farms.length > 0 && !formFarmId) {
      setFormFarmId(farms[0].id);
    }
  }, [farms]);

  // Handle Form Submit (Add/Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFarmId) {
      alert("Please select a Farm to link this crop to.");
      return;
    }
    const cropPayload: Omit<Crop, 'id'> = {
      farmId: formFarmId,
      name: formName,
      category: formCategory,
      sowingDate: formSowingDate,
      status: formStatus
    };

    try {
      if (editingCrop && editingCrop.id) {
        const updated = await updateCrop(editingCrop.id, { ...cropPayload, id: editingCrop.id });
        if (updated) {
          setCrops(prev => prev.map(c => c.id === editingCrop.id ? updated : c));
        }
      } else {
        const saved = await createCrop(cropPayload);
        if (saved) {
          setCrops(prev => [saved, ...prev]);
        }
      }
      setIsFormOpen(false);
      setEditingCrop(null);
      resetForm();
    } catch (err) {
      console.error("Failed to save crop:", err);
      alert("Failed to save crop details. Operating locally.");
      // Fallback local save
      const mockId = editingCrop?.id || `crop-mock-${Date.now()}`;
      const mockSaved = { id: mockId, ...cropPayload };
      if (editingCrop) {
        setCrops(prev => prev.map(c => c.id === editingCrop.id ? mockSaved : c));
      } else {
        setCrops(prev => [mockSaved, ...prev]);
      }
      setIsFormOpen(false);
      setEditingCrop(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormFarmId(farms[0]?.id || '');
    setFormName('Wheat');
    setFormCategory('Grain');
    setFormSowingDate(new Date().toISOString().split('T')[0]);
    setFormStatus('PLANTED');
  };

  const handleEditClick = (crop: Crop) => {
    setEditingCrop(crop);
    setFormFarmId(crop.farmId);
    setFormName(crop.name);
    setFormCategory(crop.category);
    setFormSowingDate(crop.sowingDate);
    setFormStatus(crop.status);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (cropId: string) => {
    if (!window.confirm("Are you sure you want to delete this crop record?")) return;
    try {
      await deleteCrop(cropId);
      setCrops(prev => prev.filter(c => c.id !== cropId));
      if (selectedCropDetails?.id === cropId) {
        setSelectedCropDetails(null);
      }
    } catch (err) {
      console.error("Failed to delete crop:", err);
      // Local delete fallback
      setCrops(prev => prev.filter(c => c.id !== cropId));
    }
  };

  // Filter crops
  const filteredCrops = crops.filter(c => {
    const matchesFarm = selectedFarmFilter === 'All' || c.farmId === selectedFarmFilter;
    const matchesStatus = selectedStatusFilter === 'All' || c.status === selectedStatusFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFarm && matchesStatus && matchesSearch;
  });

  const getFarmName = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  return (
    <div className="min-h-screen bg-[#F9FBF8] pb-24 text-[#191c1a]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-40 border-b border-[#ecefea]">
        <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-md md:max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuClick}
              className="md:hidden w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer"
              title="Open Navigation"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <span className="material-symbols-outlined text-primary text-3xl font-bold">eco</span>
            <span className="text-xl font-bold text-primary tracking-tight">{t("My Crops & Plantations", lang)}</span>
          </div>

          <button
            onClick={() => {
              setEditingCrop(null);
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#2b5c27] text-white px-3 py-2 text-[11px] font-black uppercase tracking-wider hover:opacity-95 shadow-sm active:scale-98 transition-all"
            id="add-crop-btn"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            <span>{t("Add Crop", lang)}</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-md md:max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-6 space-y-5 pb-6">
        
        {/* Connection status banner */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-center gap-3 text-xs">
            <span className="material-symbols-outlined text-amber-600">info</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-[24px] border border-[#ecefea] shadow-xs space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-lg">
              search
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f1f4ef]/60 border border-[#c2c9bb]/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a] font-medium"
              placeholder="Search crop name or category..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">Filter by Farm</label>
              <select
                value={selectedFarmFilter}
                onChange={(e) => setSelectedFarmFilter(e.target.value)}
                className="w-full bg-[#f1f4ef] border border-[#c2c9bb]/40 rounded-xl px-2 py-2 font-bold cursor-pointer text-[#42493e]"
              >
                <option value="All">All Farms</option>
                {farms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black text-[#72796e] uppercase tracking-wider mb-1">Filter by Status</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full bg-[#f1f4ef] border border-[#c2c9bb]/40 rounded-xl px-2 py-2 font-bold cursor-pointer text-[#42493e]"
              >
                <option value="All">All Statuses</option>
                <option value="PLANTED">Planted</option>
                <option value="GROWING">Growing</option>
                <option value="HARVESTED">Harvested</option>
              </select>
            </div>
          </div>
        </div>

        {/* Crops List Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-xs font-bold text-[#72796e] mt-4">Loading crop plantation records...</p>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#ecefea] rounded-[32px] shadow-sm">
            <span className="material-symbols-outlined text-[#72796e] text-5xl">nature_people</span>
            <h4 className="text-sm font-bold text-[#191c1a] mt-3">No crops registered yet</h4>
            <p className="text-xs text-[#72796e] max-w-xs mx-auto mt-1 leading-relaxed">
              Register crop cycles mapped to your fields to monitor their health, yield, and schedules.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 bg-[#2b5c27] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Add Your First Crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredCrops.map(crop => (
              <div 
                key={crop.id}
                className="bg-white rounded-3xl border border-[#ecefea] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase bg-[#EBF5EB] text-[#2b5c27] border border-primary/10">
                      {crop.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      crop.status === 'HARVESTED' 
                        ? 'bg-gray-100 text-gray-700' 
                        : crop.status === 'GROWING' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-yellow-50 text-yellow-850 border border-yellow-150'
                    }`}>
                      {crop.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#191c1a] tracking-tight">{crop.name}</h3>
                  <p className="text-xs text-primary font-bold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">agriculture</span>
                    <span>{getFarmName(crop.farmId)}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#f1f4ef] grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[#72796e] font-bold block uppercase tracking-wider">Sowing Date</span>
                      <strong className="text-[#191c1a] font-extrabold">{crop.sowingDate}</strong>
                    </div>
                    <div>
                      <span className="text-[#72796e] font-bold block uppercase tracking-wider">Season</span>
                      <strong className="text-[#191c1a] font-extrabold">Kharif</strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-5 pt-2">
                  <button
                    onClick={() => setSelectedCropDetails(crop)}
                    className="flex-1 bg-[#f1f4ef] text-primary hover:bg-[#e4e9e1] py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">info</span>
                    Details
                  </button>
                  <button
                    onClick={() => handleEditClick(crop)}
                    className="p-2 bg-[#f1f4ef] hover:bg-[#e4e9e1] rounded-xl text-[#72796e] hover:text-primary cursor-pointer flex items-center justify-center"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(crop.id!)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 cursor-pointer flex items-center justify-center"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Crop Detail View */}
        {selectedCropDetails && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative shadow-2xl">
              <button 
                onClick={() => setSelectedCropDetails(null)}
                className="absolute top-4 right-4 text-[#72796e] hover:text-black cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="text-center pb-2 border-b border-[#f1f4ef]">
                <span className="material-symbols-outlined text-5xl text-primary mb-1">eco</span>
                <h3 className="text-lg font-black">{selectedCropDetails.name}</h3>
                <p className="text-xs text-primary font-bold">{getFarmName(selectedCropDetails.farmId)}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f1f4ef]/50">
                  <span className="text-[#72796e] font-semibold">Category</span>
                  <span className="font-extrabold text-[#191c1a]">{selectedCropDetails.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f4ef]/50">
                  <span className="text-[#72796e] font-semibold">Sowing Date</span>
                  <span className="font-extrabold text-[#191c1a]">{selectedCropDetails.sowingDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f4ef]/50">
                  <span className="text-[#72796e] font-semibold">Planted Status</span>
                  <span className="font-extrabold text-[#191c1a] uppercase">{selectedCropDetails.status}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#72796e] font-semibold">Water Requirement</span>
                  <span className="font-extrabold text-[#2b5c27]">Moderate (Standard)</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCropDetails(null)}
                className="w-full bg-[#2b5c27] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Close details
              </button>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Crop Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <form 
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl"
            >
              <h3 className="text-lg font-black tracking-tight border-b border-[#f1f4ef] pb-3">
                {editingCrop ? "Edit Crop Plantation" : "Add New Crop Plantation"}
              </h3>

              <div className="space-y-3.5">
                {/* Farm selection */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider mb-1">Select Farm Field</label>
                  <select
                    value={formFarmId}
                    onChange={(e) => setFormFarmId(e.target.value)}
                    required
                    className="w-full bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl px-3 py-2.5 text-xs font-bold text-[#191c1a] focus:outline-none"
                  >
                    <option value="" disabled>Choose a farm field</option>
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Crop Name */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider mb-1">Crop Name</label>
                  <select
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      // Auto categories
                      if (['Tomato', 'Potato', 'Okra', 'Chilli'].includes(e.target.value)) setFormCategory('Vegetable');
                      else if (['Sugarcane', 'Cotton'].includes(e.target.value)) setFormCategory('Cash Crop');
                      else setFormCategory('Grain');
                    }}
                    className="w-full bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl px-3 py-2.5 text-xs font-bold text-[#191c1a]"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Corn">Corn</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Okra">Okra</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider mb-1">Category</label>
                  <input 
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a]"
                    placeholder="e.g. Grain, Vegetable"
                  />
                </div>

                {/* Sowing Date */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider mb-1">Sowing Date</label>
                  <input 
                    type="date"
                    required
                    value={formSowingDate}
                    onChange={(e) => setFormSowingDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary text-[#191c1a]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#72796e] uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-[#f1f4ef] border border-[#c2c9bb] rounded-xl px-3 py-2.5 text-xs font-bold text-[#191c1a]"
                  >
                    <option value="PLANTED">Planted</option>
                    <option value="GROWING">Growing</option>
                    <option value="HARVESTED">Harvested</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingCrop(null);
                  }}
                  className="w-1/3 bg-white hover:bg-gray-50 border border-[#ecefea] text-[#42493e] py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-[#2b5c27] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
                >
                  Save Plantation
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Bottom Menu Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#ecefea] z-40 md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">home</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
          </button>
          
          <button 
            onClick={() => onNavigate('map')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">agriculture</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Farms</span>
          </button>
          
          <button 
            onClick={() => onNavigate('crops')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#2b5c27] font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[26px]">eco</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">Crops</span>
          </button>
          
          <button 
            onClick={() => onNavigate('market')}
            className="flex flex-col items-center justify-center gap-0.5 text-[#42493e] hover:text-[#2b5c27] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">storefront</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase">Market</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
