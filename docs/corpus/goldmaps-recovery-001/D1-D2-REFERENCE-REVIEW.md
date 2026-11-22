# GOLDMAPS-RECOVERY-001 — independently replayed prior-reworker comparisons (D1/D2)

**Source:** exactly the frozen owner evaluator's `maps/D1` and `maps/D2`, each containing original / Astra candidate / prior reworker reference Setup and source-aligned 1:1 PNGs. Prior reworker references are automation-produced and **not proven personally human-authored**. This is independent, source-static post-lock inspection, **not a new blind assessor vote**.

## Geometric and data-integrity findings

| Case | Original → Astra changed material cells | Original → earlier reworker changed material cells | Astra ↔ reworker differing material cells | Settings and actors |
|---|---:|---:|---:|---|
| D1 Orthant | 15,807 | 45,566 | 52,952 | Identical to original in both variants |
| D2 Warden | 7,692 | 16,090 | 18,704 | Identical to original in both variants |

All six original/derived maps (two originals, two Astra variants, two prior references) reconstructed as complete 1024×2048 uint8 material planes from in-bounds, nonoverlapping Setup-v2 rectangles. Both reworker references preserved original geometry-independent Setup fields. The independent 19×15, 23×19 and 31×27 conservative-hull reachability checks, with and without the documented obstruction, found **zero newly lost named sites** on either Astra or reference variant in all six cases per arm.

**D1 original/reference full-plane SHA-256:** `8727b7d3b3130d9ed5fe5894e6c770134b05bde89a206b2c14cbb1a8cd4aa3df` / `b86a0dfbe75f87b887642f8e90c8a5d9d43dadafcec24379076d2c000bb6a3da`.

**D2 original/reference full-plane SHA-256:** `ab4c2caa9ad05eb507197685c3cad25a47a7cd2d0068fe62ae6824956601de81` / `f9c64051454650b49bd43f0164491a1c350938ea8cf83c6fd6fde3a1d88d5ca4`.

Astra's candidate plane SHA-256s match the locked child PRs: D1 `ed459770f09de635d095bee5b4d3c41f9cef9005449efdbb6bef5126217a7ac3`, D2 `f9fcc3c98c595c10a763a7319bf30edd0842de6f80033c46a55a97709deacd63`.

## Spatial review of the real 1:1 PNG crops

- **D1 high crossing:** Astra introduces distinct bracing/approach fragments compared with the original's simplified bridge; the earlier reworker reference includes more visually instrumented mechanical relationships. Both are genuine material geometry, not operating transfer machinery.
- **D1 east drill workface:** Astra builds an entered gallery from the originally bare wall. The reference instead shows a substantially more enclosed and differentiated, instrumented receiver station. Previous preference for the reference as an architectural lesson is plausible from these pixels, but its additional cell count is not proof of superior gameplay; compare with actual Midge flight and routes.
- **D2 suspended magnet:** both variants make the original shallow pad a visibly collecting head. The earlier reworker reference adds more connecting horizontal structure while Astra's simpler pair of legs leaves a larger opening. The reference's added detail should not be confused with functional physics.
- **D2 press:** Astra adds simple opposed plate levels and a support triangle; reference supplies a more complex, recognizably mechanical arrangement of unlike ram surfaces. The stronger visual specificity of the reference warrants qualitative review rather than indiscriminate adoption.
- **D2 fractured freight:** Astra adds differentiated broken terminals in a specific pair that the reference largely leaves as in the original. This is a positive local contrast favouring Astra in that window alone.

**Independent assessment:** The earlier reworker's D1/D2 outputs differ substantively from Astra, not merely in material count or decoration. There is no basis for declaring either entire reference universally better solely from these crops. D1's earlier-reference preference and D2 reviewer disagreement should remain visible in the final assessor record. Preserve the five changed trial outputs and all prior references as distinct branches; do not cherry-pick a hybrid into the locked experiment.

**Outstanding:** Real owner Windows GPU graphical assessment, actual full flight, high-speed B3 readability and explicit matched/blinded final adjudication. These calculations do not change experimental or corpus acceptance.
