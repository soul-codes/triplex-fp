import { api, d, kb, link, list, remark, code } from "kbts";
import { preferredFilename, render, save } from "kbts/markdown";
import rimraf from "rimraf";
import { install } from "source-map-support";

import { RetryableError, Triplex, Unit, WeightedProgress } from "@lib/index";
import { getApplicative } from "@lib/Triplex";
import { pkg, pkgRef } from "./pkgRef.js";

install();
const pwd = process.cwd();

rimraf.sync("./docs");

const npmRef = (name: string) =>
  link("https://www.npmjs.com/package/" + encodeURIComponent(name), name);

const readme = kb(`${pkg} - UI data state triplex extension for fp-ts`)`
  ${remark("Warning")("This package is currently in an experimental stage.")}

  ${pkgRef} provides a ${npmRef("fp-ts")}-compatible
  ${link(api(Triplex), "Triplex")} type class
  that represents the triply branched UI data state of "progress" (data is
  being fetched), "error" (the fetching failed) and "available" (the fetching
  is successful, yielding a result), with the applicative combinator
  ${api(getApplicative)} that lets you combine such states, with an "error"
  instance masking "progress" instances, and a "progress" instance masking
  "available" instances. It also supplies other ergonomic methods for
  constructing, discriminating, folding mapping over different branches,
  as well as conversion into ${code("Option")} and ${code("Either")}.

  The applicative takes semigroup type classes for progress and error states,
  allowing you to specify your on logic as to how they should be combined when
  putting two triplex instances together. You may therefore choose to keep any
  single error instance and throw away the rest, or concatenate them, or perform
  any other accumulation logic on the individual error instances. The same goes
  with the progress states.

  The library also ships the following type classes that can be used to
  represent progress states:

  ${list(
    d`
    ${link(api(WeightedProgress), "WeightedProgress")} -
    represents a numerical progress state
    that can be combined in a weighted manner, so that some data contribution's
    progress can count more than others.`,
    d`
    (${link(api(RetryableError), "RetryableError")}) -
    represents a simple, message-less error that is
    either retryable or not retryable. When combined, non-retryable errors
    propagate over retryable errors.`,
    d`
    (${link(api(Unit), "Unit")}) -
    represents a type with no value. You can use this to blank
    out progresses or errors if you aren't interested in them.`
  )}

`;

process.chdir(pwd);
save(
  await render([preferredFilename("README.md")(readme)], {
    paths: [
      [readme, "."],
      [null, "./docs"],
    ],
  })
);
