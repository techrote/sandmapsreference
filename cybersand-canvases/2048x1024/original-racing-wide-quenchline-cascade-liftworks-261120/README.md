# Quenchline Cascade Liftworks — original racing-wide 2048×1024

**ORIGINAL / NO REFERENCE IMAGE · R1 · Draft/HOLD · NATIVE-UNTESTED**

An abandoned dry quench-transfer elevator embedded in a volcanic industrial cut. The world is authored as exactly 2,097,152 final material-ID cells; the whole map, district crops and setup rectangles are generated from `geometry.cjs`. Orthographic, perpendicular side elevation throughout. No isometric viewing surfaces, fake scenic collision, or reference-image conversion.

## Five identifiable functional districts

1. **West Ignition Dispatch (x 0–390):** opposing roof/foundation capture jaws, roof-connected operator room, west recovery ascent, and real equipped foundation repair bay. Main start `(130,339)` and return finish `(134,336)`.
2. **Cascade Louver Line (x 390–805):** three differently shaped hanging depth baffles backed by the upper masonry, two unequal founded weighing pedestals, calibration hardware, outbound descending flight clearance. True return-cable inspection stop `(568,615)`.
3. **Keystone Switch Drum (x 805–1250):** broad open exchange chamber, two opposing roof-fed drive headers, polygonal founded motor casing with a real bored internal service shaft. Outbound checkpoint `(1125,523)`, core internal service visit `(1119,638)`, westbound low return `(1150,764)`.
4. **Dry Quench Separator Banks (x 1250–1690):** unequal filter teeth from the lower foundation, dissimilar roof pipes, real through-chimney and maintenance room. Outbound `(1615,570)`, lower return `(1537,754)`.
5. **Eastern Reversal and Brake Works (x 1690–2048):** asymmetric top/bottom capture portals and genuine vertical return void. Outbound `(1866,573)`, down `(1905,660)`, released return `(1870,747)`, underfloor brake shop `(1841,937)`.

## Route graph and grounded gameplay scale

**Intended outward flight:** West ignition `(130,339)` → Dispatch cut `(330,352)` → Cascade intake `(474,407)` → Baffled outlet `(705,443)` → Quench transfer west `(886,476)` → Keystone drum `(1125,523)` → Thermal approach `(1318,552)` → Quench fins `(1615,570)` → East capture `(1866,573)`. **Vertical east reversal** `(1905,660)` → `(1870,747)`. **Low westbound return** `(1537,754)` → `(1150,764)` → `(770,759)` → `(403,761)` → West recovery climb `(126,545)` → Finish `(134,336)`. This is an authored route graph; geometry is also independently tested for conservative four-neighbour passability, not actual measured flight speed.

Optional recovery: the Keystone centre has an explicitly excavated internal service chimney, three roof-office shafts and four foundation garages accessible from the larger flight volume. A *real 150×100 hard-material temporary obstruction at `(1040,465)`*, exactly covering Keystone outbound, leaves all 25 other literal checkpoint destinations (including finish) reachable with full 31×27 actor clearance. No waypoint snapping or exemptions.

## Source and proof

Run `node build.cjs`, then `node verify-independent.cjs` and `node local-route-audit.cjs` using Node 22 (or compatible). The third test independently restricts each consecutive racecourse leg and local service spur to a bounded band around its exact waypoints to reject nonlocal detour shortcuts; its committed receipt is `local-route-qualification.json`. The builder uses a fixed xorshift seed (`0x261120ce`), deterministic per-cell geometry and canonical horizontal-run/vertical-extension rectangle packing. The verifier loads committed Setup JSON, independently expands **every edit** into the full final grid, checks histogram/grid SHA-256, geometry legality, overlap, boundary-grounded inert solids, exact sites, physical obstruction and *every indexed material pixel* in the full 2048×1024 PNG and six native-resolution crops, including PNG CRC and inflated zlib data.

Full setup: `setup-quenchline-cascade-liftworks.json`. Machine-readable proof: `qualification.json`. Named exact sites are in `geometry.cjs` and the receipt. No water, lava, powders or reactive material IDs occur in this original piece. The only physical material IDs are 49 Slate, 58 ReinforcedConcrete, 62 SteelPlate, 100 BasaltColumns, 101 Obsidian, 113 ZincSheet, 117 BareIron and 122 QuartzCrystal (accepted inert immobile solids with no rule kernel). Intermediate designed fragments that are not boundary connected are explicitly pruned by the generator; the final material plane has no detached collision solids. The receipt reports the pruned intermediate-cell count, without concealing it.

### Boundaries, native gate and limitations

Read-only accepted CyberSand authority: `de109d0131641d6adc8d25bb9ced7ca3d4991105` (Setup-v2 parser, original Midge 4×3 hull, native material descriptors and bridge source). Source budgets: dimensions 2048×1024, 32,768 source rectangles, 1,048,576 UTF-8 JSON bytes and 32,000,000 construction visits. An installed or legacy CyberDemoBridge may still report only **4,096** rectangles; source qualification is **not** actual native import. The creator has not executed Godot Workbench, installed bridge, Rapier flying/collision/progression, collision geometry after simulation ticks, or cold-process persistence. Every such gate is **NATIVE-UNTESTED**. Requested independent Art/Technical/Shepherd assessment must pin the exact published HEAD; creator-source pass does not imply independent acceptance.

## Authentic 1:1 indexed-material evidence

`overview.png` (full 2048×1024), `01-ignition-dispatch.png`, `02-cascade-louvers.png`, `03-switch-drum.png`, `04-quench-banks.png`, `05-capture-reversal.png`, `06-underfloor-shops.png` are pure material-index renders; there are no AI images, concept replacements or purported native screenshots.

No engine edits, legacy conversion, unrelated PR writes, Ready promotion or merge.
