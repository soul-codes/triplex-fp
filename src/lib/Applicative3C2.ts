import { Kind, Kind2, Kind3, URIS, URIS2, URIS3, URIS4 } from "fp-ts/HKT.js";
import { Applicative3C2 } from "fp-ts/lib/Applicative.js";
import { Apply3C2 } from "fp-ts/lib/Apply.js";
import { Functor3C2 } from "fp-ts/lib/Functor";
import { Pointed3C2 } from "fp-ts/lib/Pointed.js";
import type {} from "fp-ts/es6/Traversable.js";

interface _Functor3C2<F extends URIS3, R, E> {
  readonly URI: F;
  readonly _R: R;
  readonly _E: E;
  readonly map: <A, B>(
    fa: Kind3<F, R, E, A>,
    f: (a: A) => B
  ) => Kind3<F, R, E, B>;
}

declare module "fp-ts/lib/Functor" {
  export interface Functor3C2<F extends URIS3, R, E>
    extends _Functor3C2<F, R, E> {}
}

declare module "fp-ts/es6/Functor" {
  export interface Functor3C2<F extends URIS3, R, E>
    extends _Functor3C2<F, R, E> {}
}

interface _Apply3C2<F extends URIS3, R, E> extends Functor3C2<F, R, E> {
  readonly ap: <A, B>(
    fab: Kind3<F, R, E, (a: A) => B>,
    fa: Kind3<F, R, E, A>
  ) => Kind3<F, R, E, B>;
}

declare module "fp-ts/lib/Apply" {
  export interface Apply3C2<F extends URIS3, R, E>
    extends Functor3C2<F, R, E>,
      _Apply3C2<F, R, E> {}
}

declare module "fp-ts/es6/Apply" {
  export interface Apply3C2<F extends URIS3, R, E>
    extends Functor3C2<F, R, E>,
      _Apply3C2<F, R, E> {}
}

interface _Pointed3C2<F extends URIS3, R, E> {
  readonly URI: F;
  readonly _E: E;
  readonly _R: R;
  readonly of: <A>(a: A) => Kind3<F, R, E, A>;
}

declare module "fp-ts/lib/Pointed" {
  export interface Pointed3C2<F extends URIS3, R, E>
    extends _Pointed3C2<F, R, E> {}
}

declare module "fp-ts/es6/Pointed" {
  export interface Pointed3C2<F extends URIS3, R, E>
    extends _Pointed3C2<F, R, E> {}
}

declare module "fp-ts/lib/Applicative" {
  export interface Applicative3C2<F extends URIS3, R, E>
    extends Apply3C2<F, R, E>,
      Pointed3C2<F, R, E> {}
}

declare module "fp-ts/es6/Applicative" {
  export interface Applicative3C2<F extends URIS3, R, E>
    extends Apply3C2<F, R, E>,
      Pointed3C2<F, R, E> {}
}

declare module "fp-ts/lib/Traversable" {
  export interface Sequence1<T extends URIS> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <A>(
      ta: Kind<T, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind<T, A>>;
  }
  export interface Sequence2<T extends URIS2> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <TE, A>(
      ta: Kind2<T, TE, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind2<T, TE, A>>;
  }
  export interface Sequence3<T extends URIS3> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <TR, TE, A>(
      ta: Kind3<T, TR, TE, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind3<T, TR, TE, A>>;
  }
}

declare module "fp-ts/es6/Traversable" {
  export interface Sequence1<T extends URIS> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <A>(
      ta: Kind<T, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind<T, A>>;
  }
  export interface Sequence2<T extends URIS2> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <TE, A>(
      ta: Kind2<T, TE, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind2<T, TE, A>>;
  }
  export interface Sequence3<T extends URIS3> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <TR, TE, A>(
      ta: Kind3<T, TR, TE, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind3<T, TR, TE, A>>;
  }
}
