import { Applicative3C2 } from "fp-ts/es6/Applicative";
import { Either } from "fp-ts/lib/Either.js";
import type { Option } from "fp-ts/lib/Option.js";
import { Pointed3 } from "fp-ts/lib/Pointed";
import type { Semigroup } from "fp-ts/lib/Semigroup.js";
import { Unit, unit } from "./Unit.js";
export { _Applicative3C2 } from "./Applicative3C2.js";

export type Triplex<L, E, A> = Progress<L> | Error<E> | Available<A>;

export interface Progress<L> {
  _tag: "Progress";
  progress: L;
}

export interface Error<E> {
  _tag: "Error";
  error: E;
}

export interface Available<A> {
  _tag: "Available";
  value: A;
}

declare module "fp-ts/es6/HKT" {
  interface URItoKind3<R, E, A> {
    readonly [URI]: Triplex<R, E, A>;
  }
}
declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    readonly [URI]: Triplex<R, E, A>;
  }
}

export const URI = "Triplex" as const;
export type URI = typeof URI;

/**
 * Constructs a Triplex in "available" state.
 */
export const available = <A>(value: A): Available<A> => ({
  _tag: "Available",
  value,
});

/**
 * Constructs a Triplex in "progress" state.
 */
export const progress = <L>(progress: L): Progress<L> => ({
  _tag: "Progress",
  progress,
});

/**
 * Constructs a Triplex in "error" state.
 */
export const error = <E>(error: E): Error<E> => ({ _tag: "Error", error });

/**
 * Implementation of `Pointed`'s `of` method.
 */
export const of: Pointed3<URI>["of"] = <L, E, A>(
  value: A
): Triplex<L, E, A> => ({
  _tag: "Available",
  value,
});

/**
 * Type guard. Returns `true` if the Triplex is in "available" state.
 */
export const isAvailable = <L, E, A>(m: Triplex<L, E, A>): m is Available<A> =>
  m._tag === "Available";

/**
 * Type guard. Returns `true` if the Triplex is in "error" state.
 */
export const isError = <L, E, A>(m: Triplex<L, E, A>): m is Error<E> =>
  m._tag === "Error";

/**
 * Type guard. Returns `true` if the Triplex is in "progress" state.
 */
export const isProgress = <L, E, A>(m: Triplex<L, E, A>): m is Progress<L> =>
  m._tag === "Progress";

/**
 * Pattern matches a Triplex with a mapper function for each state. This
 * variation of `fold` "`W`idens" the return types of all branches.
 */
export const foldW =
  <L, E, A, B, C, D>(
    onProgress: (progress: L) => B,
    onError: (error: E) => C,
    onAvailable: (value: A) => D
  ) =>
  (m: Triplex<L, E, A>): B | C | D =>
    isProgress(m)
      ? onProgress(m.progress)
      : isError(m)
      ? onError(m.error)
      : onAvailable(m.value);

/**
 * Pattern matches a Triplex with a mapper function for each state. Each
 * branch is expected to return the value of the same type.
 */
export const fold: <L, E, A, B>(
  onProgress: (progress: L) => B,
  onError: (error: E) => B,
  onAvailable: (value: A) => B
) => (m: Triplex<L, E, A>) => B = foldW;

/**
 * Returns a Triplex transforming function that maps the value in the
 * "available" branch.
 */
export const map =
  <A, B>(fab: (a: A) => B) =>
  <L, E>(m: Triplex<L, E, A>): Triplex<L, E, B> =>
    isAvailable(m) ? available(fab(m.value)) : m;

/**
 * Returns a Triplex transforming function that maps the error in the
 * "error" branch.
 */
export const mapError =
  <E, F>(fef: (e: E) => F) =>
  <R, A>(m: Triplex<R, E, A>): Triplex<R, F, A> =>
    isError(m) ? error(fef(m.error)) : m;

/**
 * Returns a Triplex transforming function that maps the progress in the
 * "progress" branch.
 */
export const mapProgress =
  <R, S>(frs: (e: R) => S) =>
  <E, A>(m: Triplex<R, E, A>): Triplex<S, E, A> =>
    isProgress(m) ? progress(frs(m.progress)) : m;

/**
 * Gets an `Option` whose value is the value in the "available" branch.
 */
export const getAvailable = <A>(m: Triplex<unknown, unknown, A>): Option<A> =>
  isAvailable(m) ? { _tag: "Some", value: m.value } : { _tag: "None" };

/**
 * Gets an `Option` whose value is the error in the "error" branch.
 */
export const getError = <E>(m: Triplex<unknown, E, unknown>): Option<E> =>
  isError(m) ? { _tag: "Some", value: m.error } : { _tag: "None" };

/**
 * Gets an `Option` whose value is the progress in the "progress" branch.
 */
export const getProgress = <R>(m: Triplex<R, unknown, unknown>): Option<R> =>
  isProgress(m) ? { _tag: "Some", value: m.progress } : { _tag: "None" };

/**
 * Creates an `Applicative` instance from the progress and error semigroups.
 */
export const getApplicative = <L, E>(
  Progress: Semigroup<L>,
  Error: Semigroup<E>
): Applicative3C2<URI, L, E> => ({
  of,
  map: (fa, f) => map(f)(fa),
  ap: (fab, fa) => {
    return isProgress(fa)
      ? isProgress(fab)
        ? progress(Progress.concat(fa.progress, fab.progress))
        : isError(fab)
        ? fab
        : fa
      : isError(fa)
      ? isError(fab)
        ? error(Error.concat(fa.error, fab.error))
        : fa
      : isProgress(fab)
      ? fab
      : isError(fab)
      ? fab
      : available(fab.value(fa.value));
  },
  _E: null!,
  _R: null!,
  URI,
});

/**
 * Coverts a Triplex to a nested `Either` where the outer `Right` is the
 * available value, and the outer `Left` is the "suspended" `Either`
 * (whose `Left` indicates "progress" and `Right` indicates "error").
 */
export const getAvailableOrSuspended: <R, E, A>(
  m: Triplex<R, E, A>
) => Either<Either<R, E>, A> = foldW(
  (progress) => ({ _tag: "Left", left: { _tag: "Left", left: progress } }),
  (error) => ({ _tag: "Left", left: { _tag: "Right", right: error } }),
  (value) => ({ _tag: "Right", right: value })
);

/**
 * @deprecated Use `getAvailableOrSuspended` instead.
 */
export const asEitherAvailable = getAvailableOrSuspended;

/**
 * Coverts a Triplex to a nested `Either` where the outer `Left` is the
 * progress, and the outer `Right` is the "settled" `Either` (whose
 * `Left` indicates "error" and `Right` indicates "available")
 */
export const getSettledOrProgress: <R, E, A>(
  m: Triplex<R, E, A>
) => Either<R, Either<E, A>> = foldW(
  (progress) => ({ _tag: "Left", left: progress }),
  (error) => ({ _tag: "Right", right: { _tag: "Left", left: error } }),
  (value) => ({ _tag: "Right", right: { _tag: "Right", right: value } })
);

/**
 * @deprecated Use `getSettledOrProgress` instead
 */
export const asEitherSettled = getSettledOrProgress;

/**
 * Coverts a Triplex to a nested `Either` where the outer `Left` is the
 * error, and the outer `Right` is the "infallible" `Either` (whose
 * `Left` indicates "loading" and `Right` indicates "available")
 */
export const getInfallibleOrError: <R, E, A>(
  m: Triplex<R, E, A>
) => Either<E, Either<R, A>> = foldW(
  (progress) => ({ _tag: "Right", right: { _tag: "Left", left: progress } }),
  (error) => ({ _tag: "Left", left: error }),
  (value) => ({ _tag: "Right", right: { _tag: "Right", right: value } })
);

/**
 * @deprecated Use `getInfallibleOrError` instead
 */
export const asEitherInfallible = getInfallibleOrError;

/**
 * Extracts an `Option` of a "settled" `Either` (whose `Left` indicates "error"
 * and `Right` indicates "available").
 */
export const getSettled: <E, A>(
  m: Triplex<unknown, E, A>
) => Option<Either<E, A>> = foldW(
  () => ({ _tag: "None" }),
  (error) => ({ _tag: "Some", value: { _tag: "Left", left: error } }),
  (value) => ({ _tag: "Some", value: { _tag: "Right", right: value } })
);

/**
 * Extracts an `Option` of an "infallible" `Either` (whose `Left` indicates
 * "progress" and `Right` indicates "available").
 */
export const getInfallible: <R, A>(
  m: Triplex<R, unknown, A>
) => Option<Either<R, A>> = foldW(
  (progress) => ({ _tag: "Some", value: { _tag: "Left", left: progress } }),
  () => ({ _tag: "None" }),
  (value) => ({ _tag: "Some", value: { _tag: "Right", right: value } })
);

/**
 * Extracts an `Option` of an "suspended" `Either` (whose `Left` indicates
 * "progress" and `Right` indicates "error").
 */
export const getSuspended: <R, E>(
  m: Triplex<R, E, unknown>
) => Option<Either<R, E>> = foldW(
  (progress) => ({ _tag: "Some", value: { _tag: "Left", left: progress } }),
  (error) => ({ _tag: "Some", value: { _tag: "Right", right: error } }),
  () => ({ _tag: "None" })
);

/**
 * Constructs a triplex based on an `Option` value where a `None` is regarded
 * as "progress" and a `Some` is regarded as "available".
 */
export const fromOptionInfallible = <A>(
  value: Option<A>
): Triplex<Unit, Unit, A> =>
  value._tag === "None" ? progress(unit) : available(value.value);

/**
 * Constructs a triplex based on an `Option` value where a `None` is regarded
 * as "error" and a `Some` is regarded as "available".
 */
export const fromOptionSettled = <A>(
  value: Option<A>
): Triplex<Unit, Unit, A> =>
  value._tag === "None" ? progress(unit) : available(value.value);

/**
 * Constructs a triplex based on an `Option` value where a `None` is regarded
 * as "progress" and a `Some` is regarded as "error".
 */
export const fromOptionSuspended = <E>(
  value: Option<E>
): Triplex<Unit, E, Unit> =>
  value._tag === "None" ? progress(unit) : error(value.value);

/**
 * Constructs a triplex based on an `Option` of a "settled" `Either`, where
 * `Left` is regarded as "error" and `Right` is regarded as "available". The
 * outer `None` indicates progress.
 */
export const fromOptionalSettled = <E, A>(
  value: Option<Either<E, A>>
): Triplex<Unit, E, A> =>
  value._tag === "None"
    ? progress(unit)
    : value.value._tag === "Left"
    ? error(value.value.left)
    : available(value.value.right);

/**
 * Constructs a triplex based on an `Option` of a "infallible" `Either`, where
 * `Left` is regarded as "progress" and `Right` is regarded as "available". The
 * outer `None` indicates error.
 */
export const fromOptionalInfallible = <R, A>(
  value: Option<Either<R, A>>
): Triplex<R, Unit, A> =>
  value._tag === "None"
    ? error(unit)
    : value.value._tag === "Left"
    ? progress(value.value.left)
    : available(value.value.right);

/**
 * Constructs a triplex based on an `Option` of a "suspended" `Either`, where
 * `Left` is regarded as "progress" and `Right` is regarded as "error". The
 * outer `None` indicates available.
 */
export const fromOptionalSuspended = <R, E>(
  value: Option<Either<R, E>>
): Triplex<R, E, Unit> =>
  value._tag === "None"
    ? available(unit)
    : value.value._tag === "Left"
    ? progress(value.value.left)
    : error(value.value.right);

/**
 * Constructs a triplex based on a "settled" `Either`, whose `Left` is an "error"
 * and right is "available".
 */
export const fromSettled = <E, A>(value: Either<E, A>): Triplex<Unit, E, A> =>
  value._tag === "Left" ? error(value.left) : available(value.right);

/**
 * Constructs a triplex based on an "infallible" `Either`, whose `Left` is a
 * "progress" and right is "available".
 */
export const fromInfallible = <R, A>(
  value: Either<R, A>
): Triplex<R, Unit, A> =>
  value._tag === "Left" ? progress(value.left) : available(value.right);

/**
 * Constructs a triplex based on an "suspended" `Either`, whose `Left` is a
 * "progress" and right is "error".
 */
export const fromSuspended = <R, E>(value: Either<R, E>): Triplex<R, E, Unit> =>
  value._tag === "Left" ? progress(value.left) : error(value.right);
