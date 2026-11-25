# Live source PR freshness — owner delivery

Observed **2026-11-24 20:37:46 UTC** through the read-only GitHub connector.
The frozen source identities remain current: **71 of 71 custody PRs retain
their exact pinned heads, open state and Draft flag. No head, state or Draft
flag drift was found.** The three supplementary donor PRs #37, #124 and #135
also retain their exact frozen heads and remain open Draft.

| Population | Found | Exact frozen heads | Open Draft | Head drift |
| --- | ---: | ---: | ---: | ---: |
| Original master custody inventory | 71 / 71 | 71 / 71 | 71 / 71 | 0 |
| Supplementary portrait donors | 3 / 3 | 3 / 3 | 3 / 3 | 0 |

The 71 custody PRs include infrastructure and ledger sources; they are not a
map count. The playable collection's 70-map source population remains 67 primary
maps plus three supplementary donors. This audit does not reinterpret either
population or add a new source to the frozen corpus.

The connector enumerated all 211 available repository PR records in one paginated
read with state `all`, requested limit 250, no diff and no comments. Every targeted
source was present, so no absent PR is silently treated as unchanged.
[`live-source-pr-freshness.v1.json`](live-source-pr-freshness.v1.json) records all
71 source entries and all three supplementary donors individually: pinned head,
current head, branch, base, state, Draft flag, merged status, update timestamp,
requested-reviewer metadata and comparison with the frozen observation.

Frozen inventory authority is
[`master-artifacts.v1.json`](../../goldmaps-finalisation-001/custody/master-artifacts.v1.json),
SHA-256 `3ac9b8d9ff0578e09e18cec13b302b9313453ff36a54e55d45755075d42e09c0`.
Supplementary donor authority is
[`supplementary-donors.v1.json`](../../goldmaps-finalisation-001/custody/supplementary-donors.v1.json),
SHA-256 `1ca1eaa51eacd2fa89fffa43a64d677e5aa80b5d8a553f852b3f4b7320a2c861`.
Both derive from the preserved finalisation lineage.

No source PR, branch, reviewer state or frozen file was modified. Branch names
and requested reviewers are metadata observations, not proof of exclusive human
or programme ownership. This freshness audit does not provide new native,
graphical, artistic or owner acceptance. The lead separately records accepted
main and predecessor #215/#216 freshness and their Draft/HOLD discrepancy.
