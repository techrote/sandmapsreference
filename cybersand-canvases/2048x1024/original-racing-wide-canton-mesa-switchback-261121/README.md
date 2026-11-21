# Canton Mesa Switchback — ORIGINAL-LANDSCAPE-RACING-WIDE

**OPEN Draft/HOLD candidate. Genuinely original, orthographic 2048×1024 material-cell map. SOURCE-STATIC-PASS; NATIVE-UNTESTED.** No prior map geometry or image imported. No merge, Ready promotion or native acceptance implied.

## Structural thesis

Five **floor-rooted industrial cantons** form an uneven escarpment around two open low saddles. The broad upper west→east flight corridor, asymmetric eastern vertical turnaround, eastbound low alternative, and westbound low return occupy genuinely empty material cells above the landscape. Unlike a suspended island map, the machinery belongs to a single grounded geological support. Three rounded excavated vaults, customs/workshop access shafts, service alcoves and spare annex seams supply editable authoring opportunities. The open sky and unfilled chambers are intentional. Source material is precisely indexed; overview and six 1:1 crops are faithful image-plane extracts, not concept images.

## Route graph and concrete districts

The named exact-site **primary** path is in `qualification.json`: West launch gantry → West guide sail → Rim signal crown → Central flyover → Upper breakaway cue → North valley flank → East tensile beacon → East crane approach → Eastern dive mouth → East quick drop → East turnaround → Eastern return guide → Far depot return → Central basin return → West transfer return → Ramp-side return → West finish.

The **alternative** leaves from West launch gantry through West drop gate, Western service cruise, Basin lateral, Middle canton passage, East market lateral, Eastern interchange, and joins at East turnaround to return west. The 31×27 real-cell obstacle `[1014,170,85,94]` closes only *Upper breakaway cue*: all 13 low-alternative legs, finish and 30 other exact sites remain reachable. These are 4-neighbour connectivity results, **not actual flight speed/feel, control, boost or collision dynamics**.

Five operational districts: west muster and launch arch, northwest signal/pump saddle, central airlift/round vault settlement, east fabrication terraces, and far-east arrestor/docking arms. The separate deep service chambers are accessible by conservative real-cell clearance; some other unfinished pockets are deliberately not named as destinations.

## Committed source and reproducibility

1. `python build.py` (requires NumPy, SciPy, Pillow): fixed seed `0x26A7C116`, 2,097,152 exact material IDs, lossless run rectangles and authentic indexed PNGs.
2. `python verify.py`: independent-from-builder exhaustive bounds, overlap, run canonicality, source SHA, histogram, rooted solids and complete pixel-index parity of seven indexed PNGs.
3. `python route_audit.py`: independently replays committed Setup-v2 and checks every literal site at 19×15, 23×19 and 31×27 with all immediate cardinal steps; verifies locally bounded 31×27 primary, alternative and service legs and an actual material obstruction, never a virtual graph skip.

Do not replace the source grid with AI art or rasterized screenshot approximations. Source Setup-v2 contains exact [x,y,w,h,material] stamping records only; it is not a captured native World or Rapier simulation. `exemplar.json` is corpus metadata, never an engine key.

## Current engine authority and known limitations

- Accepted `techrote/cybersand` `main` evaluated at `f7e056c9b8791106e22f2d1c295043783d8a9701` (21 Nov 2026). The accepted Setup-v2 source uses [512,2048]-multiple-of-64 extents, up to 32,768 starting records, and 1 MiB Setup persistence. `CyberDemoBridge.workbench_start_rectangle_capacity()` advertises 32,768 after the accepted host-evidence projection repair. The user is the only installed-runtime operator; no legacy-4,096 release speculation is a corpus acceptance criterion.
- Material indices: Empty=0, Hard wall=58, Concrete=62, Glass=72, Basalt=100, Obsidian=101, Zinc=113, Iron=117 and Quartz=122. Only audited inert grounded solids are used. **No sand, water, lava, oil, acid, loose or reactive ingredients**.
- Actor uses accepted Midge model `midge`, definition hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`, default workbench options, spawn `[100,217]`, conservative envelopes 19×15, 23×19 and 31×27. The source actor definition hash must be independently requalified if the installed engine changes.
- **NATIVE-UNTESTED.** No compatible installed Godot+native extension was invoked. Installed bridge admission, actual actor thrust, physics/impacts, lap timing, game feel, full engine save/reopen and native persistence are unverified downstream gates. Independent exact-HEAD Art/Technical/Shepherd qualification is requested; there is no owner acceptance.

## Corpus information value

`exemplar.json` describes eight controlled dimensions, the ground-mass load graph, unequal settlement adjacency and four possible unscripted set-piece regions. Do not fill every intentional void or homogenize the five settlement silhouettes simply for visual completion; preserve useful editable spaces.
