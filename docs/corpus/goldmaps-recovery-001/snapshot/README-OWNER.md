# GOLD-ASTRA-001 — Windows evaluation package

**Draft / HOLD. Owner acceptance is pending.** This package contains the eight frozen original/candidate pairs and two prior reworker references, plus exact accepted CyberSand source and the pinned Windows runtimes. It is an evaluation copy; it does not replace the owner's installed game.

The scientific record and current independent conclusions are in [trial ledger PR #209](https://github.com/techrote/sandmapsreference/pull/209). The preregistration is `241029a2de59b412e1475ef7f46094d71033ad6e`; all eight outputs were locked at `0bdbf3fc524e85c30c7095b7e1dad53159fd7d9c` before prior repair comparisons. The engine pin is `662df51cd8409a52332fa7ef15d06d8ab8945aed`. Do not silently substitute newer engine files or older DLLs.

## What is included

`owner-bundle-manifest.v1.json` names each Setup, its original/output commit and exact SHA-256. `engine-source-manifest.json` maps accepted source and Windows runtime bytes. `maps/<arm>/<variant>/` contains Setups and genuine material-cell imagery; `fixture.json` names the original authored sites. Variants are `original`, `candidate` and, for D1/D2, `reference`.

The three control candidates are byte-identical to their originals. The five changed candidates are B1 (receiving cradle), B2 (examination apparatus), B3 (fork entrances), D1 (crossing/workface grammar) and D2 (magnet/press/broken freight). References are prior repair-worker outputs; individual manual-human authorship is unverified.

All image pixels represent real authored cells. Views use the same original world coordinates. Overview thumbnails can hide modest changes: open the native-resolution district crops as well.

## Verify and open this isolated evaluation copy

Extract the complete ZIP into an ordinary local folder. Open PowerShell in that folder. Preserve the extracted manifest and Setups; save observations under new labels.

1. Check the ZIP SHA-256 against the final delivery record with `Get-FileHash -Algorithm SHA256 <zip-path>`. Review `package-files.v1.json` for individual file hashes. This inventory excludes its own bytes; its digest is pinned by the delivery record and CI input.
2. Import the exact project resources once:

   ```powershell
   & .\Godot_v4.7-stable_win64_console.exe --headless --path .\godot --import
   ```

3. Discover the real user-data directory rather than assuming a machine-specific path:

   ```powershell
   & .\Godot_v4.7-stable_win64_console.exe --headless --path .\godot --script (Join-Path $PWD 'Owner-Preflight.gd')
   ```

   Read `workbench_dir` from `GOLD_ASTRA_OWNER_PREFLIGHT`. This creates that directory if missing and reports bridge registration. It does not load or qualify a map. If the command fails, preserve the output and stop before installing a Setup.

4. Stage one exact Setup using the printed existing Workbench directory. Example:

   ```powershell
   .\Install-GoldAstraSetup.ps1 -ManifestPath .\owner-bundle-manifest.v1.json -Arm B2 -Variant candidate -WorkbenchDir '<printed-workbench-directory>' -EngineRoot . -GodotExe .\Godot_v4.7-stable_win64.exe
   ```

   The installer validates the selected bytes and both native DLLs, creates a unique new `gold-astra-001-*` label, and refuses to overwrite an existing label. Add `-ValidateOnly` for a read-only check. Keep the printed label. A staging PASS is not native or owner acceptance.

5. Launch this project explicitly:

   ```powershell
   & .\Godot_v4.7-stable_win64.exe --path .\godot
   ```

   Choose **Development workbench**, enter the printed label in the starting-map name field, then **Load start**. Wait for completion. Use **Pilot Midge** and **Play** for actual movement and collision inspection.

Windows may require the owner to allow a downloaded script under the owner's normal local policy. Do not weaken a machine-wide execution policy for this package. The Setup can instead be copied manually, after SHA verification, to `setup-<new-label>.json` in the printed Workbench directory; never overwrite another recipe.

## What to evaluate

Compare the original and candidate at the same world coordinates. The site list and original spawn are in each arm's `fixture.json`. Check full routes with the actual Midge, collision at repaired apparatus, high-speed branch reading, and the distinction between deliberately broken freight and accidental disconnection. Do not judge by added material count.

| Arm | Inspection focus |
| --- | --- |
| C1 | Covered production spine and distinct work/crew districts; verify that restraint preserves its identity. |
| C2 | Censer loop, central culture apparatus and open return routes; no geometry change. |
| C3 | Ferry, bascule, lift and rotary transfer relationships in the portrait; no geometry change. |
| B1 | Crane-to-receiver relationship and the original obstruction detour below/around the repair. |
| B2 | Central examination table, opposed calipers and material-receiving position; surrounding islands and broken gantry remain distinct. |
| B3 | Read the fork at flight speed. The difference is deliberately small and most visible on approach. |
| D1 | High, middle and broken-low crossing types plus entered drill gallery; the gallery is optional, not a compulsory shortest-path bypass. |
| D2 | Open magnetic head, opposed press and unlike broken freight terminations. Machinery is static architecture, not demonstrated animation. |

For D1/D2, compare the separately staged `reference` after recording an original/candidate impression. It is comparison material, not an accepted target or evidence of general human superiority.

## Save and fresh-process reopen

Use **Save start** under a different unused name no longer than 48 characters. This saves the authored starting recipe, not the current evolved physics state. Quit the entire Godot process. Launch the same pinned project in a new process, load the newly saved label and verify the authored map, spawn and actors. Record any refusal or discrepancy; do not overwrite the imported source label to hide it.

## Evidence limits and decision record

Independent source-static tests and limited actual Linux headless Workbench/GDExtension/Rapier runs are recorded in the ledger. Linux tests include full-plane native parity, actor adoption, short controlled movement, local terrain contact, ordinary Save and separate-process reopen. They do not establish graphical playfeel, every repaired apparatus, complete route flight, long-duration behavior or personal Windows acceptance. Any hosted Windows result is separately identified by its exact run and package input manifest in the ledger; possession or extraction of this ZIP alone proves none of those behaviors.

Record date, Windows/GPU details, package SHA, arm/variant, original/output commit, loaded Setup SHA, route/site, observation, screenshot if useful, save label and reopen result. Mark each owner check PASS, FAIL or NOT TESTED. State whether the candidate is better, equivalent, worse or inconclusive, and why. Final Gold membership, Platinum/Pyrite acceptance, merges and production adoption remain the owner's decisions.
