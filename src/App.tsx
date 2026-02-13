import { useState, useEffect } from 'react';
import { Laptop, Settings, TrendingUp, PlusCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Laptop as LaptopType, Criteria } from './lib/database.types';
import { calculateSAW, type RankedLaptop } from './utils/saw';
import LaptopForm from './components/LaptopForm';
import LaptopList from './components/LaptopList';
import CriteriaConfig from './components/CriteriaConfig';
import RankingDisplay from './components/RankingDisplay';

type TabType = 'laptops' | 'criteria' | 'ranking';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('laptops');
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [rankedLaptops, setRankedLaptops] = useState<RankedLaptop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState<LaptopType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (laptops.length > 0 && criteria.length > 0) {
      const ranked = calculateSAW(laptops, criteria);
      setRankedLaptops(ranked);
    }
  }, [laptops, criteria]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [laptopsRes, criteriaRes] = await Promise.all([
        supabase.from('laptops').select('*').order('created_at', { ascending: false }),
        supabase.from('criteria').select('*').order('attribute'),
      ]);

      if (laptopsRes.error) throw laptopsRes.error;
      if (criteriaRes.error) throw criteriaRes.error;

      setLaptops(laptopsRes.data || []);
      setCriteria(criteriaRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLaptop = async (data: Omit<LaptopType, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('laptops').insert([data]);

      if (error) throw error;

      await fetchData();
      setShowForm(false);
      alert('Laptop berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding laptop:', error);
      alert('Terjadi kesalahan saat menambahkan laptop');
    }
  };

  const handleUpdateLaptop = async (data: Omit<LaptopType, 'id' | 'created_at'>) => {
    if (!editingLaptop) return;

    try {
      const { error } = await supabase
        .from('laptops')
        .update(data)
        .eq('id', editingLaptop.id);

      if (error) throw error;

      await fetchData();
      setShowForm(false);
      setEditingLaptop(null);
      alert('Laptop berhasil diupdate!');
    } catch (error) {
      console.error('Error updating laptop:', error);
      alert('Terjadi kesalahan saat mengupdate laptop');
    }
  };

  const handleDeleteLaptop = async (id: string) => {
    if (!confirm('Yakin ingin menghapus laptop ini?')) return;

    try {
      const { error } = await supabase.from('laptops').delete().eq('id', id);

      if (error) throw error;

      await fetchData();
      alert('Laptop berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting laptop:', error);
      alert('Terjadi kesalahan saat menghapus laptop');
    }
  };

  const handleUpdateCriteria = async (updatedCriteria: Criteria[]) => {
    try {
      const updates = updatedCriteria.map((c) =>
        supabase
          .from('criteria')
          .update({ weight: c.weight })
          .eq('id', c.id)
      );

      await Promise.all(updates);
      await fetchData();
      alert('Bobot kriteria berhasil diupdate!');
    } catch (error) {
      console.error('Error updating criteria:', error);
      alert('Terjadi kesalahan saat mengupdate kriteria');
    }
  };

  const handleEditLaptop = (laptop: LaptopType) => {
    setEditingLaptop(laptop);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLaptop(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Laptop className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">SPK Pemilihan Laptop</h1>
              <p className="text-gray-600">Metode Simple Additive Weighting (SAW)</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex gap-2 bg-white rounded-lg shadow p-2">
            <button
              onClick={() => setActiveTab('laptops')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'laptops'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Laptop size={20} />
              Data Laptop
            </button>
            <button
              onClick={() => setActiveTab('criteria')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'criteria'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={20} />
              Kriteria
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'ranking'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={20} />
              Hasil Ranking
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {activeTab === 'laptops' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Data Laptop</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Tambah Laptop
                </button>
              </div>
              <LaptopList
                laptops={laptops}
                onEdit={handleEditLaptop}
                onDelete={handleDeleteLaptop}
              />
            </div>
          )}

          {activeTab === 'criteria' && (
            <CriteriaConfig criteria={criteria} onUpdate={handleUpdateCriteria} />
          )}

          {activeTab === 'ranking' && (
            <RankingDisplay rankedLaptops={rankedLaptops} criteria={criteria} />
          )}
        </div>
      </div>

      {showForm && (
        <LaptopForm
          laptop={editingLaptop}
          onSubmit={editingLaptop ? handleUpdateLaptop : handleAddLaptop}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
