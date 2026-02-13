import { Trophy, Medal, Award } from 'lucide-react';
import type { RankedLaptop } from '../utils/saw';
import type { Criteria } from '../lib/database.types';
import { formatCurrency } from '../utils/saw';

interface RankingDisplayProps {
  rankedLaptops: RankedLaptop[];
  criteria: Criteria[];
}

export default function RankingDisplay({ rankedLaptops, criteria }: RankingDisplayProps) {
  if (rankedLaptops.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Tambahkan laptop untuk melihat hasil perhitungan SAW.
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <span className="text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Hasil Perhitungan SAW</h2>

        <div className="space-y-4">
          {rankedLaptops.map((laptop) => (
            <div
              key={laptop.id}
              className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${getRankColor(laptop.rank)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow">
                  {getRankIcon(laptop.rank)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{laptop.name}</h3>
                      <p className="text-gray-600">{laptop.brand}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Skor SAW</div>
                      <div className="text-2xl font-bold text-blue-600">{laptop.score.toFixed(4)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Harga</div>
                      <div className="font-semibold text-gray-800">{formatCurrency(laptop.price)}</div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">RAM</div>
                      <div className="font-semibold text-gray-800">{laptop.ram} GB</div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Processor</div>
                      <div className="font-semibold text-gray-800">{laptop.processor_score}</div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Storage</div>
                      <div className="font-semibold text-gray-800">{laptop.storage} GB</div>
                    </div>
                  </div>

                  <details className="cursor-pointer">
                    <summary className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Lihat Detail Normalisasi
                    </summary>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {criteria.map((criterion) => {
                        const normalizedValue = laptop.normalizedValues[criterion.attribute];
                        return (
                          <div key={criterion.id} className="bg-white bg-opacity-70 rounded p-3 border border-gray-200">
                            <div className="text-xs text-gray-600 mb-1">{criterion.name}</div>
                            <div className="font-semibold text-gray-800">
                              {normalizedValue.toFixed(4)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Bobot: {criterion.weight.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Informasi Metode SAW</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Simple Additive Weighting (SAW)</strong> adalah metode penjumlahan terbobot yang mencari penjumlahan terbobot dari rating kinerja pada setiap alternatif.
          </p>
          <p>
            Metode SAW membutuhkan proses normalisasi matriks keputusan ke suatu skala yang dapat diperbandingkan dengan semua rating alternatif yang ada.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Benefit:</strong> Semakin tinggi nilai, semakin baik (RAM, Processor, Storage, Layar)</li>
            <li><strong>Cost:</strong> Semakin rendah nilai, semakin baik (Harga)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
