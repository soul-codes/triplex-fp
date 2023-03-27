import { Semigroup } from "fp-ts/lib/Semigroup.js";

interface WeightedProgress {
  progress: number;
  weight: number;
}

export const semigroup: Semigroup<WeightedProgress> = {
  concat: (a, b) => ({
    progress:
      (a.progress * a.weight + b.progress * b.weight) / (a.weight + b.weight),
    weight: a.weight + b.weight,
  }),
};

export const progress = (progress: number): WeightedProgress => ({
  progress,
  weight: 1,
});

export const weightedProgress = (
  progress: number,
  weight: number
): WeightedProgress => ({ progress, weight });
