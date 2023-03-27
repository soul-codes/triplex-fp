# triplex-fp - UI data state triplex extension for fp-ts

> ℹ️ This package is currently in an experimental stage.



`triplex-fp` provides a [fp-ts](https://www.npmjs.com/package/fp-ts "fp-ts")-compatible
[Triplex](docs/declaration.md "Triplex") type class
that represents the triply branched UI data state of "progress" (data is
being fetched), "error" (the fetching failed) and "available" (the fetching
is successful, yielding a result), with the applicative combinator
[getApplicative](docs/get_applicative.md "getApplicative") that lets you combine such states, with an "error"
instance masking "progress" instances, and a "progress" instance masking
"available" instances. It also supplies other ergonomic methods for
constructing, discriminating, folding mapping over different branches,
as well as conversion into `Option` and `Either`.

The applicative takes semigroup type classes for progress and error states,
allowing you to specify your on logic as to how they should be combined when
putting two triplex instances together. You may therefore choose to keep any
single error instance and throw away the rest, or concatenate them, or perform
any other accumulation logic on the individual error instances. The same goes
with the progress states.

The library also ships the following type classes that can be used to
represent progress states:



*   [WeightedProgress](docs/declaration_2.md "WeightedProgress") -
    represents a numerical progress state
    that can be combined in a weighted manner, so that some data contribution's
    progress can count more than others.

*   ([RetryableError](docs/declaration_3.md "RetryableError")) -
    represents a simple, message-less error that is
    either retryable or not retryable. When combined, non-retryable errors
    propagate over retryable errors.

*   ([Unit](docs/declaration_4.md "Unit")) -
    represents a type with no value. You can use this to blank
    out progresses or errors if you aren't interested in them.
