import type { Laptop, Criteria } from '../lib/database.types';

export interface RankedLaptop extends Laptop {
  score: number;
  rank: number;
  normalizedValues: Record<string, number>;
}

export function calculateSAW(
  laptops: Laptop[],
  criteria: Criteria[]
): RankedLaptop[] {
  if (laptops.length === 0 || criteria.length === 0) {
    return [];
  }

  const normalizedMatrix: Record<string, Record<string, number>> = {};

  criteria.forEach((criterion) => {
    const attribute = criterion.attribute as keyof Laptop;
    const values = laptops.map((laptop) => Number(laptop[attribute]));

    if (criterion.type === 'benefit') {
      const maxValue = Math.max(...values);
      laptops.forEach((laptop, index) => {
        if (!normalizedMatrix[laptop.id]) {
          normalizedMatrix[laptop.id] = {};
        }
        normalizedMatrix[laptop.id][attribute] =
          Number(laptop[attribute]) / maxValue;
      });
    } else {
      const minValue = Math.min(...values);
      laptops.forEach((laptop, index) => {
        if (!normalizedMatrix[laptop.id]) {
          normalizedMatrix[laptop.id] = {};
        }
        normalizedMatrix[laptop.id][attribute] =
          minValue / Number(laptop[attribute]);
      });
    }
  });

  const rankedLaptops: RankedLaptop[] = laptops.map((laptop) => {
    let score = 0;
    criteria.forEach((criterion) => {
      const attribute = criterion.attribute as keyof Laptop;
      score += criterion.weight * normalizedMatrix[laptop.id][attribute];
    });

    return {
      ...laptop,
      score: Math.round(score * 10000) / 10000,
      rank: 0,
      normalizedValues: normalizedMatrix[laptop.id],
    };
  });

  rankedLaptops.sort((a, b) => b.score - a.score);

  rankedLaptops.forEach((laptop, index) => {
    laptop.rank = index + 1;
  });

  return rankedLaptops;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}
