# The Long Pour — original industrial steelworks

**2048×1024 exact material-cell plane; independent authored 2D side elevation; no image reference. NATIVE-UNTESTED.**

## Design thesis
A kilometre-like continuous industrial pouring journey at Midge scale, from dry ore skip and paired unequal blast furnaces to a suspended crane ladle, long roller casting line, contained quench and export gantry. The furnace cores and quench pool are separate sealed physical cells, not simulated machine interactions. A deliberately dark, enterable subgrade inspection railway connects five 82–95-cell-wide transfer shafts. Bright thermal brick and steel equipment stand over deep basalt service geology. Negative space is a real traversal chamber, not a scenic backdrop.

## Intended goal, sites and routes
Fly from **Receiving spawn** to **East rail recovery**, visiting furnace survey, suspended crane, rolling caster and quench. Main: Receiving → Ore sorting → Blower transfer → Ladle inspection → Caster operator → Quench overseer → Exit. Upper alternate: Skip hoist → West furnace approach → Blast furnace survey → Crane upper gallery → Caster operator. Subgrade alternate: descend west shaft near x175 to Western service return, continue through Blower basement and Caster sump, emerge near eastern maintenance shaft; shaft clearances are verified conservatively.

All exact named site centres (x,y):

- Receiving spawn: (115, 448)
- Ore sorting booth: (335, 554)
- Skip hoist apex: (203, 365)
- West furnace approach: (453, 399)
- Blast furnace survey: (644, 301)
- Blower transfer: (845, 545)
- Crane upper gallery: (1053, 336)
- Ladle inspection: (1275, 542)
- Caster operator: (1435, 460)
- Quench overseer: (1765, 513)
- East rail recovery: (2003, 567)
- Western service return: (270, 849)
- Blower basement: (700, 843)
- Caster sump: (1195, 841)
- East maintenance: (1780, 842)

## R6 engineering and art-audit remediation
Paired unequal furnace chambers retain fully sealed Lava, and the quench retains enclosed Water. New short dry tap/roller interfaces, a suspended crane-control console, an asymmetric receiving booth, a caster inspection bay and vented quench observation entry form differentiated physical destinations. Upper and subgrade structural spans were thinned to reduce repeated X-bracing and rail stamps while maintaining open transit. All four painted control sites remain exact in the three conservative Midge envelopes. The R4 support-finishing pass rooted previously detached suspended controls, basement benches, quench drains, and ore sorting windows to legitimate static load paths. R5 expanded the *dry* west-furnace to ladle handoff into a protected tap inspection and serviced receiving pan; attaches a visible ladle-charge sill to a separate caster mould; differentiates charge, straightener, exit shear, quench-side handling and dry dispatch. Two distinct underground inspection/switch districts break the repeating rail cadence while retaining a genuine second flight route. R6 adds a segmented overhead pickup datum, a larger static mould overbite below the ladle, a distinct guarded shear station and dry extraction threshold, an accessed crane operator ladder and a supported quench-side service console. The blower overhaul room and caster sump divert from identical rail stamps into asymmetrical maintenance layouts with grounded workbenches. Flight-blocking longer furnace/ladle bridge candidates were rejected during exact full-hull testing instead of forcing acceptance. Previously isolated quench observation hardware, ore equipment and crane monitor are deliberately supported. These are static authored assemblies, not an animated furnace/crane/pour. No Water or Lava core was opened. This is static authoring, not an animated production line; the entire geometry still requires native acceptance.

## Art direction and gameplay scale
At full resolution every pixel represents one engine cell. Flight clearance has been tested for complete 19×15, 23×19 and 31×27 axis-aligned envelopes, not Midge-radius point sampling. Local inspection booths, hoist rungs and openings were built at readable game scale. No three-quarter views or platform top faces; equipment is side-elevation physical cross-section. The crane assembly is **static at authored start**, not an animated crane actor.

## Engine contract and limits
Accepted authority: techrote/cybersand main `de109d0131641d6adc8d25bb9ced7ca3d4991105` (19 Nov 2026). The Workbench Setup-v2 parser accepts extent sides 512–2048, divisible by 64; max 32,768 starting edits, 1 MiB JSON, and min(64×cells, 32,000,000) construction work. Installed bridge may still only admit 4,096 edits. Midge record hash is pinned to accepted authoring. No material IDs 10, unstable powders or unsupported pseudos. All non-fluid structural IDs are immobile Solid / RuleKernel::None in accepted material.hpp. Water ID 3 and Lava ID 8 are movable/reactive; both fully embedded in sealed solid enclosures at time zero, isolated from accessible air and each other. These are **initial-state static** containment checks only; heating, pressure and long-term world reaction require native verification.

## Static structural audit / limitations
The four-neighbour bottom-grounding audit finds **713,311 rooted of 713,311 inert solid cells; 0 remain disconnected**. R6 connects or removes every disjoint inert assembly observed by the four-neighbour bottom-grounding audit (zero detached inert cells). Crucial crane ladder, service window, reactor cheeks and blower indicators now have deliberate structural attachments; two unserviceable floating east hoist rails were removed. This does not substitute for native structural physics or independent artistic review. The realistic installed-bridge fallback is 4,096 records; this build currently produces 4092 records, but installed bridge still must be inspected. A filled 50×60-cell obstruction at (1025,490) preserves 15/15 named sites under the full 31×27 envelope.

NATIVE-UNTESTED: no installed Godot / CyberDemoBridge / Rapier import, sustained physics tick, actual Midge control/collision, active material reactions, performance or fresh-process save/reopen acceptance. Only static geometric reachability, source-schema budgets, deterministic full-plane replay and exact material-index PNG parity are claimed. Independent art/technical/Shepherd reviewers decide whether the map meets owner quality.
