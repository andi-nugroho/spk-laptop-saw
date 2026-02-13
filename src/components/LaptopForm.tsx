import { useState, useEffect } from 'react';
import type { Laptop } from '../lib/database.types';
import { X } from 'lucide-react';

interface LaptopFormProps {
  laptop?: Laptop | null;
  onSubmit: (data: Omit<Laptop, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export default function LaptopForm({ laptop, onSubmit, onCancel }: LaptopFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    ram: '',
    processor_score: '',
    storage: '',
    screen_size: '',
  });

  useEffect(() => {
    if (laptop) {
      setFormData({
        name: laptop.name,
        brand: laptop.brand,
        price: laptop.price.toString(),
        ram: laptop.ram.toString(),
        processor_score: laptop.processor_score.toString(),
        storage: laptop.storage.toString(),
        screen_size: laptop.screen_size.toString(),
      });
    }
  }, [laptop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      brand: formData.brand,
      price: Number(formData.price),
      ram: Number(formData.ram),
      processor_score: Number(formData.processor_score),
      storage: Number(formData.storage),
      screen_size: Number(formData.screen_size),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {laptop ? 'Edit Laptop' : 'Tambah Laptop Baru'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Laptop
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merk
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RAM (GB)
              </label>
              <input
                type="number"
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skor Processor (0-100)
              </label>
              <input
                type="number"
                value={formData.processor_score}
                onChange={(e) => setFormData({ ...formData, processor_score: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage (GB)
              </label>
              <input
                type="number"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukuran Layar (inch)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.screen_size}
                onChange={(e) => setFormData({ ...formData, screen_size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {laptop ? 'Update' : 'Tambah'} Laptop
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
