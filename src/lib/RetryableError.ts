import { Semigroup } from "fp-ts/lib/Semigroup.js";

export interface RetryableError {
  isRetryable: boolean;
}

export const semigroup: Semigroup<RetryableError> = {
  concat: (a, b) => retryableError(a.isRetryable && b.isRetryable),
};

export const retryableError = (isRetryable: boolean): RetryableError => ({
  isRetryable,
});
