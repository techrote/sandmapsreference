# Policy-only integration variants

The original #155 and #183 remain unmodified source references with their
native refusal preserved. Their separate descendants retain the complete
authored material plane, actor records, selected actor and every parsed field
other than `liquid_policy`. Neither a successful policy admission nor a Gold
nomination is owner acceptance.

## What was invalid

Original #155 contains a 55-word all-zero policy. Original #183 contains a
48-word all-zero policy, explicitly produced by its source generator. These
are not valid requests for “all default families.” A valid request still needs
the wire header, exact catalogue/capability identities and a complete assignment
table. The native decoder rejects either original at its first magic word with
`malformed_policy / bad magic`, before allocating a World.

The policy decoder, generated catalogue and wire-contract document are
byte-identical at the frozen scientific engine
`662df51cd8409a52332fa7ef15d06d8ab8945aed` and the accepted delivery engine
`00cdb02f103265b6dc5224c68283e9a0c8cb449f`. The exact source hashes and links are
recorded in `policy-field-audit.v1.json`. This source comparison explains the
representation; actual runtime admission remains a separate receipt.

## Exact replacement and meaning

The #155 descendant is the already recovered immutable finalisation variant:

`b9535405853a5cd16e4bba968ec7167222861c42:docs/corpus/goldmaps-finalisation-001/native/descendants/pr155-policy-repair/setup.json`

Its Setup SHA-256 is
`3d0f9c9efd293eed5a38b59c89fd0754a0a202a730bcd0fbe011237fb58772f0`.
The separately generated #183 descendant copies that exact native-default
policy envelope. It does not strip fields, delete actors or alter geometry.
The #183 generated Setup SHA-256 is
`4aa581b4984bdd5c8b1d2853f438abdddb9beb19b99aa7b40da06e440f79cc8e`.
Its final delivery record separately pins the generator source commit and bytes.

The replacement has 55 signed 32-bit words:

| Zero-based word positions | Field | Meaning |
| --- | --- | --- |
| 0 | Magic `0x4C435057` | The `LCPW` wire envelope marker. |
| 1 | Envelope version `1` | Selects the supported wire decoder. |
| 2 | Policy version `1` | Identifies policy semantics. |
| 3–10 | Catalogue digest | Exact material/rule catalogue identity; signed words preserve the digest's big-endian byte groups. |
| 11–18 | Capability digest | Exact supported solver-family/variant matrix identity. |
| 19 | Assignment count `11` | All eleven liquid descriptors have an explicit assignment. |
| 20–52 | Eleven triples | Each triple is material ID, family code and variant code. |
| 53 | Family parameter block count `0` | No family parameter overrides. |
| 54 | Material parameter block count `0` | No material parameter overrides. |

The catalogue digest is
`82b5ab9a6e87ae817072390105052f8a5ac6d0ee22b3301cd973efdfc7fdbad3`;
the capability digest is
`33c608f875e3d8b5730f1d3b81a54dbeff9579b433e061535610a8bfa276e237`.

| Material | ID | Applied family | Variant |
| --- | ---: | --- | --- |
| Water | 3 | `freemass_v1` (code 1) | `reference` (code 0) |
| Lava | 8 | `cellular_yield_v1` (code 2) | `reference` |
| Acid | 12 | `cellular_yield_v1` | `reference` |
| Oil | 16 | `cellular_yield_v1` | `reference` |
| Paste | 20 | `cellular_yield_v1` | `reference` |
| Slush | 21 | `cellular_yield_v1` | `reference` |
| Brine | 24 | `cellular_yield_v1` | `reference` |
| Cement | 30 | `cellular_yield_v1` | `reference` |
| Toxic sludge | 32 | `cellular_yield_v1` | `reference` |
| Mercury | 33 | `cellular_yield_v1` | `reference` |
| Molten glass | 36 | `cellular_yield_v1` | `reference` |

Both original Setups retain `rule_radius=2` and `normalize=false`. The
replacement changes their invalid policy field to the explicit native default
law; it does not otherwise choose new World settings. If the owner later paints
liquids in the evaluation copy, these assignments govern those materials.

## What this does and does not establish

An invalid envelope has no admitted policy meaning, so **equivalence to the
author's original policy intent is unprovable**. The #183 source describes an
initially dry/inert map, but that observation cannot establish a missing liquid
law. Its descendant is an explicit native-default integration candidate outside
Gold25, available for separate review if its own native gates pass. The recovered
#155 descendant also remains separate from the artistically nominated original.

The field audit checks exact parsed-field equality, actors, authored stamps and
complete material-plane digests. Read the fresh delivery matrix for actual
ordinary Workbench admission, exact native readback, actor adoption, progression,
movement/contact, save and fresh-process reopen. Keep original negative receipts
and the two variant decisions separate.

## Source references

- [Accepted-engine policy decoder](https://github.com/techrote/cybersand/blob/00cdb02f103265b6dc5224c68283e9a0c8cb449f/native/include/cybersand/liquid_solver_policy.hpp).
- [Accepted-engine generated catalogue](https://github.com/techrote/cybersand/blob/00cdb02f103265b6dc5224c68283e9a0c8cb449f/native/include/cybersand/liquid_policy_catalogue.hpp).
- [Wire envelope and policy contract](https://github.com/techrote/cybersand/blob/00cdb02f103265b6dc5224c68283e9a0c8cb449f/docs/architecture/liquid-solver-family-policy.md).
- [Recovered #155 derivation](https://github.com/techrote/sandmapsreference/blob/b9535405853a5cd16e4bba968ec7167222861c42/docs/corpus/goldmaps-finalisation-001/native/descendants/pr155-policy-repair/derivation.v1.json).
- [Original #183 source generator](https://github.com/techrote/sandmapsreference/blob/c1bd6fcf2cb4c002aa7906a13543a0a5e4af8f2b/cybersand-canvases/2048x1024/original-megastructure-wide-keel-ossuary-brokenback-261121/build.py).
