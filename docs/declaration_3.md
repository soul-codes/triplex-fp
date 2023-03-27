# declaration

```ts
import { Semigroup } from "fp-ts/lib/Semigroup.js";
export interface RetryableError {
    isRetryable: boolean;
}
export declare const semigroup: Semigroup<RetryableError>;
export declare const retryableError: (isRetryable: boolean) => RetryableError;

```
