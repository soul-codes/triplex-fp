import { Applicative3C2 } from "fp-ts/es6/Applicative";
import { Either } from "fp-ts/lib/Either.js";
import type { Option } from "fp-ts/lib/Option.js";
import { Pointed3 } from "fp-ts/lib/Pointed";
import type { Semigroup } from "fp-ts/lib/Semigroup.js";
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
 * available value, and the outer `Left` is an `Either` whose `Left` is the
 * progress, and whose `Right` is the error. Useful if mostly interested in the
 * available value.
 */
export const asEitherAvailable: <R, E, A>(
  m: Triplex<R, E, A>
) => Either<Either<R, E>, A> = foldW(
  (progress) => ({
    _tag: "Left",
    left: { _tag: "Left", left: progress },
  }),
  (error) => ({
    _tag: "Left",
    left: { _tag: "Right", right: error },
  }),
  (value) => ({ _tag: "Right", right: value })
);

/**
 * Coverts a Triplex to a nested `Either` where the outer `Left` is the
 * progress, and the outer `Right` is an `Either` whose `Left` is the
 * error, and whose `Right` is the value. Useful if mostly interested in the
 * "settled" case of either an available value or an error.
 */
export const asEitherSettled: <R, E, A>(
  m: Triplex<R, E, A>
) => Either<R, Either<E, A>> = foldW(
  (progress) => ({
    _tag: "Left",
    left: progress,
  }),
  (error) => ({
    _tag: "Right",
    right: { _tag: "Left", left: error },
  }),
  (value) => ({ _tag: "Right", right: { _tag: "Right", right: value } })
);

/**
 * Coverts a Triplex to a nested `Either` where the outer `Left` is the
 * error, and the outer `Right` is an `Either` whose `Left` is the
 * progress, and whose `Right` is the value. Useful if mostly interested in the
 * "infallible" case of either an available value or a progress.
 */
export const asEitherInfallible: <R, E, A>(
  m: Triplex<R, E, A>
) => Either<E, Either<R, A>> = foldW(
  (progress) => ({
    _tag: "Right",
    right: { _tag: "Left", left: progress },
  }),
  (error) => ({
    _tag: "Left",
    left: error,
  }),
  (value) => ({ _tag: "Right", right: { _tag: "Right", right: value } })
);

/**
 * Coverts a Triplex to an `Option` whose `Some` value is the
 * "settled" case of `Either` and available value or an error.
 */
export const asOptionSettled: <R, E, A>(
  m: Triplex<R, E, A>
) => Option<Either<E, A>> = foldW(
  () => ({
    _tag: "None",
  }),
  (error) => ({
    _tag: "Some",
    value: { _tag: "Left", left: error },
  }),
  (value) => ({ _tag: "Some", value: { _tag: "Right", right: value } })
);

/**
 * Coverts a Triplex to an `Option` whose `Some` value is the
 * "infallible" case of `Either` and available value or a progress.
 */
export const asOptionInfallible: <R, E, A>(
  m: Triplex<R, E, A>
) => Option<Either<R, A>> = foldW(
  (progress) => ({
    _tag: "Some",
    value: { _tag: "Left", left: progress },
  }),
  () => ({
    _tag: "None",
  }),
  (value) => ({ _tag: "Some", value: { _tag: "Right", right: value } })
);
