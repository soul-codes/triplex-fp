import { Semigroup } from "fp-ts/lib/Semigroup.js";

export interface Unit {
  _tag: "Unit";
}

export const unit: Unit = { _tag: "Unit" };

export const semigroup: Semigroup<Unit> = { concat: () => unit };
