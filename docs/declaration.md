# declaration

```ts
import type { Applicative3C2 } from "fp-ts/lib/Applicative.js";
import { Either } from "fp-ts/lib/Either.js";
import type { Option } from "fp-ts/lib/Option.js";
import { Pointed3 } from "fp-ts/lib/Pointed";
import type { Semigroup } from "fp-ts/lib/Semigroup.js";
export declare type Triplex<L, E, A> = Progress<L> | Error<E> | Available<A>;
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
export declare const URI: "Triplex";
export declare type URI = typeof URI;
/**
 * Constructs a Triplex in "available" state.
 */
export declare const available: <A>(value: A) => Available<A>;
/**
 * Constructs a Triplex in "progress" state.
 */
export declare const progress: <L>(progress: L) => Progress<L>;
/**
 * Constructs a Triplex in "error" state.
 */
export declare const error: <E>(error: E) => Error<E>;
/**
 * Implementation of `Pointed`'s `of` method.
 */
export declare const of: Pointed3<URI>["of"];
/**
 * Type guard. Returns `true` if the Triplex is in "available" state.
 */
export declare const isAvailable: <L, E, A>(m: Triplex<L, E, A>) => m is Available<A>;
/**
 * Type guard. Returns `true` if the Triplex is in "error" state.
 */
export declare const isError: <L, E, A>(m: Triplex<L, E, A>) => m is Error<E>;
/**
 * Type guard. Returns `true` if the Triplex is in "progress" state.
 */
export declare const isProgress: <L, E, A>(m: Triplex<L, E, A>) => m is Progress<L>;
/**
 * Pattern matches a Triplex with a mapper function for each state. This
 * variation of `fold` "`W`idens" the return types of all branches.
 */
export declare const foldW: <L, E, A, B, C, D>(onProgress: (progress: L) => B, onError: (error: E) => C, onAvailable: (value: A) => D) => (m: Triplex<L, E, A>) => B | C | D;
/**
 * Pattern matches a Triplex with a mapper function for each state. Each
 * branch is expected to return the value of the same type.
 */
export declare const fold: <L, E, A, B>(onProgress: (progress: L) => B, onError: (error: E) => B, onAvailable: (value: A) => B) => (m: Triplex<L, E, A>) => B;
/**
 * Returns a Triplex transforming function that maps the value in the
 * "available" branch.
 */
export declare const map: <A, B>(fab: (a: A) => B) => <L, E>(m: Triplex<L, E, A>) => Triplex<L, E, B>;
/**
 * Returns a Triplex transforming function that maps the error in the
 * "error" branch.
 */
export declare const mapError: <E, F>(fef: (e: E) => F) => <R, A>(m: Triplex<R, E, A>) => Triplex<R, F, A>;
/**
 * Returns a Triplex transforming function that maps the progress in the
 * "progress" branch.
 */
export declare const mapProgress: <R, S>(frs: (e: R) => S) => <E, A>(m: Triplex<R, E, A>) => Triplex<S, E, A>;
/**
 * Gets an `Option` whose value is the value in the "available" branch.
 */
export declare const getAvailable: <A>(m: Triplex<unknown, unknown, A>) => Option<A>;
/**
 * Gets an `Option` whose value is the error in the "error" branch.
 */
export declare const getError: <E>(m: Triplex<unknown, E, unknown>) => Option<E>;
/**
 * Gets an `Option` whose value is the progress in the "progress" branch.
 */
export declare const getProgress: <R>(m: Triplex<R, unknown, unknown>) => Option<R>;
/**
 * Creates an `Applicative` instance from the progress and error semigroups.
 */
export declare const getApplicative: <L, E>(Progress: Semigroup<L>, Error: Semigroup<E>) => Applicative3C2<"Triplex", L, E>;
/**
 * Coverts a Triplex to a nested `Either` where the outer `Right` is the
 * available value, and the outer `Left` is an `Either` whose `Left` is the
 * progress, and whose `Right` is the error. Useful if mostly interested in the
 * available value.
 */
export declare const asEitherAvailable: <R, E, A>(m: Triplex<R, E, A>) => Either<Either<R, E>, A>;
/**
 * Coverts a Triplex to a nested `Either` where the outer `Left` is the
 * progress, and the outer `Right` is an `Either` whose `Left` is the
 * error, and whose `Right` is the value. Useful if mostly interested in the
 * "settled" case of either an available value or an error.
 */
export declare const asEitherSettled: <R, E, A>(m: Triplex<R, E, A>) => Either<R, Either<E, A>>;
/**
 * Coverts a Triplex to a nested `Either` where the outer `Left` is the
 * error, and the outer `Right` is an `Either` whose `Left` is the
 * progress, and whose `Right` is the value. Useful if mostly interested in the
 * "infallible" case of either an available value or a progress.
 */
export declare const asEitherInfallible: <R, E, A>(m: Triplex<R, E, A>) => Either<E, Either<R, A>>;
/**
 * Coverts a Triplex to an `Option` whose `Some` value is the
 * "settled" case of `Either` and available value or an error.
 */
export declare const asOptionSettled: <R, E, A>(m: Triplex<R, E, A>) => Option<Either<E, A>>;
/**
 * Coverts a Triplex to an `Option` whose `Some` value is the
 * "infallible" case of `Either` and available value or a progress.
 */
export declare const asOptionInfallible: <R, E, A>(m: Triplex<R, E, A>) => Option<Either<R, A>>;

```
