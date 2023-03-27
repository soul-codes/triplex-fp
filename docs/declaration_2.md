# declaration

```ts
import { Semigroup } from "fp-ts/lib/Semigroup.js";
interface WeightedProgress {
    progress: number;
    weight: number;
}
export declare const semigroup: Semigroup<WeightedProgress>;
export declare const progress: (progress: number) => WeightedProgress;
export declare const weightedProgress: (progress: number, weight: number) => WeightedProgress;
export {};

```
