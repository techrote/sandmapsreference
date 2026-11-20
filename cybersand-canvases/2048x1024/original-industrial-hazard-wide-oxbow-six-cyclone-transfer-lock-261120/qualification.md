# Oxbow-6 R2 — exact-source material-cell qualification (creator-side)

**Evidence dated 20 November 2026.** Existing independent R1 Art audit found two P1 defects; this revision changes actual final material cells to connect cyclone→kiln→quench discharge and furnish the coolant return with a recognisable pump/filter/valve workface. The Art audit must re-review; this creator proof does not supersede that reviewer.

| Test | Result |
|---|---|
| Changes vs original R1 | 14,304 cells (9,978 new solid; 4,326 solid substitutions; 0 erased; 0 Water/Lava) |
| Complete final material plane | 2048×1024 = 2,097,152 indexed material-ID cells |
| Fixed deterministic seed | `202611206` |
| Full-grid SHA-256 | `a953f1668ddcbd50bfb428934b25901ec34482ec2a20d5882db4a3efff12efd0` |
| Setup-v2 SHA-256 | `102845097404062434e33902203760c14d42b24d0f3062f86e80127420012e27` |
| Ordered lossless disjoint rectangles | 2990 / 32,768 source limit |
| Serialized UTF-8 Setup bytes | 56086 / 1,048,576 source limit |
| Construction work | 510864 material cells |
| Boundary-grounded nonfluid solids | 501052 / 501052; detached 0 |
| Initial Water and Lava | 7646 / 2166; unchanged and initially 4-neighbour sealed |
| Exact free-centre four-neighbour BFS sites | 16/16 at 19×15, 23×19 and 31×27 (no moved targets or exemptions) |
| Forced 31×27 obstruction | [970,50,55,275]; 16/16 literal sites reachable, 9 detours, max +450 centre steps |
| Actual indexed images re-fetched from GitHub | Full 2048×1024 overview + six native-pixel district crops |
| Separate in-memory remote PNG decoder | **3,656,672 / 3,656,672 indexed pixels**, 28 PNG chunk CRC32 checks, all zlib Adler-32 and fixed-Huffman DEFLATE checks passed; 0 pixel mismatches |

**Source authority:** accepted `techrote/cybersand/main@7b03aa437561ec63e31fd09531171360ab60eeb4` read-only Setup-v2 `workbench_setup.gd`, native bridge and Midge. Same exclusive branch and author-owned folder only. The source's 32,768 record budget does **not** prove the installed bridge constructor reports 32,768; legacy 4,096 remains a binary qualification risk. Here 2990 rectangles are below both reported numbers, but install/load, physics, dynamic liquids, save/reopen and real GPU observation remain **NATIVE-UNTESTED**.

**Do not infer native PASS, independent reviewer approval, Ready, merge or owner acceptance from these static receipts.** Fresh R2 Art/Technical/Shepherd review requested.
