import { Kind, Kind3, URIS, URIS3 } from "fp-ts/HKT.js";
import { Applicative3C2 } from "fp-ts/lib/Applicative.js";
import { Apply3C2 } from "fp-ts/lib/Apply.js";
import { Functor3C2 } from "fp-ts/lib/Functor";
import { Pointed3C2 } from "fp-ts/lib/Pointed.js";

declare module "fp-ts/lib/Functor" {
  /**
   * @category model
   * @since 2.2.0
   */
  export interface Functor3C2<F extends URIS3, R, E> {
    readonly URI: F;
    readonly _R: R;
    readonly _E: E;
    readonly map: <A, B>(
      fa: Kind3<F, R, E, A>,
      f: (a: A) => B
    ) => Kind3<F, R, E, B>;
  }
}

declare module "fp-ts/lib/Apply" {
  /**
   * @category model
   * @since 2.2.0
   */
  export interface Apply3C2<F extends URIS3, R, E> extends Functor3C2<F, R, E> {
    readonly ap: <A, B>(
      fab: Kind3<F, R, E, (a: A) => B>,
      fa: Kind3<F, R, E, A>
    ) => Kind3<F, R, E, B>;
  }
}

declare module "fp-ts/lib/Pointed" {
  /**
   * @category model
   * @since 2.10.0
   */
  export interface Pointed3C2<F extends URIS3, R, E> {
    readonly URI: F;
    readonly _E: E;
    readonly _R: R;
    readonly of: <A>(a: A) => Kind3<F, R, E, A>;
  }
}

declare module "fp-ts/lib/Applicative" {
  /**
   * @category model
   * @since 2.2.0
   */
  export interface Applicative3C2<F extends URIS3, R, E>
    extends Apply3C2<F, R, E>,
      Pointed3C2<F, R, E> {}
}

declare module "fp-ts/lib/Traversable" {
  /**
   * @since 2.0.0
   */
  export interface Sequence1<T extends URIS> {
    <F extends URIS3, R, E>(F: Applicative3C2<F, R, E>): <A>(
      ta: Kind<T, Kind3<F, R, E, A>>
    ) => Kind3<F, R, E, Kind<T, A>>;
  }
}
