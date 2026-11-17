# Twin Ravine Temples — CyberSand 2048×2048

**DRAFT / HOLD · owner playtest required · never merge without approval.**

Original reference: [artwork/ruins_monuments/batch1/rootbound_guardians-twin_ravine_temples-suspended_tension.png](https://github.com/techrote/sandmapsreference/blob/main/artwork/ruins_monuments/batch1/rootbound_guardians-twin_ravine_temples-suspended_tension.png) · public ID **ruins-0013** · source key **batch1/image-0212** · Git blob **0611d05df37b443a411c1ebf9dba663082e25975** · original SHA-256 **47f4039fb0547f6799b0e3b445a12869e1a7dc5904c68e1725d2ba2d52aa5bdb**. Original image dimensions and direct pixel comparison could not be independently verified in this run because the binary source was unavailable to the generator; the title, catalogue identity and geometry are the sourced visual premise.

The 2048² level interprets the reference's twin ravine shrines as **two separate cliff-bound temple wings**, with guardian reliefs, root-bound mineral ledges, three masonry/root crossings, conservative flying bypass shafts, underground galleries and a contained turquoise moonwater basin. 2D orthographic geometry only. The original reference PNG is not used as scenery, engine background or actual material pixels.

## Loading

1. Copy `setup-twin-ravine-temples.json` into the Workbench setup location: `%APPDATA%\\Godot\\app_userdata\\Cyber Sand Reference Sandbox\\workbench\\` on Windows (verify the installed Workbench user-data path).
2. Open Workbench and select the start `twin-ravine-temples`. Install into the Workbench and play as the selected Midge.
3. Do not treat static material rendering as a native test: exercise Godot, Rapier, actor control and save/reopen on physical Windows 11.

## Static qualification

- CyberSand authority: [accepted main `018bd09503d7f079ddac52e225c2f7daf8d678bf`](https://github.com/techrote/cybersand/tree/018bd09503d7f079ddac52e225c2f7daf8d678bf).
- Real Workbench setup-v2 extent: **2048×2048**; the material plane is reconstructed losslessly from 5-field rectangle edits.
- 14,445 rectangles / 32,768; 276,445 UTF-8 JSON bytes / 1,048,576.
- Conservative **19×15** actor clearance: 17/17 named destinations reached; spawn 1024, 454. Repositioned viewpoint offsets: 0.
- Full material-equivalence check: 4,194,304 / 4,194,304 cells.
- Stable structural materials predominate; actual Water is retained inside a reinforced basin with solid liner. No spreading live Plant/Fungus components.

## Reproducibility

Run `node -e "const fs=require('fs'),{generate,template}=require('./builder.cjs');const r=generate(template);fs.writeFileSync('setup-twin-ravine-temples.json',r.json);fs.writeFileSync('twin-ravine-temples-preview.png',r.png);console.log(r.stats)"` from this directory with Node 18+.

The committed PNG is a **1024×1024, 4-bit indexed material-cell preview** sampled from the exact 2048² authored array; it is not a tracing or AI-generated image. See `evidence.json` for collision clearance, waypoints and budget evidence.

**Unqualified:** direct visual fidelity against the original PNG, physical Godot/native/Rapier launch, actor input/collision, simulation progression, and save/reopen. These require owner/independent validation and must not be described as passed.
