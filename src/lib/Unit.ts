import { Semigroup } from "fp-ts/lib/Semigroup.js";

/**
 * Represents the Unit type
 */
export interface Unit {
  _tag: "Unit";
}

/**
 * Represents the Unit singleton
 */
export const unit: Unit = { _tag: "Unit" };

export const semigroup: Semigroup<Unit> = { concat: () => unit };
