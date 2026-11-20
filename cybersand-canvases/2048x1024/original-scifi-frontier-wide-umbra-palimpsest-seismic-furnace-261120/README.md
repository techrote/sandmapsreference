# Umbra Palimpsest — Seismic Furnace and Aurora Reclamation

**Entirely original science-fiction / industrial material-cell landscape.** Perpendicular 2D side elevation, exact 2048×1024. No source imagery, AI render or reference conversion.

**Provenance:** New branch `original/scifi-frontier-wide/umbra-palimpsest-seismic-furnace-261120` from sandmapsreference default `main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Accepted read-only CyberSand `main@de109d0131641d6adc8d25bb9ced7ca3d4991105`. Seed `0x5C1F026`. No engine modifications.

## Purpose and physical geography

The Umbra Palimpsest installation studies seismic transients under an eroded basalt plateau. Two unequal collector forks, grounded through deep load-bearing piers, silhouette a wide negative-space flight basin. A midspan inspection cradle and separate optical lab watch low-temperature ore processing. Inhabited side-elevation spaces contain actual rover/assay, salvage, hydraulic compression, and east-side quarantine facilities, connected by an entered deep geological return. Distinct 1:1 machinery, not names pasted onto scenic walls.

**Functional districts:** (1) West inhabited rover arrival and assay/repair bays; (2) West seismic collector tower and hydraulic gallery; (3) Center inspection cradle, optical lab and open recovery basin; (4) East collector, quarantine scrubbers, displacement/evacuation; (5) Four differentiated excavated lower process benches and two rescue shaft mouths.

**Literal route topology:** Rover recovery dock → West assay berth → West salvage mezzanine → West collector service → Mid-gantry inspection → Cradle optical lab → East collector service → Quarantine intake → Eastern isolation lab → East freight evacuation. Alternative sky traverse goes West upper survey ledge → Aurora fork west → Upper flight corridor → Fork east locator → East upper weather ledge. Geological return goes Western rescue shaft → Deep west entry → Lower mineral assay → Lower centrifuge → Lower archive → Lower pump station → Deep east return → Eastern rescue shaft. Dropped flights can recover via the wide central basin and either rescue shaft.

Exact named sites are in `receipt.json` as actual unshifted integer coordinates. The 31×27 pass includes all 26 named sites and a physical [1002,373,1080,436] obstacle leaves all 25 unaffected sites accessible, only intentionally removing Mid-gantry inspection.

## Creator verification / honest gates

| Contract | Result |
|---|---|
| Fixed-seed grid | 2,097,152 actual final material-ID cells |
| Occupied structural grid | 508,592 / 508,592 grounded; zero detached |
| Finite disjoint ordered rectangle list | 2,236 five-field rectangles; complete replay equality |
| Setup-v2 JSON size | 42,545 bytes (1 MiB budget) |
| Physical work | 508,592 material writes |
| Conservative Midge hulls | 26/26 each at 19×15, 23×19, 31×27, exact 4-neighbour centre BFS |
| 31×27 real obstruction | 25/25 surviving sites; only one intentionally enclosed |
| Material kernel assumption | Only known inert immobile Solid/None IDs; no powders, mobile fluid, uncontained lava/water, reactive foundation |
| Support construction | 73 deterministic support connectors route-guarded to keep the exact primary/obstructed routes clear |
| Images | True 2048×1024 indexed-ID overview; 5 native-unscaled exact-pixel district crops |
| **Native Godot / Midge / Rapier / fresh save-reopen** | **NATIVE-UNTESTED**, never native PASS |
| Independent Art / Technical / Shepherd | Pending exact-HEAD assessment |

`build.cjs` is the complete reproducible generator. Run `node build.cjs` to regenerate setup, receipt and PNGs, or `node build.cjs --verify` to verify byte-for-byte matching and independently Node-inflate every PNG pixel against the finished grid. The builder verifies SHA-256 against Node's independent crypto implementation, CRCs, indexed pixel equality, every edited cell and true hull BFS.

**Bridge qualification:** Accepted source advertises 32,768 rectangles; older installed CyberDemoBridge may report 4,096. This map uses 2236 and fits both numerical caps, *but installed bridge capability, native integration, actor collision, simulation progression and restart persistence are still untested*. Do not infer native admission.

## Authentic index-material gallery

![Complete 2048x1024 source grid](overview.png)

| West inhabited rover/assay | Western collector and hydraulic |
|---|---|
| ![Rover and assay](01-west-rover.png) | ![Collector service](02-west-collector.png) |
| Inspection cradle and optics | East quarantine and freight |
| ![Midspan](03-gantry-lab.png) | ![Quarantine](04-east-quarantine.png) |

![Four dry geological workcells and lower recovery](05-thermal-return.png)

**Discipline:** Draft/HOLD, no independent result manufactured, no Ready/merge/auto-merge/owner acceptance. Former original-map PRs and all other creators' branches are untouched.
