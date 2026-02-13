import { useState, useEffect } from 'react';
import type { Criteria } from '../lib/database.types';
import { Save } from 'lucide-react';

interface CriteriaConfigProps {
  criteria: Criteria[];
  onUpdate: (criteriaList: Criteria[]) => void;
}

export default function CriteriaConfig({ criteria, onUpdate }: CriteriaConfigProps) {
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    const initialWeights: Record<string, number> = {};
    let total = 0;
    criteria.forEach((c) => {
      initialWeights[c.id] = c.weight;
      total += c.weight;
    });
    setWeights(initialWeights);
    setTotalWeight(total);
  }, [criteria]);

  const handleWeightChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newWeights = { ...weights, [id]: numValue };
    setWeights(newWeights);

    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    setTotalWeight(total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Math.abs(totalWeight - 1) > 0.001) {
      alert('Total bobot harus sama dengan 1.0');
      return;
    }

    const updatedCriteria = criteria.map((c) => ({
      ...c,
      weight: weights[c.id],
    }));

    onUpdate(updatedCriteria);
  };

  const isValid = Math.abs(totalWeight - 1) <= 0.001;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Konfigurasi Kriteria</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {criterion.name}
                </label>
                <span className={`text-xs px-2 py-1 rounded ${
                  criterion.type === 'benefit'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weights[criterion.id] || 0}
                onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bobot: {((weights[criterion.id] || 0) * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-lg ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Bobot:</span>
            <span className={`font-bold text-lg ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight.toFixed(2)} {isValid ? '✓' : '✗'}
            </span>
          </div>
          {!isValid && (
            <p className="text-sm text-red-600 mt-2">
              Total bobot harus sama dengan 1.0
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Simpan Bobot Kriteria
        </button>
      </form>
    </div>
  );
}
