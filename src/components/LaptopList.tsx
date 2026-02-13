import { Edit2, Trash2 } from 'lucide-react';
import type { Laptop } from '../lib/database.types';
import { formatCurrency } from '../utils/saw';

interface LaptopListProps {
  laptops: Laptop[];
  onEdit: (laptop: Laptop) => void;
  onDelete: (id: string) => void;
}

export default function LaptopList({ laptops, onEdit, onDelete }: LaptopListProps) {
  if (laptops.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Belum ada data laptop. Tambahkan laptop untuk memulai.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Merk
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RAM
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Processor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Storage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Layar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {laptops.map((laptop) => (
            <tr key={laptop.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{laptop.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {laptop.brand}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {formatCurrency(laptop.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {laptop.ram} GB
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {laptop.processor_score}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {laptop.storage} GB
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {laptop.screen_size}"
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(laptop)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(laptop.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
