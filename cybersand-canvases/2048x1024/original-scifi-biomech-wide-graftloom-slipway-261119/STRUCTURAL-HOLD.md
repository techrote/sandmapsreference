# Graftloom Slipway — structural support blocker

**Original science-fiction landscape. Internal work-in-progress on the owned branch. 2026-11-19.**

## Verified baseline
- Source branch baseline: `228a241193d30677b6941440ef396cfee285d1a2`; full exact material plane 2048 × 1024, deterministic Python 3 builder, 11,717 rectangles / 32,768, Setup 218,774 / 1,048,576 bytes, 763,178 nonempty cells.
- All 13 authored sites, 19×15, 23×19, 31×27: connected without nearest-site proxies. Upper/lower constrained return tests passed. Eight PNGs including six native-resolution crops passed independent CRC/zlib/material-pixel parity.
- **Failure:** independent four-connected material flood detected **33 non-boundary-grounded components / 116,604 floating solid cells**, including **39,183 cells** at x1204–1704/y185–386 (upper refinery), **29,054 cells** at x753–1082/y386–550 (memory-eye) and **14,656 cells** at x921–1208/y522–769.
- Valid immobile inert solid IDs and static actor clearance do **not** equal physically credible supports. No native Godot install/flight/collision/save-reopen was exercised.

## Executed but rejected candidate repairs
- [Run 44443724458](https://github.com/techrote/sandmapsreference/actions/runs/44443724458): primitive shortest steel strut selection found an actor-gate obstruction at a 40-cell island (x1151,y468).
- [Run 44443908372](https://github.com/techrote/sandmapsreference/actions/runs/44443908372): removing negligible gate fragments and adding steel struts severed the 19×15 flight graph; memory south, all refinery destinations and final recovery were unreachable.
- [Run 44444257216](https://github.com/techrote/sandmapsreference/actions/runs/44444257216): pre-reserving all 31×27 exact route envelopes left no legal structural path for the 39,183-cell upper machine component.
- [Run 44444620076](https://github.com/techrote/sandmapsreference/actions/runs/44444620076): independently flight-trialling each direct steel weld against 31×27 reachability and both constrained alternate routes could not anchor the upper machine component.
- [Run 44444884427](https://github.com/techrote/sandmapsreference/actions/runs/44444884427): adding explicit ceiling/underkeel candidate hangers still could not satisfy exact route admission.
- [Run 44445352963](https://github.com/techrote/sandmapsreference/actions/runs/44445352963): lateral hull hangers also failed the flight-preserving support gate.

The original deterministic builder and independent verifier were therefore **restored**; failed cables were never committed as material-cell images/Setup output. These action failures are real qualification evidence, not native tests.

## Repair hypothesis / next bounded implementation
Do not join the main high-frame island to the roof or side wall blindly. Rebuild the **upper refinery access geometry first** with two separate 31×27 traversable entrances from the west and east, preserving the existing 13 exact named sites. Re-evaluate a grounded roof hanger *only after* a genuine bypass corridor survives both constrained upper/lower route tests. Repeat for the detached memory eye (prefer a paired spar with an alternate ring access gap) and underkeel, avoiding giant one-pixel antennae. The independent verifier must additionally assert zero detached structural cells, then rerun RGB material parity from the changed source on all eight PNGs. Any small removable floating decorative islands must be explicitly counted as changed actual cells.

No PR, Ready promotion, merge, owner acceptance or native qualification is authorized by this note. **NATIVE-UNTESTED.**
