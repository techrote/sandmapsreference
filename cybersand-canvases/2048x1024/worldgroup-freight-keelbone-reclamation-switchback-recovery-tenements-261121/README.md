# Keelbone Reclamation Vaults — Switchback Recovery Tenements / Crossed Component Relay

**World-group Freight — Keelbone sibling 02. Entirely new true-side-on 2048×1024 material-cell world. OPEN DRAFT/HOLD; source-static qualification only; NATIVE-UNTESTED.**

Original design language studies: Graven Keel Ship-Tipper (PR #45 HEAD `7ce39e6e`) and Peregrine Cleft / Halcyon Drydock (PR #33 HEAD `0e872ce0`). These are read-only donors. Reuses engineering culture (grounded rail/gantry loads, industrial service interiors and physical freight handoffs), never donor geometry, source, names, route coordinates or pixels.

## Family and distinct operational role

Keelbone 01 is a broad open excavated component-cutting cellar. Keelbone **02** is its differently structured **inhabited, predominantly enclosed recovery neighbourhood**, with five staggered room/workface clusters, multiple connected roof- and floor-level lanes, a compact material-lift/receiver, long emergency return and incomplete eastern expansion socket. It is **not another huge central crater or procession of identical U-shaped posts**.

The built material geometry contains six distinguishable operating functions: **western ledger and canteen**; **billet rinse / stock classification**; **upper sorter and switching points**; **midship reclaim and receiver**; **enclosed repair assay/crew facilities**; and **damaged outward dispatch**. These are static, not simulated operating machines. Floors, roofing thresholds, usable cut-throughs, founding and collision are material-cell geometry, not painted overlays.

The recurring family vocabulary is basalt-embedded, founded hard-wall and structural-steel cargo/maintenance frames, deliberately irregular service thresholds and genuine lower recovery circuits. The large upper sky, vacant mezzanines, outboard sockets and incomplete rooms are intentional authoring affordances.

### Explicit exact Midge site graph

- **Main haul:** West arrival booth → First component switch → Reclaim crossways → Machine transit → East dispatch → Outer firebreak
- **Upper switching / escapes:** Ledger mezzanine → Sorter overhead → West high bypass → Reclaim shaft head → Upper handoff → Repair bridge → West seam → Sky emergency → East seam
- **Entered tenements and machine rooms:** Crew canteen → Rinsing room → Press service → Press receiver → Repair ward → East domestic booth
- **Independent basal return:** West under-return → Central under-return → East under-return

Exact authored Midge spawn: `[115,520]`. The JSON receipt lists all 24 literal named site coordinates. Traversal uses a full in-bounds, four-neighbour collision-occupancy clearance (not nearest-site substitution) for 19×15, 23×19 and 31×27 collision hulls. A temporary extra 58-material physical obstruction at `[936,450,120,150]` raises the First component switch → Machine transit route from **586 to 706** centre steps while keeping all named destinations reachable. This is a static route model; it does **not** prove piloted native flight.

## Exact creator-source verification

| Measure | Result |
|---|---|
| Complete material-cell plane | 2048×1024 = 2,097,152 |
| IDs | 0 Empty; 58 ReinforcedConcrete; 62 SteelPlate; 100 BasaltColumns (stable immovable solids) |
| Final occupied grounded cells | 629,744 / 629,744 |
| Detached final solid cells | 0 |
| Discarded ungrounded intermediate cells | 173,062 |
| Lossless disjoint Setup-v2 rectangles | 171 / 32,768 source limit |
| Setup bytes | 4083 / 1,048,576 |
| Rectangle work | 629744 / 32,000,000 |
| Invalid/overlapping writes | 0 |
| Exact three-hull named destinations | 24/24 · 24/24 · 24/24 |
| Temporary material obstruction detour | 586 → 706 cardinal centre steps |
| Indexed authentic material PNGs | 6/6; full CRC / Adler / source-pixel parity |
| Full material-plane SHA-256 | `6c53fdc6c69489cfed0ed06c00adae2ca23f184be7cd2725618392688584a6d5` |
| Source CyberSand accepted main | `f7e056c9b8791106e22f2d1c295043783d8a9701` (read-only) |
| Source sandmapsreference main | `99a166e7fcae45eb22be1740e9f33f62faccbcc7` |
| Native Workbench / Bridge / Rapier / Midge ticks / fresh-process save | **NATIVE-UNTESTED** |

**Artifacts:** [full material-cell overview](overview.png); true **unscaled** 1:1 crops: [west ledger/tenements](01-ledger-tenements.png), [rinse/sort](02-rinse-sorting.png), [central reclaim shaft](03-central-reclaim.png), [repair atelier](04-repair-atelier.png), [east workers/dispatch](05-east-tenements.png); [deterministic source](build.cjs), [Setup-v2](setup.json), [receipt](receipt.json), [independent Node verification source](verify.cjs), [machine corpus annotation](exemplar.json). All PNG pixels are derived directly from identical committed cells, not synthetic illustrations.

Run `node build.cjs --verify` in this folder for regeneration/byte comparison, then `node verify.cjs` for separate full-plane Setup reconstruction, boundary-connected solids, PNG inflation/CRC/physical-cell parity and route results. In this author's execution environment, the pure-JS builder runs in a V8 isolate and those standalone Node commands **have not been executed**.

## Corpus and future editing

Four unscripted scene sites: short central reclaim machinery activation, worker-encounter/lockdown in west entered rooms, repair-atelier outage with alternate return, and a destructible eastern half-formed outboard socket. The five rooms' relative sparsity is preserved intentionally. `exemplar.json` documents topological contrast, human-editing seams and eight controlled diversity dimensions.

Independent exact-HEAD Art, Technical and Shepherd review still required. Check actual 1:1 room threshold legibility and credible freight transaction rather than requesting blanket furnishing. The real installed bridge capacity and compatible engine binary remain unverified; native gameplay, movement/collision/ticks, persistence and cold reopen require a real execution receipt. **No Ready, merge, auto-merge, force push or owner acceptance.**
