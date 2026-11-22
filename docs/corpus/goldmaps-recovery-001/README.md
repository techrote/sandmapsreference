# GOLDMAPS-RECOVERY-001 — independent evidence custody (Draft/HOLD)

**Scope:** Custody handover after implementer disconnect. This is not source-map editing, accepted Gold selection, a merge proposal for the map PRs, or a new experiment.

## Recovered authoritative records
- **Immutable mission ledger:** [#209](https://github.com/techrote/sandmapsreference/pull/209) at `5982fa553bc6356742cfea0911c848c372dcdb97` (181 changed paths). Full file-name inventory in `inventory.v1.json`.
- **Owner evaluator:** Original manifest `snapshot/owner-package-files.v2.json` is mirrored byte-identically here; SHA-256 `d26829e44ef697966ffde81424d8c22d9ae154b75e42122b4ac172e5c707dae0`. 586 individually pinned files, 200,610,152 uncompressed bytes, including original/candidate Setups, cell-accurate crops, 2 reference maps, pinned Godot 4.7, engine and native dependencies. The original `acquire_package.py` is also mirrored unchanged. Rebuild rather than treating this Draft PR as a binary ZIP store.
- **Scientific record:** original preregistration, selected qualifications, eight-output lock, Gold25 provisional slate, comparators, source-plane audit, and native Linux qualification mirrored as unchanged `snapshot/` files.
- **Source provenance:** All 40 prepass records and 12 original portrait-trial records mirrored with original comment text and exact URL in `prepass-portrait-register.v1.json`. The 25 Gold SHA-pinned sources, eight input originals, five trial children, seven portrait repair children and three supporting infrastructure PRs are indexed in `inventory.v1.json`.
- **Windows evidence:** Full GitHub-hosted job log `windows-ci-44990714746.log` and parseable JSON `windows-ci-evidence.v1.json` preserved independently of GitHub's Actions log retention. The final [hosted run](https://github.com/techrote/sandmapsreference/actions/runs/44990714746) at exact `5982fa553bc6356742cfea0911c848c372dcdb97` **PASS**: 586/586 file checks, 21/21 installer tests, 8/8 Godot headless native load/movement/contact/save/reopen checks. Earlier failed runs 44990138494 and 44990272976 remain in GitHub history.

**Live read-through:** 71 distinct source PRs rechecked at their exact frozen HEADs, all OPEN Draft/HOLD on 22 November 2026; no mismatches.

## Rebuild the original owner evaluator (network+Python 3)
From this directory, run:

```powershell
python .\snapshot\acquire_package.py --manifest .\snapshot\owner-package-files.v2.json --manifest-sha256 d26829e44ef697966ffde81424d8c22d9ae154b75e42122b4ac172e5c707dae0 --workspace .\reconstructed-owner-kit
```

The original reconstruction script independently verifies every frozen file SHA256, writes `reconstructed-owner-kit/gold-astra-001-owner-evaluation.zip`, extracts and verifies it again, and writes a receipt. The resulting ZIP may have different compressed bytes; the 586 individual file identities are the frozen contract. Use an empty workspace, not a normal Workbench install. Review `snapshot/README-OWNER.md` before opening it.

## Independent audit and unresolved gates
- Three `C` controls correctly abstained. B1 and B2 have the most convincing direct spatial/causal improvements. B3 fork readability remains inconclusive. D1 and D2 have useful improvements with comparative reference disagreement/limitations.
- Historical implementer summary: *four provisional Platinum candidates, three no-change, one inconclusive*. This is **not** final owner-accepted status and is not represented as a newly independently replayed blinded comparison. The experimental reviewer recorded `fully_blinded_review=false`; later reworker comparisons require their own explicit matched-assessor evidence.
- Gold25 = **24 core + conditional #125**, none owner accepted; 7/7 repair children have Art+source-static Technical PASS, **not** native acceptance.
- The experiment output lock and trial PRs must not be rewritten. Atlas evidence windows are not edit masks. Preserve DO-NOT-FILL instructions within every record, including those primarily marked DO-PRESERVE.
- Native tests establish short controlled headless behavior, not complete Midge routes, machinery operation, GPU stutter/performance or owner Windows playability.
- **Next exact-HEAD work:** independently adjudicated post-lock art decision record, a source-matched owner Windows GUI evaluator, and owner decisions on Gold25/Platinum. No merge, Ready promotion, automatic scheduling or changes to accepted CyberSand main.

The GitHub repository remains the source of truth. This archive is a second, independent custody path for the full manifests and human-readable evidence; it deliberately does not mirror all 200MB of binaries into a Draft PR.
